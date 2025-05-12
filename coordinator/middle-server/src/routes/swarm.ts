import { Router } from "express";
import { createSwarmJob } from "../controllers/swarm/createSwarmJob";
import { getSwarmJob } from "../controllers/swarm/getSwarmJob";
import { updateSwarmStatus } from "../controllers/swarm/updateSwarmStatus";
import { storeSwarmResult } from "../controllers/swarm/storeSwarmResult";
import { getSwarmResult } from "../controllers/swarm/getSwarmResult";

const router = Router();

// Create a new swarm job
router.post("/jobs", createSwarmJob);

// Get a swarm job by ID
router.get("/jobs/:jobId", getSwarmJob);

// Update swarm job status
router.put("/jobs/:jobId/status", updateSwarmStatus);

// Store swarm result
router.post("/jobs/:jobId/result", storeSwarmResult);

// Get swarm result
router.get("/jobs/:jobId/result", getSwarmResult);

export default router; 