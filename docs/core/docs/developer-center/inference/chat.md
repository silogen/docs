# Chat

The Chat page allows you to experiment with models you have access to - you will be able to modify several Retrieval and Generation parameters to judge how they affect the model's response.

## Accessing the Chat

Navigate to the **AI Developer Center** → `Chat and Compare` to access the Chat.

You will be able to choose from the list of models you have access to.
Expand the settings toggle to view and modify the retrieval and generation parameters, using same format as for the API (eg. [Changing Prompt Template for RAG](../../using-the-api/llm-service/changing-prompt-template.md))

![Chat](../../img/inference/playground-chat.png)

## Inspecting the debug output of the model

Once you have a response from the model, you can inspect the messages that were sent to the model, the context retrieved as part of RAG and the consumed tokens by clicking the "bug" icon next to the response.

![Debug Icon](../../img/inference/debug-icon.png)

![Debug Output](../../img/inference/debug-output.png)
