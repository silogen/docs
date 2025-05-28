# SiloGen AMD Enterprise AI Platform

## 1. Introduction

### Prerequisites for cluster installation and running workloads
* SSH connection and sudo privileges on the node
* Huggingface token

## 2. Cluster installation
**A helper tool that sets up all essential platform tools to prepare a Kubernetes cluster for running applications.**

### Overview

**Cluster Forge** is a tool designed to bundle various third-party, community, and in-house components into a single, streamlined stack that can be deployed in Kubernetes clusters. By automating the process, Cluster Forge simplifies the repeated creation of consistent, ready-to-use clusters.

This tool is not meant to replace simple `helm install` or `kubectl apply` commands for single-use development clusters. Instead, it wraps these workflows into a robust process tailored for scenarios such as:

- **Ephemeral test clusters**
- **CI/CD pipeline clusters**
- **Scaling and managing multiple clusters efficiently**

Cluster Forge is built with the idea of **ephemeral and reproducible clusters**, enabling you to spin up identical environments quickly and reliably.

### Usage

To deploy a Cluster Forge SW stack, download a release package, and run 'deploy.sh'. This assumes there is a working kubernetes cluster to deploy into, and the current kubeconfig context refers to that cluster.

While Cluster Forge does not in any way require AMD Instinct GPU's, this was a primary use case during intial development. For ease of use in such a server, a helper script is available to deploy RKE2 kubernetes, install rocm, and then setup Cluster Forge. It can be found in the setup.sh file. It can also be run with:
```bash
curl https://raw.githubusercontent.com/silogen/cluster-forge/refs/heads/main/docs/deploy.sh | sudo bash
```
## 3. Working with workloads
As a prerequisite, you'll need a personal Huggingface token.
Set your Huggingface token for the workloads as shown in Appendix A.

### 3.1 Fine-tuning wweep

start by navigating to the workloads folder for this workload
```
cd ~/ai-workloads-dev/walk-throughs/deliver-resources-and-finetune
```

#### Deliver model+data to cluster MinIO, then run fine-tune

This walk-through shows how to download a model and some data from HuggingFace Hub to a cluster-internal MinIO storage server, and then launch fine-tuning Jobs that use those resources. The checkpoints are also synced into the same cluster-internal MinIO storage. Finally, an inference workload is spawned to make it possible to discuss with the newly fine-tuned model.

We should have a working AMD Silo cluster, setup by a cluster administrator. The access to that cluster is provided with a suitable kubeconfig file. We don't require administrator permissions to run through this walk-through.

#### 1: Setup for the walk-through, programs used, instructions for monitoring

##### Additional cluster setup

Additional cluster setup. This does the following:
- Adds a namespace, where we will conduct all our work. We will use the `silo` namespace.
- Adds an External Secret to get the credentials to access the MinIO storage from our namespace.
    - This depends on a ClusterSecretStore called `k8s-secret-store` being already setup by a cluster admin, which the Silo cluster should have.
- Adds a LocalQueue so that our Jobs schedule intelligently.
    - This references the ClusterQueue `kaiwo` which should already be setup by a cluster admin. This should be the case in the Silo cluster.

Apply the manifests:
```bash
kubectl create namespace "silo"
kubectl apply -f manifests/ --namespace silo
```

##### Monitoring progress, logs, and GPU utilization with k9s
We're interested to see a progress bar of the fine-tuning training, seeing any messages that a workload logs, and we also want to verify that our GPU Jobs
are consuming our compute relatively effectively. This information can be fetched from our Kubernetes cluster in many ways, but one convenient and recommended way us using [k9s](https://k9scli.io/).
We recommend the official documentation for more thorough guidance, but this section shows some basic commands to get what we want here.

To get right to the Jobs view in the namespace we're using in this walk-through, we can run:
```bash
k9s --namespace silo --command Jobs
```
Choose a Job using `arrow keys` and `Enter` to see the Pod that it spawned, then `Enter` again to see the Container in the Pod. From here, we can do three things:
- Look at the logs by pressing `l`. The logs show any output messages produced during the workload runtime.
- Attach to the output of the container by pressing `a`. This is particularly useful to see the interactive progress bar of a fine-tuning run.
- Spawn a shell inside the container by pressing `s`. Inside the shell we can run `watch -n0.5 rocm-smi` to get a view of the GPU utilization that updates every 0.5s.

Return from any regular `k9s` view with `Esc`.

#### 2. Run a workload to deliver data + model

We will use the helm chart in `../../workloads/deliver-huggingface-example-resources/helm/chart`. We will use it to deliver a Tiny-Llama 1.1B parameter model, and an Argilla single-turn response supervised fine-tuning dataset.

Our user input file is in `deliver-resources.user-values.yaml`, we can change the `modelID` and the `dataScript` to user different models and data.

```bash
helm template ../../workloads/deliver-huggingface-example-resources/helm/chart \
  --values deliver-resources.user-values.yaml \
  --name-template "deliver-tiny-llama-and-argilla" \
  --namespace "silo" \
  | kubectl apply -f -
```
The [logs](#monitoring-progress-logs-and-gpu-utilization-with-k9s) will show a model staging download and upload, then data download, preprocessing, and upload.

#### 3. Scaling fine-tuning: hyperparameter tuning with parallel jobs

At the hyperparameter tuning stage, we run many parallel Jobs while varying a hyperparameter to find the best configuration.

Here we are going to look for the best rank parameter `r` for [LoRA](https://arxiv.org/pdf/2106.09685).

To define the fine-tuning workload, we will use the helm chart in `../../workloads/LLM-finetune-silogen-engine/helm/chart`.
Our user input file is in `finetune.user-values.yaml`. This also includes the fine-tuning hyperparameters - you can change them in the file to experiment, or use `--set` with helm templating to change an individual value.

Let's create ten different fine-tunes to try out different LoRA ranks:
```bash
run_id=alpha
for r in 4 6 8 10 12 16 20 24 32 64; do
  name="tiny-llama-argilla-r-sweep-$run_id-$r"
  helm template ../../workloads/LLM-finetune-silogen-engine/helm/chart \
    --values finetune-lora.user-values.yaml \
    --name-template $name \
    --namespace "silo" \
    --set finetuning_config.peft_conf.peft_kwargs.r=$r \
    --set "checkpointsRemote=default-bucket/experiments/$name" \
    | kubectl apply -f -
done
```

For each Job we can see logs, a progress bar, and that Job's GPU utilization following the [instructions above](#monitoring-progress-logs-and-gpu-utilization-with-k9s).
If these Jobs get relaunched, they are setup to continue from the existing checkpoints. If we instead want to re-run from scratch, we can just change the `run_id` variable that is defined before the for loop.

#### 4. Scaling fine-tuning: multi-GPU training

Beside parallel Jobs, we can also take advantage of multiple GPUs by using them for parallel compute. This can be helpful for more compute demanding Jobs, and necessary with larger models.

Let's launch an 8GPU run of full-parameter fine-tuning:
```bash
name="tiny-llama-argilla-v1"
helm template ../../workloads/LLM-finetune-silogen-engine/helm/chart \
  --values finetune-full-param.user-values.yaml \
  --name-template $name \
  --namespace "silo" \
  --set "checkpointsRemote=default-bucket/experiments/$name" \
  --set "finetuningGpus=8" \
  | kubectl apply -f -
```

We can see logs, a progress bar, and the full 8-GPU compute utilization following the [instructions above](#monitoring-progress-logs-and-gpu-utilization-with-k9s).

The training steps of this multi-gpu training run take merely 75 seconds, which reflects the nature of fine-tuning:
fast, iterative, with a focus on flexible experimentation.

If we want to compare to an equivalent single-GPU run, we can run:

```bash
name="tiny-llama-argilla-v1-singlegpu"
helm template ../../workloads/LLM-finetune-silogen-engine/helm/chart \
  --values finetune-full-param.user-values.yaml \
  --name-template $name \
  --namespace "silo" \
  --set "checkpointsRemote=default-bucket/experiments/$name" \
  --set "finetuningGpus=1" \
  | kubectl apply -
```

The training steps for this single-GPU run take around 340 seconds.
Thus the full-node training yields a speedup ratio of around 0.22 (4.5x speed). Even higher speedups are achieved in pretraining, which benefits hugely from optimizations.

#### 5. Inference with a fine-tuned model

After training the model, we'll want to discuss with it. For this we will use the helm chart in `../../workloads/llm-inference-vllm/helm/chart`.

Let's deploy the full-parameter fine-tuned model:

```bash
name="tiny-llama-argilla-v1"
helm template ../../workloads/llm-inference-vllm/helm \
  --values inference.user-values.yaml \
  --set "model=s3://default-bucket/experiments/$name/checkpoint-final" \
  --set "vllm_engine_args.served_model_name=$name" \
  --name-template "$name" \
  | kubectl create --namespace "silo" -f -
```
We can change the `name` to different experiment names to deploy other models. Note that discussing with the LoRA adapter models with these workloads requires us to merge the final adapter. This can be achieved during fine-tuning by adding `--set mergeAdapter=true` and additionally in the deploy command, we have to refer to the merged model, changing the path to `--set "model=s3://default-bucket/experiments/$name/checkpoint-final-merged"`.

To discuss with the model, we first need to setup a connection to it. Since this is not a public-internet deployment, we'll do this simply by starting a background port-forwarding process:

```bash
name="tiny-llama-argilla-v1"
kubectl port-forward deployments/llm-inference-vllm-$name 8080:8080 -n silo >/dev/null &
portforwardPID=$!
```

Now we can discuss with the model, using curl:

```bash
name="tiny-llama-argilla-v1"
question="What are the top five benefits of eating a large breakfast?"
curl http://localhost:8080/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "'$name'",
        "messages": [
            {"role": "user", "content": "'"$question"'"}
        ]
    }' | jq ".choices[0].message.content" --raw-output
```

We can test the limits of the model with our own questions. Since this is a model with a relatively limited capacity, its answers are often delightful nonsense.

When we want to stop port-forwarding, we can just `kill $portforwardPID`.

## Appendix A. LLM tokens

To run certain AI workloads, such as **Llama 3.1** or other models
provided by Hugging Face, you need to have proper authentication to
access these resources. Hugging Face, a popular platform for AI models
and tools, requires an **API token** for accessing and downloading
models.

### What is a Hugging Face token?

A Hugging Face token is like a digital key that allows your systems or
applications to securely communicate with Hugging Face and access their
models, datasets, or APIs. Without this token, you won\'t be able to use
many of their resources in your workflows.

### Why do you need to install it as a secret?

Tokens contain sensitive information. To keep them secure and prevent
unauthorized access, they should not be stored in plain text in your
code or configuration files. Instead, they are stored as **secrets**--a
secure way to manage sensitive data.

### How to get a Hugging Face token

1. Create or log in to your Hugging Face account:
    [https://huggingface.co](https://huggingface.co/).

2. Navigate to your account settings.

3. Under **Access Tokens**, generate a new token.

4. Copy the token (keep it safe; don\'t share it).

### Where to install the token

The token needs to be installed as a secret in your environment. Here
are examples of how to do this in common platforms:

On Kubernetes

Save the token in an environment variable in your terminal:

```
kubectl create secret generic hf-token \
    --from-literal=hf-token=my_super_secret_token \
    -n my_namespace
```