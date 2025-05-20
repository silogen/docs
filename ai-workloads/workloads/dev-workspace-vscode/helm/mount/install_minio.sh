#!/bin/bash

echo '--------------------------------------------'
echo 'Installing MinIO Client'
echo '--------------------------------------------'

# Download MinIO client binary
curl -s https://dl.min.io/client/mc/release/linux-amd64/mc \
    --create-dirs \
    -o /usr/local/bin/mc

# Make the binary executable
chmod +x /usr/local/bin/mc

# Configure MinIO alias
mc alias set minio "${BUCKET_STORAGE_HOST}" "${BUCKET_STORAGE_ACCESS_KEY}" "${BUCKET_STORAGE_SECRET_KEY}"

echo '--------------------------------------------'
echo 'MinIO Client Installed!'
echo '--------------------------------------------'

# Display usage instructions
echo '--------------------------------------------'
echo 'Usage Instructions:'
echo '
  - List available buckets:
      $ mc ls minio
  - Copy files from a bucket:
      $ mc cp minio/<bucket>/prefix <destination>
  - Upload files to a bucket:
      $ mc cp <source> minio/<bucket>/prefix
  - Remove files from a bucket:
      $ mc rm minio/<bucket>/prefix
  - Create a new bucket:
      $ mc mb minio/<bucket>
  - Get help:
      $ mc --help
'
echo '--------------------------------------------'
