"use strict";(self.webpackChunksilogen_docs=self.webpackChunksilogen_docs||[]).push([[653],{52:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var o=n(6070),s=n(1503);const r={title:"Changing Prompt Template for RAG",sidebar_position:3},a=void 0,i={id:"using-the-api/llm-service/changing-prompt-template",title:"Changing Prompt Template for RAG",description:"There are default prompt templates for RAG in the SiloGen platform. These often work ok, but if e.g. your target language is not English, or you want references in another format, or you use the short context Poro 34B chat model, then you might need to set the default templates to something else. The effect of changing the default templates varies a lot between models, and not all models support the system prompt. Check with your SiloGen contact for specifics regarding your model.",source:"@site/external-docs/docs/using-the-api/llm-service/changing-prompt-template.mdx",sourceDirName:"using-the-api/llm-service",slug:"/using-the-api/llm-service/changing-prompt-template",permalink:"/using-the-api/llm-service/changing-prompt-template",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Changing Prompt Template for RAG",sidebar_position:3},sidebar:"externalDocsSidebar",previous:{title:"LLM Service",permalink:"/using-the-api/llm-service/"},next:{title:"Python Example",permalink:"/using-the-api/llm-service/python-example"}},l={},c=[];function h(e){const t={a:"a",code:"code",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.p,{children:"There are default prompt templates for RAG in the SiloGen platform. These often work ok, but if e.g. your target language is not English, or you want references in another format, or you use the short context Poro 34B chat model, then you might need to set the default templates to something else. The effect of changing the default templates varies a lot between models, and not all models support the system prompt. Check with your SiloGen contact for specifics regarding your model."}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"There are three prompts that potentially needs to be changed to achieve desired RAG output:"}),"\n",(0,o.jsxs)(t.li,{children:["The system prompt: this gives general instructions of what the system (model really) should do. This is the one that in the LLM literature often starts with \u201cYou are a helpful assistant\u2026\u201d.\nThe RAG prompt template: this contains variables for using the retrieved sources in combination with the user\u2019s input/question as the prompt to the model. The ",(0,o.jsx)(t.code,{children:"user_message"})," and ",(0,o.jsx)(t.code,{children:"sources_string"})," are required, but more instructions can be added before/after. See code example below."]}),"\n",(0,o.jsx)(t.li,{children:"The source template. Just leave this one as is unless you really know what you want to achieve and how. Currently, it loops through the number of found sources and gives them all to the model as part of the prompt_template."}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.strong,{children:"NOTE"}),": Different system and prompt template can also be tested in the ",(0,o.jsx)(t.a,{href:"/developer-console/",children:"Developer Console"})]}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["Example for setting ",(0,o.jsx)(t.strong,{children:"system"})," and ",(0,o.jsx)(t.strong,{children:"prompt_template"})," showing lightly edited versions of the default templates in blue:"]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:'curl -X POST https://model-service.services.silogen.ai/v1/chat/completions -H "Authorization: Bearer ${ACCESS_TOKEN}" -H "Content-Type: application/json" -d \'{"model": "THE_MODEL_NAME", "prompt_template":"Input: {{ user_message }}\\n\\Sources : {{ sources_string }}\\n\\nResponse (Must be in markdown format. Cite the sources you used as a markdown link as you use them at the end of each sentence by number of the source. Example: [[1]](link.com). Do not list all sources at the end!:", "messages": [{"role":"system","content":"Provide me with the information I requested. Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as a markdown link as you use them at the end of each sentence by number of the source (example: [[1]](link.com)).\nProvide an accurate response and then stop.\n\nImportant: If there are no sources, respond with "No sources found." and stop. If there are sources but the answer cannot be extracted from them, respond with "Not sure how to respond to that." and stop.\nIf there are sources, and the answer can be extracted from the sources, respond with the information requested and then stop. Do not provide any additional information.\n\nExample Input:\nWhat\'s the weather in San Francisco today?\n\nExample Sources:\n\n"Weather data" (https://www.google.com/search?q=weather+san+francisco):\nThe current weather in San Francisco is 70 degrees and sunny.\n\nExample Response:\nIt\'s 70 degrees and sunny in San Francisco today. [1]](https://www.google.com/search?q=weather+san+francisco)\n"},{"role": "user", "content": "YOUR PROMPT HERE"}], "collection": {"collectionId": "THE_COLLECTION_NAME"}}\'\n'})})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}},1503:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>i});var o=n(758);const s={},r=o.createContext(s);function a(e){const t=o.useContext(r);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),o.createElement(r.Provider,{value:t},e.children)}}}]);