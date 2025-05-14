#!/bin/bash

# Source root .env if present
if [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

# Run the coordinator's start-and-test.sh
./start-and-test.sh 