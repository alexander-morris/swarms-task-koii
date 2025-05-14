import { Keypair } from "@_koii/web3.js";
import { signData, verifySignature } from "../utils/sign";
import request from "supertest";
import { app } from "../app";
import dotenv from "dotenv";
import { describe, beforeAll, it, expect } from '@jest/globals';

dotenv.config();

describe("Authentication Tests", () => {
  let keypair: Keypair;
  const testPayload = {
    taskId: "test-task-123",
    timestamp: Date.now(),
    action: "create_swarm"
  };

  beforeAll(() => {
    keypair = Keypair.generate();
  });

  describe("Payload Signing", () => {
    it("should successfully sign and verify a payload", async () => {
      // Sign the payload
      const signature = await signData(keypair, testPayload);
      const publicKey = keypair.publicKey.toBase58();

      // Verify the signature
      const verificationResult = await verifySignature(
        signature,
        publicKey,
        JSON.stringify(testPayload)
      );

      expect(verificationResult.error).toBeUndefined();
      expect(verificationResult.data).toBeDefined();
      expect(JSON.parse(verificationResult.data!)).toEqual(testPayload);
    });

    it("should reject invalid signatures", async () => {
      const invalidSignature = "invalid_signature";
      const publicKey = keypair.publicKey.toBase58();

      const verificationResult = await verifySignature(
        invalidSignature,
        publicKey,
        JSON.stringify(testPayload)
      );

      expect(verificationResult.error).toBeDefined();
      expect(verificationResult.data).toBeUndefined();
    });
  });

  describe("API Authentication", () => {
    it("should accept properly signed requests", async () => {
      // Sign the payload
      const signature = await signData(keypair, testPayload);
      const publicKey = keypair.publicKey.toBase58();

      // Make authenticated request
      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .set("X-Signature", signature)
        .set("X-Public-Key", publicKey)
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
    });

    it("should reject requests with invalid signatures", async () => {
      const invalidSignature = "invalid_signature";
      const publicKey = keypair.publicKey.toBase58();

      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .set("X-Signature", invalidSignature)
        .set("X-Public-Key", publicKey)
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