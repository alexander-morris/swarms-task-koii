# Middle Server for Swarm Task Processing

This server acts as a middleware for processing swarm tasks, managing job status, and storing results.

## Recent Updates
- Only Swarm APIs are supported; all legacy endpoints have been removed.
- Test scripts in `deprecated_unit_tests/` demonstrate usage of the new Swarm APIs.
- Comprehensive API documentation and data models are provided below.

## Features

- Swarm job creation and management
- Status tracking and updates
- Result storage and retrieval
- MongoDB integration for data persistence
- RESTful API endpoints
- Comprehensive test coverage

## API Endpoints

### Swarm Jobs

- `POST /api/swarm/jobs` - Create a new swarm job
  - Request body: `{ swarm_spec: SwarmSpec, metadata?: Record<string, any> }`
  - Response: `{ job_id: string, status: string, swarm_spec: SwarmSpec, ... }`

- `GET /api/swarm/jobs/:jobId` - Get job details
  - Response: `{ job_id: string, status: string, swarm_spec: SwarmSpec, ... }`

- `PUT /api/swarm/jobs/:jobId/status` - Update job status
  - Request body: `{ status: string, progress?: number, error?: string }`
  - Response: `{ job_id: string, status: string, progress?: number, ... }`

- `POST /api/swarm/jobs/:jobId/result` - Store job result
  - Request body: `{ output: any, metadata?: Record<string, any> }`
  - Response: `{ job_id: string, status: string, output: any, ... }`

- `GET /api/swarm/jobs/:jobId/result` - Get job result
  - Response: `{ job_id: string, output: any, metadata?: Record<string, any>, ... }`

## Data Models

### SwarmSpec

```typescript
interface SwarmSpec {
  name: string;
  description: string;
  agents: AgentSpec[];
  max_loops: number;
  swarm_type: string;
  task: string;
  schedule?: ScheduleSpec;
}
```

### AgentSpec

```typescript
interface AgentSpec {
  agent_name: string;
  description: string;
  model_name: string;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  system_prompt?: string;
}
```

### ScheduleSpec

```typescript
interface ScheduleSpec {
  type: "sequential" | "parallel";
  max_parallel?: number;
}
```

## Quick Start

For a quick start with a sample job, use the provided script:

```bash
./scripts/start-and-test.sh
```

This script will:
1. Start the server in development mode
2. Create a sample swarm job
3. Display the job details
4. Keep the server running until you press Ctrl+C

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/middle-server
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Testing

Run tests:
```bash
npm test
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

## Test Scripts

See `deprecated_unit_tests/` for migration and legacy test scripts using the new Swarm APIs.

## Live Unit Tests

The `live_unit_tests/` directory contains scripts that exercise the Swarm APIs against a running instance of the middle server. These scripts are intended for manual or integration testing with a live backend (not as part of the automated Jest suite).

### How to Use

1. **Start the middle server** (in a separate terminal):
   ```bash
   npm run dev
   ```

2. **Run a live test script** (in another terminal):
   ```bash
   npx ts-node live_unit_tests/controllers/createToDoTest.ts
   npx ts-node live_unit_tests/controllers/createFetchAddPRTest.ts
   npx ts-node live_unit_tests/utils/signTest.ts
   ```

These scripts will make real HTTP requests to the server and print results to the console. They are useful for verifying end-to-end functionality and API compatibility after changes.

## Error Response Conventions

- **Authentication errors** (invalid or missing admin key):
  - Status codes: `401` (missing), `403` (invalid)
  - Response body: `{ "message": "..." }`

- **Validation errors** (invalid job spec):
  - Status code: `400`
  - Response body: `{ "error": "..." }`

These conventions are enforced and tested in the API test suite. 