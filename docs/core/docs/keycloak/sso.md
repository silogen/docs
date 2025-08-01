---
tags:
  - keycloak
  - login
  - single sign-on
---

# Adding an identity provider to enable single sign-on

This is a general guide for setting up single sign-on (SSO) with an identity provider. This has been tested with OpenID Connect (Okta), but the guide aims to be provider-agnostic.

## Prerequisite

Keycloak is set up for Airman, so organizations, realms, etc. are already created. Correct realm is selected as all the actions are realm specific.

## Add an identity provider

Select **Identity provider** under **Configure** and add a new provider. There are many identity providers, and this guide will not cover every provider supported by Keycloak in detail.

The main things you need are:

- **Redirect URI from Keycloak**<br>
  Configure this in the identity provider so that when Keycloak directs authentication to the external identity provider, the provider can then redirect the user back to Keycloak.
- **Client ID from the identity provider**<br>
  The identity provider offers an ID so it can distinguish between different clients (applications) making requests to the provider.
- **Client secret from the identity provider**<br>
  A secret generated by the identity provider. Do not confuse this with the UI client secret, for example.

The rest of the settings will vary between different types of identity providers.

### Mapping rights

When you control authentication with an identity provider, you can automatically assign minimum rights to every user (i.e., all users allowed to access the system can be assumed to have at least minimum rights). Do this by opening the configured identity provider and going to the **Mappers** tab. Select **Add mapper** and use the following settings:

- Name: `default-user-role` (or any other name you prefer)
- Mapper type: Hardcoded Role
- Role: Team Member
- Sync mode override: Inherit

Additional rights can still be granted in Keycloak manually, even if the minimum rights are hard-coded. Also note that without _any_ rights, users can log in but cannot use the system.

It's also possible to map roles from the identity provider by configuring a mapper to the identity provider for automatic role assignment, which moves the authorization from Keycloak to the identity provider. Remember to set `Sync mode override` to `Force` to ensure that rights are also removed, not just added.

## Link identity provider to organization

Select the correct organization from **Organizations** and go to the **Identity providers** tab. Select **Link identity provider** and then select the newly created identity provider from the list. Set:

- Identity provider: [Your new identity provider]
- Domain: [Domain attached to the organization]
- Hide on login page: Off
- Redirect when email matches: Off

## Add an authentication flow

To automatically enroll a user to an organization, you must create a new flow under **Authentication**. This can be adapted to specific needs, but here is one option to create a simple automatic flow for an IDP. Add execution steps in this order with the specified Requirement type:

- **Create User If Unique** [Required]<br>
  Creates a new user in Keycloak if one doesn't already exist.
- **Automatically Set Existing User** [Alternative]<br>
  Sets user to existing one as an alternative to "Create User If Unique".
- **Review Profile** [Required]<br>
  Updates Keycloak profile data with the data the identity provider offers using attribute mappers.
- **Organization Member Onboard** [Required]<br>
  Adds the user to the organization that the identity provider is linked to.
- **Allows Access** [Required]<br>
  Permits the user to log in.

After the flow has been created, navigate to your identity provider and change `First Login Flow` to that custom authentication flow.
