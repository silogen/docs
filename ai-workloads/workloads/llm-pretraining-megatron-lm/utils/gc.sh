#!/bin/bash

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <job name> <namespace>."
  echo "This script attaches configmap to the lifecycle of the job for automatic garbage collection."
  echo "Config map name must be the same as the name of the job."
  exit 1
fi

job_name="$1"
namespace="$2"

job_uid="$(kubectl get job $job_name -n $namespace -o=jsonpath='{.metadata.uid}')"

kubectl patch configmap $job_name -n $namespace --patch $'
metadata:
  ownerReferences:
    - apiVersion: batch/v1
      blockOwnerDeletion: true
      controller: true
      kind: Job
      name: '$job_name'
      uid: '$job_uid'
'
