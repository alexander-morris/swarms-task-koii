/// <reference types="jest" />

import { describe, beforeAll, afterAll, beforeEach, test, expect } from '@jest/globals';
import { app, startServer } from '../middle-server/middle-server/src/app';
import mongoose from 'mongoose';
import { SwarmJobModel, SwarmStatusModel, SwarmResultModel } from '../middle-server/middle-server/src/models/swarm';
import { Server } from 'http';
import request from 'supertest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/middle-server-test';

describe('Middle Server Integration Tests', () => {
  let server: Server;
  const TEST_PORT = 3001;

  const validSwarmSpec = {
    name: "Test Integration Swarm",
    description: "A test swarm for integration testing",
    agents: [
      {
        agent_name: "Test Agent",
        description: "A test agent",
        model_name: "gpt-4",
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95
      }
    ],
    max_loops: 3,
    swarm_type: "test",
    task: "Create a simple hello world program"
  };

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || '');
    
    // Start the middle server
    process.env.PORT = TEST_PORT.toString();
    server = startServer();

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Cleanup
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await SwarmJobModel.deleteMany({});
    await SwarmStatusModel.deleteMany({});
    await SwarmResultModel.deleteMany({});
  });

  test('Create and get swarm job', async () => {
    // 1. Create a new swarm job
    const createResponse = await request(app)
      .post('/api/swarm/jobs')
      .send({ swarm_spec: validSwarmSpec });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('job_id');
    const jobId = createResponse.body.job_id;

    // 2. Get the created job
    const getResponse = await request(app)
      .get(`/api/swarm/jobs/${jobId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('swarm_spec');
    expect(getResponse.body.swarm_spec).toEqual(validSwarmSpec);
  });

  test('Update swarm job status', async () => {
    // 1. Create a new swarm job
    const createResponse = await request(app)
      .post('/api/swarm/jobs')
      .send({ swarm_spec: validSwarmSpec });

    const jobId = createResponse.body.job_id;

    // 2. Update the job status
    const updateResponse = await request(app)
      .put(`/api/swarm/jobs/${jobId}/status`)
      .send({ status: 'in_progress' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('status', 'in_progress');

    // 3. Verify the status was updated
    const getResponse = await request(app)
      .get(`/api/swarm/jobs/${jobId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('status', 'in_progress');
  });

  test('Store and get swarm result', async () => {
    // 1. Create a new swarm job
    const createResponse = await request(app)
      .post('/api/swarm/jobs')
      .send({ swarm_spec: validSwarmSpec });

    const jobId = createResponse.body.job_id;

    // 2. Store a result
    const testResult = {
      output: "Test output",
      metadata: {
        duration: 1000,
        steps: 5
      }
    };

    const storeResponse = await request(app)
      .post(`/api/swarm/jobs/${jobId}/result`)
      .send(testResult);

    expect(storeResponse.status).toBe(200);
    expect(storeResponse.body).toHaveProperty('success', true);

    // 3. Get the stored result
    const getResponse = await request(app)
      .get(`/api/swarm/jobs/${jobId}/result`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('output', testResult.output);
    expect(getResponse.body).toHaveProperty('metadata');
    expect(getResponse.body.metadata).toEqual(testResult.metadata);
  });
}); 