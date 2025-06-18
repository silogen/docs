{/* ####################################################################################################################################################### */}}
{{- define "downloadEntrypoint" -}}
# Setup MinIO, Download resources:
echo 'Copying resources to container...';
mc alias set minio-host $${BUCKET_STORAGE_HOST} $${BUCKET_STORAGE_ACCESS_KEY} $${BUCKET_STORAGE_SECRET_KEY}
mc cp --recursive \
  minio-host/{{ .Values.basemodel | trimSuffix "/" }}/ \
  /local_resources/basemodel
{{- if $.Values.trainingData }}
mc cp \
  minio-host/{{ $.Values.trainingData }} \
  /local_resources/{{ $.Values.trainingData | replace "/" "_" }}
{{- else }}
{{- range .Values.finetuning_config.data_conf.training_data.datasets }}
mc cp \
  minio-host/{{ .path }} \
  /local_resources/{{ .path | replace "/" "_" }}
{{- end }}
{{- if (or (eq .Values.finetuning_config.data_conf.validation_data.type "AUTO_SPLIT" ) (eq .Values.finetuning_config.data_conf.validation_data.type "NONE")) }}
{{- range .Values.finetuning_config.data_conf.validation_data.datasets }}
mc cp \
  minio-host/{{ .path }} \
  /local_resources/{{ .path | replace "/" "_" }}
{{- end }}
{{- end }}
{{- end }}
# Sync checkpoints from remote to local
if mc mirror minio-host/{{ .Values.checkpointsRemote | trimSuffix "/" }}/ /workdir/checkpoints 2>/dev/null; then
  echo 'Downloaded checkpoints from {{ .Values.checkpointsRemote}} to /workdir/checkpoints'
  ls -lah /workdir/checkpoints
else
  echo 'No checkpoints found yet'
fi
{{- end }}

{/* ####################################################################################################################################################### */}}
{{- define "finetuningAndUploadEntrypoint" -}}
{{- $logs_path := (default ( .Values.checkpointsRemote | trimSuffix "/" | printf "%s/logs/" ) .Values.logsRemote ) -}}
# Print GPU Info:
rocm-smi
echo "Starting checkpoint sync process"
mc mirror \
  --watch \
  /workdir/checkpoints \
  minio-host/{{ .Values.checkpointsRemote | trimSuffix "/" }}/ &
uploadPID=$!
# Run training:
{{- if .Values.runTensorboard }}
tensorboard --logdir /workdir/logs --port 6006 &
echo "Serving tensorboard on port 6006. Port-forward to access training logs during the training process lifetime."
echo "Also starting logs upload process, uploading to {{ $logs_path }}"
mc mirror \
  --watch \
  /workdir/logs \
  minio-host/{{ $logs_path }} &
logsPID=$!
{{- end }}
echo "Starting training process"
accelerate launch \
  --config_file /configs/accelerate_config.yaml \
  --no-python \
  finetuning --num-preprocess-workers 4 {{ .Values.finetuning_config.method }} /configs/finetuning_config.yaml
echo "Training done, stop the upload process"
kill $uploadPID
wait $uploadPID || true
{{- if .Values.runTensorboard }}
kill $logsPID
wait $logsPID || true
{{- end }}
# Post process:
echo "Running post-processing"
create_vllm_compatible_adapter --training-config /configs/finetuning_config.yaml ./checkpoints/checkpoint-final
{{- if (and .Values.mergeAdapter (not (eq .Values.finetuning_config.peft_conf.peft_type "NO_PEFT" ))) }}
merge_base=/local_resources/basemodel
if [ -d ./checkpoints/checkpoint-new-basemodel ]; then
  merge_base=./checkpoints/checkpoint-new-basemodel
fi
merge_adapter $merge_base ./checkpoints/checkpoint-final ./checkpoints/checkpoint-final-merged
{{- end }}
# Once more to ensure everything gets uploaded
echo 'Training done, syncing once more...'
mc mirror \
  /workdir/checkpoints \
  minio-host/{{ .Values.checkpointsRemote | trimSuffix "/" }}/
{{- if .Values.runTensorboard }}
mc mirror \
  /workdir/logs \
  minio-host/{{ $logs_path }}
{{- end }}
# Sync the final checkpoint with overwrite to carry over vLLM-compatibility changes
mc mirror \
  --overwrite \
  /workdir/checkpoints/checkpoint-final \
  minio-host/{{ .Values.checkpointsRemote | trimSuffix "/" }}/checkpoint-final/
echo 'All done, exiting'
{{- end }}
