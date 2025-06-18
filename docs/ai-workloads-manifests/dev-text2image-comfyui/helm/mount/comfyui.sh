export COMFYUI_PATH=/workload/ComfyUI

apt update && apt install -y git

git clone https://github.com/comfyanonymous/ComfyUI.git $COMFYUI_PATH
git clone https://github.com/ltdrdata/ComfyUI-Manager $COMFYUI_PATH/custom_nodes/comfyui-manager

pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/rocm6.2.4/
pip install -r $COMFYUI_PATH/requirements.txt
pip install -r $COMFYUI_PATH/custom_nodes/comfyui-manager/requirements.txt

curl -L https://huggingface.co/Comfy-Org/Lumina_Image_2.0_Repackaged/resolve/main/all_in_one/lumina_2.safetensors -o $COMFYUI_PATH/models/checkpoints/lumina_2.safetensors
# curl -L https://huggingface.co/Comfy-Org/flux1-dev/resolve/main/flux1-dev-fp8.safetensors -o $COMFYUI_PATH/models/checkpoints/flux1-dev-fp8.safetensors

python3 $COMFYUI_PATH/main.py --listen 0.0.0.0
