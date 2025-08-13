---
tags:
  - platform
  - installation
  - demo environment
  - kubernetes
---

# Install SiloGen on-premises

This article explains how to install SiloGen in an on-premises environment, covering the full stack from metal to application layer in a streamlined manner.

The SiloGen platform runs on top of Kubernetes orchestration platform and includes essential Kubernetes components for monitoring, secrets management, and certificate management.

The installation process leverages helper tools called **Cluster Bloom** and **Cluster Forge** that deploy and configure all necessary platform components, preparing a Kubernetes cluster for executing AI workloads.

## Prerequisites

- Ubuntu (supported versions checked at runtime)
- Sufficient disk space (500GB+ recommended for root partition, 2TB+ for workloads)
- NVMe drives for optimal storage configuration
- ROCm-compatible AMD GPUs (for GPU nodes)
- Root/sudo access

### Domain and SSL certificate prerequisites
- Before installing the Kubernetes services, you'll need a domain name (such as myapp.example.com) that points to your server's IP address.
  - For production environments, this domain should point to a load balancer that distributes traffic across multiple servers.
  - For smaller setups or demonstrations, the domain can point directly to a single server's IP address, and MetalLB will be configured to handle load balancing within the Kubernetes cluster.
- Additionally, you'll need an SSL certificate to enable secure HTTPS connections to your services.
  - You can either provide your own trusted SSL certificate purchased from a certificate authority, or use the free Let's Encrypt service to automatically generate one.
  - If using Let's Encrypt, your setup must meet one of these requirements: either have port 80 accessible from the internet (allowing Let's Encrypt to verify domain ownership through your website), or have DNS management capabilities that allow automated domain validation (where Let's Encrypt can verify ownership by temporarily adding DNS records to your domain).
- Finally, ensure that any firewalls, security groups, or network routing configurations are updated to allow incoming connections from users who will be accessing these services.

## Install Kubernetes cluster and software

You will use an installation script called **Cluster Bloom** to install and configure a Kubernetes cluster and install the SiloGen software. It installs the following features to prepare an AMD GPU node to be part of a Kubernetes cluster:

- Automated RKE2 Kubernetes cluster deployment
- ROCm setup and configuration for AMD GPU nodes
- Disk management and Longhorn storage integration
- Multi-node cluster support with easy node joining
- 1Password integration for secrets management
- Install the SiloGen software using Cluster Forge tool

### 1. SSH to node as root user
Access the node using SSH as root user.

### 2. Download the latest installation script

Go to the working folder where you want to install the release.

Download the latest installation script (adjust the URL to the release of your preference):
```
wget https://github.com/silogen/cluster-bloom/releases/latest/download/bloom
```
### 3. Make file executable
```
chmod +x bloom
```
### 4. Installation steps

Before you can start the installation you need to create the configuration for your installation to tailor the installation based on your environment.
You can use a Configuration wizard that facilitates the creation of the configuration (Option A) or add the values directly in the configuration file (Option B).

#### Option A - Create configuration using the Installation wizard

The Installation wizard is a helper tool that guides the user in creating the optimal configuration for the installation.
For the standard installation you should select the default values, only exception is the domain name where you should provide a valid domain name.

To start the wizard:
```
sudo ./bloom
```

The wizard includes the following steps:

**First node**

Specifies if this is the first node in the cluster. Set to `false` for additional nodes joining an existing cluster.

**GPU node**

Specifies whether the node has GPUs. Set to `false` for CPU-only nodes. When `true`, ROCm will be installed and configured.

**OIDC URL**

URL of the OIDC provider for authentication. Leave empty to skip OIDC configuration.

**Skip disk check**

Specifies if disk check should be performed. Set to `true` if you don't want automatic disk setup.

**Selected disks**

List of disk devices to use. Example: `dev/sdb`. Leave empty for automatic selection.

**Longhorn disks**

List of disk paths for Longhorn storage. Leave empty for automatic configuration.

**Cluster-Forge release**

The ClusterForge release `URL` or `none` to skip the SW installation.

**Domain**

Domain name for the cluster, e.g., `cluster.example.com`. The domain name is used for ingress configuration.

**Use cert manager**

Set to `Yes` to use cert-manager with Let's encrypt for automatic TLS certificates. Set to `false` to provide your own certificates.

**Cert option**

Certificate option when `Use cert manager` is false. Choose `existing` to use existing certificate files, or `generate` to create a self-signed certificate.

**Configuration complete!**

Once the wizard has completed you can find the configuration file in `bloom.yaml`.

**Start the installation**

To run the actual installation select `y` in the following step
`Would you like to run bloom with this configuration no? (y/n)`

#### Option B - Specify the values in configuration file

You can also specify the values in the configuration file directly and skip the installation wizard process.

Below is an example configuration for the configuration file bloom.yaml:
```
DOMAIN: <your-ip-address>.nip.io
CERT_OPTION: generate
CLUSTERFORGE_RELEASE: https://github.com/silogen/cluster-forge/releases/download/20250812-1-enterprise/release-enterprise-20250812-1.tar.gz
FIRST_NODE: true
GPU_NODE: true
SKIP_DISK_CHECK: false
USE_CERT_MANAGER: false
SELECTED_DISKS: /dev/vdc1
```
To start the installation:
```
sudo ./bloom --config bloom.yaml
```

### 6. Follow the installation progress

The installation will take roughly 15 minutes. You can now follow the installation progress through the user interface:

![Cluster Bloom Interface](../media/infra/bloom.png)

For systems with unmounted physical disks, a selection prompt will appear:

![Cluster Bloom Disk Selection](../media/infra/bloom-disk-selection.png)

### 7. Adding a second node to cluster (optional)
After successful installation, Cluster Bloom generates `additional_node_command.txt`, which contains the command for installing additional nodes into the cluster.

### 8. Specify HuggingFace token
In order to download and access gated models from Hugging Face, you need to provide a Hugging Face token. Tokens contain sensitive information. To keep them secure and prevent unauthorized access, they should not be stored in plain text in your code or configuration files. Instead, they are stored as **secrets**, a secure way to manage sensitive data.

#### How to get a Hugging Face token

1. Create or log in to your Hugging Face account:
    [https://huggingface.co](https://huggingface.co/).

2. Navigate to your account settings.

3. Under **Access Tokens**, generate a new token.

4. Copy the token (keep it safe; don\'t share it).

#### Where to install the token

The token needs to be installed as a secret in your environment. Here
are examples of how to do this in common platforms:

On Kubernetes, save the token in an environment variable in your terminal:

```
kubectl create secret generic hf-token \
    --from-literal=hf-token=my_super_secret_token \
    -n my_namespace
```

### 8. Confirm successful installation

To confirm that the installation was successful, ensure you are able to log in to the Developer Center.

1. Access the SiloGen URL (your domain name). See more details [here](../login-to-silogen.md)
2. Login as `devuser@domain` user and use the default password.

## Install only software into an existing Kubernetes cluster

To install SiloGen platform in an existing Kubernetes cluster, download a Cluster Forge release package and run `deploy.sh`. This assumes there is a working Kubernetes cluster to deploy into, and the current Kubeconfig context refers to that cluster.

For the Cluster Forge `deploy` release:

```
wget https://github.com/silogen/cluster-forge/releases/download/deploy/deploy-release.tar.gz
tar -xzvf deploy-release.tar.gz
sudo bash clusterforge/deploy.sh
```

## Appendix

- Cluster Forge: [https://github.com/silogen/cluster-forge](https://github.com/silogen/cluster-forge)
- Cluster Bloom: [https://github.com/silogen/cluster-bloom](https://github.com/silogen/cluster-bloom)
