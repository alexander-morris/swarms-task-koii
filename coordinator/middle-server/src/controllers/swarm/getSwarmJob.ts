import { Response } from "express";
import { GetSwarmJobRequest } from "../../types/swarm";
import { SwarmJobModel } from "../../models/swarm";

export const getSwarmJob = async (req: GetSwarmJobRequest, res: Response) => {
  try {
    const { jobId } = req.params;

    const job = await SwarmJobModel.findOne({ job_id: jobId });
    if (!job) {
      return res.status(404).json({
        error: "Swarm job not found",
        details: `No job found with ID: ${jobId}`
      });
    }

    res.json({
      data: {
        job_id: job.job_id,
        status: job.status,
        swarm_spec: job.swarm_spec,
        created_at: job.created_at,
        updated_at: job.updated_at,
        metadata: job.metadata
      }
    });
  } catch (error) {
    console.error("Error getting swarm job:", error);
    res.status(500).json({
      error: "Failed to get swarm job",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 