# Tested wiht image: rocm/vllm-dev:20250205_aiter

export WORKPATH=/workload

mkdir -p $WORKPATH/bin
mkdir -p $WORKPATH/models

export PATH=$PATH:${WORKPATH}/bin
export OUTPATH=$WORKPATH/output/$(date +%Y%m%d%H%M)
export NUM_GPUS=$(rocm-smi -a --csv | grep ^card | wc -l)

# get minio
curl https://dl.min.io/client/mc/release/linux-amd64/mc -o $WORKPATH/bin/mc
chmod +x $WORKPATH/bin/mc
mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY}

# Start a background process that watches for changes and uploads them
mc mirror --watch $WORKPATH/output/ minio-host/${BUCKET_RESULT_PATH} &
MINIOPID=$!

bash $WORKPATH/mount/minio_download_models.sh

if [ $USE_MAD != "false" ]; then
    # run ROCm/MAD benchmarking
    git clone https://github.com/ROCm/MAD.git $WORKPATH/MAD &&
        env -C $WORKPATH/MAD/scripts/vllm \
            bash $WORKPATH/mount/run_mad_standalone.sh
fi

if [ $USE_SCENARIO != "false" ]; then
    # run scenario-based vLLM benchmarking
    if [ $TESTOPT == "throughput" ]; then
        export TOOL="/app/vllm/benchmarks/benchmark_throughput.py"
        export SCENARIO=$WORKPATH/mount/scenarios_throughput.csv

    elif [ $TESTOPT == "latency" ]; then
        export TOOL="/app/vllm/benchmarks/benchmark_latency.py"
        export SCENARIO=$WORKPATH/mount/scenarios_latency.csv
    fi

    MODEL_ROOT=$WORKPATH/models \
        python $WORKPATH/mount/vllm_benchmark.py \
        --tool $TOOL \
        --scenario-file $SCENARIO \
        --result-dir $OUTPATH
fi

echo -e "\n\n==========\n"
find $OUTPATH -name "*.csv" | xargs tail -n +1

echo 'Benchmarking completed'
kill $MINIOPID
wait $MINIOPID || true

# Run a final mirror command to ensure all data is uploaded
mc mirror $WORKPATH/output/ minio-host/${BUCKET_RESULT_PATH}
echo 'All data uploaded successfully'
