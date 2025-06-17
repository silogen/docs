cd /workload && mkdir bin
curl https://dl.min.io/client/mc/release/linux-amd64/mc -o /workload/bin/mc
chmod +x /workload/bin/mc
export PATH=$PATH:/workload/bin
mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY}
mc cp --recursive --preserve $(echo "minio-host/${BIN_PATH}/${ROCM_ARCH}" | sed 's#//*#/#g') /workload/bin
