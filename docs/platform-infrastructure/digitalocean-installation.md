# Install SiloGen on DigitalOcean cloud

This article explains how to install SiloGen in DigitalOcean cloud environment. The article complements the [full installation article](./on-premises-installation.md) by describing the DigitalOcean specific installation configuration. For more details about the installation steps, refer to the full installation article.

## Prerequisites

Suggested minimum configuration for DigitalOcean droplet:

```
AMD MI300X
1 GPU - 192 GB VRAM - 20 vCPU - 240 GB RAM
Boot disk: 720 GB NVMe- Scratch disk: 5 TB NVMe
```
SW requirements:
```
ROCm™ Software 6.4.0.
```

## Installation steps

In order to install on a DigitalOcean droplet, copy the following text into a file bloom.yaml, replacing <your-ip-address> with the ip address of the node.
```
DOMAIN: <your-ip-address>.nip.io
CERT_OPTION: generate
CLUSTERFORGE_RELEASE: https://github.com/silogen/cluster-forge/releases/download/v2025.08.001-enterprise/release-enterprise-v2025.08.001.tar.gz
FIRST_NODE: true
GPU_NODE: true
SKIP_DISK_CHECK: false
USE_CERT_MANAGER: false
SELECTED_DISKS: /dev/vdc1
```

Download the installation tool ("bloom")

```
wget https://github.com/silogen/cluster-bloom/releases/latest/download/bloom
```
Run bloom with the following command
```
chmod +x bloom

sudo ./bloom --config bloom.yaml
```