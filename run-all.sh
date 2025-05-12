#!/bin/bash

# Start the coordinator
echo "Starting the coordinator..."
cd coordinator && ./start-and-test.sh

# Start the node
echo "Starting the node..."
cd ../node && ./start-node.sh 