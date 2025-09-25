<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

---
tags:
  - AMD Resource Manager
  - projects
  - workloads
---

# Workload Submission

Once a project is set up with users and quotas, users can submit workloads to the cluster. Workloads are typically AI training or inference jobs that require significant computational resources.

## Submitting a workload

Ensure you have access to the cluster by obtaining the kubeconfig file as detailed in [Accessing the Cluster](./accessing-the-cluster.md). This file is necessary for submitting workloads.
You can submit workloads using command-line tools like `kubectl` or through a workload management system integrated with the cluster. You will be prompted to login using your Resource Manager credentials when you attempt to access the cluster.
When submitting your workload, please make sure to specify the project namespace and request resources within the allocated quota.

## Workloads and project quotas

Similar to submission of workloads via the API, workloads submitted to a particular project must adhere to the quotas allocated to the project. The workloads can exceed the quota allocated to the project, if there are idle resources in the cluster.
However, if another project with a higher quota allocation requests those resources, the workload may be preempted to free up resources for the higher-priority project.

## Monitoring workloads

Workloads submitted via kubectl can be monitored by Platform Administrators on the Resource Manager UI.
This includes monitoring of the GPU resources currently consumed by the workloads as well as the project.

## Supported workload types

Not all workload types are monitored by the AMD Resource Manager. Currently the following standard Kubernetes workload types are supported: Pods, Jobs, CronJobs, Deployments, DaemonSets and StatefulSets, in addition to KaiwoJobs and KaiwoServices.
This does not mean that other workload types and custom resources cannot be submitted to the cluster, but they will not be monitored by the Resource Manager. However any of the above supported types created or spun off from the custom resources will be monitored.

!!! note
    Please note that to submit custom resources, the ClusterRole definitions for project members might need to be customized to account for these new types.
