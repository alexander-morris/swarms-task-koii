# Docs Summarizer

A document summarization system built on the Koii network, designed to process and summarize documents efficiently.

## Project Structure

The project consists of two main components:

- `worker/`: The core processing component that handles document summarization tasks
- `planner/`: Component responsible for task planning and coordination

## Prerequisites

- Node.js >= 18.17.0
- Yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd docs-summarizer
```

2. Install dependencies:
```bash
yarn install
```

## Development

### Worker Component

The worker component is responsible for processing and summarizing documents. To run the worker:

```bash
cd worker
yarn install
yarn build
yarn start
```

### Testing

Run tests for the worker component:
```bash
cd worker
yarn test
```

## Configuration

The project uses configuration files for different environments:
- `config-task-test.yml`: Test environment configuration
- `config-task-prod.yml`: Production environment configuration

## Dependencies

The project uses several key dependencies:
- Koii network components (`@_koii/*`)
- TypeScript for type safety
- Webpack for bundling
- Jest for testing

## License

ISC