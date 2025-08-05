---
tags:
  - developer center
  - workloads
  - workspaces
---

# Workloads

A workload is a batch job or a service running in the cluster with resources defined by the workload and limited by the quota that the workload owner has. This page shows all started workloads. The view shows all workload statuses by default except `Deleted`.

If a user belongs to multiple projects, the project needs to be selected first from the top of the page.

![Workload actions](../img/workloads/workloads-projects.png)

The paginated table shows the name of the workload, the cluster the workload is assigned to, and how many resources the workload requires. The `Status` column shows the last known status of the workload and is not updated automatically. Filters can be used to find workloads by name, type, or status.

![Workload filters](../img/workloads/workloads-filters.png)

## Actions

Workload actions are available from the Actions column by pressing the three-dot button.

![Workload actions menu](../img/workloads/workloads-actions.png)

### Show details

Shows details of the workload, such as when it was created and by whom.

### Delete

Queues the workload for deletion.

### Open workspace

If the workload type is `Workspace`, selecting this action opens the workspace in a new browser tab.

## Workload types

| Type               | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| **Model Download** | Batch job for downloading a new AI model                      |
| **Inference**      | Inference service                                             |
| **Training**       | Model training batch job which generates a new model          |
| **Pre-Training**   | Model pre-training batch job which generates a new base model |
| **Fine-Tuning**    | Model fine-tuning batch job which generates a new model       |
| **Evaluation**     | Workload for evaluating model performance                     |
| **Workspace**      | Workspace for model experiments                               |

## Workload statuses

| Status            | Description                                             | Condition                                                |
| ----------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| **Added**         | Workload has been created                               | Workload component creation has not started              |
| **Pending**       | Waiting to start                                        | All components are in the `Pending` state                |
| **Running**       | Workload is being executed                              | Any component is in the `Running` state                  |
| **Complete**      | Workload has finished successfully                      | All components are in the `Completed` state              |
| **Failed**        | An error has occurred and the workload did not complete | Any component is in the `Failed` state                   |
| **Deleting**      | Workload is queued for removal                          | Delete started, but not all components are `Deleted`     |
| **Deleted**       | Workload successfully deleted                           | All components are in the `Deleted` state                |
| **Delete Failed** | Delete failed and manual cleanup might be needed        | Any component is in the `Delete Failed` state            |
| **Terminated**    | Execution has been terminated                           | All components are in the `Completed` or `Deleted` state |
| **Unknown**       | Status cannot be determined                             |                                                          |
