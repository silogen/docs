# Finetuning config structure and parameters

This document describes the structure of the finetuning configuration, and the parameters and values that can be defined there.

See the finetuning config section [this config file](overrides/llama-31-tiny-random-deepspeed-values.yaml) for an example of a valid configuration.
See the various sub-configs for their options. Additional properties are not allowed.

**Top-level properties:**

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| method | `const` |  | `sft` | `"sft"` |  |
| data_conf | `object` | ✅ | [ChatTrainValidConfig](#chattrainvalidconfig) |  | The data input config |
| training_args | `object` | ✅ | [SilogenTrainingArguments](#silogentrainingarguments) |  | Transformer TrainingArguments with some restrictions |
| overrides | `object` |  | [Overrides](#overrides) | `{"num_train_epochs": null, "lr_multiplier": 1.0, "lr_batch_size_scaling": "none"}` | Override options to simplify the config interface |
| batchsize_conf | `object` | ✅ | [BatchsizeConfig](#batchsizeconfig) |  | Batch size configuration |
| peft_conf | `object` | ✅ | [NoPeftConfig](#nopeftconfig) or [PretrainedPeftConfig](#pretrainedpeftconfig) or [GenericPeftConfig](#genericpeftconfig) |  | Adapter configuration |
| run_conf | `object` | ✅ | [RunConfig](#runconfig) |  | Model related configuration |
| tracking | `object` or `null` |  | [FinetuningTrackingConfig](#finetuningtrackingconfig) |  | MLFlow tracking configuration |
| quant_conf | `object` |  | [BnBQuantizationConfig](#bnbquantizationconfig) or [NoQuantizationConfig](#noquantizationconfig) | `{"quantization_type": "no-quantization"}` | Quantization configuration |
| sft_args | `object` | ✅ | [SFTArguments](#sftarguments) |  | SFT specific arguments |

---

# Definitions

## AutoSplitDataInput

Automatic validation split from the training data

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| type | `const` | ✅ | `AUTO_SPLIT` |  |  |
| data_type | `string` |  | string | `"ChatConversation"` | generally, the data_type is automatically set based on the experiment config method |
| ratio | `number` |  | number | `0.2` | Ratio of the training data to use for validation |
| seed | `integer` |  | integer | `1289525893` | Seed for the random number generator for splitting |

## BatchsizeConfig

Config for determining the total batch size

Total batch size is the effective batch size for the complete training run. It is equal to
number of processes * per-device batch size * accumulation.

The maximum batch size per device is the maximum batch size that can be accommodated on a single device.
This mostly limited by the memory capacity of the device.

#### Type: `object`

| Property | Type | Required | Possible values | Description |
| -------- | ---- | -------- | --------------- | ----------- |
| total_train_batch_size | `integer` | ✅ | integer | The total batch size for the training run |
| max_per_device_train_batch_size | `integer` | ✅ | integer | The maximum training batch size per device |
| per_device_eval_batch_size | `integer` or `null` |  | integer | The maximum eval batch size per device, if not given, will use same as training batch size |

## BnBQuantizationConfig

Bits and Bytes configuration

The options are from the BitsAndBytes config,
see: https://huggingface.co/docs/transformers/en/main_classes/quantization#transformers.BitsAndBytesConfig

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| quantization_type | `const` |  | `bits-and-bytes` | `"bits-and-bytes"` |  |
| load_in_8bit | `boolean` |  | boolean | `False` |  |
| load_in_4bit | `boolean` |  | boolean | `False` |  |
| llm_int8_threshold | `number` |  | number | `6.0` |  |
| llm_int8_skip_modules | `array` or `null` |  | string |  |  |
| llm_int8_enable_fp32_cpu_offload | `boolean` |  | boolean | `False` |  |
| llm_int8_has_fp16_weight | `boolean` |  | boolean | `False` |  |
| bnb_4bit_compute_dtype | `string` or `null` |  | string |  |  |
| bnb_4bit_quant_type | `const` |  | `fp4` and/or `nf4` | `"fp4"` |  |
| bnb_4bit_use_double_quant | `boolean` |  | boolean | `False` |  |
| bnb_4bit_quant_storage | `string` or `null` |  | string |  |  |

## ChatTrainValidConfig

Training time data configuration.

Always defines some DataInput for training data and can include validation DataInput, though a trivial NoneDataInput is also allowed for the validation side.

Additionally includes chat template and padding configurations, as those are part of the data input pipeline.

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| training_data | `object` | ✅ | [ConcatenationDataInput](#concatenationdatainput) or [WeightedMixDataInput](#weightedmixdatainput) |  |  |
| validation_data | `object` | ✅ | [AutoSplitDataInput](#autosplitdatainput) or [ConcatenationDataInput](#concatenationdatainput) or [NoneDataInput](#nonedatainput) |  |  |
| chat_template_name | `string` |  | `mistral-with-system` or `chat-ml` or `poro` or `keep-original` or `simplified-llama31` | `"mistral-with-system"` |  |
| padding_side | `string` |  | string | `"right"` | Padding side, right is usually right. |
| missing_pad_token_strategy | `string` |  | [MissingPadTokenStrategy](#missingpadtokenstrategy) | `"bos-repurpose"` | See the MissingPadTokenStrategys for descriptions of the options |

## ConcatenationDataInput

A simple list of datasets

These are simply concatenated, the same as sampling all with equal weight.

The datasets themselves need to be in the finetuning supported JSONL formats.
For SFT this means lines:

    {"messages": {"content": "string", "role": "string"}}

For DPO this means lines of:

    {"prompt_messages": {"content": "string", "role": "string"}, "chosen_messages": {"content": "string", "role": "string"}, "rejected_messages": {"content": "string", "role": "string"}}

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| type | `const` | ✅ | `CONCATENATION` |  |  |
| datasets | `array` | ✅ | [DatasetDefinition](#datasetdefinition) |  |  |
| data_type | `string` |  | string | `"ChatConversation"` | generally, the data_type is automatically set based on the experiment config method |

## DatasetDefinition

Define how to load a dataset

#### Type: `object`

| Property | Type | Required | Possible values | Description |
| -------- | ---- | -------- | --------------- | ----------- |
| path | `string` | ✅ | string | Local path to a JSONL file in the finetuning data format |

## FinetuningTrackingConfig

Settings that define how run details are logged

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| mlflow_server_uri | `string` | ✅ | string |  | MLflow server URI. Can be local path |
| experiment_name | `string` | ✅ | string |  | Experiment name that is used for MLFlow tracking |
| run_id | `string` or `null` |  | string |  | Run id, to resume logging to previousely started run |
| run_name | `string` or `null` |  | string |  | Run name, to give meaningful name to the run to be displayed in MLFlow UI. Used only when run_id is unspecified |
| hf_mlflow_log_artifacts | `string` |  | string | `"False"` | Whether to store model artifacts in MLFlow |

## GenericPeftConfig

Config for any new initialized PEFT Adapter

See https://huggingface.co/docs/peft/tutorial/peft_model_config for the possible kwargs
and https://github.com/huggingface/peft/blob/v0.7.1/src/peft/utils/peft_types.py for the types.

### Example
    >>> loaded_data = {'peft_type':'LORA', 'task_type': 'CAUSAL_LM',
    ...         'peft_kwargs': {'r': 32, 'target_modules': ['v_proj']}}
    >>> generic_conf = GenericPeftConfig(**loaded_data)
    >>> # Then later in the code something like:
    >>> model = transformers.AutoModel.from_pretrained('hf-internal-testing/tiny-random-MistralModel')
    >>> peft.get_peft_model(model, generic_conf.get_peft_config())
    PeftModelForCausalLM(
      (base_model): LoraModel(
        ...
      )
    )

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| peft_type | `string` | ✅ | [PeftType](#pefttype) |  |  |
| task_type | `string` |  | [TaskType](#tasktype) | `"CAUSAL_LM"` |  |
| peft_kwargs | `object` |  | object |  |  |



## MissingPadTokenStrategy

Specifies the available missing pad token strategies.

We've shown in a small set of experiments that repurposing EOS can start to hurt performance
while the other options seem to work equally well.

Repurposing EOS is the default in many online sources, but it is actually a bad idea if we want to predict
EOS, as all the pad_token_ids get ignored in loss computation, and thus the model does not learn to predict
the end of the text. However, for models that have additional tokens for end of message, end of turn, etc.
this is not so dangerous.

Repurposing BOS is similar to repurposing EOS, but since we do not need to predict BOS, this may be more sensible.

Repurposing UNK can work with tokenizers that never produce UNKs in normal data (e.g. Mistral tokenizers should have
a byte fall-back so that everything can be tokenized).

UNK_CONVERT_TO_EOS uses a hack where the unk_token_id is initially used for padding, but in the collation phase the
input-side UNKs (padding) gets set to EOS, so that the input-side padding looks like EOS. On the output-side, the
UNKs (padding) still gets ignored. NOTE: This will leave the tokenizer's pad_token_id set to the unk_token_id; so
any subsequent use of the model where padding is involved should somehow explicitly set the pad_token_id again.

#### Type: `string`

**Possible Values:** `eos-repurpose` or `bos-repurpose` or `unk-repurpose` or `unk-convert-to-eos`

## ModelArguments

These are passed to AutoModelForCausalLM.from_pretrained

See parameter docstrings and help at:
https://huggingface.co/docs/transformers/main/en/main_classes/model#transformers.PreTrainedModel.from_pretrained
See below in "Parameters for big model inference" too, it affects training too. Also note that this link takes you
to the transformers main branch version - be sure to compare with the installed version of transformers (that keeps
changing over time, and it is difficult to keep this doctstring up to date, so we wanted to link to the latest here).

Some important parameters to consider are:
- device_map :
    A map that specifies where each submodule should go. It doesn’t need to be refined to each parameter/buffer
    name, once a given module name is inside, every submodule of it will be sent to the same device. If we only pass
    the device (e.g., "cpu", "cuda:1", "mps", or a GPU ordinal rank like 1) on which the model will be allocated,
    the device map will map the entire model to this device. Passing device_map = 0 means put the whole model on GPU
    0.
- attn_implementation :
    The attention implementation to use in the model (if relevant). Can be any of "eager" (manual implementation of
    the attention), "sdpa" (using F.scaled_dot_product_attention), or "flash_attention_2" (using
    Dao-AILab/flash-attention). By default, if available, SDPA will be used for torch>=2.1.1. The default is
    otherwise the manual "eager" implementation.

NOTE:
    This does not include quantization_config. Quantization config is specified separately.

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| torch_dtype | `const` |  | `auto` | `"auto"` |  |
| device_map | `object` or `string` or `null` |  | object and/or string |  | Custom device map so that you can manually override the choices that HuggingFace would make. This can also be a string to specify "auto", "balanced_low_0", or "sequential" |
| max_memory | `object` or `null` |  | object |  |  |
| low_cpu_mem_usage | `boolean` |  | boolean | `False` |  |
| attn_implementation | `string` or `null` |  | string |  | Note: this can be set to "sdpa", "flash_attention_2", "eager" |
| offload_folder | `string` or `null` |  | string |  |  |
| offload_state_dict | `boolean` or `null` |  | boolean |  | Default is True if offloading (otherwise no effect) |
| offload_buffers | `boolean` or `null` |  | boolean |  |  |
| use_cache | `boolean` |  | boolean | `True` | Saves generated hidden states to speed up generation. See: https://discuss.huggingface.co/t/what-is-the-purpose-of-use-cache-in-decoder/958 use_cache is mutually exclusive with gradient_checkpointing |
| cache_dir | `string` or `null` |  | string |  |  |
| force_download | `boolean` |  | boolean | `False`  |  |
| local_files_only | `boolean` |  | boolean | `False`  |  |
| proxies | `object` or `null` |  | object |  |  |
| resume_download | `boolean` |  | boolean | `False`  |  |
| revision | `string` |  | string | `"main"` |  |
| code_revision | `string` |  | string | `"main"` |  |
| subfolder | `string` or `null` |  | string |  |  |
| token | `string` or `null` |  | string |  |  |
| use_safetensors | `boolean` or `null` |  | boolean |  |  |
| variant | `string` or `null` |  | string |  |  |
| trust_remote_code | `boolean` |  | boolean | `False`  | Warning: if set to `True`, allows execution of downloaded remote code |

## NoPeftConfig

A trivial config specifying that no peft is used

#### Type: `object`

| Property | Type | Required | Possible values | Description |
| -------- | ---- | -------- | --------------- | ----------- |
| peft_type | `const` | ✅ | `NO_PEFT` |  |

## NoQuantizationConfig

A marker not to use quantization

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| quantization_type | `const` |  | `no-quantization` | `"no-quantization"` |  |

## NoneDataInput

A special type for not using data e.g. in validation

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| type | `const` | ✅ | `NONE` |  |  |
| data_type | `string` |  | string | `"ChatConversation"` | generally, the data_type is automatically set based on the experiment config method |

## Overrides

Override options that allow simple interfaces for charts using these configs

This is particularly useful for a helm chart interface where we include the finetuning package config
as a part of the values.yaml file. These a more flexible helm interface with certain keys brought to the
top level.

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| num_train_epochs | `integer` or `number` or `null` |  | number |  | Overrides the number of epochs in the training_args |
| lr_multiplier | `number` |  | number | `1.0` | Multiplier applied to the learning rate in the training_args |
| lr_batch_size_scaling | `string` |  | `none` `sqrt` `linear` | `"none"` | Scales the learning rate in the training_args by a factor derived from the total training batch size. `none`: No scaling. `sqrt`: Multiplies learning rate by square root of batch size (a classic scaling rule). `linear`: Multiplies learning rate by the batch size (a more modern scaling rule). |

## PeftType

Enum class for the different types of adapters in PEFT.

Supported PEFT types:
- PROMPT_TUNING
- MULTITASK_PROMPT_TUNING
- P_TUNING
- PREFIX_TUNING
- LORA
- ADALORA
- BOFT
- ADAPTION_PROMPT
- IA3
- LOHA
- LOKR
- OFT
- XLORA
- POLY
- LN_TUNING
- VERA
- FOURIERFT
- HRA

#### Type: `string`

**Possible Values:** `PROMPT_TUNING` or `MULTITASK_PROMPT_TUNING` or `P_TUNING` or `PREFIX_TUNING` or `LORA` or `ADALORA` or `BOFT` or `ADAPTION_PROMPT` or `IA3` or `LOHA` or `LOKR` or `OFT` or `POLY` or `LN_TUNING` or `VERA` or `FOURIERFT` or `XLORA` or `HRA` or `VBLORA`

## PretrainedPeftConfig

PEFT adapter uses the config and initialisation from a pretrained adapter

#### Type: `object`

| Property | Type | Required | Possible values | Description |
| -------- | ---- | -------- | --------------- | ----------- |
| peft_type | `const` | ✅ | `PRETRAINED_PEFT` |  |
| name_or_path | `string` | ✅ | string | HF ID or path to the pretrained peft |

## RunConfig

Experiment running configuration

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| model | `string` |  | string | `"/local_resources/basemodel"` | Local path to model to be fine-tuned. Normally this should be `/local_resources/basemodel` |
| model_args | `object` |  | [ModelArguments](#modelarguments) | `{"torch_dtype": "auto", "device_map": "auto", "max_memory": null, "low_cpu_mem_usage": false, "attn_implementation": null, "offload_folder": null, "offload_state_dict": null, "offload_buffers": null, "use_cache": true, "cache_dir": null, "force_download": false, "local_files_only": false, "proxies": null, "resume_download": false, "revision": "main", "code_revision": "main", "subfolder": null, "token": null, "use_safetensors": null, "variant": null, "trust_remote_code": false}` |  |
| tokenizer | `string` or `null` |  | string |  | Model HuggingFace ID, or path, or None to use the one associated with the model |
| use_fast_tokenizer | `boolean` |  | boolean | `True` | Use the Fast version of the tokenizer. The 'slow' version may be compatible with more features. |
| resume_from_checkpoint | `boolean` or `string` | | boolean and/or string | `False`  | Normally should be set to 'auto' to continue if a checkpoint exists. Can set to `True` to always try to continue, `False` to never try, or a path to load from a specific path. |
| final_checkpoint_name | `string` |  | string | `"checkpoint-final"` | Name of final checkpoint. Should be left as default |

## SFTArguments

Supervised fine-tuning arguments

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| max_seq_length | `integer` |  | integer | `2048` | Maximum length input sequence length. Longer sequences will be filtered out. |
| save_name_if_new_basemodel | `string` |  | string | `"checkpoint-new-basemodel"` | If a new basemodel is saved, it will be saved with this name |
| train_on_completions_only | `boolean` |  | boolean | `False` | Only compute loss on the assistant's turns. |

## SilogenTrainingArguments

HuggingFace TrainingArguments as Config with additional SiloGen conventions

The list of training arguments is best available online (the version might not be up-to-date here):
https://huggingface.co/docs/transformers/main/en/main_classes/trainer#transformers.TrainingArguments

The TrainingArguments object does a lot of things besides specifying the training configuaration options (e.g. it
has computed properties like true training batch size etc.)

## TaskType

Enum class for the different types of tasks supported by PEFT.

Overview of the supported task types:
- SEQ_CLS: Text classification.
- SEQ_2_SEQ_LM: Sequence-to-sequence language modeling.
- CAUSAL_LM: Causal language modeling.
- TOKEN_CLS: Token classification.
- QUESTION_ANS: Question answering.
- FEATURE_EXTRACTION: Feature extraction. Provides the hidden states which can be used as embeddings or features
  for downstream tasks.

#### Type: `string`

**Possible Values:** `SEQ_CLS` or `SEQ_2_SEQ_LM` or `CAUSAL_LM` or `TOKEN_CLS` or `QUESTION_ANS` or `FEATURE_EXTRACTION`

## WeightedDatasetDefinition

Define a dataset, with a weight for sampling

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| path | `string` | ✅ | string |  | Local path to a JSONL file in the finetuning data format |
| sampling_weight | `number` |  | number | `1.0` |  |

## WeightedMixDataInput

A list of datasets where each is sampled by a certain weight

These datasets are interleaved based on the sampling weights. The resulting dataset is fully precomputed, upto
the point where every single sample in every dataset gets picked. This means that with small sampling weights,
it can take a lot of draws to see every sample from a dataset and so the resulting dataset can be very large.

The datasets themselves need to be in the finetuning supported JSONL formats.
For SFT this means lines:

    {"messages": {"content": "string", "role": "string"}}

For DPO this means lines of:

    {"prompt_messages": {"content": "string", "role": "string"}, "chosen_messages": {"content": "string", "role": "string"}, "rejected_messages": {"content": "string", "role": "string"}}

#### Type: `object`

| Property | Type | Required | Possible values | Default | Description |
| -------- | ---- | -------- | --------------- | ------- | ----------- |
| type | `const` | ✅ | `PRECOMPUTE_WEIGHTED_MIX` |  |  |
| datasets | `array` | ✅ | [WeightedDatasetDefinition](#weighteddatasetdefinition) |  |  |
| data_type | `string` |  | string | `"ChatConversation"` | generally, the data_type is automatically set based on the experiment config method |
| seed | `integer` |  | integer | `19851243` | Seed for the random number generator for interleaving draws |
