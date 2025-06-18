# Finetuning with the SiloGen finetuning engine

This is a Helm Chart for finetuning Jobs based on the SiloGen finetuning engine.
The chart integrates the finetuning config as part of the `values.yaml` input.

See the `values.yaml` file for the general structure (more documentation coming soon).

## Running the workload
Since the `helm install` semantics are centered around on-going installs, not jobs that run once,
it's best to just run `helm template` and pipe the result to `kubectl create`.

Example command:
```bash
helm template . \
  -f overrides/llama-31-tiny-random-deepspeed-values.yaml \
  --name-template llama-31-tiny-random-deepspeed-alpha \
  | kubectl create -f -
```

## Multiple overlays, simplified interface

This chart supports two ways of specifying certain inputs, one on the top level and one as part of the finetuning_config:
- Training data can be provided as `trainingData` or `finetuning_config.data_conf.training_data.datasets`
- The total batch size target can be provided as `batchSize` or `finetuning_config.batchsize_conf.total_train_batch_size`
- The number of epochs to run for can be provided as `numberOfEpochs` or `finetuning_config.training_args.num_train_epochs`

The top level inputs provide a simpler interface to run finetuning. However, they're not enough alone to fully specify a sensible training setup.
The expectation is that these top-level inputs are used in conjuction with a set of override files that specify most arguments. This is the expected
way that the chart is used in conjuction with the so called Silogen developer console.
An example of such use is:
```bash
helm template . \
  -f overrides/models/meta-llama_llama-3.1-8b.yaml \
  -f overrides/dev-console/default.yaml \
  --name-template llama-31-8b-argilla-alpha \
  | kubectl create -f -
```


## Multiple overlays, general case
Multiple overlays can be useful for a CLI user as well.
Here's an example that reproduces the output of tutorial-01-finetune-full-param.yaml:
```bash
helm template . \
  -f overrides/models/tiny-llama_tinyllama-1.1b-chat-v1.0.yaml \
  -f overrides/additional-example-files/repro-tutorial-01-user-inputs.yaml \
  --name-template tiny-llama-argilla-alpha \
  | kubectl create -f -
```
To check that the manifests match, we can run a diff and see that it is empty:
```bash
diff \
  <( \
    helm template . \
    -f overrides/models/tiny-llama_tinyllama-1.1b-chat-v1.0.yaml \
    -f overrides/additional-example-files/repro-tutorial-01-user-inputs.yaml \
    --name-template tiny-llama-argilla-alpha \
  ) \
  <( \
    helm template . \
    -f overrides/tutorial-01-finetune-full-param.yaml \
    --name-template tiny-llama-argilla-alpha \
  )
```

## Tensorboard
Specifying `runTensorboard: true` and `finetuning_config.trainings_args.report_to: ["tensorboard"]` logs the training progress to tensorboard and serves the Tensorboard web UI from the training container.
The tensorboard logs are also uploaded to the bucket storage for later use.

To connect to the Tensorboard web UI on the container, start a port-forward:
```bash
kubectl port-forward --namespace YOUR_NAMESPACE pods/YOUR_POD_NAME 6006:6006
```
Then browse to [localhost:6006](localhost:6006).

Note that the logging frequency is set by the HuggingFace Transformers [logging options](https://huggingface.co/docs/transformers/main/en/main_classes/trainer#transformers.TrainingArguments.logging_strategy).

## Best-known-configuration model overrides

The directory `overrides/models` hosts finetuning recipes for various models. The files are named according to model canonical names, which is the huggingface pattern of `organization/model-name` just changed into `organization_model-name`. These configurations have been shown to work well in experiments, but that does not guarantee that these exact parameters are always optimal. The best parameters still depend on the data, too.
