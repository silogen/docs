# Release notes

## Release Date: September 15, 2025

### Documentation
For details, see documentation: https://docs.silogen.ai/

### New Features: AMD Resource Manager
- **Kubernetes Cluster Onboarding:** Installation and configuration of Enterprise ready Kubernetes cluster for AMD GPUs
- **Compute Quota Management:** Create projects with assigned users and allocated compute resource (GPU) quota
- **Workload Management:** Efficient management of both Deployments (inference & workspaces) and Jobs (fine-tuning)
- **Monitoring:** Dashboards for monitoring compute utilization on cluster, project and workload levels  

### New Features: AI Workbench
- **Models and Data Catalogues:** Catalogue with popular open source models and ability to upload fine-tuning data
- **Low Code UI for Inference and Fine-tuning:** Fine-tuning recipes for selected models (e.g. Llama 3.1) and Chat UI for model interaction
- **Inference API:** Deploy models for inference behind API Gateway, for both community models and custom models fine-tuned on the platform 
- **Workspaces:** Deploy VSCode, JupyterLab or ComfyUI workspaces with pre-allocated compute resources

---

### Known Issues
- **Delays in JupyterLab Workspace** It takes about 30 seconds after the launch button gets activated before the JupyterLab can actually be launched.
- **Community Models document link is not pointing to right document after download**
- **Custom Models** "Failed" models have "deploy" action menu item. They shouldn't, since you cannot deploy them.
- **Model download may occasionally fail** due to connectivity problems with the HuggingFace model registry or issues with the MinIO bucket storage connection.
- **Cluster storage is not auto-monitored** which may result in storage becoming full and causing workload failures.
- **Certain models, like the Llama 3.2 Vision models** may not be available for download and deployment due to geographical restrictions. This can cause the workloads to fail.
- **When downloading models from the Community Models page, the state of the UI card might not update to "Deploy"** A page refresh is then needed.
- **Only one cluster is supported** the GUI suggests that another cluster can be onboarded, but this is not yet fully supported.
- **Kubectl usage for workload deployment needs workaround** the AI Resource manager currently does not manage those workloads. This is coming in next release. If you need this now, we can share a workaround that may be sufficient for some teams of cooperative users