# Deepspeed RAM and VRAM estimate

Deepspeed can require a large amount of RAM, and save on the VRAM, depending on the configuration. Deepspeed includes a [memory estimation utility](https://deepspeed.readthedocs.io/en/latest/memory.html), and this chart exposes that utility in a convenient package.

## Specifying the inputs
You can get estimates for a specifc model on bucket storage or on HuggingFace Hub. In that case, the model config is downloaded to the container and a model loaded onto a meta device, meaning that no parameters are actually constructed.
The number of parameters is computed based on the loaded model, but note that any shared parameters will be counted multiple times, since the meta device cannot distinguish between shared layers and non-shared ones. That may slightly inflate the estimates. Specify the model in the `modelPath` field. If the model is on an S3-bucket, prefix the bucket path with `s3://`.

You can also simply specify the number of parameters. Then, the estimates are based on your given number. Note that if you give both `modelPath` and `numParameters`, then `modelPath` is used. If you're using stage 3, you must also specify `largestLayerParameters`.

The estimates depend on the number of nodes and GPUs per node. These are set with `nodes` and `gpusPerNode` respectively. Additionally, a buffer factor is used. It's set by `bufferFactor`.

Finally, the estimates depend on the Deepspeed stage. Stages 1 and 2 have the same estimate, and stage 3 has its own. Specify the Deepspeed stage with `stage`.

See `values.yaml` for other inputs, which determine the image, the bucket storage secret naming, the hf-token secret naming, and whether to use a KaiwoJob or a regular Job.

## Getting the results

The estimates are printed to the logs of the pod.
You simply run the workload, e.g.
```bash
helm template . --set modelPath=meta-llama/Llama-3.1-70B --values overrides/hf-token --name-template "llama-70b-ds-estimate" | kubectl apply -f -
```
or
```bash
helm template . --set modelPath=s3://default-bucket/models/meta-llama/Llama-3.1-70B --name-template "llama-70b-ds-estimate" | kubectl apply -f -
```
or
```bash
helm template . --set numParameters=70e9 --name-template "generic-70b-ds-estimate" | kubectl apply -f -
```

then let the workload finish and check the logs with
```bash
kubectl logs llama-70b-ds-estimate-POD_UNIQUE_ID_PART_HERE
```

The logs end in something along the lines of:
```
Estimated memory needed for params, optim states and gradients for a:
HW: Setup with 1 node, 8 GPUs per node.
SW: Model with 69503M total params.
  per CPU  |  per GPU |   Options
 3107.03GB | 129.46GB | offload_optimizer=cpu
 3107.03GB | 275.10GB | offload_optimizer=none
 ```
