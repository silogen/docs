# Tested wiht image: rocm/vllm-dev:20250205_aiter

# References:
# https://unsloth.ai/blog/deepseekr1-dynamic
# https://medium.com/@alexhe.amd/deploy-deepseek-r1-in-one-gpu-amd-instinct-mi300x-7a9abeb85f78

export TMPDIR=/tmp
bash /workload/mount/minio_download_bin.sh

# Check existing llama.cpp executables with specified ROCm architecture, or build if not found
if [ -d /workload/bin/$ROCM_ARCH ]; then
    cd /workload/bin/$ROCM_ARCH
else
    cd /workload &&
        bash /workload/mount/build_llamacpp.sh &&
        cd llama.cpp/build/bin/ || exit 1
fi

# Retrieve model from Hugging Face Hub and concatenate split GGUF files if necessary
export MODEL_TAG=$(echo $MODEL | tr '/:' '_')
if [ -f ${MODEL_TAG}.gguf ]; then
    echo "GGUF file already exists"
else
    python /workload/mount/download_model.py && bash /workload/mount/merge_bin.sh
fi

# serve the model
./llama-server \
    -m ${MODEL_TAG}.gguf \
    --host 0.0.0.0 \
    --port ${PORT:-8080} \
    --n-gpu-layers ${GPU_LAYERS:-62} \
    --threads ${NCPU:-4} \
    --prio 2 \
    --temp ${TEMP:-0.6} \
    --ctx-size ${CTX_SIZE:-4096}
