import { Keypair } from "@_koii/web3.js";
import { signData } from "../utils/sign";
import request from "supertest";
import { app } from "../app";
import dotenv from "dotenv";
import { describe, beforeAll, it, expect } from '@jest/globals';

dotenv.config();

describe("Downstream API Authentication Tests", () => {
  let keypair: Keypair;
  let jobId: string;

  beforeAll(() => {
    keypair = Keypair.generate();
  });

  describe("API Authentication", () => {
    it("should create a new swarm job with proper authentication", async () => {
      const jobPayload = {
        taskId: "test-task-123",
        timestamp: Date.now(),
        action: "create_swarm"
      };

      const signature = await signData(keypair, jobPayload);

      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .set("X-Signature", signature)
        .set("X-Public-Key", keypair.publicKey.toBase58())
        .send({
          swarm_spec: {
            name: "Test Swarm",
            description: "A test swarm",
            agents: [
              {
                agent_name: "Test Agent",
                description: "A test agent",
                model_name: "gpt-4",
                max_tokens: 1000
              }
            ],
            max_loops: 3,
            swarm_type: "test",
            task: "Test task"
          }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("job_id");
      jobId = response.body.job_id;
    });

    it("should reject requests with invalid signature", async () => {
      const invalidSignature = "invalid_signature";
      const jobPayload = {
        taskId: "test-task-123",
        timestamp: Date.now(),
        action: "create_swarm"
      };

      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .set("X-Signature", invalidSignature)
        .set("X-Public-Key", keypair.publicKey.toBase58())
        .send({
          swarm_spec: {
            name: "Test Swarm",
            description: "A test swarm",
            agents: [
              {
                agent_name: "Test Agent",
                description: "A test agent",
                model_name: "gpt-4",
                max_tokens: 1000
              }
            ],
            max_loops: 3,
            swarm_type: "test",
            task: "Test task"
          }
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("should update swarm job status with proper authentication", async () => {
      const statusPayload = {
        taskId: "test-task-123",
        timestamp: Date.now(),
        action: "update_status",
        jobId: jobId
      };

      const signature = await signData(keypair, statusPayload);

      const response = await request(app)
        .put(`/api/swarm/jobs/${jobId}/status`)
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .set("X-Signature", signature)
        .set("X-Public-Key", keypair.publicKey.toBase58())
        .send({
          status: "in_progress",
          progress: 50
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("in_progress");
    });

    it("should store swarm result with proper authentication", async () => {
      const resultPayload = {
        taskId: "test-task-123",
        timestamp: Date.now(),
        action: "store_result",
        jobId: jobId
      };

      const signature = await signData(keypair, resultPayload);

      const response = await request(app)
        .post(`/api/swarm/jobs/${jobId}/result`)
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .set("X-Signature", signature)
        .set("X-Public-Key", keypair.publicKey.toBase58())
        .send({
          output: { result: "test output" },
          metadata: { test: "metadata" }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should reject requests without authentication headers", async () => {
      const response = await request(app)
        .post("/api/swarm/jobs")
        .send({
          swarm_spec: {
            name: "Test Swarm",
            description: "A test swarm",
            agents: [
              {
                agent_name: "Test Agent",
                description: "A test agent",
                model_name: "gpt-4",
                max_tokens: 1000
              }
            ],
            max_loops: 3,
            swarm_type: "test",
            task: "Test task"
          }
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });
}); 