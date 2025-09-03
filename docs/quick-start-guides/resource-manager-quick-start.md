---
tags:
  - quick start
  - resource management
  - AMD Resource Manager
---

# Quick start guide for AI resource managers

The AMD Enterprise AI Suite provides a robust environment for managing AI development teams' work on AMD compute. Whether teams are working on fine-tuning, inference, or any other aspect of AI development, the platform offers easy-to-use tools to maintain fair compute resource allocation. To work efficiently in the platform, a resource manager should have some experience with AI terminology and a general understanding of AI development infrastructure.

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

This guide assumes you have access to an installed AMD Enterprise AI Suite. To assist you with onboarding, the following configurations have already been created during the installation process:

- Platform admin users have already been created for your organization as part of the installation process. These are named `devuser@domain` and `silogen-admin`. The platform admin user can manage the platform and onboard more users.
- An organization entity has been created.
- A compute cluster has been onboarded and connected to AMD Enterprise AI Suite.
- A project with a resource quota has been created.

## Getting started

This section outlines the steps to set up essential AI compute resources for project work.

### Onboard users

!!! note
    AMD Enterprise AI Suite provides multiple options for onboarding users into the platform. For small-scale trial deployments you can invite users through email or add them manually, but for large scale deployments we recommend using single sign-on (SSO).

#### Invite users through email

Follow the instructions in ["Inviting users and configuring SMTP in Keycloak"](../core/docs/keycloak/smtp-configuration.md) to invite users through email.

#### Onboard users through single sign-on (SSO)

Follow the instructions in ["Adding an identity provider to enable single sign-on"](../core/docs/keycloak/sso.md) to onboard users through SSO.

#### Invite users manually

In case your organization does not have SSO or SMTP server set up you can add users manually.

Follow the instructions in ["Manually managing and activating users in AMD Resource Manager"](../core/docs/keycloak/manual-user-management.md) to add users manually.

### Change the default admin user passwords

It is recommended to change the initial admin users' passwords that were created as part of the installation process.
- Super admin password (Keycloak admin user) - The super admin password is needed to login to the Keycloak admin panel. The password is stored in a Kubernetes secret, so in order to change the password you need to change the Kubernetes secret.
- Platform admin password (devuser@domain) - How to change your `devuser` password depends on your user management setup. E.g., the `super admin` user can reset the user in Keycloak admin panel, if you have `Invite users through email` you can change your password yourself through "Forget password" link.

### Optional: Create new projects (for advanced users)

!!! note
    A default project with quota has already been created for your organization as part of the installation process. In case you want to create new projects follow the instructions below.

To learn how to create a new project with guaranteed quota follow the instructions in ["Manage projects"](../core/docs/resources/projects/manage-projects.md)
