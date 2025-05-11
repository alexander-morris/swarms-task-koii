# Earn Crypto with AI Agents: Prometheus Document & Summarize Task (Beta v0)

## Overview

The **Prometheus Document & Summarize Task** spins up an **AI agent** capable of continuously summarizing repositories, **earning you KOII**. Automated document summarization agents can constantly process and summarize information, increasing the value of the network _and_ your node. Our ultimate goal is to have **AI agents summarizing Koii tasks**, growing the network with **more opportunities for node operators to earn rewards**.

## Releases

### Beta v0

- This is the **first beta release** of the task.
- The AI agent reads documents and generates summaries automatically.
- Documentations are sent to the user repository.
- Future versions will introduce **enhanced AI logic, more complex summarization tasks, and more!**

## Task Setup

**[How to set up a Claude API key and a GitHub API key for the 247 Document & Summarize Task.](https://www.koii.network/blog/Earn-Crypto-With-AI-Agent)**

## How It Works

1. The Koii Node **launches an AI agent** inside a lightweight runtime.
2. The agent reads an active **repository list** from the bounty repository.
3. It picks a **repository**, generates the necessary **documentation**, and submits a **Github pull request** (a request to have its documentation added to the repository).
4. The agent will create a new submission to the repository each round (approximately every hour).
5. Koii Nodes **earn rewards** for running the AI agent and contributing documentation.

## Local Development and Testing

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn package manager
- TypeScript 5.6.2 or later

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   # Required environment variables
   ANTHROPIC_API_KEY=your_api_key
   GITHUB_TOKEN=your_github_token
   GITHUB_USERNAME=your_github_username
   TASK_ID=your_task_id
   ```

### Running Tests

The project uses Jest for testing with TypeScript support. There are two types of tests:

1. **Integration Tests** (`tests/node-worker.test.ts`):
   - Tests the core functionality of the worker
   - Includes configuration loading, task execution, submission process, and pre-run checks
   - These tests are currently passing and verify basic functionality
   - Run with:
     ```bash
     npm run jest-test
     ```

2. **Main Tests** (`tests/main.test.ts`):
   - Legacy test suite for the main task functionality
   - Currently failing due to missing mock data and incomplete setup
   - Not recommended for local development at this time
   - Run with the same command:
     ```bash
     npm run jest-test
     ```

### Test Configuration

The test environment is configured using:

- `jest.config.js`: Main Jest configuration with ES modules support
- `babel.config.js`: Babel configuration for TypeScript support
- `tsconfig.tests.json`: TypeScript configuration for tests

### Debugging Tests

- Use `--verbose` flag for detailed output:
  ```bash
  npm run jest-test -- --verbose
  ```

- To run a specific test file:
  ```bash
  npm run jest-test -- tests/node-worker.test.ts
  ```

### Common Issues and Solutions

1. **Module Resolution**: If you encounter module resolution errors:
   - Ensure your `tsconfig.tests.json` is properly configured
   - Check that all imports use the correct path format

2. **Environment Variables**: 
   - Make sure all required environment variables are set before running tests
   - The tests will fail if `ANTHROPIC_API_KEY` is not set

3. **Watchman Warnings**: If you see Watchman warnings, you can clear them with:
   ```bash
   watchman watch-del '/path/to/project' ; watchman watch-project '/path/to/project'
   ```

4. **Namespace Wrapper Errors**: 
   - Some errors from `@_koii/namespace-wrapper` are expected in the test environment
   - These errors are handled by the test mocks and don't affect test results

### Adding New Tests

1. Create new test files in the `tests` directory with the `.test.ts` extension
2. Follow the existing test patterns in `node-worker.test.ts`
3. Use Jest's testing utilities and assertions
4. Mock external dependencies using Jest's mocking capabilities
5. Ensure proper cleanup in `afterAll` and `afterEach` hooks

### Current Test Status

- ✅ Integration tests are passing
- ❌ Main tests are failing (known issue)
- 🔄 Watchman warnings are present but don't affect test results
- ⚠️ Some namespace wrapper errors are expected in the test environment
