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

This section outlines the steps to set up essential AI compute resources for project work.

### Onboard users
!!! Note
    Two platform admin users have already been created for your organization as part of the installation process. These are named: devuser@domain, silogen-admin

SiloGen provides multiple options for onboarding users into the platform. For small-scale trial deployments you can use 'email invite' or 'manual workaround', but for more large scale deployments we recommend using single sign-on (SSO).

#### Invite users through email

Follow the instructions in ["User management"](../core/docs/airman/users/manage-users.md) to invite and manage more users in SiloGen.

#### Onboard users through single sign-on (SSO)
Follow the instructions in ["Adding an identity provider to enable single sign-on"](../core/docs/keycloak/sso.md) to onboard users through SSO.

#### Manual workaround
For small scale trial customers who don't have SMTP server or SSO we provide a manual workaround solution.
Creating a new user requires two logins with two passwords and two systems:
- Login to keycloak (kc.domain) with silogen-admin
  - change realm to airm
  - add the user
  - check 'email verified'
  - click organizations
  - find the airm organization
  - add the organization
- Login as a platform admin user to airm itself (airm.domain)
  - click projects
  - add the user

### Change the default user passwords

It is recommended to change the initial users' passwords that were created as part of the installation process. To change the passwords you need to change the Kubernetes secrets.

### Optional: Create new projects (for advanced users)

!!! Note
    A default project with quota has already been created for your organization as part of the installation process. In case you want to create new projects follow the instructions below.

To learn how to create a new project with guaranteed quota follow the instructions in ["Manage projects"](../core/docs/airman/projects/manage-projects.md)
