apt update && apt install -y jq

if ! curl -s ${OPENAI_API_BASE_URL}/models >/dev/null; then
    echo "The endpoint ${OPENAI_API_BASE_URL} is not accessible. Exiting..."
    exit 0
fi

OPENAI_API_BASE_URL=${OPENAI_API_BASE_URL%/}

MODEL=$(curl -s ${OPENAI_API_BASE_URL}/models | jq -r '.data[0].id')
OUTPATH=/workload/output
mkdir -p $OUTPATH

modelname=$(echo "${OPENAI_API_BASE_URL}_${MODEL}" | sed 's/[^a-zA-Z0-9]/_/g')
QPS="inf"
Req_In_Out=("1:2048:2048" "2:2048:2048" "4:2048:2048" "8:2048:2048" "16:2048:2048" "32:2048:2048" "64:2048:2048" "128:2048:2048" "256:2048:2048")
#Req_In_Out=("1:128:2048" "2:128:2048" "4:128:2048" "8:128:2048" "16:128:2048" "32:128:2048" "64:128:2048" "128:128:2048" "256:128:2048")
#Req_In_Out=("1:5000:500" "2:5000:500" "4:5000:500" "8:5000:500" "16:5000:500" "32:5000:500" "64:5000:500" "128:5000:500" "256:5000:500")

for req_in_out in "${Req_In_Out[@]}"; do
    con=$(echo "$req_in_out" | awk -F':' '{ print $1 }')
    inp=$(echo "$req_in_out" | awk -F':' '{ print $2 }')
    out=$(echo "$req_in_out" | awk -F':' '{ print $3 }')
    for qps in $QPS; do
        echo -e "\n\n=============================================>"
        echo "[INFO] req=256 inp=$inp out=$out con=$con qps=$qps"
        cmd="python /app/vllm/benchmarks/benchmark_serving.py \
            --backend openai-chat \
            --model \"$MODEL\" \
            --base-url $OPENAI_API_BASE_URL \
            --endpoint '/chat/completions' \
            --tokenizer \"$TOKENIZER\" \
            --dataset-name random \
            --num-prompts 256 \
            --random-input-len \"$inp\" \
            --random-output-len \"$out\" \
            --random-range-ratio 1.0 \
            --ignore-eos \
            --max-concurrency \"$con\" \
            --percentile-metrics ttft,tpot,itl,e2el \
            --save-result \
            --result-dir $OUTPATH \
            --result-filename \"${modelname}_req256_i${inp}_o${out}_c${con}_q${qps}.json\" \
            --request-rate \"$qps\""
        echo "[CMD] $cmd"
        eval "$cmd"
        echo -e "<=============================================\n\n"
    done
done

curl https://dl.min.io/client/mc/release/linux-amd64/mc --create-dirs -o /minio-binaries/mc
chmod +x /minio-binaries/mc
export PATH="${PATH}:/minio-binaries/"

mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY}
mc cp --recursive $OUTPATH minio-host/${BUCKET_RESULT_PATH}/
