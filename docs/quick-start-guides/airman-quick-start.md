---
tags:
  - quick start
  - resource management
  - airman
---

# Quick start guide for AI resource managers

The SiloGen platform provides a robust environment for managing AI development teams' work on AMD compute. Whether teams are working on fine-tuning, inference, or any other aspect of AI development, the platform offers easy-to-use tools to maintain fair compute resource allocation. To work efficiently in the SiloGen platform, a resource manager should have some experience with AI terminology and a general understanding of AI development infrastructure.

This quick start guide outlines the steps to set up essential AI compute resources for project work. By the end, you will have a connected compute cluster, a project with allocated compute resources, and an invited team member who can access the platform.

**Terminology reference**

| Word    | Explanation                                                                                 |
|---------|---------------------------------------------------------------------------------------------|
| GPU     | A graphics processing unit. An essential part of compute clusters.                          |
| Node    | A single data center computer that can contain multiple GPUs.                               |
| Cluster | A set of interconnected computational nodes.                                                |
| Project | A container for AI development. The project is allocated resources through a quota.
| Quota   | Quotas define a _minimum_ set of resources that are guaranteed. Quotas ensure that computational resources are appropriately shared between projects. Without quotas, some workloads might use all the resources, leaving other workloads waiting.       |
| SSO     | Single sign-on. A user login feature allowing easy traversal between multiple applications. |


## Prerequisites

This guide assumes you have access to an installed SiloGen platform. To assist you with onboarding, the following configurations have already been created during the installation process:
- A platform admin user has been created. The platform admin user can manage the SiloGen platform and onboard more users.
- A project with a default resource quota has been created.
- An organization entity has been created.
- A compute cluster has been onboarded and connected to SiloGen platform.


## Getting started

### 1. Onboard users
!!! Note
    A platform admin user has already been created for your organization as part of the installation process.

SiloGen provides two options to onboard users into the platform. For small-scale trial deployments you can use Option A, but for more large scale deployments we recommend Option B using SSO.

#### Option A - Invite users through email

Follow the instructions in ["User management"](../core/docs/airman/users/manage-users.md) to invite and manage more users in SiloGen.
#### Option B - Onboard users through single sign-on (SSO)
Follow the instructions in ["Adding an identity provider to enable single sign-on"](../core/docs/keycloak/sso.md) to onboard users through SSO.

### 2. Onboard a compute cluster
!!! Note
    A compute cluster has already been connected to your control plane as part of the installation process.

To learn how to onboard a new compute cluster, please follow these intructions in ["Onboard a new cluster"](../core/docs/airman/clusters/add-clusters-ui.md)

### 3. Create a project with quota

!!! Note
    A default project and quota has already been created for your organization as part of the installation process.

To learn how to create a new project with quota follow the instructions in ["Manage projects"](../core/docs/airman/projects/manage-projects.md)

### 4. Change the default password
To change the default password that was created as part of the installation process, please follow these instructions.

### 5. Bonus step - Tutorial: GPU resource utilization

To learn how to analyze GPU utilization, follow this tutorial guide["Resource utilization tutorial"](../tutorials/resource-utilization.md).
