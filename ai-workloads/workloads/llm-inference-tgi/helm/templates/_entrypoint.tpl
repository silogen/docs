{{- define "minio.setup" -}}
{{- $model := trimPrefix "s3://" .Values.model | trimSuffix "/" -}}
{{- $minioModel := printf "minio-host/%s" $model -}}
{{- $localModel := printf "/workload/%s" $model -}}
echo '--------------------------------------------'
echo 'Installing minio client'
echo '--------------------------------------------'
curl https://dl.min.io/client/mc/release/linux-amd64/mc \
      --create-dirs \
      -o /minio-binaries/mc
chmod +x /minio-binaries/mc
export PATH="${PATH}:/minio-binaries/"
mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY}
echo '--------------------------------------------'
echo 'Downloading the model to the local container'
echo '--------------------------------------------'
mc cp --recursive {{$minioModel -}}/ {{$localModel -}}/
{{- end -}}

{{- define "tgi.start" -}}
{{- $modelPath := .Values.model -}}
{{- if (hasPrefix "s3://" .Values.model) -}}
  {{- $modelPath = printf "/workload/%s" (trimPrefix "s3://" .Values.model | trimSuffix "/") -}}
{{- end -}}
echo '--------------------------------------------'
echo 'Starting TGI'
echo '--------------------------------------------'
cd /server
/tgi-entrypoint.sh \
{{- range $key, $value := .Values.tgi_engine_args }}
--{{ $key }}={{ tpl $value $ | quote }} \
{{- end }}
--model-id={{ $modelPath }} \
--num-shard={{ .Values.gpus }} \
--port=8080
{{- end -}}

{{ define "entrypoint" -}}
  {{- if (hasPrefix "s3://" .Values.model) -}}
    {{- include "minio.setup" . -}}
  {{- end }}
  {{- include "tgi.start" . -}}
{{- end -}}
