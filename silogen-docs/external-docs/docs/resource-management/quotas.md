---
title: Quotas
sidebar_position: 3
---

# Quotas

Quotas ensure that computational resources are appropriately shared between groups. Without quotas, some workloads might use all the resources, leaving other workloads waiting. Quotas define a _minimum_ set of resources that are guaranteed. There is no maximum, so quotas can be exceeded if unused resources are available.

The filter bar can be used to find the correct quota. Filtering can be done by keyword, cluster, or quota assignee.

![Quota filters](/img/resource-management/quotas-filtering.png)

The list view shows available quotas with the applied filters from the filter bar. Each quota has a submenu that allows you to modify or delete the quota.

![Quota filters](/img/resource-management/quotas-list.png)

## Creating a quota

> ---
>
> **Note: Quota creation limitation**
>
> There can be only one quota for a group per cluster
>
> ---

Press the `Create Quota` button to create a new quota.

- Select the cluster to which the new quota applies.
- Select the assignee from the list of available groups.
- Create an identifier for the quota that will be used throughout the system.
- Optionally, add a description for the quota to describe its purpose.

After pressing the `Create and configure` button, you can enter the actual quota restrictions. A value of 0 means there is no guarantee for that particular resource. Any other value means a guaranteed minimum. The following resources can be independently guaranteed:

- The number of GPUs
- The number of CPU cores
- The amount of system memory
- The amount of ephemeral storage

Press `Save changes` to finish creating the quota.
