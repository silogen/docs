# LLM Inference Benchmarking Workload (ROCm Best Practices)

This Helm chart deploys a job to benchmark the performance of [vLLM](https://docs.vllm.ai/en/latest/) running a model within the same container. It follows the [best practices](https://rocm.blogs.amd.com/artificial-intelligence/LLM_Inference/README.html) for optimized inference on AMD Instinct GPUs.

## Prerequisites

1. **Helm**: Ensure `helm` is installed. Refer to the [Helm documentation](https://helm.sh/) for installation instructions.
2. **MinIO Storage** (optional): To use pre-downloaded model weights from MinIO storage, set the following environment variables. If not set, models will be downloaded from HuggingFace. MinIO storage is also used for saving benchmark results:
    - `BUCKET_STORAGE_HOST`
    - `BUCKET_STORAGE_ACCESS_KEY`
    - `BUCKET_STORAGE_SECRET_KEY`
    - `BUCKET_MODEL_PATH`

3. **HuggingFace Token** (optional): Required for downloading gated models (e.g., Mistral and LLaMA 3.x) from HuggingFace if they are not available locally.

## Implementation

Basic configurations are defined in the `values.yaml` file. YAML files in the `overrides/models/` directory can be used to reproduce benchmarks for specific scenarios, such as models, tensor parallelism, data types, quantization, etc.

### Example: Benchmarking a Specific Model Configuration

To benchmark a specific model (e.g., Mistral-7B-Instruct-v0.3-FP8) with its settings, run the following command from the `helm` directory:

```bash
helm template . -f overrides/models/Mistral-7B-Instruct-v0.3-FP8.TP2.yaml | kubectl apply -f -
```

The benchmark results will be displayed at the end of the job log.
An example result as the following:

```text
============ Serving Benchmark Result ============
Successful requests:                     256
Benchmark duration (s):                  63.26
Total input tokens:                      524288
Total generated tokens:                  524288
Request throughput (req/s):              4.05
Output token throughput (tok/s):         8287.48
Total Token throughput (tok/s):          16574.96
---------------Time to First Token----------------
Mean TTFT (ms):                          5749.02
Median TTFT (ms):                        5569.11
P99 TTFT (ms):                           10835.37
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          28.06
Median TPOT (ms):                        28.15
P99 TPOT (ms):                           30.52
---------------Inter-token Latency----------------
Mean ITL (ms):                           28.06
Median ITL (ms):                         25.17
P99 ITL (ms):                            40.60
----------------End-to-end Latency----------------
Mean E2EL (ms):                          63192.59
Median E2EL (ms):                        63190.51
P99 E2EL (ms):                           63229.48
==================================================
```
