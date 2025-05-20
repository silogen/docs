#!/bin/bash

set -eu

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <tokenizer_hf_id>"
  echo "<tokenizer_hf_id>: Huggingface model id that has Huggingface tokenizer files: special_tokens_map.json, tokenizer.json, tokenizer_config.json"
  echo "Example: $0 NousResearch/Meta-Llama-3.1-8B"
  exit 1
fi
echo "Running data and tokenizer download with the following parameters:"
echo "tokenizer_hf_id: $1"

# Parameters
tokenizer_hf_id="$1"

echo "Downloading tokenizer..."
huggingface-cli download "$tokenizer_hf_id" \
            special_tokens_map.json tokenizer.json tokenizer_config.json \
            --local-dir /downloads/tokenizer/"$tokenizer_hf_id"

echo "Downloading dataset..."
python /scripts/download_data.py --target-dir /downloads/tmp
