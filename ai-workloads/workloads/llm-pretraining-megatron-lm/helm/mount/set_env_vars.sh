#!/bin/bash

# Limit the maximum number of hardware queues per GPU
export GPU_MAX_HW_QUEUES=2

# Enable high-priority streams for NCCL in PyTorch
export TORCH_NCCL_HIGH_PRIORITY=1

# Disable NCCL checks for performance optimization
export NCCL_CHECKS_DISABLE=1

# Specify the RDMA (Remote Direct Memory Access) interfaces for NCCL
export NCCL_IB_HCA=rdma0,rdma1,rdma2,rdma3,rdma4,rdma5,rdma6,rdma7

# Set the GID (Global Identifier) index for RDMA communication
export NCCL_IB_GID_INDEX=3

# Disable cross-NIC (Network Interface Card) communication for NCCL
export NCCL_CROSS_NIC=0

# Specify the network interface for NCCL communication
export NCCL_SOCKET_IFNAME=eth0

# Specify the network interface for Gloo communication
export GLOO_SOCKET_IFNAME=eth0

# Limit the maximum number of connections per CUDA device
export CUDA_DEVICE_MAX_CONNECTIONS=1

# Set the NCCL protocol to Simple for performance tuning
export NCCL_PROTO=Simple

# Disable MSCCL (Multi-System Collective Communication Library) in RCCL
export RCCL_MSCCL_ENABLE=0

# Disable parallelism in the Tokenizers library to avoid threading issues
export TOKENIZERS_PARALLELISM=false

# Uncomment the following lines for debugging AMD-specific issues
# export AMD_LOG_LEVEL=3
# export AMD_SERIALIZE_KERNEL=3

# Disable scratch memory reclaiming in HSA (Heterogeneous System Architecture)
export HSA_NO_SCRATCH_RECLAIM=1

# Disable MSCCL++ (an advanced feature of RCCL)
export RCCL_MSCCLPP_ENABLE=0

# Enable legacy IPC (Inter-Process Communication) mode in HSA
export HSA_ENABLE_IPC_MODE_LEGACY=1
