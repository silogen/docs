{{- define "namespace-setup.external-secret" }}
{{- if .Values.external_secret.setup }}
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: {{ .Values.external_secret.external_secret_name }}
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: {{ .Values.external_secret.src.secret_store_name }}
    kind: ClusterSecretStore
  target:
    name: {{ .Values.external_secret.dest.k8s_secret_name }}
  data:
    - secretKey: {{ .Values.external_secret.dest.access_key_name }}
      remoteRef:
        key: {{ .Values.external_secret.src.remote_secret_name }}
        property: {{ .Values.external_secret.src.access_key_name }}
    - secretKey: {{ .Values.external_secret.dest.secret_key_name }}
      remoteRef:
        key: {{ .Values.external_secret.src.remote_secret_name }}
        property: {{ .Values.external_secret.src.secret_key_name }}
---
{{- end }}
{{- end }}
