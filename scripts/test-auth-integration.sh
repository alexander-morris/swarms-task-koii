#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COORDINATOR_PORT=3001
NODE_PORT=4001
TEST_ADMIN_KEY="test-admin-key-123"
TEST_API_KEY="test-api-key-456"

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to wait for a service to be ready
wait_for_service() {
    local port=$1
    local service=$2
    local endpoint=$3
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}Waiting for $service to be ready on port $port...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port$endpoint" > /dev/null; then
            echo -e "${GREEN}$service is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts: $service not ready yet...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    echo -e "${RED}$service failed to start within the timeout period${NC}"
    return 1
}

# Function to cleanup processes
cleanup() {
    echo -e "${YELLOW}Cleaning up...${NC}"
    if [ ! -z "$COORDINATOR_PID" ]; then
        echo "Stopping coordinator (PID: $COORDINATOR_PID)..."
        kill $COORDINATOR_PID 2>/dev/null
    fi
    if [ ! -z "$NODE_PID" ]; then
        echo "Stopping node (PID: $NODE_PID)..."
        kill $NODE_PID 2>/dev/null
    fi
    # Kill any remaining background processes
    kill $(jobs -p) 2>/dev/null
    exit 1
}

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is required but not installed.${NC}"
        exit 1
    fi
}

# Check required commands
check_command "curl"
check_command "lsof"
check_command "npm"

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Check if ports are available
if check_port $COORDINATOR_PORT; then
    echo -e "${RED}Port $COORDINATOR_PORT is already in use${NC}"
    exit 1
fi

if check_port $NODE_PORT; then
    echo -e "${RED}Port $NODE_PORT is already in use${NC}"
    exit 1
fi

# Start the coordinator
echo -e "${YELLOW}Starting coordinator...${NC}"
cd coordinator/middle-server || { echo -e "${RED}Failed to change to coordinator directory${NC}"; exit 1; }
npm install || { echo -e "${RED}Failed to install coordinator dependencies${NC}"; exit 1; }
export PORT=$COORDINATOR_PORT
export SWARMS_ADMIN_KEY=$TEST_ADMIN_KEY
npm run dev > coordinator.log 2>&1 &
COORDINATOR_PID=$!

# Wait for coordinator to be ready
if ! wait_for_service $COORDINATOR_PORT "Coordinator" "/health"; then
    echo -e "${RED}Coordinator failed to start. Check coordinator.log for details.${NC}"
    exit 1
fi

# Start the node
echo -e "${YELLOW}Starting node...${NC}"
cd ../../node || { echo -e "${RED}Failed to change to node directory${NC}"; exit 1; }
npm install || { echo -e "${RED}Failed to install node dependencies${NC}"; exit 1; }
npm run build || { echo -e "${RED}Failed to build node${NC}"; exit 1; }
export PORT=$NODE_PORT
export MIDDLE_SERVER_URL="http://localhost:$COORDINATOR_PORT"
export SWARMS_ADMIN_KEY=$TEST_ADMIN_KEY
export SWARMS_API_KEY=$TEST_API_KEY
# Use tsx instead of ts-node-dev for better Node.js compatibility
npx tsx src/index.ts > node.log 2>&1 &
NODE_PID=$!

# Wait for node to be ready
if ! wait_for_service $NODE_PORT "Node" "/api/health"; then
    echo -e "${RED}Node failed to start. Check node.log for details.${NC}"
    exit 1
fi

# Function to run a test case
run_test() {
    local test_name=$1
    local expected_status=$2
    local expected_response=$3
    local headers=$4
    local data=$5

    echo -e "${YELLOW}Running test: $test_name${NC}"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "http://localhost:$NODE_PORT/api/swarm/jobs" \
        -H "Content-Type: application/json" \
        $headers \
        -d "$data")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" -eq "$expected_status" ] && echo "$RESPONSE_BODY" | grep -q "$expected_response"; then
        echo -e "${GREEN}Test passed: $test_name${NC}"
        return 0
    else
        echo -e "${RED}Test failed: $test_name${NC}"
        echo "Expected status: $expected_status, got: $HTTP_CODE"
        echo "Expected response to contain: $expected_response"
        echo "Actual response: $RESPONSE_BODY"
        return 1
    fi
}

# Test cases
echo -e "\n${YELLOW}Running test cases...${NC}"

# Test 1: Create a swarm job (should succeed)
run_test "Create swarm job with valid admin key" 201 "job_id" \
    "-H \"Authorization: Bearer $TEST_ADMIN_KEY\"" \
    '{
        "swarm_spec": {
            "name": "Test Swarm",
            "description": "Integration test swarm",
            "agents": [{
                "agent_name": "Test Agent",
                "description": "Test agent",
                "model_name": "gpt-4",
                "max_tokens": 1000
            }],
            "max_loops": 3,
            "swarm_type": "test",
            "task": "Test task"
        }
    }' || exit 1

# Test 2: Try to create a job with invalid admin key (should fail)
run_test "Create swarm job with invalid admin key" 403 "Invalid bearer token" \
    "-H \"Authorization: Bearer invalid-key\"" \
    '{
        "swarm_spec": {
            "name": "Test Swarm",
            "description": "Integration test swarm",
            "agents": [{
                "agent_name": "Test Agent",
                "description": "Test agent",
                "model_name": "gpt-4",
                "max_tokens": 1000
            }],
            "max_loops": 3,
            "swarm_type": "test",
            "task": "Test task"
        }
    }' || exit 1

# Test 3: Try to create a job without admin key (should fail)
run_test "Create swarm job without admin key" 401 "No authorization header provided" \
    "" \
    '{
        "swarm_spec": {
            "name": "Test Swarm",
            "description": "Integration test swarm",
            "agents": [{
                "agent_name": "Test Agent",
                "description": "Test agent",
                "model_name": "gpt-4",
                "max_tokens": 1000
            }],
            "max_loops": 3,
            "swarm_type": "test",
            "task": "Test task"
        }
    }' || exit 1

# Test 4: Try to create a job with invalid swarm spec (should fail)
run_test "Create swarm job with invalid spec" 400 "error" \
    "-H \"Authorization: Bearer $TEST_ADMIN_KEY\"" \
    '{
        "swarm_spec": {
            "name": "Invalid Swarm"
        }
    }' || exit 1

echo -e "\n${GREEN}All integration tests passed!${NC}"

# Cleanup
echo -e "${YELLOW}Cleaning up...${NC}"
if [ ! -z "$COORDINATOR_PID" ]; then
    kill $COORDINATOR_PID 2>/dev/null
fi
if [ ! -z "$NODE_PID" ]; then
    kill $NODE_PID 2>/dev/null
fi
trap - EXIT INT TERM

exit 0 