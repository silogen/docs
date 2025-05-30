---
title: Debugging Tips
description: Tips for debugging SiloGen Services, Pipelines, and other components.
---

## Pipelines

### Debugging “this one pipeline doesn’t work”

Whenever anything weird happens, first go to the pod logs of the pipeline. Pods are named pipeline--\<\<pipeline name\>\> in Kubernetes. Loki is the best tool for checking our logs. The error is usually something with:

1. Access control or something being down that the pipeline relies on. The pipeline logs will show that something cannot be accessed or reached. Check access rights or Kubernetes pods of whatever is trying to be accessed. One possibility is also that the pipeline or backend model has an image that is incompatible with the rest of the system -- either a buggy version or too old.
1. RAG. Check the pipeline logs to see that sources are retrieved correctly.
1. Model parameters or the inference engine. Check the pod logs of the inference model being used, it should tell exactly what the model has been given as a prompt along with all the parameters. The ID for the model that is used can be found either through model catalog, or in the `usesInferenceModel` label in the Kubernetes manifest. The correct pod in the Kubernetes cluster can be then found with the `componentId` label.
1. Something that is actually common to all pipelines/models. Check the next part.

### Debugging “none of the pipelines work”

1. Is it through the chat UI, AI Developer Center, and the API, or only some of these?
   1. UI components might need you to delete site data after an update to work correctly. API might need you to get a fresh token.
1. Is it with RAG, without RAG, or both?
   1. If with RAG, is it a certain collection?
1. Something in the cluster is probably down or broken. In both cases, checking the models and chat namespaces for pods that are not fully operational (Ready N/N) is the first clue. After that, check the pod logs for the pods which provide common services to model-service. Interesting pods include:
   1. model-service, which acts as the proxy for all requests
   1. orchestrator, which handles deploying, undeploying, and listing LLM system components
   1. document-collection, which provides access to documents used in RAG
   1. catalog, which provides API access to the data and model catalog
