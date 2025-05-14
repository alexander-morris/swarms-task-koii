#!/bin/bash

# Source root .env if present
if [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

# Run the node's start-node.sh
./start-node.sh 