# List all GGUF files
echo "Listing all GGUF files in the current directory:"
GGUF_FILES=$(find . -name "*.gguf")
echo "$GGUF_FILES"

# Count GGUF files
MODEL_COUNT=$(echo "$GGUF_FILES" | wc -l)

# Check for split model (with 00001-of pattern)
SPLIT_MODEL=$(find . -name "*00001-of-*.gguf" | head -1)

if [ "$MODEL_COUNT" -eq 1 ] && [ -n "$GGUF_FILES" ]; then
    # Only one GGUF file exists
    echo "Found single model file: $GGUF_FILES. Creating link..."
    ln -sf "$GGUF_FILES" "${MODEL_TAG}.gguf"
elif [ -n "$SPLIT_MODEL" ]; then
    # Model is split, merge it
    echo "Found split model file: $SPLIT_MODEL. Merging..."
    ./llama-gguf-split --merge "$SPLIT_MODEL" "${MODEL_TAG}.gguf"
else
    echo "Either no suitable GGUF model file found or multiple files exist that cannot be merged!"
    exit 1
fi
