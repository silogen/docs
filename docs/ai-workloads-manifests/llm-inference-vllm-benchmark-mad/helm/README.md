# LLM Inference Benchmarking Workload

This Helm chart submits a job to benchmark the performance of [vLLM](https://docs.vllm.ai/en/latest/) running a model in the same container.

## Prerequisites

1. **Helm**: Install `helm`. Refer to the [Helm documentation](https://helm.sh/) for instructions.
2. **MinIO Storage** (optional): To use pre-downloaded model weights from MinIO storage, the following environment variables must be set, otherwise models will be downloaded from HuggingFace. MinIO storage is also used for saving benchmark results.
    - `BUCKET_STORAGE_HOST`
    - `BUCKET_STORAGE_ACCESS_KEY`
    - `BUCKET_STORAGE_SECRET_KEY`
    - `BUCKET_MODEL_PATH`

3. **HF Token** (optional): If you need to download gated models from HuggingFace (e.g., Mistral and LLaMA 3.x) that are not available locally, ensure a secret named `hf-token` exists in the namespace.

## Implementation

Basic configurations are defined in the `values.yaml` file, with key settings:

- `env_vars.TESTOPT`: Must be set to either "latency" or "throughput"
- `env_vars.USE_MAD`: Controls whether to apply the MAD approach (see below)

**Note**: If the specified model cannot be found locally, the workload will attempt to download it from HuggingFace.

### A. Scenario-specific approach

In this approach (`env_vars.USE_SCENARIO` is not "false"), scenarios are defined in the `mount/scenarios_{$TESTOPT}.csv` file. Modify this file to specify models, parameters, and environment variables for benchmarking. Each column defines a parameter or variable, and each row represents a unique scenario to benchmark.

The default configuration benchmarks **latency** using [benchmark_latency.py](https://github.com/vllm-project/vllm/blob/main/benchmarks/benchmark_latency.py) from vLLM. Setting `env_vars.TESTOPT` to "throughput" will use [benchmark_throughput.py](https://github.com/vllm-project/vllm/blob/main/benchmarks/benchmark_throughput.py) instead.

Example 1: Benchmark latency scenarios (default)
```bash
helm template . | kubectl apply -f -
```

Example 2: Benchmark throughput scenarios
```bash
helm template . --set env_vars.TESTOPT="throughput" | kubectl apply -f -
```

### B. ROCm/MAD standalone approach

When `env_vars.USE_MAD` is not "false", the ROCm/MAD [repository](https://github.com/ROCm/MAD/) will be cloned. The specified model (`env_vars.MAD_MODEL`) will be benchmarked according to preset [scripts](https://github.com/ROCm/MAD/tree/develop/scripts/vllm).

Example 3: Benchmark using MAD standalone approach with override settings
```bash
helm template . -f overrides/methods/MAD-Qwen2.5_0.5B.yaml | kubectl apply -f -
```
