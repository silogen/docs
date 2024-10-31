"use strict";(self.webpackChunksilogen_docs=self.webpackChunksilogen_docs||[]).push([[845],{5920:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var i=t(6070),o=t(1503);const a={title:"Fine-tuning",sidebar_position:4},s="Fine-tuning",c={id:"developer-console/fine-tuning",title:"Fine-tuning",description:"Fine-tuning a model allows you to customize it to your specific use-case with your data. We provide a certified list of base-models which you can finetune and we allow you to customize certain hyperparameters to get the best results.",source:"@site/external-docs/docs/developer-console/fine-tuning.mdx",sourceDirName:"developer-console",slug:"/developer-console/fine-tuning",permalink:"/developer-console/fine-tuning",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"Fine-tuning",sidebar_position:4},sidebar:"externalDocsSidebar",previous:{title:"Collections",permalink:"/developer-console/collections"},next:{title:"Evaluation",permalink:"/developer-console/evaluation"}},d={},l=[{value:"Getting ready to finetune your model",id:"getting-ready-to-finetune-your-model",level:2},{value:"Uploading training data",id:"uploading-training-data",level:3},{value:"Base-models for finetuning",id:"base-models-for-finetuning",level:3},{value:"Creating a fine-tuned model",id:"creating-a-fine-tuned-model",level:2},{value:"Deploying a fine-tuned model",id:"deploying-a-fine-tuned-model",level:2},{value:"Undeploying a fine-tuned model",id:"undeploying-a-fine-tuned-model",level:2}];function r(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",p:"p",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"fine-tuning",children:"Fine-tuning"})}),"\n",(0,i.jsx)(n.p,{children:"Fine-tuning a model allows you to customize it to your specific use-case with your data. We provide a certified list of base-models which you can finetune and we allow you to customize certain hyperparameters to get the best results."}),"\n",(0,i.jsx)(n.p,{children:"Fine-tuned models can be deployed and subsequently be used for evaluation and inferencing once weights for the model have been computed."}),"\n",(0,i.jsx)(n.h2,{id:"getting-ready-to-finetune-your-model",children:"Getting ready to finetune your model"}),"\n",(0,i.jsx)(n.h3,{id:"uploading-training-data",children:"Uploading training data"}),"\n",(0,i.jsx)(n.p,{children:"One of the first steps to take towards fine-tuning your model is to upload training data to our platform.\nThe training data should represent a wide range of indicative conversations that you would like your model to respond to as part of inference."}),"\n",(0,i.jsxs)(n.p,{children:["Once you have procured training data for your model, navigate to the ",(0,i.jsx)(n.a,{href:"https://chat.services.silogen.ai/console/datasets",children:"Datasets page"})," of the developer console to upload the dataset.\nWe currently support uploading datasets in a JSONL format, where each row represents a separate chat conversation. The format of each row should correspond to what is defined in our ",(0,i.jsx)(n.a,{href:"https://catalog.services.silogen.ai/redoc#tag/Datasets/operation/add_data_point",children:"API"})," for each datapoint, of type ChatConversation."]}),"\n",(0,i.jsx)(n.p,{children:'Subsequently, click the "Upload" button and drop your JSONL file in with a name and description'}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Upload dataset",src:t(2484).A+"",width:"578",height:"722"})}),"\n",(0,i.jsx)(n.h3,{id:"base-models-for-finetuning",children:"Base-models for finetuning"}),"\n",(0,i.jsxs)(n.p,{children:["We are continuously working on certifying base-models for fine-tuning. It is recommended that you first identify a base-model appropriate for your use case and use that for fine-tuning.\nIf you are missing a specific base-model, reach out to our customer success team in order for them to either provision access, or fast-track certification.\nYou can browse the list of accessible base-models by navigating back to the ",(0,i.jsx)(n.a,{href:"https://chat.services.silogen.ai/console/models",children:"Models page"}),' in the Developer console and clicking the "Create New" button.']}),"\n",(0,i.jsx)(n.h2,{id:"creating-a-fine-tuned-model",children:"Creating a fine-tuned model"}),"\n",(0,i.jsx)(n.p,{children:'Once you have selected a dataset and a base-model for finetuning, trigger the creation of your fine-tuned model by clicking the "Create New" button and selecting appropriate entries.\nYou must provide your model a name and a description and can optionally specify any of 3 hyperparameters: Batch-size, Learning-rate multiplier and Number of epochs. If you are unsure of the values to use, leave the inputs empty, to auto select the default certified values.'}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Create fine-tuned model",src:t(4744).A+"",width:"578",height:"847"})}),"\n",(0,i.jsx)(n.p,{children:'Once the fine-tuning process has successfully been triggered, you will be able to see your model in the "Not-deployed" tab of the page and the fine-tuning run itself in the "Run status" section.\nThe finetuning run may take several hours to complete, so we recommend visiting the Developer console occasionally when the run is in progress. If the run fails mid-way, please reach out to our customer success team, and we will help triage your issue.'}),"\n",(0,i.jsx)(n.h2,{id:"deploying-a-fine-tuned-model",children:"Deploying a fine-tuned model"}),"\n",(0,i.jsx)(n.p,{children:'Once your model has been successfully trained, the model status will reflect as "Ready": this means that the weights have been successfully computed for your model and it can be used for inferencing.'}),"\n",(0,i.jsx)(n.p,{children:'Click the "Deploy button" corresponding the model you would like to deploy, and have it usable for inferencing. Please note that a model once deployed can take upto 5 minutes before it can serve requests.'}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Deploy fine-tuned model",src:t(6498).A+"",width:"391",height:"183"})}),"\n",(0,i.jsxs)(n.p,{children:["Once deployed, you can navigate either to the ",(0,i.jsx)(n.a,{href:"https://chat.services.silogen.ai/console/chat",children:"Chat page"})," or the ",(0,i.jsx)(n.a,{href:"https://chat.services.silogen.ai/console/chat",children:"Compare page"})," to converse with the model or the ",(0,i.jsx)(n.a,{href:"https://chat.services.silogen.ai/console/evaluations",children:"Evaluations page"})," to evaluate the performance of your model against a pre-defined evaluation dataset."]}),"\n",(0,i.jsx)(n.p,{children:'After your have verified that your model performs as per expectations, you can copy the name of the model in the Models page, by clicking the "Copy Icon" and use the copied model name for inferencing via the API.'}),"\n",(0,i.jsx)(n.h2,{id:"undeploying-a-fine-tuned-model",children:"Undeploying a fine-tuned model"}),"\n",(0,i.jsxs)(n.p,{children:['Once you have deployed a version of a fine-tuned model, it might be the case that you subsequently want to "Undeploy" it because it has been superseded by other model. You can do this by again navigating to the ',(0,i.jsx)(n.a,{href:"https://chat.services.silogen.ai/console/models",children:"Models page"}),', identifying the model in the list of "Deployed" models and clicking the "Undeploy button".']}),"\n",(0,i.jsx)(n.p,{children:"This will make the model no longer accessible for inferencing."}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"Undeploy fine-tuned model",src:t(9195).A+"",width:"435",height:"183"})})]})}function h(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(r,{...e})}):r(e)}},6498:(e,n,t)=>{t.d(n,{A:()=>i});const i="data:image/png;base64,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"},4744:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/trigger-finetuning-4c6fbf66ddb5e9f4e96e66aeb4e64a55.png"},9195:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/undeploy-finetuned-model-aba6e9c7e4e46ccc8c6ac6a653b59d96.png"},2484:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/upload-finetuning-dataset-46c92c747c2d2bfa7ef7055f5f0155ca.png"},1503:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>c});var i=t(758);const o={},a=i.createContext(o);function s(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);