---
tags:
  - developer center
  - ai catalog
  - workload
---

# AI development overview

The SiloGen AI Developer Center is an interface for you to easily manage the lifecycle of your Generative AI stack. The Developer Center provides an easy-to-use no-code/low-code option for running and managing AI workloads. This article sets the ground for how to run and manage AI workloads on SiloGen platform.

SiloGen platform offers API access to a selection of open source and proprietary large language models (LLMs). The LLM generation can be restricted to the content of a document collection with retrieval augmented generation (RAG). This allows the LLM to answer user queries based on an external knowledge base instead of just the LLM’s internal knowledge.

The best results are achieved out-of-the-box with factual questions where the answer exists in the document collection. For many use cases, for example, handling specialised or technical terminology, it is often necessary to further fine-tune a model and/or design few-shot prompts to get good enough results.

The Developer Center does not offer a general intelligence solution. Asking the system to draw conclusions about implications beyond the content of the document collection, for example environmental impact, impact on political stability or consequences in the future, can generate something that may sound like a reasonable answer but is most often just nonsense.

## Developer Center

At the core of the SiloGen platform is the Developer Center which enables researchers to manage AI workloads end-to-end. Developer Center enables the usage of the SiloGen AI workloads and focuses on the user experience, offering low code approaches for developing AI applications by simplifying the execution of [fine-tuning](./training/fine-tuning.md), [inference](./inference/overview.md) and other jobs. Developer Center includes following capabilities:

- [AI catalog](./ai-catalog.md) with pre-configured AI workloads: SiloGen platform provides researchers with a vast catalog of AI workloads and models optimized for AMD compute. The workloads include the most common developer tooling and frameworks: Jupyter Notebooks, Visual Studio Code and popular frameworks like Pytorch and Tensorflow.
- GPU-as-a-Service: Self-service access to AMD compute and GPUs for running smaller fine-tuning jobs to large scale distributed pretraining workloads. Access to GPUs and quotas are predefined in the Airman module so your team always has the right amount of resources available.

![The introduction page to Developer Center outlines the main chat features.](../img/ai-development/devcenter-introduction.png)

## SiloGen AI workloads

SiloGen platform offers common AI workloads to AI researchers covering fine-tuning, evaluation and deployment of LLMs. Those AI workloads have been tested and executed on AMD GPUs and they have been open sourced ([https://github.com/silogen/ai-workloads](https://github.com/silogen/ai-workloads)). SiloGen AI workloads provide building blocks for broader collaboration across the AI ecosystem and accelerate the development of AI use cases. The of predeveloped AI workloads is continuously updated.

## Running AI workloads on Kubernetes command-line

You can also run AI workloads directly through a command-line interface using Helm charts and kubectl. You can select a suitable workload from a list of reference workloads in order to get started quickly. The reference workloads offer intelligent workload scheduling based on policies to optimize GPU utilization across workloads.

[See how to run workloads on Kubernetes](../../../../../../../ai-workloads/workloads/workloads-overview).
