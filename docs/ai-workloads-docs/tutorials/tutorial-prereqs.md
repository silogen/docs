# Tutorial 0: Prerequisites for running the tutorials

## Required program installs

Programs that are used in this tutorial:

* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

* [helm](https://helm.sh/docs/intro/install/)

* [k9s](https://k9scli.io/topics/install/)

* [jq](https://jqlang.org/download/)

* [curl](https://everything.curl.dev/install/index.html)

At least curl and often jq too are commonly installed in many distributions out of the box.

## Namespace setup
In order to run the workloads you need to have a Kubernetes cluster with sufficient resources configured. This includes storage, secrets, namespace and HuggingFace token. These should be installed and configured as part of the installation process, but if this is not the case you can use the following command to set up these. The command does the following:

* Adds a namespace, where we will conduct all our work. We will setup the `silo-tutorial` namespace, but this also works in the default namespace in your cluster.

* Adds an External Secret to get the credentials to access the MinIO storage from our namespace.

    - This depends on a ClusterSecretStore called `k8s-secret-store` being already setup by a cluster admin, and the MinIO API credentials being secret there.
    The cluster should have these by default.

* Adds a LocalQueue so that our Jobs schedule intelligently.

    - This references the ClusterQueue `kaiwo` which should already be setup by a cluster admin.

We will use the helm chart in `workloads/k8s-namespace-setup/helm` and the overrides in `workloads/k8s-namespace-setup/helm/overrides/`.

This first creates a new namespace and sets the current context to use it from now on:
```bash
kubectl create namespace "silo-tutorial"
kubectl config set-context --current --namespace silo-tutorial
helm template workloads/k8s-namespace-setup/helm \
  --values workloads/k8s-namespace-setup/helm/overrides/tutorial-prereqs-local-queue.yaml \
  --values workloads/k8s-namespace-setup/helm/overrides/tutorial-prereqs-storage-access-external-secret.yaml \
  | kubectl apply -f -
```

- HuggingFace token: In addition to running the command above you also need to add your HF Token as a secret called `hf-token` with the key `hf-token` in your namespace.


## Monitoring progress, logs, and GPU utilization with k9s

We're interested to see a progress bar of the finetuning training, seeing any messages that a workload logs, and we also want to verify that our GPU Jobs
are consuming our compute relatively effectively. This information can be fetched from our Kubernetes cluster in many ways, but one convenient and recommended way us using [k9s](https://k9scli.io/).
We recommend the official documentation for more thorough guidance, but this section shows some basic commands to get what we want here.

To get right to the Jobs view in the namespace we're using in this walk-through, we can run:

```bash
k9s --command Jobs
```

Choose a Job using `arrow keys` and `Enter` to see the Pod that it spawned, then `Enter` again to see the Container in the Pod. From here, we can do three things:

* Look at the logs by pressing `l`. The logs show any output messages produced during the workload runtime.

* Attach to the output of the container by pressing `a`. This is particularly useful to see the interactive progress bar of a finetuning run.

* Spawn a shell inside the container by pressing `s`. Inside the shell we can run `watch -n0.5 rocm-smi` to get a view of the GPU utilization that updates every 0.5s.

Return from any regular `k9s` view with `Esc` .
