# Tested wiht image: rocm/vllm-dev:20250205_aiter

export TMPDIR=/workload
export PATH=$PATH:/usr/local/go/bin
export hip_DIR="$(hipconfig -R)"
export OLLAMA_HOST="0.0.0.0:8080"

#----------------------------------- prep
cd /workload
apt update && apt install -y git

curl -L https://go.dev/dl/go1.24.1.linux-amd64.tar.gz -o go1.24.1.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.24.1.linux-amd64.tar.gz

#----------------------------------- build
git clone https://github.com/ollama/ollama.git
cd ollama/
cmake -B build
cmake --build build -j ${NCPU:-4}


#----------------------------------- run
mkdir -p /workload/.ollama
ln -s /workload/.ollama /root/.ollama

go run . serve &

for i in {1..10}; do
    if go run . pull ${MODEL:-gemma3:4b}; then
        break
    fi
    echo "Retrying pulling model... ($i/10)"
    sleep 10
done

wait
