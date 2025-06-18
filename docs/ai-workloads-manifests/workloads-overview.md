# Working with AI workloads on Kubernetes

## Overview
This document provides a general introduction to deploying AI workloads on Kubernetes using Helm charts and Kubernetes manifests. While each specific AI workload in our solution has its own dedicated documentation, this guide explains the common concepts, structure, and deployment patterns that apply across all our AI workload Helm charts.

Each AI workload is defined as a separate Helm chart that can be submitted to run on a Kubernetes platform.

## What is Helm?
Helm is the package manager for Kubernetes, often referred to as "the apt/yum for K8s." It simplifies the deployment and management of applications by:

- Packaging Kubernetes resources into reusable charts (pre-configured templates).
- Managing dependencies, versions, and configurations.
- Supporting easy upgrades, rollbacks, and customization.

Think of it as a blueprint that defines how an application should be installed and run in a Kubernetes cluster.

### How does Helm relate to Kubernetes manifests?
Helm doesn't replace manifests - it generates them dynamically using:
- Templates: Manifest files with variables (in templates/ directory)
- Values: Configuration that fills the template variables

## Why Use Helm for AI Workloads?
Deploying AI/ML workloads (inference, training, batch processing) on Kubernetes can be complex due to:

- Dependencies (models, datasets, GPU drivers).
- Configuration variability (resource limits, scaling, model versions).
- Reproducibility (consistent deployments across dev/test/prod).

Helm addresses these challenges by:

1. Standardizing Deployments:
   - AI components (model servers, preprocessing, monitoring) are defined in a Helm chart (deployment.yaml, service.yaml, etc.).

2. Managing Configurations:
   - values.yaml centralizes tunable parameters (e.g., replicaCount, modelPath, GPU limits). Overrides allow specifying specific models, datasets or environment-specific setups (e.g., dev vs. prod):

3. Supporting AI-Specific Needs
   - GPU/accelerator support: Define resource requests in values.yaml.
   - Model storage: Mount PersistentVolumes or download models at runtime.
   - Scaling: Pre-configure Horizontal Pod Autoscaler (HPA) for inference workloads.

## Structure of the workloads

```bash
<workload-name>/
├── Chart.yaml          # Metadata about the chart, such as the release name.
├── values.yaml         # Default configuration values for the workload.
├── templates/          # Kubernetes manifest templates that Helm uses to generate actual manifests
│   ├── deployment.yaml # Configuration of the AI workload deployment
│   ├── service.yaml    # Configuration of the Kubernetes service
└── overrides           # Customization of the AI workload without modifying the original chart
```

### Understanding the values.yaml file

The values.yaml file is a YAML-formatted configuration file that contains key-value pairs representing the parameters required for your model inference deployment. These parameters include:
- Image name: name of the docker image to use

- Resources: Define GPU, CPU and memory requirements for your deployment.

- Model: Provide the name of the model.

- Storage details

- Environment Variables: Set environment-specific configurations, such as secrets and storage host location.

- Service Configuration: Customize service settings like ports, timeouts, and logging levels.

### Overrides
Overrides allow customization of the AI workload without modifying the original chart. This includes changing the model and data sets.

## Running AI workloads on k8s

It is recommended to use `helm template` and pipe the result to `kubectl create` , rather than using `helm install`. Generally, a command looks as follows

```bash
helm template <release-name> . -f <override.yaml> | kubectl apply -f -
```
or
```bash
helm template <release-name> . --set <parameter>=<value> | kubectl apply -f -
```
### How to use overrides to customize the workload
There are multiple options you can use to customize the workload by applying overrides.

**Alternative 1: Deploy a Specific Model Configuration**

To deploy a specific model along with its settings, use the following command from the `helm` directory:

```bash
helm template tiny-llama . -f overrides/models/tinyllama_tinyllama-1.1b-chat-v1.0.yaml | kubectl apply -f -
```

**Alternative 2: Override the Model**

You can also override the model on the command line:

```bash
helm template qwen2-0-5b . --set model=Qwen/Qwen2-0.5B-Instruct | kubectl apply -f -
```

Helm merges overrides in this order (last takes precedence):

1. values.yaml (in chart)
2. -f files (in command order)
3. --set arguments

### Verifying the Deployment

Check pods
```bash
kubectl get pods -n <namespace>
```
Check services
```bash
kubectl get svc -n <namespace>
```
View logs (for a specific pod)
```bash
kubectl logs -f <pod-name> -n <namespace>
```

### Monitoring progress, logs, and GPU utilization with k9s

We're interested to see a progress bar of the finetuning training, seeing any messages that a workload logs, and we also want to verify that our GPU Jobs
are consuming our compute relatively effectively. This information can be fetched from our Kubernetes cluster in many ways, but one convenient and recommended way us using [k9s](https://k9scli.io/).
We recommend the official documentation for more thorough guidance, but this section shows some basic commands to get what we want here.

To get right to the Jobs view in the namespace `<namespace>`, we can run:

```bash
k9s --namespace <namespace> --command Jobs
```

Choose a Job using `arrow keys` and `Enter` to see the Pod that it spawned, then `Enter` again to see the Container in the Pod. From here, we can do three things:

* Look at the logs by pressing `l`. The logs show any output messages produced during the workload runtime.

* Attach to the output of the container by pressing `a`. This is particularly useful to see the interactive progress bar of a finetuning run.

* Spawn a shell inside the container by pressing `s`. Inside the shell we can run `watch -n0.5 rocm-smi` to get a view of the GPU utilization that updates every 0.5s.

Return from any regular `k9s` view with `Esc` .

## Editing & reusing workloads
To create a new workload, you can duplicate an existing workload and adapt as needed.

[Example: Using your own model and data in the workloads](https://github.com/silogen/ai-workloads/blob/main/docs/tutorials/tutorial-01-deliver-resources-and-finetune.md#next-steps-how-to-use-your-own-model-and-data)
