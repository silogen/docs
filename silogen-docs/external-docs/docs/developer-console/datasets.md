---
title: Datasets
sidebar_position: 6
---

# Datasets

SiloGen allows your to create and manage datasets in the platform for Fine-tuning purposes. Datasets are a collection of data points, where each datapoint represents a conversation, with or without the models' expected response, depending on the use-case.

## Uploading the dataset

Navigate to the **AI Developer Center** → `Datasets` to upload the dataset.
You can provide a name and description for the dataset, and upload a file representing the dataset in JSONL format.
The type of dataset should be selected when uploading the file, and the format of each row should correspond to the type of dataset selected.

![Upload dataset](/img/datasets/upload-dataset.png)

## Data formats

Depending on the selected dataset type, each row in the JSONL file should be formatted as below

> ---
>
> **Info: JSONL formatting**
>
> In a real JSONL file, each object must be on a single line. Here, objects are formatted for readability.
>
> ---

### Fine-tuning

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful Geography bot. Only answer questions about Geography."
    },
    { "role": "user", "content": "What is the capital of France?" },
    { "role": "assistant", "content": "Paris" }
  ]
}
```

### Direct Preference

```json
{
  "prompt_messages": [
    {
      "role": "system",
      "content": "You are a helpful Geography bot. Only answer questions about Geography."
    },
    { "role": "user", "content": "What is the capital of France?" }
  ],
  "chosen_messages": [{ "role": "assistant", "content": "Paris" }],
  "rejected_messages": [{ "role": "assistant", "content": "I do not know" }]
}
```

## Archiving datasets

If you have identified a dataset that is no longer relevant to your use cases, you can choose to archive that dataset, by selecting the dataset(s) and clicking the "Archive" button in the "Actions" menu.

![Archive dataset](/img/datasets/archive.png)

### Un-archiving datasets

To subsequently un-archive a dataset, you can select the "Archived" filter option, select the dataset(s) you would like to un-archive and click the "Un-archive" button in the "Actions" menu.

![Un-archive dataset](/img/datasets/unarchive.png)
