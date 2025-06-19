---
tags:
  - developer center
  - inference
  - chat
---

# Model inference

## Developer Center Playground - Chat

The Playground Chat page allows you to experiment with models you have access to - you will be able to modify several Retrieval and Generation parameters to judge how they affect the model's response. User can test and compare chat models and quickly change between the views. Please see respective [Chat](./chat.md) or [Compare](./compare.md) pages for more details.

### Accessing the Playground Chat

Navigate to the "Chat and Compare" to access the Playground Chat.

You will be able to choose from the list of models you have access to.
Expand the settings toggle to view and modify the retrieval and model generation parameters.

![Playground Chat](../../img/inference/playground-chat.png)

### Inspecting the debug output of the model

Once you have a response from the model, you can inspect the messages that were sent to the model, the context retrieved as part of RAG and the consumed tokens by clicking the "bug" icon next to the response.

![Debug Icon](../../img/inference/debug-icon.png)

![Debug Output](../../img/inference/debug-output.png)

## Tutorials and examples

This section contains examples and reference workloads for running model inference on SiloGen platform.

[Model inferencing using SGLang](../../../../../ai-workloads-manifests/llm-inference-sglang/helm/)

[Model inferencing using vLLM](../../../../../ai-workloads-manifests/llm-inference-vllm/helm/)

[Using your own model and data](../../../../../ai-workloads-docs/tutorials/tutorial-01-deliver-resources-and-finetune#next-steps-how-to-use-your-own-model-and-data)
