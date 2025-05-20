apt update && apt install -y jq
pip install guidellm

mkdir -p /workload/output
curl https://dl.min.io/client/mc/release/linux-amd64/mc -o /workload/mc
chmod +x /workload/mc
/workload/mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY}
/workload/mc mirror --watch /workload/output/ minio-host/${BUCKET_RESULT_PATH} &
MINIOPID=$!

OPENAI_API_BASE_URL=${OPENAI_API_BASE_URL%/}
MODEL=$(curl -s ${OPENAI_API_BASE_URL}/models | jq -r '.data[0].id')

OUTPATH=/workload/output/$(date +%Y%m%d%H%M)
mkdir -p $OUTPATH

modelname=$(echo "${OPENAI_API_BASE_URL}_${MODEL}" | sed 's/[^a-zA-Z0-9]/_/g')

echo -e "Starting GuideLLM benchmarking.\n==========================>"
guidellm benchmark --target $OPENAI_API_BASE_URL \
    --model $MODEL \
    --processor $TOKENIZER \
    --rate-type sweep \
    --data "prompt_tokens=512,output_tokens=128" \
    --output-path "${OUTPATH}/${modelname}.guidellm.json" \
    --disable-progress || echo "GuideLLM exit!"

echo -e "<==========================\nBenchmarking completed"
kill $MINIOPID
wait $MINIOPID || true
/workload/mc mirror /workload/output/ minio-host/${BUCKET_RESULT_PATH}
echo "All data uploaded successfully"
