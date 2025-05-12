#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port 3000 is in use
check_port() {
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for server to be ready
wait_for_server() {
    echo "Waiting for server to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/ > /dev/null; then
            echo -e "${GREEN}Server is ready!${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    echo -e "${RED}Server failed to start${NC}"
    return 1
}

# Kill existing server if running
if check_port; then
    echo "Killing existing server on port 3000..."
    kill $(lsof -t -i:3000)
    sleep 2
fi

# Start the server in the background
echo "Starting server..."
npm run dev &
SERVER_PID=$!

# Wait for server to be ready
if ! wait_for_server; then
    kill $SERVER_PID
    exit 1
fi

# Sample swarm job specification
SAMPLE_JOB='{
  "swarm_spec": {
    "name": "Sample Swarm Job",
    "description": "A test swarm job created by the startup script",
    "agents": [
      {
        "agent_name": "Test Agent",
        "description": "A test agent",
        "model_name": "gpt-4",
        "max_tokens": 1000
      }
    ],
    "max_loops": 3,
    "swarm_type": "test",
    "task": "Test task"
  }
}'

# Create a sample job
echo "Creating sample job..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/swarm/jobs \
    -H "Content-Type: application/json" \
    -d "$SAMPLE_JOB")

# Check if job was created successfully
if echo "$RESPONSE" | grep -q "job_id"; then
    JOB_ID=$(echo "$RESPONSE" | grep -o '"job_id":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}Sample job created successfully!${NC}"
    echo "Job ID: $JOB_ID"
    echo "Full response:"
    echo "$RESPONSE" | json_pp
else
    echo -e "${RED}Failed to create sample job${NC}"
    echo "Response:"
    echo "$RESPONSE" | json_pp
fi

# Keep the script running and allow for Ctrl+C to kill the server
echo -e "\n${GREEN}Server is running. Press Ctrl+C to stop.${NC}"
trap "kill $SERVER_PID" INT
wait $SERVER_PID 