import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CreateSwarmJobRequest } from "../../types/swarm";
import { SwarmJobModel } from "../../models/swarm";
import { SwarmStatus } from "../../types/swarm";

function isValidSwarmSpec(spec: any): boolean {
  return spec && typeof spec.name === 'string' && Array.isArray(spec.agents) && spec.agents.length > 0;
}

export const createSwarmJob = async (req: CreateSwarmJobRequest, res: Response) => {
  try {
    const { swarm_spec } = req.body;
    const now = new Date();

    // Validate swarm spec
    if (!isValidSwarmSpec(swarm_spec)) {
      return res.status(400).json({ error: "Invalid swarm spec" });
    }

    const job = new SwarmJobModel({
      job_id: uuidv4(),
      status: SwarmStatus.PENDING,
      swarm_spec,
      created_at: now,
      updated_at: now
    });

    await job.save();

    res.status(201).json({
      job_id: job.job_id,
      status: job.status,
      swarm_spec: job.swarm_spec,
      created_at: job.created_at,
      updated_at: job.updated_at
    });
  } catch (error) {
    console.error("Error creating swarm job:", error);
    res.status(500).json({
      error: "Failed to create swarm job",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 