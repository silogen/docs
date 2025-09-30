<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

# AMD Resource Manager & AMD AI Workbench Documentation

Welcome to the documentation for AMD Resource Manager & AMD AI Workbench. Enterprises striving to scale AI often encounter roadblocks that increase costs, slow innovation, and limit impact. AMD Enterprise AI platform is built to overcome these challenges and unlock the full potential of AI across the enterprise. In the documentation we will refer to the AMD Resource Manager & AMD AI Workbench as either *AMD Enterprise AI platform* or simply *platform*.

This is your comprehensive handbook designed to help infrastructure administrators, AI practitioners, and AI resource managers successfully deploy, manage, and run AI workloads on AMD compute. The guide provides step-by-step instructions for installing and configuring the necessary software, as well as practical tutorials and use cases to help you run AI workloads efficiently on a scalable Kubernetes platform.

::::{grid} 1 1 2 2
:gutter: 2

:::{grid-item-card}
Introduction
^^^
- [Platform Overview](./platform-overview/)
- [Quick Start Guide](./quick-start/)
- [Target Audience](./target-audience/)
:::

:::{grid-item-card}
Infrastructure and Platform Installation
^^^
- [Install On-premises Environment](./platform-infrastructure/on-premises-installation/)
- [Single Sign-on](./keycloak/sso/)
:::

:::{grid-item-card}
AMD AI Workbench
^^^
- [AI Development Overview](./workbench/overview/)
- [Deploy Model and Run Inference](./workbench/inference/how-to-deploy-and-inference/)
- [Model Fine-tuning](./workbench/training/fine-tuning/)
- [Access Models](./workbench/training/models/)
:::

:::{grid-item-card}
AMD Resource Manager
^^^
- [AMD Resource Manager Overview](./resource-manager/overview/)
- [Getting Started](./quick-start-guides/resource-manager-quick-start/)
- [Managing Clusters](./resource-manager/clusters/overview/)
- [Managing Users](./resource-manager/users/overview/)
:::

:::: % Close the grid

```{toctree}
---
caption: Introduction
maxdepth: 1
hidden: True
---
Platform Overview <platform-overview>
Target Audience <target-audience>
quick-start
release-notes
general-topics
```

```{toctree}
---
caption: Infrastructure and Installation
maxdepth: 1
hidden: True
---
Installation <platform-infrastructure/installation.md>
```

```{toctree}
---
caption: AMD AI Workbench
maxdepth: 1
hidden: True
---
workbench/overview.md
Quick Start for AI Practitioners <quick-start-guides/workbench-quick-start.md>
workbench/workloads.md
workbench/workspaces.md
Training and Fine-tuning <workbench/training/overview.md>
Inference <workbench/inference/overview.md>
Tutorials <tutorials/workbench-tutorials.md>
```

```{toctree}
---
caption: AMD Resource Manager
maxdepth: 1
hidden: True
---
resource-manager/overview.md
Quick Start for AI Resource Managers <quick-start-guides/resource-manager-quick-start.md>
resource-manager/dashboard.md
resource-manager/clusters/overview.md
Projects Overview <resource-manager/projects/manage-projects.md>
Secrets Overview <resource-manager/secrets/overview.md>
User Management <resource-manager/users/overview.md>
Tutorials <tutorials/resource-tutorials.md>
```

```{toctree}
---
caption: References
maxdepth: 1
hidden: True
---
references/overview.md
```
