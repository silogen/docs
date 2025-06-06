# Python Example

```python
import os

from keycloak import KeycloakOpenID
from openai import OpenAI


class KeycloakAuth:
    def __init__(self, server_url, client_id, realm_name):
        self.keycloak_openid = KeycloakOpenID(server_url=server_url, client_id=client_id, realm_name=realm_name)

    def token(self, username, password):
        response = self.keycloak_openid.token(username=username, password=password)  # type: ignore
        return response["access_token"]

TOKEN = KeycloakAuth(
    server_url="https://auth.services.silogen.ai",
    client_id="cc6e3d5f-0b70-462c-b40a-1d795c948d3d",
    realm_name="silogen",
).token(
    username=os.environ.get("KEYCLOAK_USERNAME"),
    password=os.environ.get("KEYCLOAK_PASSWORD"),
)
OPENAI_BASE_URL = "https://model-service.services.silogen.ai/v1"

client = OpenAI(base_url=OPENAI_BASE_URL, api_key=TOKEN)

# List all available models in model catalogue within your account
models_list = client.models.list()

# Get a model from model catalogue (first model in catalogue is indexed as 0)
model_id = client.models.list().data[0].id

history_openai_format = [
    {"role": "system", "content": "You are a helpful assistant!"},
    {"role": "user", "content": "Hello World!"},
]
completion = client.chat.completions.create(
    model=model_id,
    messages=history_openai_format,
    temperature=0.0,
    stream=True,
)

for chunk in completion:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="")
```

You need to install the following packages to run the code:

- `requests`
- `python-keycloak`
- `openai`

Example: `pip install requests python-keycloak openai`

**Example of using extra RAG parameters in the request**:

If you are using the OpenAI python client, all SiloGen specific fields need to be specified in the 'extra_body' field. These fields include: debug, collection, prompt_template, and source_template.

```python
completion = client.chat.completions.create(
    model=model_id,
    messages=history_openai_format,
    temperature=0.0,
    stream=STREAM,
    extra_headers=AUTHORIZATION_HEADER,
    extra_body={
        "debug": True,
        "collection": {
            "collectionId": collection_id,
            "top_k": 4,
            "alpha": 0.5,
        },
        "prompt_template":prompt_template
    },
)
```
