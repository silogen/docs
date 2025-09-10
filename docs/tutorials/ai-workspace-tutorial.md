---
tags:
  - AMD AI Workbench
  - workspaces
  - tutorial
---

# Working in AI Workspaces Hands On

This guide teaches you how to work in the AMD AI Workbench workspace using a Jupyter Lab notebook.

## Tutorial: fine-tune Llama-3.1 8B with torchtune

This tutorial demonstrates how to fine-tune the Llama-3.1 8B large language model (LLM) on AMD ROCm GPUs using torchtune. Torchtune is an easy-to-use PyTorch library for authoring, post-training, and experimenting with LLMs.

Access the tutorial [here](https://rocm.docs.amd.com/projects/ai-developer-hub/en/v3.0/notebooks/fine_tune/llama_factory_llama3.html).

!!! Note
    Skip steps 1-3 in the chapter `Prepare the training environment`, as these do not apply to the (Kubernetes) environment.

## Tutorial: Prepare and upload a dataset to AMD AI Workbench

### 1. Run the data preparation script in the Jupyter Notebook

```python
from huggingface_hub import hf_hub_download
import json
import os
import random

def convert_opi(input_file, output_file):
    """
    Converts a JSON array of objects with 'instruction', 'input', and 'output' fields
    into a JSONL file with the specified message format.
    """
    with open(input_file, 'r') as f:
        data = json.load(f)

    with open(output_file, 'w') as f:
        for row in data:
            if all(k in row for k in ("instruction", "input", "output")):
                line = {
                    "messages": [
                        {"role": "user", "content": f"{row['instruction']} Sequence: {row['input']}"},
                        {"role": "assistant", "content": row["output"]}
                    ]
                }
                f.write(json.dumps(line) + "\n")

def create_sample(input_jsonl, output_jsonl, n):
    """Create a random sample of n lines from input_jsonl and write to output_jsonl."""
    with open(input_jsonl, 'r') as f:
        lines = f.readlines()
    sample = random.sample(lines, min(n, len(lines)))
    with open(output_jsonl, 'w') as f:
        f.writelines(sample)

repo_id = "BAAI/OPI"
target_dir = "./datasets"
output_dir = "./datasets"
data_in = [
    "OPI_DATA/OPI_updated_160k.json",
]
create_sample_n = 1000  # Set to None to disable

for file in data_in:
    hf_hub_download(repo_id=repo_id,
                    filename=file,
                    repo_type="dataset",
                    local_dir=target_dir)
    print('Downloaded', file)
    file_out = file.split('/')[1].replace(".json", ".jsonl")
    out_path = os.path.join(output_dir, file_out)
    convert_opi(os.path.join(target_dir, file), out_path)
    print('Converted', file, 'to', file_out)

    if create_sample_n is not None:
        sample_out = out_path.replace(".jsonl", f".sample{create_sample_n}.jsonl")
        create_sample(out_path, sample_out, create_sample_n)
        print(f'Created random sample of {create_sample_n} lines: {sample_out}')
```

### 2. Upload the dataset to the AMD AI Workbench catalog

You can upload a dataset to the platform using the API. See the examples below.

**Example**: API call using Curl

```python
curl -X 'POST' \
  'https://api-demo.silogen.ai/v1/datasets/upload?project_id=YOUR_PROJECT_UUID_HERE' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: multipart/form-data' \
  -F 'name=string' \
  -F 'description=string' \
  -F 'type=Fine-tuning' \
  -F 'jsonl=@dataset.jsonl'
```

**Example**: API call using Python

```python
from pathlib import Path
import requests, certifi

BASE_URL = "https://api-demo.silogen.ai/v1/datasets/upload?project_id=ADD_YOUR_PROJECT_ID"
file_path = Path("path_to_your_dataset")
headers = {"accept": "application/json", "Authorization": "Bearer ADD_YOUR_TOKEN"}
data = {"name": "dataset_name", "description": "dataset_decription", "type": "Fine-tuning"}

with file_path.open("rb") as f:
    response = requests.post(
        url=BASE_URL,
        headers=headers,
        data=data,
        files={"jsonl": f},
        verify=certifi.where(),
        timeout=300,
    )
print(response.json())
```
