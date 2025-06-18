# LLM Inference with vLLM

This Helm Chart deploys the LLM Inference vLLM workload.

## Prerequisites

Ensure the following prerequisites are met before deploying any workloads:

1. **Helm**: Install `helm`. Refer to the [Helm documentation](https://helm.sh/) for instructions.
2. **Secrets**: Create the following secrets in the namespace:
    - `minio-credentials` with keys `minio-access-key` and `minio-secret-key`.
    - `hf-token` with key `hf-token`.

## Deploying the Workload

It is recommended to use `helm template` and pipe the result to `kubectl create` , rather than using `helm install`. Generally, a command looks as follows

```bash
helm template [optional-release-name] <helm-dir> -f <overrides/xyz.yaml> --set <name>=<value> | kubectl apply -f -
```

The chart provides three main ways to deploy models, detailed below.

### Alternative 1: Deploy a Specific Model Configuration

To deploy a specific model along with its settings, use the following command from the `helm` directory:

```bash
helm template tiny-llama . -f overrides/models/tinyllama_tinyllama-1.1b-chat-v1.0.yaml | kubectl apply -f -
```

### Alternative 2: Override the Model

You can also override the model on the command line:

```bash
helm template qwen2-0-5b . --set model=Qwen/Qwen2-0.5B-Instruct | kubectl apply -f -
```

### Alternative 3: Deploy a Model from Bucket Storage

If you have downloaded your model to bucket storage, use:

```bash
helm template qwen2-0-5b . --set model=s3://models/Qwen/Qwen2-0.5B-Instruct | kubectl apply -f -
```

The model will be automatically downloaded before starting the inference server.

## User Input Values

Refer to the `values.yaml` file for the user input values you can provide, along with instructions.

## Interacting with Deployed Model

### Verify Deployment

Check the deployment status:

```bash
kubectl get deployment
```

### Port Forwarding

Forward the port to access the service (assuming the deployment is named `llm-inference-vllm-tiny-llama` ):

```bash
kubectl port-forward deployments/llm-inference-vllm-tiny-llama 8080:8080
```

### Test the Deployment

Send a test request to verify the service, assuming `TinyLlama/TinyLlama-1.1B-Chat-v1.0` model:

```bash
curl http://localhost:8080/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"}
        ]
    }'
```
