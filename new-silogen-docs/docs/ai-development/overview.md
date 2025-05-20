---
tags:
  - developer center
  - ai catalogue
  - workload
---

# AI development overview

This article explains how to run and manage AI workloads on SiloGen platform.

## Developer Center

At the core of the SiloGen platform is the Developer Center which enables researchers to manage AI workloads end-to-end. Developer Center enables the usage of the SiloGen AI workloads and focuses on the user experience, offering low code approaches for developing AI applications by simplifying the execution of [fine-tuning](./fine-tuning.md), [inference](./inference.md) and other jobs. Developer Center includes following capabilities:

- [AI catalogue](./ai-catalogue.md) with pre-configured AI workloads: SiloGen platform provides researchers with a vast catalog of AI workloads and models optimized for AMD compute. The workloads include the most common developer tooling and frameworks: Jupyter Notebooks, Visual Studio Code and popular frameworks like Pytorch and Tensorflow.
- GPU-as-a-Service: Self-service access to AMD compute and GPUs for running smaller fine-tuning jobs to large scale distributed pretraining workloads. Access to GPUs and quotas are predefined in the Airman module so your team always has the right amount of resources available.

![The introduction page to Developer Center outlines the main chat features.](./devcenter-introduction.png)

## SiloGen AI Workloads

SiloGen platform offers common AI workloads to AI researchers covering fine-tuning, evaluation and deployment of LLMs. Those AI workloads have been tested and executed on AMD GPUs and they have been open sourced ([https://github.com/silogen/ai-workloads](https://github.com/silogen/ai-workloads)). SiloGen AI workloads provide building blocks for broader collaboration across the AI ecosystem and accelerate the development of AI use cases. The catalogue of predeveloped AI workloads is continuously updated.

## Running AI workloads on Kubernetes command-line

You can also run AI workloads directly through a command-line interface using Helm charts and kubectl. You can select a suitable workload from a list of reference workloads in order to get started quickly. The reference workloads offer intelligent workload scheduling based on policies to optimize GPU utilization across workloads.

[See how to run workloads on Kubernetes](../ai-workloads/workloads/workloads-overview.md).
 