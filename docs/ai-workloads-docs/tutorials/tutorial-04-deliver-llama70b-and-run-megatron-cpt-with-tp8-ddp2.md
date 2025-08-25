# Tutorial 04: Deliver Llama 70B and data to cluster MinIO, then run Megatron-LM continuous pretraining with DDP=2 (distributed data parallelism) and TP=8 (tensor parallelism)

This tutorial involves the following steps:
1. Download Llama 3.1 70B from the HuggingFace Hub in HuggingFace Transformers format, convert it to the Megatron-LM compatible format, and save it to the cluster-internal MinIO storage server.
2. Download a sample dataset from the HuggingFace Hub in `jsonl` format, preprocess it into the Megatron-LM compatible format, and store it in a cluster-internal MinIO storage server.
3. Execute a multi-node Megatron-LM continued pretraining job using **distributed data parallelism (DDP=2) and tensor parallelism (TP=8)**, and saving the resulting checkpoints to the cluster-internal MinIO storage.
4. Perform an inference workload using the final checkpoint from step 3 in Megatron-LM format to validate the results.

## 1. Setup

Follow the setup in the [tutorial 0 prerequisites section](./tutorial-00-prerequisites.md).

## 2. Run workloads

### 2.1 Prepare model in Megatron-LM format

#### 2.1.1 Download model
To download the `meta-llama/llama-3.1-70B` model from the HuggingFace Hub and upload it to the in-cluster MinIO bucket, use the Helm chart located at `workloads/download-huggingface-model-to-bucket/helm`:

```bash
helm template workloads/download-huggingface-model-to-bucket/helm \
  --values workloads/download-huggingface-model-to-bucket/helm/overrides/tutorial-04-llama-3.1-70b.yaml \
  --name-template "download-llama3-1-70b" \
  | kubectl apply -f -
```

The model will be stored in the remote MinIO bucket at the path `default-bucket/models/meta-llama/Llama-3.1-70B` after being downloaded from the HuggingFace Hub.

#### 2.1.2 Convert model checkpoints to Megatron-LM format
To convert the model checkpoints into the Megatron-LM compatible format, use the Helm chart located at `workloads/llm-megatron-ckpt-conversion/helm`:

```bash
helm template workloads/llm-megatron-ckpt-conversion/helm \
  --values workloads/llm-megatron-ckpt-conversion/helm/overrides/tutorial-04-llama-3.1-70b.yaml \
  --name-template "llama3-1-70b" \
  | kubectl create -f -
```

The conversion process begins by copying the model checkpoints into the minio container. These checkpoints are then processed within the conversion container to transform them into the Megatron-LM compatible format. Once the conversion is complete, the transformed checkpoints are uploaded back to the internal MinIO storage at the location `default-bucket/megatron-models/meta-llama/Llama-3.1-70B/` for subsequent use.

### 2.2 Prepare data in Megatron-LM format

We will use the Helm chart located at `workloads/prepare-data-for-megatron-lm/helm` to download and preprocess a sample of the `HuggingFaceFW/fineweb-edu` dataset and use the tokenizer of the `meta-llama/Llama-3.1-70B` model.

The user input file is `workloads/prepare-data-for-megatron-lm/helm/overrides/tutorial-04-fineweb-data-sample.yaml`.

```bash
helm template workloads/prepare-data-for-megatron-lm/helm \
  --values workloads/prepare-data-for-megatron-lm/helm/overrides/tutorial-04-fineweb-data-sample.yaml \
  --name-template "prepare-fineweb-data" \
  | kubectl apply -f -
```

Refer to the [Monitoring progress, logs, and GPU utilization with k9s](./tutorial-00-prerequisites.md#monitoring-progress-logs-and-gpu-utilization-with-k9s) section to track data and tokenizer downloads, data preprocessing, and uploads to the in-cluster MinIO bucket.

### 2.3 Run multi-node Megatron-LM continuous pretraining job
To launch the Megatron-LM pretraining job use the Helm chart located at `workloads/llm-pretraining-megatron-lm-ray/helm`. Use the following command:

```bash
helm template workloads/llm-pretraining-megatron-lm-ray/helm \
  --values workloads/llm-pretraining-megatron-lm-ray/helm/overrides/tutorial-04-values-llama-70b-2ddp.yaml \
  | kubectl apply -f -
```

### 2.4 Run inference workload with the final checkpoint (2.3) and query it using sample prompts on Llama-3.1-70B


In order to perform inference with the just trained Llama-3.1-70B model and verify it's quality, follow the steps:

1. Execute the Llama-3.1-70B single-node Megatron-LM inference workload. This step verifies that the model is correctly deployed and can respond to basic prompts.
2. Query the model with a simple prompt to confirm it generates coherent responses.


#### 2.4.1 Run Megatron-LM inference workload

```bash
helm template workloads/llm-inference-megatron-lm/helm/ \
  --values workloads/llm-inference-megatron-lm/helm/overrides/tutorial-04-llama-3-1-70b.yaml \
  | kubectl apply -f -
```

#### 2.4.2 Monitoring progress, logs, and GPU utilization with k9s

To monitor training progress, view workload logs, and observe GPU utilization, we recommend using [k9s](https://k9scli.io/). Refer to the official documentation for detailed guidance. Below are basic commands for this tutorial:

To access the Pods view in the your namespace, run:

```bash
k9s --command pods
```

Navigate using the `arrow keys` to select a the pod containg the keyword "inference" and  and press `Enter` to view the pod running the inference server. View logs by pressing `l`. Logs display output messages generated during runtime. Press `Esc` to return to the previous `k9s` view.

#### 2.4.3 Connect to the inference service and query it to sample prompt continuations

First, check the deployment status:

```bash
kubectl get deployment
```
You should see a deployment with a name in the format `llm-inference-megatron-lm-YYYYMMDD-HHMM` (e.g. `llm-inference-megatron-lm-20250811-1229`) in ready state.

Get the name of the respective service deployed by the workload with

```bash
kubectl get svc
```

The service should have the same name as the deployment from above with the format `llm-inference-megatron-lm-YYYYMMDD-HHMM`. Note the port exposed by the service, it is expected to be the port `80`.

Forward the service port to your local machine, e.g., in the example below, remote port `80` to local port `5000`. For example, use the following command, and do not forget to replace `llm-inference-megatron-lm-YYYYMMDD-HHMM` with your real service name:

```bash
kubectl port-forward svc/llm-inference-megatron-lm-YYYYMMDD-HHMM 5000:80
```

Now the inference API is available at `http://localhost:5000`.

You can use `curl` to send requests to the inference API. Make sure you have the service port forwarded as shown above. Send a simple prompt to the model to check if it responds coherently. For example:

```bash
curl -X PUT -H "Content-Type: application/json" \
  -d '{"prompts": ["What is the capital of France?"], "tokens_to_generate": 32}' \
  http://localhost:5000/api
```

You should receive a JSON response with the model’s answer. For a healthy model, the answer should be `"Paris"` or similar with some extra text.

Try a few more prompts to check basic reasoning and language ability:

```bash
curl -X PUT -H "Content-Type: application/json" \
  -d '{"prompts": ["2 + 2 = ?"], "tokens_to_generate": 8}' \
  http://localhost:5000/api

curl -X PUT -H "Content-Type: application/json" \
  -d '{"prompts": ["Write a short greeting."], "tokens_to_generate": 16}' \
  http://localhost:5000/api
```
