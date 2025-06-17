# k8s-namespace-setup

A Helm chart for setting up Kubernetes namespaces. This chart allows you to configure the following components in a namespace:

- **External Secrets**: Pull in secrets from within or outside the cluster, such as bucket storage credentials or Hugging Face tokens.
- **Kueue**: Set up a local queue for Kueue in the namespace to submit jobs.
- **Role / Role Binding**: Configure permissions for service accounts, like the default service account, to access the Kubernetes API from within a container.

If you are not sure if you need any of these, then this workload is probably not needed for you.

## Installation

To apply a configuration to the active namespace, use:

```sh
helm template . -f overrides/rename-secret-names.yaml | kubectl apply -f -
```

To specify a different namespace:

```sh
helm template . -f overrides/rename-secret-names.yaml | kubectl apply -n <namespace> -f -
```

Control which components to set up using command line parameters:

```sh
helm template . --set kueue.setup=true --set role.setup=true | kubectl apply -f -
```

## Configuration

The following table lists the configurable parameters of the `k8s-namespace-setup` chart and their default values.

### External Secret

| Parameter                                      | Description                                      | Default                        |
|------------------------------------------------|--------------------------------------------------|--------------------------------|
| `external_secret.setup`                        | Enable external secret                           | `false`                        |
| `external_secret.external_secret_name`         | External secret name                             | `minio-credentials-fetcher`    |
| `external_secret.src.secret_store_name`        | Secret store name                                | `k8s-secret-store`             |
| `external_secret.src.remote_secret_name`       | Remote secret name                               | `default-user`                 |
| `external_secret.src.access_key_name`          | Access key name                                  | `API_ACCESS_KEY`               |
| `external_secret.src.secret_key_name`          | Secret key name                                  | `API_SECRET_KEY`               |
| `external_secret.dest.k8s_secret_name`         | Kubernetes secret name                           | `minio-credentials`            |
| `external_secret.dest.access_key_name`         | Kubernetes access key name                       | `minio-access-key`             |
| `external_secret.dest.secret_key_name`         | Kubernetes secret key name                       | `minio-secret-key`             |

### Kueue

| Parameter                                      | Description                                      | Default                        |
|------------------------------------------------|--------------------------------------------------|--------------------------------|
| `kueue.setup`                                  | Enable kueue                                     | `false`                        |
| `kueue.cluster_queue_name`                     | Cluster queue name                               | `kaiwo`                        |

### Roles

| Parameter                                      | Description                                      | Default                        |
|------------------------------------------------|--------------------------------------------------|--------------------------------|
| `role.setup`                                   | Enable roles setup                               | `false`                        |
| `role.name`                                    | Role name                                        | `default-role`                 |
| `role.bindingName`                             | Role binding name                                | `default-role-binding`         |
| `role.rules`                                   | Role rules                                       | See `values.yaml`              |
