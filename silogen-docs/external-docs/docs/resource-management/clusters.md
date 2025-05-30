---
title: Clusters
sidebar_position: 2
---

# Clusters

The Clusters view is dedicated for cluster management. From this view, administrators can monitor, add or remove clusters.

The tiles on this page are the same that are shown on the Dashboard that shows the overall metrics from the clusters.

![Clusters and nodes](/img/resource-management/clusters-and-nodes-tiles.png)

The cluster list shows metrics from each cluster and submenu can be used also for deleting a cluster.

![Clusters and nodes](/img/resource-management/clusters-list.png)

## Adding a new cluster

Start by pressing the `Add Cluster` button from the top right corner to open wizard that guides through the process.

- Give a name for the new cluster
- Copy the generated Auth ID and Connection Token variables and paste them to the helm chart on the targer cluster
- After the values have been applied, press Verify Connection button
- If values are correctly applied and connection to the cluster is succesful, the new cluster is added to the list of available clusters.
