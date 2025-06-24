---
tags:
  - developer center
  - inference
  - chat
---

# Model inference

## Developer Center – Chat

The chat page allows you to experiment with models you have access to. You can modify several retrieval and generation parameters to see how they affect the model's response. Users can test and compare chat models and quickly switch between views. For more details, see the [Chat](./chat.md) or [Compare](./compare.md) pages.

### Accessing the chat

Navigate to **Chat and Compare** to access the chat.

You will be able to choose from the list of models you have access to. Expand the settings toggle to view and modify the retrieval and generation parameters.

![Chat view](../../img/inference/chat.png)

### Inspecting the debug output of the model

Once you have a response from the model, you can inspect the messages sent to the model, the context retrieved as part of RAG, and the consumed tokens by clicking the "bug" icon next to the response.

![Debug icon](../../img/inference/debug-icon.png)

![Debug output](../../img/inference/debug-output.png)

## Tutorials and examples

This section contains examples and reference workloads for running model inference on the SiloGen platform.

- [Model inferencing using SGLang](../../../../../ai-workloads-manifests/llm-inference-sglang/helm/)
- [Model inferencing using vLLM](../../../../../ai-workloads-manifests/llm-inference-vllm/helm/)
- [Using your own model and data](../../../../../ai-workloads-docs/tutorials/tutorial-01-deliver-resources-and-finetune#next-steps-how-to-use-your-own-model-and-data)
