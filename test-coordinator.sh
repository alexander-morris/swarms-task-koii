#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting coordinator tests...${NC}"

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with the following variables:"
    echo "ANTHROPIC_API_KEY=your_api_key"
    echo "NODE_ENV=test"
    echo "MONGODB_URI=mongodb://localhost:27017/middle-server-test"
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

# Set NODE_ENV to test if not set
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=test
    echo -e "${YELLOW}Setting NODE_ENV to test${NC}"
fi

# Set MONGODB_URI to test database if not set
if [ -z "$MONGODB_URI" ]; then
    export MONGODB_URI="mongodb://localhost:27017/middle-server-test"
    echo -e "${YELLOW}Setting MONGODB_URI to test database${NC}"
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

if ! command_exists yarn; then
    echo -e "${RED}Error: yarn is not installed${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.17.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}Error: Node.js version must be >= 18.17.0${NC}"
    exit 1
fi

# Check if coordinator directory exists
if [ ! -d "coordinator/middle-server" ]; then
    echo -e "${RED}Error: coordinator/middle-server directory not found${NC}"
    exit 1
fi

# Run coordinator tests
echo -e "${YELLOW}Running coordinator tests...${NC}"
cd coordinator/middle-server || exit 1

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
yarn install

# Run tests
if [ -f "package.json" ]; then
    echo -e "${GREEN}Running tests...${NC}"
    
    # Run all tests with verbose output
    echo -e "${YELLOW}Running tests with verbose output...${NC}"
    yarn test --verbose
    
    test_status=$?
    if [ $test_status -eq 0 ]; then
        echo -e "${GREEN}Coordinator tests passed successfully${NC}"
    else
        echo -e "${RED}Coordinator tests failed${NC}"
        exit $test_status
    fi
else
    echo -e "${RED}No package.json found in coordinator/middle-server directory${NC}"
    exit 1
fi

cd - > /dev/null || exit 1

echo -e "${GREEN}Coordinator tests completed!${NC}"

cd coordinator
./start-and-test.sh 