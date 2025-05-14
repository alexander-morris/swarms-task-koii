#!/bin/bash

# Source root .env if present
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Start the coordinator in the background
cd coordinator && ./coordinator-live-test.sh &
COORDINATOR_PID=$!
cd ..

# Wait for the coordinator server to be ready
MIDDLE_SERVER_URL=${MIDDLE_SERVER_URL:-"http://localhost:3000"}
echo "Waiting for coordinator (middle server) to be ready at $MIDDLE_SERVER_URL ..."
for i in {1..30}; do
  if curl -s "$MIDDLE_SERVER_URL/" > /dev/null; then
    echo "Coordinator is ready!"
    break
  fi
  echo -n "."
  sleep 1
done

# Start the node live test, passing the middle server URL
cd node && MIDDLE_SERVER_URL="$MIDDLE_SERVER_URL" ./node-live-test.sh &
NODE_PID=$!
cd ..

# Wait for both processes
wait $COORDINATOR_PID
wait $NODE_PID 