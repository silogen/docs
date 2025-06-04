---
tags:
  - user management
  - keycloak
  - roles
---

# Users overview

Silogen platform has a robust user management system bundled with the authtentication system [Keycloak](https://www.keycloak.org/).

## Manage organization

Tooling for managing the organization and user access are found in the navigation under titles Organization and Access control. The first section covers user groups management, while as the second section goes through user management.

## Roles

Airman and Developer Center have two different user roles: platform admin and team member.

The **platform admin** has access to everything happening in the platform. When submitting workloads, they follow the regular quota rules, meaning they can submit workloads only to clusters where they have a quota.

The **team member** has several limitations in their workflows. Team member can:

- view clusters if any of their quotas is reserved for the said cluster
- submit workloads if they have a quota
- view workloads their user group submitted
- delete workloads their user group submitted.

Roles are currently closed and they cannot be adjusted in individual SiloGen platform installations.
