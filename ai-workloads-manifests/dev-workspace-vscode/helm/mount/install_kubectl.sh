#!/bin/bash

# Download the binary
curl -L "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    --create-dirs \
    -o /usr/local/bin/kubectl

# Make the binary executable
chmod +x /usr/local/bin/kubectl
