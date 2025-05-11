#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting local test environment...${NC}"

# Check if required environment variables are set
if [ -z "$ANTHROPIC_API_KEY" ] || [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USERNAME" ] || [ -z "$TASK_ID" ]; then
    echo -e "${RED}Error: Required environment variables are not set${NC}"
    echo "Please set the following environment variables:"
    echo "ANTHROPIC_API_KEY"
    echo "GITHUB_TOKEN"
    echo "GITHUB_USERNAME"
    echo "TASK_ID"
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

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Run worker tests
echo -e "${GREEN}Running worker tests...${NC}"
cd node/worker
npm install
npm run jest-test -- --verbose

# Check if worker tests passed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Worker tests passed successfully${NC}"
else
    echo -e "${RED}Worker tests failed${NC}"
    exit 1
fi

# Return to root directory
cd ../..

echo -e "${GREEN}All tests completed!${NC}" 