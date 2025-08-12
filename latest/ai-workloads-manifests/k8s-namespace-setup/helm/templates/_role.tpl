{{- define "namespace-setup.role" }}
{{- if .Values.role.setup }}
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: {{ .Values.role.name }}
rules:
{{- range .Values.role.rules }}
- apiGroups: {{ .apiGroups | toJson }}
  resources: {{ .resources | toJson }}
  verbs: {{ .verbs | toJson }}
{{- end }}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: {{ .Values.role.bindingName }}
subjects:
- kind: ServiceAccount
  name: default
roleRef:
  kind: Role
  name: {{ .Values.role.name }}
  apiGroup: rbac.authorization.k8s.io
---
{{- end }}
{{- end }}
