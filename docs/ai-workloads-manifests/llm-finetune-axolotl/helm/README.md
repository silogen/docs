# Finetuning with Axolotl

This is a Helm Chart for running an Axolotl finetuning job.

Currently the base model and input data are assumed to be from HuggingFace, or some other source directly supported by Axolotl.
The output is saved with MinIO in the directory specified by `checkpointsRemote`.
If any checkpoints already exist in the directory, the training can be resumed from there (by setting `auto_resume_from_checkpoints`)

The provided example task is based on the [Llama-3.2-1B LoRA config](https://github.com/axolotl-ai-cloud/axolotl/blob/main/examples/llama-3/lora-1b.yml) from the Axolotl repo.
The only changes are:

- set the optimizer to `adamw_torch` in order to avoid using bitsandbytes
- turn on `auto_resume_from_checkpoints`
- not specifying an output directory (the chart takes care of uploading the checkpoints)

## Limitations

- bitsandbytes does not work. It is built and installed so that axolotl launch works, but currently has some unsolved issues. Avoid functionality that actually uses bitsandbytes.
- ray also does not work as expected, so multi-node training is not supported.

## Configuration

Create an Axolotl config file in the `mount/` directory, and set `configFile` in the overrides to point to your config file. See the [Axolotl docs](https://docs.axolotl.ai/docs/config.html) for how to specify a config file.

## Running the workload

Then the simplest is to run `helm template` and pipe the result to `kubectl create`.

Example command:

```bash
helm template workloads/llm-finetune-axolotl/helm \
  --values workloads/llm-finetune-axolotl/helm/overrides/finetune-lora.yaml \
  --name-template finetune-lora-axolotl \
  | kubectl create -f -
```
