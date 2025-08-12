---
tags:
  - keycloak
  - login
  - manual
---

# Manually managing and activating users in Airman

Airman is optimized to support user management where either users are federated via an identity provider (IdP) through SSO or the user management workflow is orchestrated by the Airman UI, relying on access to an SMTP server.
If neither option is suitable, you can manage users using the Keycloak admin console and the Airman UI.

## Prerequisites

- The URL of the keycloak instance for your application, and corresponding admin credentials are known.

  - The keycloak URL is typically https://kc.&lt;domain provided during installation&gt;/admin/master/console/
  - The keycloak credentials should be provided to you by AMD's customer success team during installation.

- Once you have logged into Keycloak, the correct realm must be selected (typically `airm`) as all actions are realm-specific.

## Updating the email domain(s) for organization

If you are managing users for your installation, it is likely that the default email domain(s) configured for the organization will need to be updated.
This can be done by navigating to the **Organizations** tab in Keycloak and selecting the pre-configured organization.
Subsequently, adjust the **Domain** of the organization to reflect the email domain(s) associated with your organization (e.g. `myorg.com` and `myorg.org`). If you are intending to support users from multiple domains in the platform, add a row for each of the email domains.

## Manual user management

### Keycloak

Navigate to the **Users** in the realm. Here you can click the **Add user** button to create a new user. You will need to fill in the following fields:

- **Email verified**: Set this to `true` since Airman requires email verification for users to log in.
- **Email**: The email address of the user. This will be the username for the user, and must match any of the domain(s) configured for the organization.
- **First name**: The first name of the user.
- **Last name**: The last name of the user.

Click **Create** to create the user. After creating the user, you will be redirected to the user's details page.

- Navigate to the **Credentials** tab and set a password for the user. Make sure to check the **Temporary** checkbox to ensure that the user is required to change their password on first login.
- Navigate to the **Organizations** tab subsequently click the **Join organization** button and add them to the pre-existing organization (e.g. `demo`).
- Send the credentials to the user and ask to them login to the application via the Airman UI.
  **Note**: At this point, while the user can login, they will not have access to any Projects or elevated permissions.

### Airman UI

**Once the user has logged in**, you can manage their access to projects and permissions via the Airman UI.
As a platform administrator, you can find the new in user in the **Access Control** tab. Select the user and adjust their roles (if needed) and/or add them to the desired projects as described in the [Airman user guide](https://docs.silogen.ai/core/docs/airman/users/manage-users/#user-view).

If only the projects that the user has access to has changed, the user can reload the page and the new projects will be visible to them. If their roles have changed, they will need to log out and log back in to see the changes.
