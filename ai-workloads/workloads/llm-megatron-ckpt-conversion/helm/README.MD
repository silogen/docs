# Helm Template for Converting Hugging Face Checkpoints to Megatron Format

This Helm template converts Hugging Face model checkpoints to the Megatron format. The workload interacts with MinIO storage to manage model artifacts. Specifically, it reads the pre-downloaded model checkpoints, converts them, and writes the converted artifacts back to the remote storage.

### Prerequisites
Ensure that the tokenizer files are located in the same directory as the model files. For example, the directory `minio-host/default-bucket/models/meta-llama/Llama-3.1-8B/` should contain both the model checkpoints and files like `tokenizer.json`.

## Usage

To deploy the workload, use the following command:

```bash
helm template workloads/llm-megatron-ckpt-conversion/helm \
    --name-template llama3.1-8B \
    | kubectl create -f -
```

You can pass overrides to the default values as following:
```bash
helm template workloads/llm-megatron-ckpt-conversion/helm \
    -f workloads/llm-megatron-ckpt-conversion/helm/overrides/values-70b.yaml
    --name-template llama3.1-70B \
    | kubectl create -f -
```

### Note

- The `helm install` command is designed for ongoing installations, not one-time jobs. Therefore, it is recommended to use `helm template` and pipe the output to `kubectl create`. This approach is more suitable for jobs that do not require modifying existing entities.
- Use `kubectl create` instead of `kubectl apply` for this job, as it is intended to create new resources without updating existing ones.

## Configuration

Refer to the `values.yaml` file for configurable user input values. The file includes instructions to help you customize the workload as needed.
