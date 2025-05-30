---
title: Models
sidebar_position: 7
---

# Models

The Models view lists all available models than can be deployed or [fine-tuned](fine-tuning.md).

The filter bar helps filtering down the model list. The model type and status are described more detailed under [Defitions](#definitions).

![Model filters](/img/resource-management/models-filtering.png)

Models list always shows models mathing the current filter values.

![Model list](/img/resource-management/models-list.png)

Model specific actions can be performed using the three dot menu button.

![Model submenu](/img/resource-management/models-list-submenu.png)

## Definitions

### Model type

Model type is one of the following

- **Base model**
- **Merged model**
- **Adapter**

### Model status

Model can be in one of the following states

- **Pending**
  - Model is being prepared
- **Ready**
  - Model is ready for use
- **Failed**
  - There was some issue loading the model and model is not available for use.
