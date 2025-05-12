import request from "supertest";
import { app } from "../app";
import { SwarmJobModel, SwarmStatusModel, SwarmResultModel } from "../models/swarm";
import { SwarmStatus } from "../types/swarm";

describe("Swarm API", () => {
  const validSwarmSpec = {
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
  };

  beforeEach(async () => {
    await SwarmJobModel.deleteMany({});
    await SwarmStatusModel.deleteMany({});
    await SwarmResultModel.deleteMany({});
  });

  describe("POST /api/swarm/jobs", () => {
    it("should create a new swarm job", async () => {
      const response = await request(app)
        .post("/api/swarm/jobs")
        .send({ swarm_spec: validSwarmSpec });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("job_id");
      expect(response.body.status).toBe("pending");
      expect(response.body.swarm_spec).toEqual(validSwarmSpec);
    });

    it("should validate swarm spec", async () => {
      const invalidSpec = { ...validSwarmSpec, name: undefined };
      const response = await request(app)
        .post("/api/swarm/jobs")
        .send({ swarm_spec: invalidSpec });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/swarm/jobs/:jobId", () => {
    it("should get a swarm job by ID", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "pending"
      });

      const response = await request(app)
        .get(`/api/swarm/jobs/${job.job_id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.job_id).toBe(job.job_id);
      expect(response.body.data.status).toBe("pending");
    });

    it("should return 404 for non-existent job", async () => {
      const response = await request(app)
        .get("/api/swarm/jobs/non-existent");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/swarm/jobs/:jobId/status", () => {
    it("should update swarm job status", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "pending"
      });

      const response = await request(app)
        .put(`/api/swarm/jobs/${job.job_id}/status`)
        .send({
          status: "in_progress",
          progress: 50
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("in_progress");
      expect(response.body.progress).toBe(50);
    });

    it("should validate status update", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "pending"
      });

      const response = await request(app)
        .put(`/api/swarm/jobs/${job.job_id}/status`)
        .send({
          status: "invalid_status"
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/swarm/jobs/:jobId/result", () => {
    it("should store swarm result", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "in_progress"
      });

      const result = {
        output: { result: "test output" },
        metadata: { test: "metadata" }
      };

      const response = await request(app)
        .post(`/api/swarm/jobs/${job.job_id}/result`)
        .send(result);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("job_id");
    });

    it("should update job status to completed", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "in_progress"
      });

      await request(app)
        .post(`/api/swarm/jobs/${job.job_id}/result`)
        .send({ output: { result: "test" } });

      const updatedJob = await SwarmJobModel.findOne({ job_id: job.job_id });
      expect(updatedJob?.status).toBe("completed");
    });
  });

  describe("GET /api/swarm/jobs/:jobId/result", () => {
    it("should get swarm result", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "completed"
      });

      const result = await SwarmResultModel.create({
        job_id: job.job_id,
        status: SwarmStatus.COMPLETED,
        output: { result: "test output" },
        metadata: { test: "metadata" },
        completed_at: new Date()
      });

      const response = await request(app)
        .get(`/api/swarm/jobs/${job.job_id}/result`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty("job_id");
    });

    it("should return 404 for non-existent result", async () => {
      const job = await SwarmJobModel.create({
        job_id: "test-job",
        swarm_spec: validSwarmSpec,
        status: "completed"
      });

      const response = await request(app)
        .get(`/api/swarm/jobs/${job.job_id}/result`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
}); 