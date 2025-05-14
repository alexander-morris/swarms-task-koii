import { Router } from "express";
import { createSwarmJob } from "../controllers/swarm/createSwarmJob";
import { getSwarmJob } from "../controllers/swarm/getSwarmJob";
import { updateSwarmStatus } from "../controllers/swarm/updateSwarmStatus";
import { storeSwarmResult } from "../controllers/swarm/storeSwarmResult";
import { getSwarmResult } from "../controllers/swarm/getSwarmResult";
import { verifyBearerToken } from "../middleware/auth";

const router = Router();

// Create a new swarm job
router.post("/jobs", verifyBearerToken, createSwarmJob);

// Get a swarm job by ID
router.get("/jobs/:jobId", verifyBearerToken, getSwarmJob);

// Update swarm job status
router.put("/jobs/:jobId/status", verifyBearerToken, updateSwarmStatus);

// Store swarm result
router.post("/jobs/:jobId/result", verifyBearerToken, storeSwarmResult);

// Get swarm result
router.get("/jobs/:jobId/result", verifyBearerToken, getSwarmResult);

export default router; 