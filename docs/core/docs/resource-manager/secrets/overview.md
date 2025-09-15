<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

---
tags:
  - secrets
  - external-secrets
  - vault
  - aws
  - google cloud
  - azure
  - AMD Resource Manager
---

# Secrets Overview

Secrets provide a centralized and secure mechanism for storing, retrieving, and distributing sensitive data—such as API keys, database credentials, and access tokens—across projects, ensuring workloads can access them safely when needed.

The platform supports multiple external secret providers, giving organizations the flexibility to use their preferred backend while maintaining consistent workflows across projects and clusters. Supported external secret providers include:

- **HashiCorp Vault**
- **AWS Secrets Manager**
- **Google Cloud Secret Manager**
- **Azure Key Vault**

For detailed instructions on managing secrets, see the [Manage secrets guide](../secrets/manage-secrets.md).

You can manage secrets from the dedicated **Secrets** page or at the project level through the **Secrets** tab on each project’s page.

## What is a secret?

A secret is a piece of sensitive information, such as an API key, database credential, or token, that workloads in your projects need to operate. Secrets are securely stored and synchronized to clusters.

Secrets can be created at the **organization level** (shared across multiple projects) or as **project-specific** (isolated to a single project). AIRM ensures that secrets are propagated correctly and remain in sync with their target clusters and projects.

## How synchronization works

External secrets are synchronized to Kubernetes clusters via **ExternalSecret** CRDs:

- The platform creates an `ExternalSecret` in the project’s namespace.
- The `ExternalSecret` fetches values from the configured backend provider.
- Workloads in that namespace can then reference the secret as a native Kubernetes `Secret`.

This ensures secret data remains in the secure backend and is only exposed to workloads at runtime.

## Access control

- **Platform admins** can create organization secrets, assign them to projects, and manage all project secrets.
- **Team members** can view and use secrets in their assigned projects but cannot create or modify organization secrets.

## Secret statuses

Secrets and their project assignments can move through the following states:

- **Unassigned**: The secret exists but has not been assigned to any projects. Displayed as `---` in the UI.
- **Pending**: The secret is being created or updated, and synchronization with assigned projects is in progress.
- **Synced**: The secret has been successfully synchronized with all assigned projects.
- **PartiallySynced**: The secret has synchronized with some projects but not all.
- **SyncedError**: Synchronization finished, but one or more projects reported errors.
- **Failed**: A critical error prevented the secret from being created, updated, or synchronized.
- **Deleting**: The secret is in the process of being removed from all projects.
- **DeleteFailed**: An error occurred while attempting to remove the secret from one or more projects.
