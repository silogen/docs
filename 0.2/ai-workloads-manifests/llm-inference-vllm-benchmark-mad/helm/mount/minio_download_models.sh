# model defined in ENV
mc cp --recursive minio-host/${BUCKET_MODEL_PATH}/${MAD_MODEL}/ $WORKPATH/models/${MAD_MODEL}/

# models defined in scenarios
awk -F, '{print $1}' $WORKPATH/mount/scenarios*.csv | sort | uniq | while read MODEL_ID; do
    mc cp --recursive minio-host/${BUCKET_MODEL_PATH}/${MODEL_ID}/ $WORKPATH/models/${MODEL_ID}/
done
