# Megatron-LM CPT templates

## Helm

To generate manifests and print them in standard output using the default `values.yaml`, for example, run:
```bash
helm template ./ --name-template 8b
```
This will generate a kubernetes manifest with a job and a configmap both named `llm-pretraining-megatron-lm-job-8b` in the user's active namespace.

To override the default values, a specific file can be passed using `-f` flag, for example:
```bash
helm template ./ --name-template 70b -f overrides/values-llama-70b-cpt.yaml
```

Multiple overriding yaml files can be used e.g.:
```bash
helm template ./ --name-template 70b \
    -f overrides/values-llama-70b-cpt.yaml \
    -f overrides/labels/kaiwo-managed-true.yaml
```

Note:
Anything overlapping with the default `values.yaml` file can be omitted from the specific files passed with the `-f` flag.

## Running

To run the workload, simply pipe the generated manifests to a `kubectl` command, like:

```bash
helm template ./ --name-template 8b | kubectl apply -f -
```

## Docker image

We recommend using the `rocm/megatron-lm:v25.4` image or later versions of it.

*Note*: this workload has been tested with images:
- `rocm/megatron-lm:v25.4`

## Assumptions

Some assumptions for running the pretraining jobs are as follows: The initial model checkpoint and data, both in Megatron format, are located in an S3-compatible storage. Additionally, it is assumed that a secret containing the S3 storage provider's HMAC credentials (access key and secret key) is present in the namespace where the jobs are executed. The defaults (as viewed from the Kubernetes manifest's perspective) are:

```
- name: BUCKET_STORAGE_ACCESS_KEY
    valueFrom:
    secretKeyRef:
        name: minio-credentials
        key: minio-access-key
- name: BUCKET_STORAGE_SECRET_KEY
    valueFrom:
    secretKeyRef:
        name: minio-credentials
        key: minio-secret-key
```

## Cleanup

Note that this chart, when applied with `kubectl`, will create Job and ConfigMap objects. After the Job has finished, there is a 3600-second grace period to remove the Job object from the namespace. However, the cleanup of the ConfigMap must be done manually. For example, to delete the ConfigMap `llm-pretraining-megatron-lm-job-8b` from the user's active namespace:

```bash
kubectl delete configmap llm-pretraining-megatron-lm-job-8b
```

Alternatively one can use the garbage collection utility script `../utils/gc.sh` to manage cleanup automatically. After the workload is submitted to the kubernetes cluster run `../utils/gc.sh <job-name> <namespace>` to attach configmap to the lifecycle of the job object, e.g., for the above example:

```bash
../utils/gc.sh llm-pretraining-megatron-lm-job-8b <ACTIVE_NAMESPACE>
```
