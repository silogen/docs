---
tags:
  - AMD AI Workbench
  - tutorial
  - model training
---
<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

# Command-line Tutorials

The CLI (command-line) tutorials include practical examples on how to run AI model training, fine-tuning, and inference workloads from the Kubernetes command line using kubectl and helm charts.

The tutorials start with a shared setup: [Tutorial 0](ai-workloads-docs/tutorials/tutorial-00-prerequisites.md). It covers the tools, but also has a required cluster setup step that needs to be run.

- [Tutorial 0](ai-workloads-docs/tutorials/tutorial-00-prerequisites.md): Shared setup for tutorials.
- [Deliver Resources and Finetune](ai-workloads-docs/tutorials/tutorial-01-deliver-resources-and-finetune.md): Learn how to download models and data to cluster MinIO storage, run finetuning jobs, and deploy inference services.
- [Language extension: Odia-finetuning](ai-workloads-docs/tutorials/tutorial-02-language-extension-finetune.md): Learn how to finetune a continued pretraining basemodel to make it an instruction following model, then deploy models and compare.
- [Deliver Resources and Run Megatron-LM Continuous Pretraining of Llama-3.1-8B](ai-workloads-docs/tutorials/tutorial-03-deliver-resources-and-run-megatron-cpt.md): Learn how to download a dataset and base model to cluster MinIO, convert them to Megatron‑LM format, run a multi‑node continuous‑pretraining job, and validate the final checkpoint with an inference workload.
- [Deliver Resources and Run Megatron-LM Continuous Pretraining of Llama-3.1-70B](ai-workloads-docs/tutorials/tutorial-04-deliver-llama70b-and-run-megatron-cpt-with-tp8-ddp2.md): Learn how to download a dataset and base model to cluster MinIO, convert them to Megatron‑LM format, run a multi‑node continuous‑pretraining job, and validate the final checkpoint with an inference workload.

