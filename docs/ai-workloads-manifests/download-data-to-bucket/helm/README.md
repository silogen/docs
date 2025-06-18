# workload helm template to download and preprocess data to bucket storage

This is an workload which downloads data, potentially preprocesses it, and uploads it to bucket storage.
Since the `helm install` semantics are centered around on-going installs, not jobs that run once,
it's best to just run `helm template` and pipe the result to `kubectl create` (`create` maybe more appropriate than apply for this Job as we don't expect to modify existing entities).
Example:
```bash
helm template workloads/download-data-to-bucket/helm \
    -f workloads/download-data-to-bucket/overrides/argilla-mistral-large-human-prompts.yaml \
    --name-template download-argilla \
    | kubectl create -f -
```

## User input values

See the `values.yaml` file for all user input values that you can provide, with instructions.
In values.yaml, the `dataScript` is a script instead of just a dataset identifier, because the datasets on HuggingFace hub don't have a standard format that can be always directly passed to any training framework.
The data script should format the data into the format that the training framework expects.

Any data files output of the data script should be saved to the `/downloads/datasets/`.
The files are uploaded to the directory pointed to by `bucketDataDir`, with the same filename as they had under `/downloads/datasets`.

### Silogen finetuning engine format
For the silogen finetuning engine, the data format is JSON lines.
For supervised finetuning, each line has a JSON dictionary formatted as follows:
```json
{
  "messages": [
    {"role": "user", "content": "This is a user message"},
    {"role": "assistant", "content": "The is an assistant answer"}
  ]
}
```
There can be an arbitrary number of messages. Additionally, each dictionary can contain a `dataset` field that has the dataset identifier, and an `id` field that identifies the data point uniquely.
For [Direct Preference Optimization](https://arxiv.org/pdf/2305.18290), the data format is as follows:
```json
{
  "prompt_messages": [
    {"role": "user", "content": "This is a user message"},
  ],
  "chosen_messages": [
    {"role": "assistant", "content": "This is a preferred answer"}
  ],
  "rejected_messages": [
    {"role": "assistant", "content": "This is a rejected answer"}
  ]
}
```

The HuggingFace datasets library can save the output in JSON lines format with the `to_json` function:
```python
dataset.to_json("/downloads/datasets/<name of your dataset file.jsonl>")
```
