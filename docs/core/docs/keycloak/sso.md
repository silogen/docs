# Adding identity provider to enable single sign-on

This is a general guide for setting up a single sign-on (SSO) with identity provider. This has been tested with OpenID Connect (Okta) but guide tries to be provider agnostic.

## Prequisite

Keycloak is set up for AIRM so organizations, realms, etc. are already created. Correct realm is selected as all the actions are realm specific.

## Add identity provider

Select Identity provider under Configure and add new provider. There are many identity providers and this guide won't go deep into every identity provider supported by Keycloak.

The main thing you need are

- Redirect URI from Keycloak
  - Configured to the identity provider so that when Keycloak directs authentication to the external identity provider, the provider can then redirect the user back to Keycloak
- Client ID from the identity provider
  - Identity provider offers ID so it can distinguis between different clients (applications) making requests to the provider
- Client secret from the identity provider
  - Secret generated by the identity provider. Not to be mixed up with UI client secret for example.

Rest of the settings will vary between different types of identity providers.

### Mapping rights

When you control authentication with a identity provider, then you can automatically assign minimum rights to every user (i.e. all users that are allowed to access the system, can be assumed to also have at least minimum rights). Do this by opening the configured identity provider and going to Mappers tab. Select Add mapper and use following settings

- Name = default-user-role (or any other name you prefer)
- Mapper type = Hardcoded Role
- Role = Team Member
- Sync mode override = Inherit

Additional rights can still be granted in Keycloak manually even if the minimum rights is hard-coded. Also note that without _any_ rights, the users can login, but cannot use the system.

It's also possible to map roles from the identity provider by configuring mapper to Identity provider for automatic role assignment which move the authorization from Keycloak to the Identity provider. Remember to set `Sync mode override` to `Force` to ensure that rights are also deducted, not just added.

## Link Identity provider to organization

Select correct organization from Organizations and go to Identity providers tab. Select Link identity provider and then select newly created identity provider from the list. Set

- Identity provider = [You new identiyt provider]
- Domain = [Domain attached to the organization]
- Hide on login page = Off
- Redirect when email matches = Off

## Add authentication flow

To automatically enroll user to an orgranization, one must create new Flow under Authentication. This can be adapted to the specific need, but here is one option to give an idea how to create simple automatic flow for IDP. Add executions steps in this order with specified Requirement type

- Create User If Unique [Required]
  - Creates new user to Keycloak if one doesn't already exist
- Automatically set existing user [Alternative]
  - Set user to existing one as alternative to Create user if unique
- Review profile [Required]
  - Update Keycloak profile data with the data identity provider offers using attribute mappers
- Organization Member Onboard [Required]
  - Adds user to the organization that identity provider is linked to
- Allows access [Required]
  - Permit user to log in

After the flow has been created, you need to navigate to your Identity provider and change `First Login Flow` to that custom authentication flow.
