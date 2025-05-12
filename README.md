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

## Local Testing

### Quick Start
To run all tests in one command:

```bash
# Make the script executable
chmod +x scripts/test-local.sh

# Run the test script
./scripts/test-local.sh
```

This script will:
1. Check for required environment variables
2. Verify Node.js version and dependencies
3. Install all required packages
4. Run the worker tests with verbose output
5. Report test results

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn package manager
- TypeScript 5.6.2 or later
- MongoDB (for middle server tests)

### Environment Setup

1. Install dependencies for each component:
   ```bash
   # Middle server
   cd middle-server/middle-server
   npm install

   # Worker
   cd node/worker
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Required for worker tests
   export ANTHROPIC_API_KEY=your_api_key
   export GITHUB_TOKEN=your_github_token
   export GITHUB_USERNAME=your_github_username
   export TASK_ID=your_task_id

   # Required for middle server tests
   export MONGODB_URI=your_mongodb_uri
   ```

### Running Tests

#### Worker Tests
The worker uses Jest for testing with TypeScript support:

```bash
# Navigate to worker directory
cd node/worker

# Run all tests
npm run jest-test

# Run tests with verbose output
npm run jest-test -- --verbose

# Run a specific test file
npm run jest-test -- tests/node-worker.test.ts

# Run tests in watch mode (auto-rerun on changes)
npm run jest-test -- --watch
```

Test types:
1. **Integration Tests** (`tests/node-worker.test.ts`):
   - Tests core worker functionality
   - Currently passing and verifying basic operations
   - Includes configuration, task execution, and submission tests

2. **Main Tests** (`tests/main.test.ts`):
   - Legacy test suite
   - Currently failing (known issue)
   - Not recommended for local development

#### Middle Server Tests
The middle server uses Jest and Supertest for API testing:

```bash
# Navigate to middle server directory
cd middle-server/middle-server

# Run all tests
npm test

# Run tests with verbose output
npm test -- --verbose

# Run a specific test file
npm test -- tests/swarm.test.ts
```

### Test Configuration

Each component has its own test configuration:

- **Worker**:
  - `jest.config.js`: Jest configuration with ES modules support
  - `babel.config.js`: Babel configuration for TypeScript
  - `tsconfig.tests.json`: TypeScript configuration

- **Middle Server**:
  - `jest.config.js`: Jest configuration
  - `tsconfig.json`: TypeScript configuration

### Common Issues and Solutions

1. **Module Resolution**:
   - Ensure TypeScript configurations are properly set up
   - Check import paths in test files

2. **Environment Variables**:
   - Verify all required variables are set
   - Worker tests require `ANTHROPIC_API_KEY`
   - Middle server tests require `MONGODB_URI`

3. **Watchman Warnings**:
   ```bash
   watchman watch-del '/path/to/project' ; watchman watch-project '/path/to/project'
   ```

4. **Namespace Wrapper Errors**:
   - Some errors from `@_koii/namespace-wrapper` are expected
   - These are handled by test mocks

### Current Test Status

- **Worker**:
  - ✅ Integration tests passing
  - ❌ Main tests failing (known issue)
  - 🔄 Watchman warnings present
  - ⚠️ Expected namespace wrapper errors

- **Middle Server**:
  - ✅ API endpoint tests passing
  - ✅ Model tests passing
  - ✅ Integration tests passing

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

## Running the Project

### Running Both Coordinator and Node

To start both the coordinator and the node in development mode, you can use the root project script. This script first runs the coordinator's start-and-test.sh script and then runs the node's start-node.sh script.

1. Make sure you are in the root directory of the project.
2. Run the following command:

   ```bash
   ./run-all.sh
   ```

   This script will:
   - Start the coordinator in development mode.
   - Start the node in development mode.

### Testing the Scripts Individually

You can also test each script independently:

- **Coordinator**: Navigate to the `coordinator` directory and run:

  ```bash
  ./start-and-test.sh
  ```

- **Node**: Navigate to the `node` directory and run:

  ```bash
  ./start-node.sh
  ```

### Prerequisites

Ensure that the following prerequisites are met before running the scripts:

- The middle server must be running.
- The Swarms API must be accessible.
- All necessary environment variables are set in the respective `.env` files.

### Troubleshooting

If you encounter any issues while running the scripts, check the following:

- Ensure that the `package.json` file exists in the `node` directory.
- Verify that all dependencies are installed.
- Check the logs for any error messages.