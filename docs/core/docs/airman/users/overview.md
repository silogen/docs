---
tags:
  - user management
  - keycloak
  - roles
  - airman
---

# Users overview

Silogen platform has a robust user management system bundled with the authentication system [Keycloak](https://www.keycloak.org/).

Tooling for managing the organization and user access are found in the navigation under titles Organization and Access control.

## Roles

Airman and Developer Center have two different user roles: platform admin and team member.

The **platform admin** has access to everything happening in the platform. When submitting workloads, they follow the regular project rules, meaning they can submit workloads only to clusters where they have a project.

The **team member** has several limitations in their workflows. Team member can:

- view clusters if any of their projects is in the said cluster
- submit workloads to their projects
- view workloads in their projects
- delete workloads from their projects.

Roles are currently closed and they cannot be adjusted in individual SiloGen platform installations.
