#!/bin/bash

# Default values
SWARMS_API_URL=${SWARMS_API_URL:-"http://localhost:8080"}
SWARMS_API_KEY=${SWARMS_API_KEY:-"your-api-key-here"}
MIDDLE_SERVER_URL=${MIDDLE_SERVER_URL:-"http://localhost:3000"}
NODE_PORT=${NODE_PORT:-"4000"}

# Check if .env file exists, if not create it
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
SWARMS_API_URL=${SWARMS_API_URL}
SWARMS_API_KEY=${SWARMS_API_KEY}
MIDDLE_SERVER_URL=${MIDDLE_SERVER_URL}
PORT=${NODE_PORT}
EOL
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building project..."
npm run build

# Start the node
echo "Starting node..."
echo "Environment:"
echo "SWARMS_API_URL: ${SWARMS_API_URL}"
echo "MIDDLE_SERVER_URL: ${MIDDLE_SERVER_URL}"
echo "PORT: ${NODE_PORT}"

# Start the node with the environment variables
SWARMS_API_URL=${SWARMS_API_URL} \
SWARMS_API_KEY=${SWARMS_API_KEY} \
MIDDLE_SERVER_URL=${MIDDLE_SERVER_URL} \
PORT=${NODE_PORT} \
npm start 