<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

---
tags:
  - user management
  - keycloak
  - roles
  - AMD Resource Manager
---

# Users Overview

The platform has a robust user management system bundled with the authentication system [Keycloak](https://www.keycloak.org/). The platform can also use an [identity provider](../../keycloak/sso.md) for user authentication.

More information about how to set up user management can be found [here](../users/manage-users.md).

To manage users on the platform navigate to `Access control` page.

## Roles

AMD Resource Manager and AMD AI Workbench have two different user roles: platform admin and team member.

The **platform admin** has access to everything on the platform. When submitting workloads, they follow the regular project rules, meaning they can submit workloads only to clusters where they have a project. Administrators can change a user's role.

The **team member** has several limitations in their workflows. A team member can:

- view clusters if any of their projects are in the cluster
- submit workloads to their projects
- view workloads in their projects
- delete workloads from their projects.

The **super administrator** is a special role reserved for platform engineers, who perform maintenance and other background tasks, such as onboarding new organizations and users in Keycloak. The super administrator has admin rights to Keycloak.

### Adjusting user roles

Roles are currently fixed and cannot be adjusted in individual platform installations.
