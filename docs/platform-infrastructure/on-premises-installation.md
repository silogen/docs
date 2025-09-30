```{tags} platform, installation, demo environment, kubernetes
```

<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.
SPDX-License-Identifier: MIT
-->

# Install AMD Enterprise AI platform on Premises

This article explains how to install {{ name }} in an on-premises environment, covering the full stack from metal to application layer in a streamlined manner.

You will use an installation tool called Cluster Bloom to first install and configure a Kubernetes cluster, and then install AMD Resource Manager & AMD AI Workbench.

## System requirements

In order to install {{ name }} your system should meet the following requirements:

- Ubuntu (supported versions checked at runtime)
- Sufficient disk space (500GB+ recommended for root partition, 2TB+ for workloads)
- NVMe drives for optimal storage configuration
- ROCm-compatible AMD GPUs (for GPU nodes)
- Root/sudo access

## Network and security requirements

Before beginning the software installation, please ensure your network environment meets the following requirements. Proper configuration of these elements is crucial for the security, accessibility, and functionality of the application.

### Domain names

Before installing {{ name }}, you'll need a domain name (such as myapp.example.com) that points to your server's IP address.

If you don't have a DNS-enabled domain available, you may use a .nip.io domain, which automatically resolves to your service's IP address. Example: https://203.0.113.10.nip.io (format is `https://<master-node-ip-address>.nip.io`). This will resolve directly to 203.0.113.10 and allow HTTPS access without DNS setup.

```{note}
A .nip.io domain is automatically created for you as part of the installation process.
```

### TLS certificates

A valid TLS certificate must be configured for the chosen domain to enable secure HTTPS connections to your services. To setup TLS certificate you need to select one of the following options:

- You can provide your own trusted TLS certificate purchased from a certificate authority.
- You can create a self-signed certificate during the installation process.
- You can use the free Let's Encrypt service to automatically generate one. When using Let's Encrypt, your setup must meet one of these requirements: either have port 80 accessible from the internet (allowing Let's Encrypt to verify domain ownership through your website), or have DNS management capabilities that allow automated domain validation (where Let's Encrypt can verify ownership by temporarily adding DNS records to your domain).

### Network access

{{ name }} application requires HTTPS for all external access. When you specify a domain for the service (whether it's a custom domain or a convenience domain like *.nip.io), the application will also use this domain name internally when making callbacks to itself. Specifically, you should ensure that:

- The application is reachable at `https://<your-domain>`
- Port 443 must be open on your firewall and routed to the application service

```{note}
.nip.io only provides DNS resolution. You still need to ensure port 443 is open and that your TLS certificate is valid for the chosen domain. If your application is configured to call itself at a .nip.io address, you must use the same domain consistently for external and internal access.
```

### Load balancing

For production environments, the domain should point to a load balancer that distributes traffic across multiple servers. For smaller setups or demonstrations, the domain can point directly to a single server's IP address, and MetalLB will be configured to handle load balancing within the Kubernetes cluster.

## Install AMD Enterprise AI platform

You will use an installation tool called Cluster Bloom to first install and configure a Kubernetes cluster, and then install the applications. The installation tool performs the following steps to prepare an AMD GPU node to be part of a Kubernetes cluster:

- Automated RKE2 Kubernetes cluster deployment
- ROCm setup and configuration for AMD GPU nodes
- Disk management and Longhorn storage integration
- Multi-node cluster support with easy node joining
- 1Password integration for secrets management
- Installs AMD Resource Manager & AMD AI Workbench using Cluster Forge tool

```{note}
The current platform version supports only one cluster per installation. Support for multiple clusters is on the product roadmap.
```

### SSH to node as root user

Access the node using SSH as root user.

### Download the software

Go to the working folder where you want to install {{ name }}.

Run the following commands to download the latest software release. This includes both the installation script ("bloom") and software application:

```
wget https://github.com/silogen/cluster-bloom/releases/latest/download/bloom
wget https://github.com/silogen/cluster-forge/releases/download/v0.5.2/release-enterprise-ai-v0.5.2.tar.gz
```

Make the installation script executable:

```
chmod +x bloom
```

### Edit the values in configuration file

Before you can start the installation you need to edit the installation configuration, which adapts the installation to your environment. You can edit the values directly in the configuration file.

!!! note
    For the standard installation you should use the default values, only exception is the `DOMAIN` and `OIDC_URL` values which should match your specific domain name. You can find more details about the configuration values in this [section](./#appendix).

Open the configuration file `bloom.yaml`.
Edit the `DOMAIN` and `OIDC_URL` values to match your specific domain name.

```
DOMAIN: <your-ip-address>.nip.io
CERT_OPTION: generate
CLUSTERFORGE_RELEASE: none
FIRST_NODE: true
GPU_NODE: true
SKIP_DISK_CHECK: false
USE_CERT_MANAGER: false
SELECTED_DISKS: /dev/vdc1
OIDC_URL: https://kc.<your-ip-address>.nip.io/realms/airm
```

### Install Kubernetes cluster

Run the following command to start the installation (this sets up a Kubernetes cluster for you):

```
sudo ./bloom --config bloom.yaml
```
The installation will take roughly 15 minutes. You can now follow the installation progress through the user interface:

![Cluster Bloom Interface](../media/infra/bloom.png)

For systems with unmounted physical disks, a selection prompt will appear:

![Cluster Bloom disk selection](../media/infra/bloom-disk-selection.png)

#### Optional step: Adding a second node to cluster

After successful installation, Cluster Bloom generates `additional_node_command.txt`, which contains the command for installing additional nodes into the cluster.

### Install the software
Exit and re-login to source the .bashrc, or run

```
source ~/.bashrc
```

Then run following commands to install the software:

```
tar -xzvf release-enterprise-ai-v0.5.2.tar.gz
cd enterprise-ai-v0.5.2
bash ./deploy.sh
```

### Specify HuggingFace token

In order to download and access gated models from Hugging Face, you need to provide a Hugging Face token. Tokens contain sensitive information. To keep them secure and prevent unauthorized access, they should not be stored in plain text in your code or configuration files. Instead, they are stored as **secrets**, a secure way to manage sensitive data.

#### How to get a Hugging Face token

1. Create or log in to your Hugging Face account: [https://huggingface.co](https://huggingface.co/).
2. Navigate to your account settings.
3. Under **Access Tokens**, generate a new token.
4. Copy the token (keep it safe; don't share it).

#### Where to install the token

The token needs to be installed as a secret in your environment. Here
are examples of how to do this in common platforms:
On Kubernetes, save the token in an environment variable in your terminal:

```
kubectl create secret generic hf-token \
    --from-literal=hf-token=my_super_secret_token \
    -n demo
```

### Login

To confirm that the installation was successful, ensure you are able to log in to the AMD AI Workbench:

- Access the login URL (your domain name).
  - For nip.io domain: `https://airmui.<master-node-ip-address>.nip.io`
  - If using a registered domain, the web address of the service will be: `https://airmui.<your-domain>`
- Login as `devuser@domain` user and use the default password.

See more details about login [here](../login.md).

## Install software into an existing Kubernetes cluster

To install {{ name_secondary }} in an existing Kubernetes cluster, download a Cluster Forge release package and run `deploy.sh`. This assumes there is a working Kubernetes cluster to deploy into, and the current Kubeconfig context refers to that cluster.
Run following commands to install the software:

```
wget https://github.com/silogen/cluster-forge/releases/download/v0.5.2/release-enterprise-ai-v0.5.2.tar.gz
tar -xzvf release-enterprise-ai-v0.5.2.tar.gz
cd enterprise-ai-v0.5.2
bash ./deploy.sh
```

## Appendix

### Installation configuration values

This section describes the installation configuration values.

**First node**<br>
Specifies if this is the first node in the cluster. Set to `false` for additional nodes joining an existing cluster.

**GPU node**<br>
Specifies whether the node has GPUs. Set to `false` for CPU-only nodes. When `true`, ROCm will be installed and configured.

**OIDC URL**<br>
URL of the OIDC provider for authentication. To use the bundled cluster-internal Keycloak, use `kc.<your-ip-address>.nip.io/realms/airm`. Leave empty to skip OIDC configuration.

**Skip disk check**<br>
Specifies if disk check should be performed. Set to `true` if you don't want automatic disk setup.

**Selected disks**<br>
List of disk devices to use. Example: `dev/sdb`. Leave empty for automatic selection.

**Longhorn disks**<br>
List of disk paths for Longhorn storage. Leave empty for automatic configuration.

**Cluster Forge release**<br>
The Cluster Forge release `URL` or `none` to skip the SW installation.

**Domain**<br>
Domain name for the cluster, for example, `cluster.example.com`. The domain name is used for ingress configuration. If you don't have a DNS-enabled domain available, you may use a .nip.io domain with your IP address. Example: `<master-node-ip-address>.nip.io`.

**Use cert manager**<br>
Set to `Yes` to use cert-manager with Let's encrypt for automatic TLS certificates. Set to `false` to provide your own certificates.

**Cert option**<br>
Certificate option when `Use cert manager` is false. Choose `existing` to use existing certificate files, or `generate` to create a self-signed certificate.

### Create installation configuration using the Installation wizard

Instead of editing the configuration file directly you can also use an installation wizard, which guides you in creating the configuration for the installation.

To start the wizard:

```
sudo ./bloom
```

Next, you need to complete each of the steps in the wizard.

!!! note
    For the standard installation you should select the default values, only exception is the `domain`, `OIDC_URL` and `cert option` where you should provide a specific value.
    You can find more details about the configuration values in this [section](./#appendix):

**Configuration complete!**<br>

Once the wizard has completed you can find the configuration file in `bloom.yaml`.

**Start the installation**<br>

To run the actual installation select `y` in the following step
`Would you like to run bloom with this configuration no? (y/n)`

### Links

- Cluster Forge: [https://github.com/silogen/cluster-forge](https://github.com/silogen/cluster-forge)
- Cluster Bloom: [https://github.com/silogen/cluster-bloom](https://github.com/silogen/cluster-bloom)
