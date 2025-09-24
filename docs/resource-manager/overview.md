```{tags} AMD Resource Manager, overview, features
```
<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->
# AMD Resource Manager Overview

The platform provides administrators with tools to oversee and control the platform’s computational resources and user access. These features are managed through a module called AMD Resource Manager. Its key capabilities include cluster management, monitoring, and maintaining teams' access to computational resources.

## Features

AMD Resource Manager is built around the basic usage pattern of maintaining compute resources, setting up teams and projects, and allowing individual users to utilize the resources for their compute needs.

- **Cluster**: The physical part of the platform installation, which can be managed in the AMD Resource Manager user interface.
- **Organization**: An organization is built from teams. Each team can have multiple users and multiple projects.
- **Projects**: A project contains users and a quota for their workloads. Multiple users can belong to multiple projects.
- **Quota**: A quota is a usage limit reserved for a project. Quotas are useful for ensuring everyone gets their fair share of compute resources.
- **Secrets**: Secure information such as API keys or credentials that can be created at the organizational level and assigned to projects. Secrets ensure workloads can access what they need without exposing sensitive data.
- **User**: Users are individuals who require compute access for work purposes.
