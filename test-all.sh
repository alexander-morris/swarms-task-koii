#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting global test environment...${NC}"

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file based on .env.sample"
    exit 1
fi

# Load environment variables from .env
set -a
source .env
set +a

# Check if required environment variables are set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${RED}Error: Required environment variable ANTHROPIC_API_KEY is not set in .env${NC}"
    echo "Please set ANTHROPIC_API_KEY in your .env file"
    exit 1
fi

# Check if test task file exists
if [ ! -f "$TEST_TASK_FILE" ]; then
    echo -e "${RED}Error: Test task file not found at $TEST_TASK_FILE${NC}"
    echo "Please ensure the test task file exists at the specified location"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.17.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}Error: Node.js version must be >= 18.17.0${NC}"
    exit 1
fi

# Function to run tests in a directory
run_tests() {
    local dir=$1
    local name=$2
    local test_cmd=${3:-"npm test"}
    
    echo -e "${YELLOW}Running tests in ${name}...${NC}"
    cd "$dir" || exit 1
    
    # Install dependencies
    echo -e "${GREEN}Installing dependencies...${NC}"
    npm install
    
    # Run tests
    if [ -f "package.json" ]; then
        eval "$test_cmd"
        local test_status=$?
        if [ $test_status -eq 0 ]; then
            echo -e "${GREEN}${name} tests passed successfully${NC}"
        else
            echo -e "${RED}${name} tests failed${NC}"
            return $test_status
        fi
    else
        echo -e "${YELLOW}No package.json found in ${name}${NC}"
    fi
    
    cd - > /dev/null || exit 1
}

# Run tests for each component
echo -e "${GREEN}Running all tests...${NC}"

# Worker tests
run_tests "node/worker" "Worker" "npm run jest-test -- --verbose"

# Coordinator tests
if [ -d "coordinator" ]; then
    run_tests "coordinator" "Coordinator"
fi

echo -e "${GREEN}All tests completed!${NC}" 