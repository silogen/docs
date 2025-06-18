# LLM Inference Service with Llama.cpp

This Helm chart deploys a LLM inference service workload via [Ollama](https://github.com/ollama/ollama)

## Prerequisites

Install `helm`. Refer to the [Helm documentation](https://helm.sh/) for instructions.

## Deploying the Workload
Basic configurations for the deployment are specified in the `values.yaml` file. By default, the service uses the quantized `Gemma3:4b` model. For a comprehensive list of available models, visit the [Ollama Model Library](https://ollama.com/library).

For example: run the following command within the `helm/` folder to deploy the service:

```bash
helm template . --set env_vars.MODEL="gemma3:27b-it-fp16" | kubectl apply -f -
```

**Note**: Compiling Ollama executables and downloading models can take a significant amount of time. The deployment process may take over 10 minutes before the LLM inference service is ready.

## Interacting with the Deployed Model

### Verify Deployment

Check the deployment and service status:

```bash
kubectl get deployment
kubectl get service
```

### Port Forwarding

To access the service locally, forward the port using the following commands. This assumes the service name is `llm-inference-ollama`:

```bash
kubectl port-forward services/llm-inference-ollama 8080:80
```

**Note** Ollama server provides both [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md) `http://localhost:8080/api` and OpenAI-compatible API `http://localhost:8080/v1`
