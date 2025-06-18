# workload helm template to download a model to bucket storage

This is an workload which downloads a model and uploads it to bucket storage.
Since the `helm install` semantics are centered around on-going installs, not jobs that run once,
it's best to just run `helm template` and pipe the result to `kubectl create` (`create` maybe more appropriate than apply for this Job as we don't expect to modify existing entities).
Example:
```bash
helm template workloads/download-huggingface-model-to-bucket/helm \
    -f workloads/download-huggingface-model-to-bucket/helm/overrides/llama-3.1-tiny-random-to-google.yaml \
    --name-template download-huggingface \
    | kubectl create -f -
```

## User input values

See the `values.yaml` file for the user input values that you can provide, with instructions.
