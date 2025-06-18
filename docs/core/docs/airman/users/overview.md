---
tags:
  - user management
  - keycloak
  - roles
  - airman
---

# Users overview

SiloGen platform has a robust user management system bundled with the authentication system [Keycloak](https://www.keycloak.org/). The platform can also use an [identity provider](../../keycloak/sso.md) for user authentication.

Tooling for managing the organization and user access are found in the navigation under titles Organization and Access control.

## Roles

Airman and Developer Center have two different user roles: platform admin and team member.

The **platform admin** has access to everything happening in the platform. When submitting workloads, they follow the regular project rules, meaning they can submit workloads only to clusters where they have a project. Administrators can change a users' role.

The **team member** has several limitations in their workflows. Team member can:

- view clusters if any of their projects is in the said cluster
- submit workloads to their projects
- view workloads in their projects
- delete workloads from their projects.

The **super administrator** is a special role reserved for platform engineers, who do maintenance and other background tasks, such as onboarding new organizations.

### Adjusting user roles

Roles are currently closed and they cannot be adjusted in individual SiloGen platform installations.
