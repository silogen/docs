There are default prompt templates for RAG in the SiloGen platform. These often work ok, but if e.g. your target language is not English, or you want references in another format, or you use the short context Poro 34B chat model, then you might need to set the default templates to something else. The effect of changing the default templates varies a lot between models, and not all models support the system prompt. Check with your SiloGen contact for specifics regarding your model.

- There are three prompts that potentially needs to be changed to achieve desired RAG output:
- The system prompt: this gives general instructions of what the system (model really) should do. This is the one that in the LLM literature often starts with “You are a helpful assistant…”.
  The RAG prompt template: this contains variables for using the retrieved sources in combination with the user’s input/question as the prompt to the model. The `user_message` and `sources_string` are required, but more instructions can be added before/after. See code example below.
- The source template. Just leave this one as is unless you really know what you want to achieve and how. Currently, it loops through the number of found sources and gives them all to the model as part of the prompt_template.
- **NOTE**: Different system and prompt template can also be tested in the [AI Developer Center](../../developer-center/overview.md)

Example for setting **system** and **prompt_template** showing lightly edited versions of the default templates in blue:

```
curl -X POST https://model-service.services.silogen.ai/v1/chat/completions -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -d '{"model": "THE_MODEL_NAME", "prompt_template":"Input: {{ user_message }}\n\Sources : {{ sources_string }}\n\nResponse (Must be in markdown format. Cite the sources you used as a markdown link as you use them at the end of each sentence by number of the source. Example: [[1]](link.com). Do not list all sources at the end!:", "messages": [{"role":"system","content":"Provide me with the information I requested. Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as a markdown link as you use them at the end of each sentence by number of the source (example: [[1]](link.com)).
Provide an accurate response and then stop.

Important: If there are no sources, respond with "No sources found." and stop. If there are sources but the answer cannot be extracted from them, respond with "Not sure how to respond to that." and stop.
If there are sources, and the answer can be extracted from the sources, respond with the information requested and then stop. Do not provide any additional information.

Example Input:
What's the weather in San Francisco today?

Example Sources:

"Weather data" (https://www.google.com/search?q=weather+san+francisco):
The current weather in San Francisco is 70 degrees and sunny.

Example Response:
It's 70 degrees and sunny in San Francisco today. [1]](https://www.google.com/search?q=weather+san+francisco)
"},{"role": "user", "content": "YOUR PROMPT HERE"}], "collection": {"collectionId": "THE_COLLECTION_NAME"}}'
```
