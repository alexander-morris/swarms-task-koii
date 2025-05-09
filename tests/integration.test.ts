/// <reference types="jest" />

import { app, startServer } from './middle-server/middle-server/src/app';
import mongoose from 'mongoose';
import { SwarmJobModel, SwarmStatusModel, SwarmResultModel } from './middle-server/middle-server/src/models/swarm';
import { Server } from 'http';
import request from 'supertest';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

describe('Integration Tests', () => {
  let server: Server;
  let swarmProcess: ChildProcess;
  const TEST_PORT = 3001;
  const BASE_URL = `http://localhost:${TEST_PORT}`;

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
    await mongoose.connect('mongodb://localhost:27017/middle-server-test');
    
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
    if (swarmProcess) {
      swarmProcess.kill();
    }
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await SwarmJobModel.deleteMany({});
    await SwarmStatusModel.deleteMany({});
    await SwarmResultModel.deleteMany({});
  });

  test('Complete integration flow', async () => {
    // 1. Create a new swarm job
    const createResponse = await request(app)
      .post('/api/swarm/jobs')
      .send({ swarm_spec: validSwarmSpec });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('job_id');
    const jobId = createResponse.body.job_id;

    // 2. Start the swarm task process
    const swarmTaskPath = path.resolve(__dirname, './modified-swarm-task/worker/src/index.ts');
    swarmProcess = spawn('ts-node', [swarmTaskPath], {
      env: {
        ...process.env,
        MIDDLE_SERVER_URL: BASE_URL,
        NODE_ENV: 'test'
      }
    });

    // Log swarm process output for debugging
    if (swarmProcess.stdout) {
      swarmProcess.stdout.on('data', (data) => {
        console.log(`Swarm stdout: ${data}`);
      });
    }

    if (swarmProcess.stderr) {
      swarmProcess.stderr.on('data', (data) => {
        console.error(`Swarm stderr: ${data}`);
      });
    }

    // 3. Wait for the swarm to process the job (poll status)
    let jobCompleted = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while (!jobCompleted && attempts < maxAttempts) {
      const statusResponse = await request(app)
        .get(`/api/swarm/jobs/${jobId}`);
      
      expect(statusResponse.status).toBe(200);
      
      if (statusResponse.body.status === 'completed') {
        jobCompleted = true;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }

    expect(jobCompleted).toBe(true);

    // 4. Check the final result
    const resultResponse = await request(app)
      .get(`/api/swarm/jobs/${jobId}/result`);

    expect(resultResponse.status).toBe(200);
    expect(resultResponse.body).toHaveProperty('output');
    expect(resultResponse.body.output).toBeDefined();
  }, 35000); // Set timeout to 35 seconds
}); 