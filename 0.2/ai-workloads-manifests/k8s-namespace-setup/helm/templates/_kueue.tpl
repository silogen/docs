{{- define "namespace-setup.kueue" }}
{{- if .Values.kueue.setup }}
apiVersion: kueue.x-k8s.io/v1beta1
kind: LocalQueue
metadata:
  name: kaiwo
spec:
  clusterQueue: {{ .Values.kueue.cluster_queue_name }}
---
{{- end }}
{{- end }}
