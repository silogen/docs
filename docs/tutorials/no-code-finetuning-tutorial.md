# Finetune a model with no code

This guide teaches you how you can finetune a model though the Developer Center GUI without using any code.

1. We first select a basemodel and dataset for finetuning
2. We then start the model finetuning workload and observe the status of the workload.
3. We then deploy the finetuned model for inference
4. Finally we chat with the finetuned model through the chat interface.

## 1. Select a basemodel and dataset for finetuning
Go to the `Models` page and select the `Custom models` tab. You can trigger the creation of your fine-tuned model by clicking the "Fine-Tune Model" button and selecting the appropriate entries.

- In the `Base Model` field, select the preloaded model.
- In the `Training data` field, select the preloaded data set.
- In the `Name` field, you must specify a unique name for the finetuned model.
- In the `Description` field, specify a description for the finetuned model.
- You can skip the `Advanced parameter` fields and use the default values.
- Finally, click `Create` to start the model finetuning.
![Create fine-tuned model](../../img/training/fine-tuning-trigger.png)

## 2. Observe the model finetuning workload
Go to the `Workloads` page and view the details of the running model AI workload. In the table you can see name of the workload, the cluster the workload is assigned to, and how many resources the workload requires. The `Status` column shows the last known status of the workload and is not updated automatically. Filters can be used to find workloads by name, type, or status.

![Workload filters](../img/workloads/workloads-filters.png)

You can find more details about the workloads [here](../workloads.md)

## 3. Deploy the model for inference
Click the `Deploy` button corresponding to the model you would like to deploy to make it available for inferencing. Please note that a model, once deployed, can take up to 5 minutes before it can serve requests.

![Deploy fine-tuned model](../../img/training/fine-tuning-deploy-model.png)

Once deployed, you can navigate to the `Chat and Compare` page to converse with the model.

After you have verified that your model performs as expected, you can click the `View Code` menu item on the row in the Models page and use the code snippet for inference via the API.

## 4. Chat with the model

In the `Chat` page, choose the name of the finetuned model from the drop-down list in the top-right corner.

Write a question in the chat to interact with the model.

![Chat](../../img/inference/chat.png)

### Inspecting the debug output of the model

Once you have a response from the model, you can inspect the messages sent to the model, the context retrieved as part of RAG, and the consumed tokens by clicking the "bug" icon next to the response.

![Debug icon](../../img/inference/debug-icon.png)

![Debug output](../../img/inference/debug-output.png)
