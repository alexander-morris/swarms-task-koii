# Integrated Swarm Task System

## Project Summary

The Integrated Swarm Task System is a comprehensive distributed architecture that enables the execution and management of AI swarm-based tasks across the Koii network with $SWARMS token payments integration. The system orchestrates interactions between multiple agents to solve complex tasks efficiently, with built-in payment, verification, and auditing mechanisms.

## Key Components

### 1. Middle Server
Central coordination hub that manages task distribution, submission tracking, and verification processes. It maintains the workflow state and orchestrates the communication between workers and services.

### 2. Worker Layer (JavaScript)
Handles task execution logic, submission processing, and interfaces with both the middle server and Python API layer. This component manages the task lifecycle and provides a standardized interface for swarm operations.

### 3. Agent Layer (Python)
Implements the AI task processing functionality with specialized workflows for repository analysis, code generation, and other AI-driven tasks. Provides RESTful APIs for task management and result retrieval.

## Recent Updates

- Added comprehensive integration testing framework
- Implemented SwarmJob, SwarmStatus, and SwarmResult models
- Created RESTful API endpoints for job creation, status updates, and result storage
- Added proper MongoDB connection and test environment configuration
- Standardized project structure with appropriate gitignore patterns

## Use Cases

1. **Repository Analysis**: Analyze code repositories to generate documentation, find bugs, and suggest improvements
2. **Feature Building**: Coordinate multiple AI agents to design, plan, and implement new features
3. **Summarization**: Generate concise summaries of complex codebases or documentation
4. **Task Distribution**: Distribute complex tasks among specialized AI agents for efficient processing

## Getting Started

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start the middle server
cd middle-server/middle-server
npm run dev

# Start the worker
cd modified-swarm-task/worker
npm run dev
```

## API Endpoints

- `/api/swarm/jobs`: Create and manage swarm jobs
- `/api/swarm/jobs/:id/status`: Update job status
- `/api/swarm/jobs/:id/result`: Store and retrieve job results

## Technology Stack

- **Backend**: Node.js, Express, MongoDB
- **AI Processing**: Python, FastAPI
- **Containerization**: Docker
- **Testing**: Jest, Supertest
- **Storage**: IPFS for distributed storage
- **Integration**: GitHub API for repository access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with tests

## License

[MIT License](LICENSE)