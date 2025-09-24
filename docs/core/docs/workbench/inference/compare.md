<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

---
tags:
  - AMD AI Workbench
  - chat
  - comparison
---

# Comparison

The model comparison view allows you to compare the output of different models using the same set of settings.

A common use case is to compare the response of your model before and after fine-tuning, or to test how different settings affect the model's output.

## Accessing the model comparison

Navigate to the `Chat and Compare` → `Compare` to access the model comparison.

You will be able to choose from the list of models you have access to.

Similar to the chat, you can expand the settings toggle to view and modify the generation parameters.

## Inspecting the debug output of the model

Also [similar to the chat](./chat.md#inspecting-the-debug-output-of-the-model), you can click the "bug" icon to inspect the messages sent to the model,the context retrieved as part of generation, and the consumed tokens.

![Model comparison view](../../core-img/inference/compare.png)
