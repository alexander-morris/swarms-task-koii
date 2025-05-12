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