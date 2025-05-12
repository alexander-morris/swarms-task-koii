# Middle Server

A monorepo containing the Middle Server service for Swarm Task Processing on the Koii Network.

## Project Structure

- `middle-server/`: The main server component for Swarm APIs
- `node/`: Contains the task implementation that integrates with Swarms API

## Architecture

The system consists of three main components:

1. **Middle Server**: Coordinates tasks and manages the workflow
2. **Task Node**: Executes tasks using the Swarms API
3. **Swarms API**: Provides AI agent swarm capabilities

### Integration Flow

1. Middle Server receives task requests
2. Task Node fetches tasks from Middle Server
3. Task Node executes tasks using Swarms API
4. Results are stored and returned to Middle Server

## Prerequisites

- Node.js (v18+ recommended)
- npm
- Docker and Docker Compose
- Swarms API access and API key

## Environment Variables

Required environment variables:
```bash
SWARMS_API_URL=http://localhost:8080  # Swarms API endpoint
SWARMS_API_KEY=your_api_key          # Swarms API key
MIDDLE_SERVER_URL=http://localhost:3000  # Middle server endpoint
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd coordinator
   ```

2. Install dependencies:
   ```bash
   npm install
   cd middle-server
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the services:
   ```bash
   docker-compose up -d
   ```

5. Start the middle server:
   ```bash
   cd middle-server
   npm run dev
   ```

## API Endpoints

### Middle Server Endpoints
- `/summarizer/worker/get-task` - Get task for execution
- `/summarizer/worker/add-todo-pr` - Add PR to todo list
- `/summarizer/worker/update-audit-result` - Update audit results

### Task Node Endpoints
- `/task/:roundNumber` - Execute task for a round
- `/swarm-status/:jobId` - Check swarm execution status
- `/available-models` - Get available AI models
- `/available-swarm-types` - Get available swarm types

## Swarms Integration

The task node integrates with the Swarms API to:
1. Execute AI agent swarms
2. Monitor swarm execution
3. Retrieve results
4. Handle errors and retries

## Test Scripts

Live API test scripts are available in `