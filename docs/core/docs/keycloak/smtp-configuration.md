---
tags:
  - keycloak
  - login
  - invitation
  - smtp
---

# Inviting users and configuring SMTP in Keycloak

This is a guide for configuring an SMTP server in Keycloak, which is a prerequisite for inviting users to Silogen via the application.

## Prerequisites

- The URL of the keycloak instance for your application, and corresponding admin credentials are known.

  - The keycloak URL is typically https://kc.&lt;domain provided during installation&gt;/admin/master/console/
  - The keycloak credentials should be provided to you by AMD's customer success team during installation.

- Once you have logged into Keycloak, the correct realm must be selected (typically `airm`) as all actions are realm-specific.
- The organization must have an SMTP server accessible that they can use to integrate with Keycloak and Airman.

## Updating the email domain(s) for organization

If you are managing users for your installation, it is likely that the default email domain(s) configured for the organization will need to be updated.
This can be done by navigating to the **Organizations** tab in Keycloak and selecting the pre-configured organization.
Subsequently, adjust the **Domain** of the organization to reflect the email domain(s) associated with your organization (e.g. `myorg.com` and `myorg.org`). If you are intending to support users from multiple domains in the platform, add a row for each of the email domains.

## Configuring the SMTP server

Navigate to **Realm settings** and then to the **Email** tab. Here you can configure the SMTP server that Keycloak will use to send emails. The settings you need to fill in are:

- **From**: The email address that will appear as the sender of the emails sent by Keycloak.
- **Host**: The hostname of your SMTP server (e.g., `smtp.example.com`).
- **Port**: The port on which your SMTP server is running (usually `587` for TLS or `465` for SSL).
- **Encryption**: Choose the encryption method your SMTP server uses (`SSL` and/or `StartTLS`). If your SMTP server does not support encryption, you can select neither, but this is not recommended for production environments.
- **Authentication**: Enable this if your SMTP server requires authentication. You will need to provide the username and password for the SMTP server.
  - **Username**: The username for the SMTP server.
  - **Password**: The password for the SMTP server.

Once this is done, you can test the configuration by sending a test email to ensure that Keycloak can connect to the SMTP server and send emails successfully.
Prior to doing this, ensure that the user you have currently logged in as, in the **master** realm has an associated email that Keycloak can use to send the test email.

Note: Depending on the strictness of the spam/junk filters, you may need to whitelist the Keycloak server's IP address or domain in your email server settings to ensure that emails are not marked as spam.

## Inviting users

Once the SMTP server is configured, you can invite users via Airman. This is done by logging into Airman and navigating to the Access Control tab and clicking on the **Invite user** button. You can read more about inviting users in the [Airman user guide](https://docs.silogen.ai/core/docs/airman/users/manage-users/#invite-users).
