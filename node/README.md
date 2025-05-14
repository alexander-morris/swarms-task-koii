# Swarms Node Implementation

This directory contains the Swarms implementation for the Orca Agent, providing a robust API for managing and orchestrating AI agent swarms.

## Overview

The implementation provides a FastAPI-based service that enables:
- Creation and management of AI agent swarms
- Individual agent operations
- Batch processing capabilities
- API key management and rate limiting
- Telemetry and logging
- Cost calculation and credit management

## Key Components

### API (`orca-agent/src/api/api.py`)
The main API implementation that provides endpoints for:
- Swarm creation and management
- Agent operations
- Batch processing
- Health checks
- Model availability
- Logging and telemetry

### Features
- Rate limiting
- API key verification
- Cost calculation
- Telemetry capture
- Caching mechanisms
- Batch processing support
- Multiple swarm types support

## API Endpoints

- `/v1/swarm/completions` - Create and run swarms
- `/v1/agent/completions` - Run individual agents
- `/v1/swarm/batch/completions` - Process multiple swarms
- `/v1/swarms/available` - Get available swarm types
- `/v1/models/available` - Get available models
- `/v1/swarm/logs` - Access swarm logs
- `/health` and `/healthz` - Health check endpoints

## Configuration

The implementation uses environment variables for configuration. Key configurations include:
- API key management
- Rate limiting parameters
- Model configurations
- Service tiers

## Dependencies

The implementation relies on:
- FastAPI for the web framework
- Swarms for agent management
- Supabase for data storage
- LiteLLM for model management
- Various utility libraries for logging, telemetry, and more

## Usage

To use the API:
1. Set up the required environment variables
2. Start the FastAPI server
3. Use the provided endpoints to create and manage swarms and agents

## Security

The implementation includes:
- API key verification
- Rate limiting
- Request validation
- Secure key generation
- Telemetry for monitoring

## Monitoring

The system includes comprehensive logging and telemetry:
- Request logging
- Performance monitoring
- Error tracking
- Usage statistics

# Node for Swarm Task Processing

This node connects to the middle server to process swarm tasks and manage job execution.

## Environment Variables

The following environment variables are required:

- `SWARMS_API_URL`: URL of the Swarms API (default: http://localhost:8080)
- `SWARMS_API_KEY`: API key for the Swarms API
- `MIDDLE_SERVER_URL`: URL of the middle server (default: http://localhost:3000)
- `SWARMS_ADMIN_KEY`: Admin key for authenticating with the middle server
- `PORT`: Port for the node to listen on (default: 4000)

## Authentication

The node uses two types of authentication:

1. **Swarms API Authentication**
   - Uses `SWARMS_API_KEY` in the `x-api-key` header
   - Required for interacting with the Swarms API

2. **Middle Server Authentication**
   - Uses `SWARMS_ADMIN_KEY` in the `Authorization: Bearer` header
   - Required for all API calls to the middle server
   - Follows the error response conventions:
     - 401: Missing or invalid admin key
     - 403: Invalid bearer token
     - 400: Validation errors

## Quick Start

1. Set up environment variables:
   ```bash
   export SWARMS_API_URL="http://localhost:8080"
   export SWARMS_API_KEY="your-api-key"
   export MIDDLE_SERVER_URL="http://localhost:3000"
   export SWARMS_ADMIN_KEY="your-admin-key"
   export PORT=4000
   ```

2. Start the node:
   ```bash
   ./start-node.sh
   ```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## API Integration

The node uses a centralized API client (`src/utils/api.ts`) that handles:
- Authentication with the middle server
- Error handling and logging
- Response interceptors for common error cases

Example usage:
```typescript
import api from './utils/api';

// Create a new swarm job
const response = await api.post('/api/swarm/jobs', {
  swarm_spec: {
    name: "Test Swarm",
    description: "A test swarm",
    agents: [...],
    max_loops: 3,
    swarm_type: "test",
    task: "Test task"
  }
});
```

## Error Handling

The API client automatically handles common error cases:
- 401: Missing or invalid admin key
- 403: Invalid bearer token
- 400: Validation errors
- Network errors
- Server errors

All errors are logged with descriptive messages to help with debugging. 