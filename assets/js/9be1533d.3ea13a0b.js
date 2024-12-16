"use strict";(self.webpackChunksilogen_docs=self.webpackChunksilogen_docs||[]).push([[221],{2373:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>a,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>s,toc:()=>d});var n=t(6070),c=t(1503);const i={title:"Collection Management",sidebar_position:3},l="Collections",s={id:"developer-console/collections",title:"Collection Management",description:"Silogen provides an out-of-the-box component to assist with indexing and retrieving your documents in Collections as part of Retrieval Augmented Generation (RAG). You can manage your collections through Collections page of the Developer Console.",source:"@site/external-docs/docs/developer-console/collections.mdx",sourceDirName:"developer-console",slug:"/developer-console/collections",permalink:"/developer-console/collections",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Collection Management",sidebar_position:3},sidebar:"externalDocsSidebar",previous:{title:"Playground - Compare",permalink:"/developer-console/playground-compare"},next:{title:"Fine-tuning",permalink:"/developer-console/fine-tuning"}},a={},d=[{value:"Creating a collection",id:"creating-a-collection",level:2},{value:"Uploading documents to a collection",id:"uploading-documents-to-a-collection",level:2},{value:"Upload documents",id:"upload-documents",level:3},{value:"Scrape a website into a collection",id:"scrape-a-website-into-a-collection",level:3},{value:"Deleting documents from the collection",id:"deleting-documents-from-the-collection",level:3},{value:"Using your document in the Developer Console Chat",id:"using-your-document-in-the-developer-console-chat",level:2},{value:"Deleting a collection",id:"deleting-a-collection",level:2}];function r(e){const o={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",p:"p",strong:"strong",...(0,c.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.header,{children:(0,n.jsx)(o.h1,{id:"collections",children:"Collections"})}),"\n",(0,n.jsxs)(o.p,{children:["Silogen provides an out-of-the-box component to assist with indexing and retrieving your documents in Collections as part of Retrieval Augmented Generation (RAG). You can manage your collections through ",(0,n.jsx)(o.a,{href:"https://chat.services.silogen.ai/console/collections",children:"Collections page"})," of the Developer Console."]}),"\n",(0,n.jsx)(o.h2,{id:"creating-a-collection",children:"Creating a collection"}),"\n",(0,n.jsx)(o.p,{children:'Create a collection by clicking the "+" button on the collections page, which will allow you to specify the name of the collection and the embeddings server to use to index the documents of the collection. Reach out to your customer success manager to understand which embeddings server to use for your use case.'}),"\n",(0,n.jsx)(o.p,{children:"You can also optionally customize the chunking configuration of your collection: every document indexed in the collection will follow the configuration you specify. We do not allow changing the chunking configuration of a collection once it is created."}),"\n",(0,n.jsx)(o.p,{children:(0,n.jsx)(o.img,{alt:"Create collection",src:t(4375).A+"",width:"576",height:"769"})}),"\n",(0,n.jsx)(o.h2,{id:"uploading-documents-to-a-collection",children:"Uploading documents to a collection"}),"\n",(0,n.jsx)(o.p,{children:"Once you have created a collection, you can upload documents to it. You can upload individual documents, a ZIP file of documents, or scrape a website into a collection."}),"\n",(0,n.jsx)(o.h3,{id:"upload-documents",children:"Upload documents"}),"\n",(0,n.jsxs)(o.p,{children:['Select the collection you want to upload the document to, and click on the "Upload" button under the "Actions" menu.\nYou can drag and drop the documents you want to upload, we currently support txt, pdf, doc, docx, ppt and pptx file formats. You can also upload ',(0,n.jsx)(o.strong,{children:"a single ZIP file"})," which contains multiple documents with the format specified."]}),"\n",(0,n.jsx)(o.p,{children:'If you choose to upload a ZIP file, the documents will be extracted and uploaded to the collection. You will be navigated to the "Jobs" tab of the page to monitor the progress of the ZIP file upload.'}),"\n",(0,n.jsx)(o.p,{children:(0,n.jsx)(o.img,{alt:"Upload documents",src:t(2350).A+"",width:"576",height:"508"})}),"\n",(0,n.jsx)(o.h3,{id:"scrape-a-website-into-a-collection",children:"Scrape a website into a collection"}),"\n",(0,n.jsx)(o.p,{children:'You can alternatively scrape the contents of a website into a collection. To do this, click on the "Scrape Website" button under the "Actions" menu, and enter the URL of the website you want to scrape. You can also specify the number of pages to scrape from the website.\nThe web scraping process will begin from the website you specify and then traverse all links, which begin with the specified URL.\nYou can alternatively specify the URL to a sitemap.xml file, and the contents of the sitemap will be scraped into the collection.'}),"\n",(0,n.jsx)(o.p,{children:'You can navigate to the "Jobs" tab of the page to monitor the progress of the scrape website job.'}),"\n",(0,n.jsx)(o.p,{children:(0,n.jsx)(o.img,{alt:"Scrape website",src:t(7796).A+"",width:"512",height:"579"})}),"\n",(0,n.jsx)(o.h3,{id:"deleting-documents-from-the-collection",children:"Deleting documents from the collection"}),"\n",(0,n.jsx)(o.p,{children:'You can delete documents that you upload to the collection, by selecting the documents in the "Documents" tab and clicking on the "Delete" button.'}),"\n",(0,n.jsx)(o.p,{children:(0,n.jsx)(o.img,{alt:"Delete documents",src:t(3805).A+"",width:"242",height:"224"})}),"\n",(0,n.jsx)(o.h2,{id:"using-your-document-in-the-developer-console-chat",children:"Using your document in the Developer Console Chat"}),"\n",(0,n.jsxs)(o.p,{children:["Once your collection has been created, it will be visible to members of your organization in the Developer Console ",(0,n.jsx)(o.a,{href:"https://chat.services.silogen.ai/console/chat",children:"Chat page"})," and the ",(0,n.jsx)(o.a,{href:"https://chat.services.silogen.ai/console/chat",children:"Compare page"})," to use as part of Retrieval Augmented Generation."]}),"\n",(0,n.jsx)(o.p,{children:"You can always choose to disable RAG for the conversation, even if you have accessible collections."}),"\n",(0,n.jsx)(o.p,{children:(0,n.jsx)(o.img,{alt:"Chat collection select",src:t(4805).A+"",width:"315",height:"300"})}),"\n",(0,n.jsx)(o.h2,{id:"deleting-a-collection",children:"Deleting a collection"}),"\n",(0,n.jsx)(o.p,{children:'You can also choose to delete the entire collection by clicking on the "Delete" button on the after selecting the collection, in the "Collection Info" section. Deleting a collection will delete all the documents indexed in the collection and cannot be undone.'})]})}function h(e={}){const{wrapper:o}={...(0,c.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(r,{...e})}):r(e)}},4805:(e,o,t)=>{t.d(o,{A:()=>n});const n=t.p+"assets/images/chat-collection-7f6ee932fdf7d2eb755e25767eb037e3.png"},4375:(e,o,t)=>{t.d(o,{A:()=>n});const n=t.p+"assets/images/create-collection-f2c929995d8af9a62d9a923ccd7fd3e1.png"},3805:(e,o,t)=>{t.d(o,{A:()=>n});const n=t.p+"assets/images/documents-top-bar-7f1f84894e6dc70c7506e80db3e56f00.png"},7796:(e,o,t)=>{t.d(o,{A:()=>n});const n=t.p+"assets/images/scrape-website-85dc3ae80ac589e5a2100abb6a5c29de.png"},2350:(e,o,t)=>{t.d(o,{A:()=>n});const n=t.p+"assets/images/upload-documents-b2dbbb2e0539facc216810bc24001458.png"},1503:(e,o,t)=>{t.d(o,{R:()=>l,x:()=>s});var n=t(758);const c={},i=n.createContext(c);function l(e){const o=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function s(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:l(e.components),n.createElement(i.Provider,{value:o},e.children)}}}]);