<!--
Copyright © Advanced Micro Devices, Inc., or its affiliates.

SPDX-License-Identifier: MIT
-->

---
tags:
  - AMD Resource Manager
  - projects
  - workloads
---
# Accessing the Cluster

## Constructing the kubeconfig file
Once a cluster has been installed with Cluster Forge, the kubeconfig file required to access the cluster can be constructed using the template below.
First you need to obtain the following information from the Platform Administrator:
- The API server URL of the cluster (typically `https://k8s.&lt;domain provided during installation&gt;:9443`)
- The keycloak server URL for the application (typically `https://kc.&lt;domain provided during installation&gt;/realms/airm`)
- The client secret for the OIDC client
  - This can be obtained by logging into keycloak (`https://keycloak.&lt;domain provided during installation&gt;/admin/airm/console/`) and navigating to the `Clients` section, selecting the `k8s` client, and then going to the `Credentials` tab and copying the `Client Secret`.

Once you have this information, you can create a kubeconfig file using the following template. Replace the placeholders with the actual values obtained from the Platform Administrator.

```yaml
apiVersion: v1
clusters:
- cluster:
    insecure-skip-tls-verify: true
    server: <kube api server url here>
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      args:
      - oidc-login
      - get-token
      - --oidc-issuer-url=<keycloak server url here>
      - --oidc-client-id=k8s
      - --oidc-client-secret=<client secret here>
      command: kubectl
      env: null
      interactiveMode: IfAvailable
      provideClusterInfo: false
```

Save the file at a secure location on your local machine, for example as `~/.kube/config`.

## Logging in via kubectl
Once you have created the kubeconfig file, install the oidc plugin (https://github.com/int128/kubelogin) to ensure that kubectl can use the OIDC authentication method.
Once you've done this, you can use `kubectl`, `k9s`, or any other command line client to access the cluster.
If you are restricted to one or more namespaces, please make sure to include the namespace you have access to in your commands, for example:
```bash
kubectl get pods -n &lt;namespace&gt;
```
