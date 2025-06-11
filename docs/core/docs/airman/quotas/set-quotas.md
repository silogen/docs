---
tags:
  - airman
  - quota
  - add quota
---

# Manage quotas

This article explains how to define quotas for your projects. In Airman you can set quotas for GPU and CPUs for your projects. Users belonging to a project are guaranteed the allocated quota for their AI workloads.

!!! info
    There can be only one quota for a project per cluster.

## Create quota

Press the `Create Quota` button to create a new quota.

**Cluster** - The cluster to which the quota applies to.

**Assignee** - The project for the quota. A quota can be assigned to only one project.

**Identifier** - Unique identifier for the quota.

**Description** - A optional description that describes the quota.

![A diagram of the clusters page.](../../img/quotas/create-quota.png)

## Set the guaranteed quota values

Define a quota below to gurarantee a fixed amount of compute resources for the assigned project. Setting a quota category to 0 means no resources are guraranteed exclusively for that project — its workloads will still use any available resource. Even with a quota in place, workloads may temporarily exceed their quota if additional resources are available.

**GPUs** - The guaranteed allocation for the number of GPUs. "Available to allocate" shows the total amount available.

**CPU Cores** - The guaranteed allocation for the number of CPUs. "Available to allocate" shows the total amount available.

**System Memory** - The guaranteed allocation for the amount of memory (GB). "Available to allocate" shows the total amount available.

**Ephemeral Disk** - The guaranteed allocation for the amount of disk space (GB). "Available to allocate" shows the total amount available.

Press `Save changes` to finish creating the quota.

![A diagram of the clusters page.](../../img/quotas/edit-quota.png)
