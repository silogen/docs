# Service discovery section
{{- define "env.openai_api_base_urls" -}}
{{- $current_namespace := .Release.Namespace }}
{{- $services := lookup "v1" "Service" $current_namespace "" }}
{{- $openai_api_base_urls := "" }}
{{- if $services }}
  {{- range $index, $service := $services.items }}
    {{- if hasPrefix "llm-inference" $service.metadata.name }}
        {{- $namespace := $service.metadata.namespace }}
        {{- $name :=  $service.metadata.name }}
        {{- $openai_api_base_url := print "http://" $name "." $namespace ".svc.cluster.local/v1" }}
        {{- $openai_api_base_url_simple := print "http://" $name "/v1" }}
        {{- $openai_api_base_urls = print $openai_api_base_urls $openai_api_base_url_simple ";" }}
    {{- end }}
  {{- end }}
{{- end }}
{{- $openai_api_base_urls }}
{{- end }}
