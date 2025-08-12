# Wait for vLLM server (localhost) to be ready
mkdir -p /workload/output
curl https://dl.min.io/client/mc/release/linux-amd64/mc -o /workload/mc
chmod +x /workload/mc
/workload/mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY}
/workload/mc mirror --watch /workload/output/ minio-host/${BUCKET_RESULT_PATH} &
MINIOPID=$! # Capture the PID of the mc mirror process

echo "vLLM server started with PID: $SERVER_PID"
ATTEMPT=0
while ! curl -s http://localhost:8000/v1/models >/dev/null; do
    ATTEMPT=$((ATTEMPT + 1))
    if [ $ATTEMPT -gt 30 ]; then
        echo "Server failed to start after 30 attempts"
        kill $SERVER_PID
        exit 1
    fi
    echo "Waiting for vLLM server to be ready..."
    sleep 20
done

apt update && apt install -y jq
echo "vLLM server is ready. Starting benchmark..."

MODEL=$(curl -s http://localhost:8000/v1/models | jq -r '.data[0].id')
OUTPATH=/workload/output/$(date +%Y%m%d%H%M)
mkdir -p $OUTPATH

modelname=$(echo $MODEL | awk -F'/' '{print $NF}' | sed 's/[^a-zA-Z0-9]/_/g')
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
        python3 /app/vllm/benchmarks/benchmark_serving.py \
            --backend vllm \
            --model "$MODEL" \
            --dataset-name random \
            --num-prompts 256 \
            --random-input-len "$inp" \
            --random-output-len "$out" \
            --random-range-ratio 1.0 \
            --ignore-eos \
            --max-concurrency "$con" \
            --port 8000 \
            --percentile-metrics ttft,tpot,itl,e2el \
            --save-result \
            --result-dir $OUTPATH \
            --result-filename "${modelname}_tp${NUM_GPUS}_req256_i${inp}_o${out}_c${con}_q${qps}.json" \
            --request-rate "$qps"
        echo -e "<=============================================\n\n"
    done
done

echo "Benchmarking completed"
kill $MINIOPID
wait $MINIOPID || true
/workload/mc mirror /workload/output/ minio-host/${BUCKET_RESULT_PATH}
echo "All data uploaded successfully"
