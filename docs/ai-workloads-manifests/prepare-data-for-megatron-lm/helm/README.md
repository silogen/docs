# Workload helm template to download and preprocess data for Megatron-LM and upload it to bucket storage

This workload downloads data and a Huggingface tokenizer, preprocesses the data to the format accepted by Megatron-LM framework, and uploads it to bucket storage. To launch the workload, resolve the helm template with `helm template` and pipe the result to `kubectl apply`:

Example:
```bash
helm template workloads/prepare-data-for-megatron-lm/helm \
    -f workloads/prepare-data-for-megatron-lm/helm/overrides/fineweb-data-sample.yaml \
    --name-template prepare-fineweb-data \
    | kubectl apply -f -
```

## User inputs

See the `values.yaml` file for all user input values that you can provide, with instructions.

The data download logic should be implemented in a user-provided script under the key `dataScript`. The script must accept `--target-dir` as an argument, and output a JSONL file in the directory specified by that argument. The only requirement for the JSONL file is that the same json key in each line contains text paragraphs to be trained on. The specific json key that is used for extracting text data is specified as parameter for the next preprocessing step. For example, for `HuggingFaceFW/fineweb-edu` dataset this json key name is `text`.

Further preprocessing logic that transforms JSONL data to the format accepted by Megatron-LM framwework is implemented in the `mount/prepare_data.sh` script. This script accepts, in particular, `json_key` as its 4-th argument, that points to the json key that stores training text data in JSONL file from previous step.

At the moment we choose to ask the user to provide the data download script instead of just a few parameters like dataset identifier, because HuggingFace datasets don't have a standard format that can be always directly applied for every use case.
