#!/bin/bash

# Source root .env if present
if [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

./start-and-test.sh 