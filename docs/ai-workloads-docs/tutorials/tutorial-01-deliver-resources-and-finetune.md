# Tutorial 01: Deliver model and data to cluster MinIO, then run finetune

This tutorial shows how to download a model and some data from HuggingFace Hub to a cluster-internal MinIO storage server, and then launch finetuning Jobs that use those resources. The checkpoints are also synced into the same cluster-internal MinIO storage. Finally, an inference workload is spawned to make it possible to discuss with the newly finetuned model. At the end of the tutorial, there are some instructions on changing the model and the data.

The finetuning work in this tutorial is meant for demonstration purposes, small enough to be run live. We're starting from Tiny-Llama 1.1B Chat, a small LLM. This is already a chat-finetuned model.
We're training it with some additional instruction data in the form of single prompt-and-answer pairs. The prompts in this data were gathered from real human prompts to LLMs, mostly ones that were shared on the now deprecated sharegpt.com site. The answers to those human prompts were generated with the [Mistral Large model](https://huggingface.co/mistralai/Mistral-Large-Instruct-2407). So in essence, training on this data makes our model respond more like Mistral Large. And there's another thing that this training accomplishes, which is to change the chat template, meaning the way the input to the model is formatted. More specifically, this adds special tokens that signal the start and end of message. Our experience is that such special tokens make the inference time message end signaling and message formatting a bit more robust.

## 1. Setup

Follow the setup in the [tutorial pre-requisites section](tutorial-prereqs.md).

## 2. Run workloads to deliver data and a model

We will use the helm charts in `workloads/download-huggingface-model-to-bucket/helm` and `workloads/download-data-to-bucket/helm`. We will use them to deliver a Tiny-Llama 1.1B parameter model, and an Argilla single-turn response supervised finetuning dataset, respectively.

Our user input files are in `workloads/download-huggingface-model-to-bucket/helm/overrides/tutorial-01-tiny-llama-to-minio.yaml`, and `workloads/download-data-to-bucket/helm/overrides/tutorial-01-argilla-to-minio.yaml`.
```bash
helm template workloads/download-huggingface-model-to-bucket/helm \
  --values workloads/download-huggingface-model-to-bucket/helm/overrides/tutorial-01-tiny-llama-to-minio.yaml \
  --name-template "deliver-tiny-llama-model" \
  | kubectl apply -f -
helm template workloads/download-data-to-bucket/helm \
  --values workloads/download-data-to-bucket/helm/overrides/tutorial-01-argilla-to-minio.yaml \
  --name-template "deliver-argilla-data" \
  | kubectl apply -f -
```

The [logs](#monitoring-progress-logs-and-gpu-utilization-with-k9s) will show a model staging download and upload for the model delivery workload, and data download, preprocessing, and upload for the data delivery.

## 3. Scaling finetuning: Hyperparameter tuning with parallel Jobs

At the hyperparameter tuning stage, we run many parallel Jobs while varying a hyperparameter to find the best configuration.
Here we are going to look for the best rank parameter `r` for [LoRA](https://arxiv.org/pdf/2106.09685).

To define the finetuning workload, we will use the helm chart in `workloads/llm-finetune-silogen-engine/helm` .
Our user input file is `workloads/llm-finetune-silogen-engine/overrides/tutorial-01-finetune-lora.yaml` . This also includes the finetuning hyperparameters - you can change them in the file to experiment, or use `--set` with helm templating to change an individual value.

Let's create ten different finetuning jobs to try out different LoRA ranks:

```bash
run_id=alpha
for r in 4 6 8 10 12 16 20 24 32 64; do
  name="tiny-llama-argilla-r-sweep-$run_id-$r"
  helm template workloads/llm-finetune-silogen-engine/helm \
    --values workloads/llm-finetune-silogen-engine/helm/overrides/tutorial-01-finetune-lora.yaml \
    --name-template $name \
    --set finetuning_config.peft_conf.peft_kwargs.r=$r \
    --set "checkpointsRemote=default-bucket/experiments/$name" \
    | kubectl apply -f -
done
```

For each Job we can see logs, a progress bar, and that Job's GPU utilization following the [instructions above](#monitoring-progress-logs-and-gpu-utilization-with-k9s).
If these Jobs get relaunched, they are setup to continue from the existing checkpoints. If we instead want to re-run from scratch, we can just change the `run_id` variable that is defined before the for loop.

## 4. Scaling finetuning: Multi-GPU training

Beside parallel Jobs, we can also take advantage of multiple GPUs by using them for parallel compute. This can be helpful for more compute demanding Jobs, and necessary with larger models.

Let's launch an 8GPU run of full-parameter finetuning:

```bash
name="tiny-llama-argilla-v1"
helm template workloads/llm-finetune-silogen-engine/helm \
  --values workloads/llm-finetune-silogen-engine/helm/overrides/tutorial-01-finetune-full-param.yaml \
  --name-template $name \
  --set "checkpointsRemote=default-bucket/experiments/$name" \
  --set "finetuningGpus=8" \
  | kubectl apply -f -
```

We can see logs, a progress bar, and the full 8-GPU compute utilization following the [instructions above](#monitoring-progress-logs-and-gpu-utilization-with-k9s).
The training steps of this multi-gpu training run take merely 75 seconds, which reflects the nature of finetuning:
fast, iterative, with a focus on flexible experimentation.

If we want to compare to an equivalent single-GPU run, we can run:

```bash
name="tiny-llama-argilla-v1-singlegpu"
helm template workloads/llm-finetune-silogen-engine/helm \
  --values workloads/llm-finetune-silogen-engine/helm/overrides/tutorial-01-finetune-full-param.yaml \
  --name-template $name \
  --set "checkpointsRemote=default-bucket/experiments/$name" \
  --set "finetuningGpus=1" \
  | kubectl apply -f -
```

The training steps for this single-GPU run take around 340 seconds.
Thus the full-node training yields a speedup ratio of around 0.22 (4.5x speed).
Even higher speedups are achieved in pretraining, which benefits hugely from optimizations.

## 5. Inference with a finetuned model

After training the model, we'll want to discuss with it. For this we will use the helm chart in `workloads/llm-inference-vllm/helm` .

Let's deploy the full-parameter finetuned model:

```bash
name="tiny-llama-argilla-v1"
helm template workloads/llm-inference-vllm/helm \
  --set "model=s3://default-bucket/experiments/$name/checkpoint-final" \
  --set "vllm_engine_args.served_model_name=$name" \
  --name-template "$name" \
  | kubectl apply -f -
```

We can change the `name` to different experiment names to deploy other models. Note that discussing with the LoRA adapter models with these workloads requires us to merge the final adapter. This can be achieved during finetuning by adding `--set mergeAdapter=true` and additionally in the deploy command, we have to refer to the merged model, changing the path to `--set "model=s3://default-bucket/experiments/$name/checkpoint-final-merged"` .

To discuss with the model, we first need to setup a connection to it. Since this is not a public-internet deployment, we'll do this simply by starting a background port-forwarding process:

```bash
name="tiny-llama-argilla-v1"
kubectl port-forward services/llm-inference-vllm-$name 8080:80 >/dev/null &
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

When we want to stop port-forwarding, we can just run:
```bash
kill $portforwardPID
```
and to stop the deployment, we run:
```bash
name="tiny-llama-argilla-v1"
kubectl delete deployments/llm-inference-vllm-$name
```


## Next Steps: How to use your own model and data

This tutorial has shown the basic steps in running finetuning and chatting with the resulting model.
For many, the next step may be to use our own models and data.
This section should get us started, but ultimately, this opens the whole topic of how to do finetuning, which is too large to cover here.
One more comprehensive view point is provided by the [Tülü 3 paper](https://arxiv.org/pdf/2411.15124).

### Preparing your own model and data

The workload `workloads/download-huggingface-model-to-bucket/helm` delivers [HuggingFace Hub](https://huggingface.co/) models. To get models from elsewhere, we may for instance do it manually by downloading them to our own computers and uploading to our bucket storage from there. The data delivery workload `workloads/download-data-to-bucket/helm` uses a free script to download and preprocess the data, so it is more flexible in this regard.

The bucket storage used in this tutorial is a MinIO server hosted inside the cluster itself. To use some other S3-compatible bucket storage, we need to change the `bucketStorageHost` field, add our credentials (HMAC keys) as a Secret in our namespace (this is generally achieved via an External Secret that in turn fetches the info from some secret store that we have access to), and then refer to that bucket storage credentials Secret in the `bucketCredentialsSecret` nested fields.

To prepare our own model, we create a values file that is similar to `workloads/download-huggingface-model-to-bucket/helm/overrides/tutorial-01-tiny-llama-to-minio.yaml`. .
The key field is `modelID`, which defins which model is downloaded. The field `bucketModelPath`
determines where the model is stored in the bucket storage.

To prepare our own data, we structure our values file like `workloads/download-data-to-bucket/helm/overrides/tutorial-01-argilla-to-minio.yaml`. It may be easiest to write a Python script separately, potentially test it locally, and then put the script as a block text value for `dataScript`. The dataset upload location is set with the `bucketDataDir` field.

#### Data
The `dataScript` is a script instead of just a dataset identifier, because the datasets on HuggingFace hub don't have a standard format that can be always directly passed to our finetuning engine. The
data script should format the data into the format that the silogen finetuning engine expects. For supervised finetuning, this is JSON lines, where each line has a JSON dictionary formatted as follows:
```json
{
  "messages": [
    {"role": "user", "content": "This is a user message"},
    {"role": "assistant", "content": "The is an assistant answer"}
  ]
}
```
There can be an arbitrary number of messages. Additionally, each dictionary can contain a `dataset` field that has the dataset identifier, and an `id` field that identifies the data point uniquely.
For [Direct Preference Optimization](https://arxiv.org/pdf/2305.18290), the data format is as follows:
```json
{
  "prompt_messages": [
    {"role": "user", "content": "This is a user message"},
  ],
  "chosen_messages": [
    {"role": "assistant", "content": "This is a preferred answer"}
  ],
  "rejected_messages": [
    {"role": "assistant", "content": "This is a rejected answer"}
  ]
}
```

The JSON lines output of the data script should be saved to the `/downloads/datasets/`. This is easy with the approach taken in the tutorial file:
```python
dataset.to_json("/downloads/datasets/<name of your dataset file.jsonl>")
```
The dataset is uploaded to the directory pointed to by `bucketDataDir`, with the same filename as it had under `/downloads/datasets`.

#### Model
Preparing a model is simple than data. We simply set the `modelID` to the HuggingFace Hub ID of the model (in the `Organization/ModelName` format). The model is the uploaded to
the path pointed to by `bucketModelPath`.

### Setting finetuning parameters

For finetuning, we create a values file that is similar to `workloads/llm-finetune-silogen-engine/helm/overrides/tutorial-01-finetune-lora.yaml` (for LoRA adapter training)
or `workloads/llm-finetune-silogen-engine/overrides/tutorial-01-finetune-full-param.yaml` (for full parameter training). We'll want to inject our data in the field:
```yaml
finetuning_config:
  data_conf:
    training_data:
      datasets:
        - path: "bucketName/path/to/file.jsonl
```
The datasets array can contain any number of datasets, and they're concatenated in training.

The model is set in the top level field `basemodel`, where the value should be a name of a bucket followed by the path to the model directory in the bucket, formatted like:
```yaml
basemodel: bucketName/path/to/modelDir
```

All finetuning configurations are not sensible with all models, and some settings might even fail for unsupported models.
Ultimately we need to understand the particular model we're using to set the parameters correctly. Suitable hyperparameters also depend on the data.

One key model compatibility parameter to look at is the chat template, which is set by
```yaml
finetuning_config:
  data_conf:
    chat_template_name: "<name of template>"
```
If the model we start from already has a chat template, we should usually set this to `"keep-original"`.
Otherwise, `"chat-ml"` is usually a reasonable choice.
Another set of parameters that often needs to be changed between models is the set of PEFT target layers, if doing LoRA training.
These are set in the following field:
```yaml
finetuning_config:
  peft_conf:
    peft_kwargs:
      target_modules:
        - q_proj
        - k_proj
        - v_proj
        - o_proj
        - up_proj
        - down_proj
```
One setting that can be used is
```yaml
finetuning_config:
  peft_conf:
    peft_kwargs:
      target_modules: "all-linear"
```
which targets all linear layers on the model and doesn't require knowing the names of the layers.
