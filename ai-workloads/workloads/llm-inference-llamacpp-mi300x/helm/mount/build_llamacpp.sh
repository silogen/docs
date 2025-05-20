rm -rf llama.cpp &&
    git clone https://github.com/ggerganov/llama.cpp.git &&
    cd llama.cpp &&
    HIPCXX="$(hipconfig -l)/clang" \
    HIP_PATH="$(hipconfig -R)" \
        cmake -S . \
        -B build \
        -DGGML_HIP=ON \
        -DAMDGPU_TARGETS=${ROCM_ARCH:-gfx942} \
        -DCMAKE_BUILD_TYPE=Release \
        -DLLAMA_CURL=OFF &&
    cmake --build build \
        --config Release \
        -- -j ${NCPU:-4}
