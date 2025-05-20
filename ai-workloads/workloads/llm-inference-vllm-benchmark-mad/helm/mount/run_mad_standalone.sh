echo "Running benchmark for model $MAD_MODEL"
echo $(pwd)

bash vllm_benchmark_report.sh \
    -s $TESTOPT \
    -m $MAD_MODEL \
    -g $NUM_GPUS \
    -d $MAD_DTYPE

mkdir -p $OUTPATH
rocminfo >$OUTPATH/rocminfo.txt
cp -r ./reports_* $OUTPATH/

echo "========================"
echo "# Benchmark results with the ID format: model _ tp (tensor-parallel-size) _ batch_size _ input_len _ output_len _ dtype"
cat ../perf_*.csv | tee $OUTPATH/perf_results.csv
