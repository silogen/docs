# Common Parameters and Values

More detailed descriptions are available in the Open API documentation. The effect of the parameters and values will vary greatly depending on the model. Most parameters can be used both through manually crafted requests as well as when using the OpenAI Python client; we note when that is not the case.

| Request body parameters | Required | Type                 | Description                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | -------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| model                   | Yes      | String               | **Name of the model**. Allowed values are provided by your SiloGen contact. You can use the API to list available models (see https://model-service.services.silogen.ai/docs).                                                                                                                                                            |
| messages                | Yes      | List                 | **Combination of "role" and "content" lists**. This is the prompt. You can specify a single instruction or experiment with e.g. few shot prompts. Often sufficient with just "role":"user" and desired content, e.g. "content":"What is Poro LLM good at?"                                                                                |
| collection              | No       | Object               | **Configuration to use for Retrieval Augmented Generation**. See the table below for instructions on how to configure this fields                                                                                                                                                                                                         |
| temperature             | No       | Number 0-2           | Zero (0) will keep the system output closely aligned with the retrieved information from the collection. Higher values allow more creativity from the model and generate different responses for the same input. Default is 0.2.                                                                                                          |
| stream                  | No       | Boolean True / False | Streaming sends words as they are created by the language model one at a time, so you can show them as they are being generated.                                                                                                                                                                                                          |
| max_tokens              | No       | Number               | Mainly to restrict output length.                                                                                                                                                                                                                                                                                                         |
| presence_penalty        | No       | Number               | Default 0. Float that penalizes new tokens based on whether they appear in the generated text so far. Values > 0 encourage the model to use new tokens, while values < 0 encourage the model to repeat tokens.                                                                                                                            |
| frequency_penalty       | No       | Number               | Default 0. Float that penalizes new tokens based on their frequency in the generated text so far. Values > 0 encourage the model to use new tokens, while values < 0 encourage the model to repeat tokens.                                                                                                                                |
| repetition_penalty      | No       | Number               | Default 1. Float that penalizes new tokens based on whether they appear in the prompt and the generated text so far. Values > 1 encourage the model to use new tokens, while values < 1 encourage the model to repeat tokens. Not directly available through the OpenAI Python client but you can specify it in the extra_body parameter. |

## Common RAG Parameters

RAG related request parameters can be provided within the `collection` parameter.

| Collection parameters | Required | Type       | Description                                                                                                                                                                                                                       |
| --------------------- | -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collection_id         | Yes      | String     | The ID of the collection against which Retrieval should be performed.                                                                                                                                                             |
| top_k                 | No       | Number     | The **number of documents** to retrieve for each query as part of the retrieval. Higher number improves recall (more relevant documents), but at the cost of lower precision (more irrelevant documents). Default value is 4.     |
| certainty             | No       | Number 0-1 | The threshold to apply for similarity search: chunks with similarity below this threshold will not be considered. Incompatible with the `alpha` parameter. Default value is 0.                                                    |
| alpha                 | No       | Number 0-1 | The **balance of vector search vs. keyword search** as part of the document retrieval. 0 equals pure keyword search, 1 equals pure vector search. If specified, a hybrid search is performed, as opposed to a pure vector search. |
| metadata_filters      | No       | Dictionary | Filters to apply when considering documents for the search. These fields must correspond to the fields that were specified when indexing the documents.                                                                           |

## Examples

### OpenAI client example

```python
# completions (without retrieval)
history_openai_format = [
    {"role": "system", "content": "You are a helpful assistant!"},
    {"role": "user", "content": "woot42!"},
]

completion = client.chat.completions.create(
    model="Mistral 7B Instruct v0.1 no-autoscale",
    messages=history_openai_format,
    frequency_penalty=0.42,
    presence_penalty=0.4242,
    temperature=0.0,
    stream=True,
    extra_headers=AUTHORIZATION_HEADER,
    extra_body=(
        {
            "repetition_penalty": 1.1337
        }
    )
)
```

### POST request example

```python
import requests
payload = {
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant!"
      },
      {
        "role": "user",
        "content": "woot42!"
      }
    ],
    "model": "Mistral 7B Instruct v0.1 no-autoscale",
    "frequency_penalty": 1.42,
    "presence_penalty": 1.1337,
    "repetition_penalty": 1.31337,
    "stream": True,
    "temperature": 0.0
}
requests.post("https://model-service.services.silogen.ai/v1/chat/completions", json=payload, headers=AUTHORIZATION_HEADER)
```
