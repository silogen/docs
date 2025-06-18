# Open WebUI for LLM Services

This Helm Chart deploys a WebUI for aggregating deployed LLM services within the cluster.

## Deploying the Workload

The basic configurations for deployment are defined in the `values.yaml` file.

To deploy the service, execute the following command from the Helm folder:

```bash
helm template <release-name> . | kubectl apply -f -
```

## Automatic Discovery and Health Checks for LLM Services

OpenAI-compatible endpoints can by specified by the user through the `env_vars.OPENAI_API_BASE_URLS` environment variable. Additionally, service discovery is used to include all OpenAI-compatible LLM inference
services running in the same namespace.
#### Client-Side Service Discovery (Optional)

Client-side discovery can be performed using the `--dry-run=server` flag:

```bash
helm template <release-name> . --dry-run=server | kubectl apply -f -
```

For a service to be included in `OPENAI_API_BASE_URLS_AUTODISCOVERY` during client-side discovery:
- The service must be running in the same namespace.
- The service name must start with `llm-inference-`.

#### Server-Side Service Discovery

The system performs server-side discovery of LLM inference services automatically. For a service to be included, the following conditions must be met:
- The service must be running in the same namespace.
- The service name must start with `llm-inference-`.
- The pod's service account must have the necessary permissions to check running services in the namespace (configured via role-binding).

#### Health Checks and Filtering

Before finalizing `OPENAI_API_BASE_URLS` and starting the service, the URLs specified by the user and the auto-discovered services are merged, and filtered based on a health check.

For a service to be included in the final `OPENAI_API_BASE_URLS`:
- The service must respond successfully to the `/v1/models` endpoint with an HTTP status code of 200.

The final `OPENAI_API_BASE_URLS` determines what services/models are included in Open WebUI interface.
