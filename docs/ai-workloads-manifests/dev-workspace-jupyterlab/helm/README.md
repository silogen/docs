# JupyterLab Workload

This workload deploys a basic JupyterLab environment on top of any image with Python (pip) pre-installed. It is ideal for interactive development sessions and experimentation with other workloads.

## Configuration Parameters

You can configure the following parameters in the `values.yaml` file or override them via the command line:

| Parameter              | Description                                                                 | Default                                                                 |
|------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `image`                | Container image repository and tag                                          | `rocm/pytorch:rocm6.4_ubuntu24.04_py3.12_pytorch_release_2.6.0`         |
| `imagePullPolicy`      | Image pull policy                                                           | `Always`                                                                |
| `gpus`                 | Number of GPUs to allocate (set to 0 for CPU-only mode)                     | `1`                                                                     |
| `memory_per_gpu`       | Memory allocated per GPU (in Gi)                                            | `128`                                                                   |
| `cpu_per_gpu`          | CPU cores allocated per GPU                                                 | `4`                                                                     |
| `storage.ephemeral`    | Ephemeral storage configuration                                             | `128Gi`, `mlstorage`, `ReadWriteOnce`                                   |
| `deployment.ports.http`| HTTP port exposed by the service                                            | `8080`                                                                  |
| `entrypoint`           | Custom entrypoint script                                                    | See `values.yaml` for details                                           |

For more details see the `values.yaml` file.

## Deploying the Workload

To deploy the chart with the release name `example`, run the following command from the `helm/` directory:

```bash
helm template example . | kubectl apply -f -
```

**Note**: If you set the `gpus` value greater than 0, ensure you specify a GPU-capable image to utilize the allocated resources properly.

## Accessing the Workload Locally

To access JupyterLab locally, forward the service port to your machine:

```bash
kubectl port-forward services/dev-workspace-jupyterlab-example 8080:80
```

Then, open your browser and navigate to `http://localhost:8080`.

## Accessing the Workload via URL

To access the workload through a URL, you can enable either an Ingress or HTTPRoute in the `values.yaml` file. The following parameters are available:

| Parameter              | Description                                                                 | Default                                                                 |
|------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `ingress.enabled`      | Enable Ingress resource                                                     | `false`                                                                 |
| `httproute.enabled`    | Enable HTTPRoute resource                                                   | `false`                                                                 |

See the corresponding template files in the `templates/` directory. For more details on configuring Ingress or HTTPRoute, refer to the [Ingress documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/) and [HTTPRoute documentation](https://kubernetes-sigs.github.io/gateway-api/v0.5.0/httproute/), or documentation of the particular gateway implementation you may use, like [KGateway](https://kgateway.dev/). Check with your cluster administrator for the correct configuration for your environment.
