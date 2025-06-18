# ComfyUI Text-to-Image/Video Workload

This Helm Chart deploys a [ComfyUI](https://github.com/comfyanonymous/ComfyUI) web app for text-to-image/video generation.

## Deploying the Workload

Basic configurations are defined in the `values.yaml` file.

To deploy the service, run the following command within the `helm` folder:

```bash
helm template . | kubectl apply -f -
```

## Interacting with the Workload

### Verify Deployment

Check the deployment and service status:

```bash
kubectl get deployment
kubectl get service
```

### Port Forwarding

To access the service locally on port `8188`, forward the port of the service/deployment using the following commands. This assumes the service name is `dev-text2image-comfyui`:

The service exposes HTTP on port 80 (the deployment uses port 8188 by default).

```bash
kubectl port-forward services/dev-text2image-comfyui 8188:80
```

Now, you can access ComfyUI ([Manager](https://github.com/ltdrdata/ComfyUI-Manager) also included) at [http://localhost:8188](http://localhost:8188) using a web browser.
