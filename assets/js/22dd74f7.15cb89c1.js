"use strict";(self.webpackChunksilogen_docs=self.webpackChunksilogen_docs||[]).push([[567],{5226:e=>{e.exports=JSON.parse('{"version":{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"noIndex":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"docsSidebar":[{"type":"link","label":"SiloGen Docs Introduction","href":"/","docId":"intro","unlisted":false},{"type":"link","label":"Registering a New User","href":"/registering","docId":"registering","unlisted":false},{"type":"category","label":"Using the API","items":[{"type":"link","label":"Authentication","href":"/using-the-api/authentication","docId":"using-the-api/authentication","unlisted":false},{"type":"category","label":"LLM Service","items":[{"type":"link","label":"Changing Prompt Template for RAG","href":"/using-the-api/llm-service/changing-prompt-template","docId":"using-the-api/llm-service/changing-prompt-template","unlisted":false},{"type":"link","label":"Python Example","href":"/using-the-api/llm-service/python-example","docId":"using-the-api/llm-service/python-example","unlisted":false},{"type":"link","label":"Common Parameters and Values","href":"/using-the-api/llm-service/common-parameters","docId":"using-the-api/llm-service/common-parameters","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/using-the-api/llm-service/"},{"type":"link","label":"RAG Document Collection Service","href":"/using-the-api/rag-document-collection-service","docId":"using-the-api/rag-document-collection-service","unlisted":false},{"type":"link","label":"Feedback Collection [under development]","href":"/using-the-api/feedback-collection","docId":"using-the-api/feedback-collection","unlisted":false},{"type":"link","label":"Response Status and Error Codes","href":"/using-the-api/response-status","docId":"using-the-api/response-status","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/using-the-api/"},{"type":"link","label":"Using the Chat UI","href":"/using-chat-ui","docId":"using-chat-ui","unlisted":false},{"type":"category","label":"Developer Console [under development]","items":[{"type":"link","label":"Playground - Model Comparison","href":"/developer-console/playground-model-comparison","docId":"developer-console/playground-model-comparison","unlisted":false},{"type":"link","label":"Collection Management","href":"/developer-console/collection-management","docId":"developer-console/collection-management","unlisted":false},{"type":"link","label":"Fine-tuning","href":"/developer-console/fine-tuning","docId":"developer-console/fine-tuning","unlisted":false},{"type":"link","label":"Evaluation","href":"/developer-console/evaluation","docId":"developer-console/evaluation","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/developer-console/"},{"type":"category","label":"Models [Section in progress]","items":[{"type":"link","label":"Viking-7b","href":"/models/viking-7b","docId":"models/viking-7b","unlisted":false},{"type":"link","label":"Poro-34b","href":"/models/poro-34b","docId":"models/poro-34b","unlisted":false},{"type":"link","label":"Mistral-7b-instruct","href":"/models/mistral-7b-instruct","docId":"models/mistral-7b-instruct","unlisted":false},{"type":"link","label":"Poro-chat-34b","href":"/models/poro-chat-34b","docId":"models/poro-chat-34b","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/models/"}]},"docs":{"developer-console/collection-management":{"id":"developer-console/collection-management","title":"Collection Management","description":"Silogen provides an out-of-the-box component to assist with indexing and retrieving your documents in Collections as part of Retrieval Augmented Generation (RAG). You can manage your collections through Collections page of the Developer Console.","sidebar":"docsSidebar"},"developer-console/evaluation":{"id":"developer-console/evaluation","title":"Evaluation","description":"As with any piece of complex software, comprehensive testing and evaluation is key to ensuring that the model performs as expected. We provide a set of tools to help you evaluate the performance of your model.","sidebar":"docsSidebar"},"developer-console/fine-tuning":{"id":"developer-console/fine-tuning","title":"Fine-tuning","description":"Fine-tuning a model allows you to customize it to your specific use-case with your data. We provide a certified list of base-models which you can finetune and we allow you to customize certain hyperparameters to get the best results.","sidebar":"docsSidebar"},"developer-console/index":{"id":"developer-console/index","title":"Developer Console","description":"The developer console is currently under rapid development and contains an interface for you to easily manage the lifecycle your Generative AI stack including:","sidebar":"docsSidebar"},"developer-console/playground-model-comparison":{"id":"developer-console/playground-model-comparison","title":"Playground - Model Comparison","description":"The Playground allows you to compare output of different models, as well as test how different settings, including how changes to system and (RAG) prompt templates affect the output.","sidebar":"docsSidebar"},"intro":{"id":"intro","title":"SiloGen Docs Introduction","description":"This is the starting point of the public documentation for the SiloGen product.","sidebar":"docsSidebar"},"models/index":{"id":"models/index","title":"Models [Section in Progress]","description":"This is a brief description of the models offered via SiloGen service. Most open source models have better descriptions on","sidebar":"docsSidebar"},"models/mistral-7b-instruct":{"id":"models/mistral-7b-instruct","title":"Mistral-7b-instruct","description":"Mistral-7b-instruct","sidebar":"docsSidebar"},"models/poro-34b":{"id":"models/poro-34b","title":"Poro-34b","description":"Poro is a 34B parameter decoder-only transformer pretrained on Finnish, English and code. It has been trained on 1 trillion tokens.","sidebar":"docsSidebar"},"models/poro-chat-34b":{"id":"models/poro-chat-34b","title":"Poro-chat-34b","description":"Poro-chat model is the chat-tuned version of Poro base model that is capable of handling user dialogues (chat use cases). The model should be prompted (instructed) through the user prompt and not through the system prompt. This is due to the training data where instructions have been placed within the user prompt.","sidebar":"docsSidebar"},"models/viking-7b":{"id":"models/viking-7b","title":"Viking-7b","description":"Viking 7B parameter model covering all the Nordic languages, plus English and code. Chat tuned models as well as 13B and 33B models are planned to be released during spring 2024.","sidebar":"docsSidebar"},"registering":{"id":"registering","title":"Registering a new user","description":"New users need to sign up for a Silogen Keycloak account. With the account, users can sign in to the Chat UI or get an access token to use with the API.","sidebar":"docsSidebar"},"using-chat-ui":{"id":"using-chat-ui","title":"Using the Chat UI","description":"After logging in to chat.services.silogen.ai you will see the Chat UI (Figure 3). The Chat UI offers a simple UI for question-answering.","sidebar":"docsSidebar"},"using-the-api/authentication":{"id":"using-the-api/authentication","title":"Authentication","description":"You need an authentication token to access the service. Request an authentication token with e.g. the following terminal commands.","sidebar":"docsSidebar"},"using-the-api/feedback-collection":{"id":"using-the-api/feedback-collection","title":"Feedback Collection [under development]","description":"At the moment, it can be used to collect e.g. DPO feedback via API. Contact your SiloGen contact for further instructions/examples.","sidebar":"docsSidebar"},"using-the-api/index":{"id":"using-the-api/index","title":"Using the API","description":"The SiloGen API is compatible with the OpenAI API. Common parameters and options such as streaming results work the same. At the moment, the SiloGen API offers fewer options than the OpenAI API, but e.g. Python examples of OpenAI are often straightforward to adapt to use the SiloGen API instead.","sidebar":"docsSidebar"},"using-the-api/llm-service/changing-prompt-template":{"id":"using-the-api/llm-service/changing-prompt-template","title":"Changing Prompt Template for RAG","description":"There are default prompt templates for RAG in the SiloGen platform. These often work ok, but if e.g. your target language is not English, or you want references in another format, or you use the short context Poro 34B chat model, then you might need to set the default templates to something else. The effect of changing the default templates varies a lot between models, and not all models support the system prompt. Check with your SiloGen contact for specifics regarding your model.","sidebar":"docsSidebar"},"using-the-api/llm-service/common-parameters":{"id":"using-the-api/llm-service/common-parameters","title":"Common Parameters and Values","description":"More detailed descriptions are available in the Open API documentation. The effect of the parameters and values will vary greatly depending on the model.","sidebar":"docsSidebar"},"using-the-api/llm-service/index":{"id":"using-the-api/llm-service/index","title":"LLM Service","description":"The service endpoint for chat is//model-service.services.silogen.ai/v1/chat/completions.","sidebar":"docsSidebar"},"using-the-api/llm-service/python-example":{"id":"using-the-api/llm-service/python-example","title":"Python Example","description":"You need to install the following packages to run the code:","sidebar":"docsSidebar"},"using-the-api/rag-document-collection-service":{"id":"using-the-api/rag-document-collection-service","title":"RAG Document Collection Service","description":"The service base url is//document-collection.services.silogen.ai/","sidebar":"docsSidebar"},"using-the-api/response-status":{"id":"using-the-api/response-status","title":"Response Status and Error Codes","description":"The HTTP response status codes follow standard conventions. Please, inspect the error message for more information.","sidebar":"docsSidebar"}}}}')}}]);