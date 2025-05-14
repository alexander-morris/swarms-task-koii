import request from "supertest";
import { app } from "../app";
import dotenv from "dotenv";
import { describe, it, expect } from '@jest/globals';

dotenv.config();

describe("Project Owner Authentication Tests", () => {
  describe("Job Creation", () => {
    it("should create a new swarm job with valid admin key", async () => {
      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .send({
          swarm_spec: {
            name: "Documentation Swarm",
            description: "Generate documentation for a codebase",
            agents: [
              {
                agent_name: "Documentation Agent",
                description: "An agent that generates documentation",
                model_name: "gpt-4",
                max_tokens: 2000,
                system_prompt: "You are a documentation expert that creates clear and comprehensive documentation."
              }
            ],
            max_loops: 3,
            swarm_type: "documentation",
            task: "Generate documentation for the provided codebase"
          }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("job_id");
      expect(response.body.swarm_spec.name).toBe("Documentation Swarm");
    });

    it("should reject job creation with invalid admin key", async () => {
      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", "Bearer invalid-key")
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

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
    });

    it("should reject job creation without admin key", async () => {
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
      expect(response.body).toHaveProperty("message");
    });

    it("should validate required swarm specification fields", async () => {
      const response = await request(app)
        .post("/api/swarm/jobs")
        .set("Authorization", `Bearer ${process.env.SWARMS_ADMIN_KEY}`)
        .send({
          swarm_spec: {
            // Missing required fields
            name: "Invalid Swarm"
          }
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
}); 