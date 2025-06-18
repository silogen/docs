import os

from huggingface_hub import snapshot_download

repo_id, model = os.getenv("MODEL", "unsloth/DeepSeek-R1-GGUF:DeepSeek-R1-UD-IQ1_M").split(":")
snapshot_download(
    repo_id=repo_id,
    local_dir=".",
    allow_patterns=[f"*{model}*"],
)
