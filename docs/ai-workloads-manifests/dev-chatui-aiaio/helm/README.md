# dev-chatui-aiaio Helm Chart

This Helm chart is used to deploy dev-chatui-aiaio workload, i.e. the [aiaio](https://github.com/abhishekkrthakur/aiaio) Chat UI.
It is a simple application, making it a good example of how to package an application as a workload.

## Installation

To install the chart with the release name `my-release`:

```sh
helm template my-release ./helm | kubectl apply -f -
```

## Configuration

The following table lists the configurable parameters of the `dev-chatui-aiaio` chart and their default values.

| Parameter                            | Description                        | Default                        |
|--------------------------------------|------------------------------------|--------------------------------|
| `image`                              | Image repository                   | `ghcr.io/silogen/aiaio:v20250221` |
| `image.pullPolicy`                   | Image pull policy                  | `Always`                       |
| `env_vars`                           | Environment variables              | `{}`                           |
| `storage.ephemeral.quantity`         | Ephemeral storage quantity         | `1Gi`                          |
| `storage.ephemeral.storageClassName` | Storage class name                 | `mlstorage`                    |
| `storage.ephemeral.accessModes`      | Access modes                       | `[ ReadWriteOnce ]`            |
| `storage.dshm.sizeLimit`             | Shared memory size limit           | `1Gi`                          |
| `deployment.port`                    | Deployment port                    | `9000`                         |
| `entrypoint`                         | Entrypoint command                 | `""`                           |

## Example

To deploy the chart with a custom values file `values_override.yaml`:

```sh
helm template my-release ./helm -f values_override.yaml | kubectl apply -f -
```
