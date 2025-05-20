#!/bin/bash
###############################################################################
# This script is an adaptation of the example script provided in the
# ROCm/Megatron-LM repository for training a Llama-3 model
# https://github.com/ROCm/Megatron-LM/blob/rocm_dev/examples/llama/train_llama3.sh.
#
# Present adaptation is designed to accept arbitrary Megatron-LM arguments
# found in https://github.com/ROCm/Megatron-LM/blob/rocm_dev/megatron/training/arguments.py.
# It assumes Continuous Pretraining (CPT) use case, i.e., model architecture parameters
# are derived from the provided initial checkpoint.
#################################################################################

# Source the environment variables from the separate script
source ./set_env_vars.sh  # path in container

TIME_STAMP=$(date +"%Y-%m-%d_%H-%M-%S")
EXP_NAME="${EXP_NAME:-perf}"

TEE_OUTPUT="${TEE_OUTPUT:-1}"
NO_TORCH_COMPILE="${NO_TORCH_COMPILE:-1}"
NO_TRAINING="${NO_TRAINING:-0}" # NO_TRAINING=1: for computing metrics only
ENABLE_PROFILING="${ENABLE_PROFILING:-0}"
echo "NO_TRAINING=$NO_TRAINING"

GPUS_PER_NODE=`python3 -c "import torch; print(torch.cuda.device_count())"`
# Change for multinode config
MASTER_ADDR="${MASTER_ADDR:-localhost}"
MASTER_PORT="${MASTER_PORT:-23731}"
NNODES="${NNODES:-1}"
NODE_RANK="${NODE_RANK:-0}"
WORLD_SIZE=$(($GPUS_PER_NODE*$NNODES))

MODEL_SIZE=8
TP="${TP:-8}"
PP="${PP:-1}"
PP_VP="${PP_VP:-"None"}"
CP="${CP:-1}"
MBS="${MBS:-2}"
BS="${BS:-8}"
SEQ_LENGTH="${SEQ_LENGTH:-2048}"
TOTAL_ITERS="${TOTAL_ITERS:-20}"
SEQ_PARALLEL="${SEQ_PARALLEL:-1}"
CONTI_PARAMS="${CONTI_PARAMS:-0}"
OPTIMIZER="${OPTIMIZER:-sgd}"
FSDP="${FSDP:-0}"
ROPE_FUSION="${ROPE_FUSION:-1}" # 1: use rope-fusion, 0: no rope-fusion
USE_FLASH_ATTN="${USE_FLASH_ATTN:-1}"
TE_FP8="${TE_FP8:-1}"
GEMM_TUNING="${GEMM_TUNING:-1}"
MOCK_DATA="${MOCK_DATA:-1}"

EXPERIMENT_DIR="experiment"
mkdir -p $EXPERIMENT_DIR

DATA_PATH="${DATA_PATH:-../megatron_lm_cookbook/fineweb-edu/fineweb-edu-train_text_document}"
TOKENIZER_MODEL="${TOKENIZER_MODEL:-../megatron_lm_cookbook/llama/tokenizers/Llama-3.1-8B}"

MAX_POSITION_EMBEDDINGS=128000

DEFAULT_LOG_DIR="${EXPERIMENT_DIR}/${NNODES}nodes_rank${NODE_RANK}_train_${MODEL_SIZE}B_mbs${MBS}_bs${BS}_tp${TP}_pp${PP}_cp${CP}_iter${TOTAL_ITERS}/nocompile${NO_TORCH_COMPILE}_TE_FP8_${TE_FP8}/${TIME_STAMP}"
LOG_DIR="${LOG_DIR:-${DEFAULT_LOG_DIR}}"
TRAIN_LOG="${LOG_DIR}/output_${EXP_NAME}.log"
mkdir -p $LOG_DIR
echo $TRAIN_LOG

if [ "$GEMM_TUNING" -eq 1 ]; then
    export TE_HIPBLASLT_TUNING_RUN_COUNT=10
    export TE_HIPBLASLT_TUNING_ALGO_COUNT=50
fi

if [ "$TP" > 1 ]; then
    echo "When using MoE and tensor parallelism, sequence parallelism must be used. Setting SEQ_PARALLEL=1."
    SEQ_PARALLEL=1
fi

if [ "$SEQ_LENGTH" -le 8192 ]; then
    ds_works=8
else
    ds_works=24
fi

PROFILING_DIR="${LOG_DIR}/trace_${EXP_NAME}"

GPT_ARGS="
    --tensor-model-parallel-size ${TP} \
    --pipeline-model-parallel-size ${PP} \
    --context-parallel-size ${CP} \
    --seq-length $SEQ_LENGTH \
    --max-position-embeddings $MAX_POSITION_EMBEDDINGS \
    --micro-batch-size $MBS \
    --global-batch-size $BS \
    --train-iters $TOTAL_ITERS \
    --no-async-tensor-model-parallel-allreduce \
    --bf16 \
    --no-masked-softmax-fusion
"

if [ "$PP_VP" != "None" ]; then
    GPT_ARGS="$GPT_ARGS --num-layers-per-virtual-pipeline-stage ${PP_VP}"
fi

if [ "$ROPE_FUSION" -eq 0 ]; then
    GPT_ARGS="$GPT_ARGS --no-rope-fusion"
fi

TRAIN_ARGS="--lr 1e-4 \
        --min-lr 1e-5 \
        --lr-decay-iters 320000 \
        --lr-decay-style cosine \
        --weight-decay 1.0e-1 \
        --clip-grad 1.0 \
        --optimizer ${OPTIMIZER} \
"

if [ "$OPTIMIZER" == "adam" ]; then
    TRAIN_ARGS="$TRAIN_ARGS --adam-beta1 0.9 \
        --adam-beta2 0.95 \
        "
fi

DATA_ARGS="
    --tokenizer-type HuggingFaceTokenizer \
    --tokenizer-model ${TOKENIZER_MODEL} \
    --dataloader-type cyclic \
    --num-workers $ds_works \
"

if [ "$MOCK_DATA" -eq 1 ]; then
    echo Using mock data.
    DATA_ARGS="$DATA_ARGS --mock-data"
else
    echo Using data from $DATA_PATH
    DATA_ARGS="$DATA_ARGS --data-path $DATA_PATH"
fi

LOG_INTERVAL="${LOG_INTERVAL:-1}"
EVAL_ITERS="${EVAL_ITERS:-"-1"}"

OUTPUT_ARGS="
    --log-interval $LOG_INTERVAL \
    --log-throughput \
    --no-save-optim \
    --no-save-rng \
    --eval-iters $EVAL_ITERS \
    --tensorboard-dir $LOG_DIR
"

DISTRIBUTED_ARGS="
    --nproc_per_node $GPUS_PER_NODE \
    --nnodes $NNODES \
    --node_rank $NODE_RANK \
    --master_addr $MASTER_ADDR \
    --master_port $MASTER_PORT \
"

CKPT_LOAD_ARGS="--exit-on-missing-checkpoint \
        --no-load-optim \
        --use-checkpoint-args \
        --no-load-rng"

EXTRA_ARGS="
    --no-gradient-accumulation-fusion \
    --distributed-timeout-minutes 120 \
    --overlap-grad-reduce \
"

if [ "$FSDP" -eq 1 ]; then
    EXTRA_ARGS="$EXTRA_ARGS --use-torch-fsdp2"
    echo "--use-torch-fsdp2 requires --ckpt-format torch_dist. Setting --ckpt-format to torch_dist."
    CKPT_FORMAT="torch_dist"
    if [ "$SEQ_PARALLEL" -eq 1 ]; then
        echo "Warning: Sequence Parallelism and FSDP2 have conflicting CUDA_MAX_CONNECTIONS requirements. It is recommended not to use them together."
        echo "FSDP2 and sequence parallel are on. Disabling sequence parallel."
        SEQ_PARALLEL=0
    fi
else
    if [ "$OPTIMIZER" == "adam" ]; then
        EXTRA_ARGS="$EXTRA_ARGS --use-distributed-optimizer --overlap-param-gather"
    fi
fi

# Treat saving checkpoint is indicative of a more detailed output intent
EVAL_INTERVAL="${EVAL_INTERVAL:-320000}"
SAVE_INTERVAL="${SAVE_INTERVAL:-200000}"
CKPT_FORMAT="${CKPT_FORMAT:-torch}"
SAVE_CKPT_PATH="${SAVE_CKPT_PATH:-None}"

if [ "$SAVE_CKPT_PATH" != "None" ]; then
    OUTPUT_ARGS="$OUTPUT_ARGS \
        --save-interval $SAVE_INTERVAL \
        --eval-interval $EVAL_INTERVAL \
        --ckpt-format $CKPT_FORMAT \
        --save $SAVE_CKPT_PATH
    "
fi

if [ "$ENABLE_PROFILING" -eq 1 ]; then
    EXTRA_ARGS="$EXTRA_ARGS --profile --use-pytorch-profiler"
fi

if [ "$USE_FLASH_ATTN" -eq 1 ]; then
EXTRA_ARGS="$EXTRA_ARGS --use-flash-attn"
fi

if [ "$SEQ_PARALLEL" -eq 1 ]; then
    EXTRA_ARGS="$EXTRA_ARGS --sequence-parallel"
fi

if [ "$CONTI_PARAMS" -eq 1 ]; then
    EXTRA_ARGS="$EXTRA_ARGS --use-contiguous-parameters-in-local-ddp"
fi

if [ "$TE_FP8" -eq 1 ]; then
    EXTRA_ARGS="$EXTRA_ARGS \
        --fp8-margin=0 \
        --fp8-format=hybrid \
        --fp8-interval=1 \
        --fp8-amax-history-len=1024 \
        --fp8-amax-compute-algo=max \
        --attention-softmax-in-fp32 \
    "
fi

# Add checkpoint path to allow continued training
LOAD_CKPT_PATH="${LOAD_CKPT_PATH:-None}"

if [ "$LOAD_CKPT_PATH" != "None" ]; then
    CKPT_LOAD_ARGS="$CKPT_LOAD_ARGS --load ${LOAD_CKPT_PATH}"
else
    CKPT_LOAD_ARGS=""
fi

run_cmd="
    torchrun $DISTRIBUTED_ARGS pretrain_gpt.py \
        $GPT_ARGS \
        $DATA_ARGS \
        $OUTPUT_ARGS \
        $EXTRA_ARGS \
        $TRAIN_ARGS \
        $CKPT_LOAD_ARGS \
        $@
"

if [ "$TEE_OUTPUT" -eq 0 ]; then
    run_cmd="$run_cmd >& $TRAIN_LOG"
else
    run_cmd="$run_cmd |& tee $TRAIN_LOG"
fi

if [ "$NO_TRAINING" -eq 0 ]; then
    eval $run_cmd
fi

# Create a Python script to process log values and compute mean
echo 'import argparse
import numpy as np

if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog="Process Log")
    parser.add_argument("filename")
    args = parser.parse_args()

    try:
        data = np.loadtxt(args.filename)
        if data.size == 0:
            print("NaN")
        else:
            print(f"{np.mean(data):.8g}")
    except Exception:
        print("NaN")' > mean_log_value.py

# Extract throughput per GPU
grep -Eo 'throughput per GPU [^|]*' "$TRAIN_LOG" | sed -E 's/.*throughput per GPU \(TFLOP\/s\/GPU\): ([0-9\.]+).*/\1/' > tmp.txt
PERFORMANCE=$(python3 mean_log_value.py tmp.txt)
echo "throughput per GPU: $PERFORMANCE" |& tee -a "$TRAIN_LOG"
rm tmp.txt

# Extract elapsed time per iteration
grep -Eo 'elapsed time per iteration [^|]*' "$TRAIN_LOG" | sed -E 's/.*elapsed time per iteration \(ms\): ([0-9\.]+).*/\1/' > tmp.txt
ETPI=$(python3 mean_log_value.py tmp.txt)
echo "elapsed time per iteration: $ETPI" |& tee -a "$TRAIN_LOG"

# Compute tokens per GPU per second (TGS), avoiding division by zero
TIME_PER_ITER=$(python3 mean_log_value.py tmp.txt)
if [[ "$TIME_PER_ITER" == "NaN" || "$TIME_PER_ITER" == "0" ]]; then
    TGS="NaN"
else
    TGS=$(awk -v bs="$BS" -v sl="$SEQ_LENGTH" -v tpi="$TIME_PER_ITER" -v ws="$WORLD_SIZE" 'BEGIN {if (tpi > 0) printf "%.6f", bs * sl * 1000 / (tpi * ws); else print "NaN"}')
fi
echo "tokens/GPU/s: $TGS" |& tee -a "$TRAIN_LOG"
rm tmp.txt

# Extract memory usage
grep -Eo 'mem usages: [^|]*' "$TRAIN_LOG" | sed -E 's/.*mem usages: ([0-9\.]+).*/\1/' > tmp.txt
MEMUSAGE=$(python3 mean_log_value.py tmp.txt)
echo "mem usages: $MEMUSAGE" |& tee -a "$TRAIN_LOG"
rm tmp.txt


NUM_GROUPS=$((NNODES - 1))

if [[ $NODE_RANK -eq $NUM_GROUPS ]]; then
    # Define CSV output path
    CSV_PATH="../llama_runs.csv"  # Ensure all output is logged here

    # Define a fixed-width format string for terminal output
    FORMAT="%-15s %-7s %-12s %-8s %-5s %-5s %-3s %-3s %-6s %-3s %-18s %-15s %-12s %-10s\n"

    # Print well-aligned terminal output
    printf "$FORMAT" "EXP_NAME" "#Nodes" "Model_SIZE" "Seq_Len" "MBS" "BS" "TP" "PP" "PP_VP" "CP" "Tokens/Sec/GPU" "TFLOPs/s/GPU" "Memory Usage" "Time/iter"
    printf "$FORMAT" "$EXP_NAME" "$NNODES" "$MODEL_SIZE" "$SEQ_LENGTH" "$MBS" "$BS" "$TP" "$PP" "$PP_VP" "$CP" "$TGS" "$PERFORMANCE" "$MEMUSAGE" "$ETPI"

    # Ensure the CSV header is written only once
    if [ ! -f "$CSV_PATH" ]; then
        echo -e "EXP_NAME\t#Nodes\tModel_SIZE\tSeq_Len\tMBS\tBS\tTP\tPP\tPP_VP\tCP\tTokens/Sec/GPU\tTFLOPs/s/GPU\tMemory Usage\tTime/iter" >> "$CSV_PATH"
    fi

    # Append the result to the CSV file
    echo -e "${EXP_NAME}\t$NNODES\t$MODEL_SIZE\t$SEQ_LENGTH\t$MBS\t$BS\t$TP\t$PP\t$PP_VP\t$CP\t$TGS\t$PERFORMANCE\t$MEMUSAGE\t$ETPI" >> "$CSV_PATH"

else
    echo "Not the final node; check the output from another node!"
    exit 1
fi
