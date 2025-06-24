---
tags:
  - developer center
  - ai catalog
  - workload
---

# AI Development overview (Developer Center)

The SiloGen Developer Center is an interface for developers to easily manage the lifecycle of their Generative AI stack. The Developer Center provides an easy-to-use no-code/low-code option for running and managing AI workloads. This article lays the foundation for how to develop, run, and manage AI workloads in the Developer Center.

![The introduction page to Developer Center outlines the main chat features.](../img/ai-development/devcenter-introduction.png)

## Developer Center functionality

The Developer Center includes the following capabilities:

### Developer tooling

The Developer Center provides developers with [tools and frameworks](./workspaces.md) to accelerate AI development and experimentation, featuring a comprehensive catalog of optimized AI workloads and models for AMD compute. The workloads include the most common developer tools and frameworks, such as Jupyter Notebooks, Visual Studio Code, and popular frameworks like PyTorch and TensorFlow.

### Chat and compare

The [chat page](./inference/chat.md) allows developers to experiment with models they have access to—developers can modify several retrieval and generation parameters to see how they affect the model's response. The [model comparison](./inference/compare.md) view allows developers to compare the output of different models using the same set of settings.

### Training & fine-tuning

[Fine-tuning](./training/fine-tuning.md) a model allows developers to customize it for their specific use case and data. SiloGen provides a certified list of base models that developers can fine-tune, and allows customization of certain hyperparameters to achieve the best results.

### GPU-as-a-Service

The Developer Center provides developers with self-service access to workspaces with GPU resources. Platform admins can set project-based quotas for GPU usage so teams always have the right amount of resources available.

### AI models

The Developer Center offers a comprehensive catalog of curated open-source models, including state-of-the-art large language models (LLMs) and image/video generation models. Developers can easily discover, fine-tune, and deploy these models for their AI use cases.

## Running AI workloads on the command-line

Developers can also deploy and run AI workloads through the command-line interface using pre-validated and open-source [workloads](https://github.com/silogen/ai-workloads) published as Kubernetes manifests and Helm charts. The list of AI workloads is continuously updated.

See more details on how to run workloads on the [command-line](../../../../ai-workloads-manifests/workloads-overview/).
