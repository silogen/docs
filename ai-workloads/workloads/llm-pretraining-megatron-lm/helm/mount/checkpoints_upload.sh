#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <remote_checkpoints_path>"
  exit 1
fi
remote_checkpoints_path="$1"

# Setup MinIO, Upload resources:
mc alias set minio-host ${BUCKET_STORAGE_HOST} ${BUCKET_STORAGE_ACCESS_KEY} ${BUCKET_STORAGE_SECRET_KEY};

mkdir -p /local_resources/checkpoints

while [ ! -f /local_resources/done_training ]; do
    ls -la /local_resources/checkpoints

    older_than_1=$(find /local_resources/checkpoints -type f ! -name 'latest_checkpointed_iteration*.txt' -mmin +1)

    echo "Older than 1 min files:";
    echo "$older_than_1" | xargs -r stat -c 'mtime: %y # size: %s # name: %n';

    # Pin latest checkpoint marker
    if [ -n "$older_than_1" ] && [ -f "/local_resources/checkpoints/latest_checkpointed_iteration.txt" ]; then
        cp /local_resources/checkpoints/latest_checkpointed_iteration.txt /local_resources/checkpoints/latest_checkpointed_iteration_pinned.txt
    fi

    echo "Moving older than 1 min files to remote storage:"
    echo "$older_than_1" | sed 's/\/local_resources\/checkpoints\///' | xargs -r -I {} mc mv /local_resources/checkpoints/{} "minio-host/$remote_checkpoints_path/{}"

    if [ -f "/local_resources/checkpoints/latest_checkpointed_iteration_pinned.txt" ]; then
        mc mv /local_resources/checkpoints/latest_checkpointed_iteration_pinned.txt "minio-host/$remote_checkpoints_path/latest_checkpointed_iteration.txt"
    fi

    echo -e "Waiting for training to finish...\n";
    sleep 60
done

echo "Training done, syncing remaining checkpoint artifacts to remote storage...";
mc mirror --overwrite \
    --exclude latest_checkpointed_iteration.txt \
    /local_resources/checkpoints/ "minio-host/$remote_checkpoints_path/";
mc cp /local_resources/checkpoints/latest_checkpointed_iteration.txt "minio-host/$remote_checkpoints_path/latest_checkpointed_iteration.txt"
echo "Done uploading. Signal to the main container that it can exit.";
touch /local_resources/done_uploading;
