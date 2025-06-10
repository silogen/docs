---
tags:
  - developer center
  - ai catalog
  - workload
---

# AI development overview (Developer Center)

The SiloGen Developer Center is an interface for you as a developer to easily manage the lifecycle of your Generative AI stack. The Developer Center provides an easy-to-use no-code/low-code option for running and managing AI workloads. This article sets the ground for how to develop, run and manage AI workloads on Developer Center.

![The introduction page to Developer Center outlines the main chat features.](../img/ai-development/devcenter-introduction.png)

## Developer Center functionality
The Developer Center includes following capabilities:

### Developer Tooling
The Developer Center provides developers with [tools and frameworks](./ai-catalog.md) to accelerate AI development and experimentation, featuring a comprehensive catalog of optimized AI workloads and models for AMD compute. The workloads include the most common developer tooling and frameworks such as Jupyter Notebooks, Visual Studio Code and popular frameworks like Pytorch and Tensorflow.

### Chat and Compare
The [Chat page](./inference/chat.md) allows developers to experiment with models they have access to - developers will be able to modify several Retrieval and Generation parameters to judge how they affect the model's response. The [Model Comparison](./inference/compare.md) page of the playground allows developers to compare output of different models, for the same set of settings.

### Training & Finetuning
[Fine-tuning](./training/fine-tuning.md) a model allows developers to customize it to their specific use-case and data. SiloGen provides a certified list of base-models which developers can fine-tune and we allow you to customize certain hyperparameters to get the best results.

### GPU-as-a-Service
Developer Center provides developers with self-service access to workspaces with GPU resources. Platform admins can set project-based quotas for GPU usage so your teams always have the right amount of resources available.

### AI models
The Developer Center offers a comprehensive catalog of curated open-source models, including state-of-the-art large language models (LLMs) and image/video generation models. Developers can easily discover, fine-tune, and deploy these models for their AI use cases.

## Running AI workloads on command-line
Developers can also deploy and run AI workloads through command-line interface using pre-validated and open-source [workloads](https://github.com/silogen/ai-workloads) which have been published as Kubernetes manifests and Helm charts. The list of AI workloads is continuously updated.
See more details on how to run workloads on [command-line](../../../../../../../ai-workloads/workloads/workloads-overview).
