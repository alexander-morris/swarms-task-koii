import { Response } from "express";
import { StoreSwarmResultRequest } from "../../types/swarm";
import { SwarmJobModel, SwarmResultModel } from "../../models/swarm";
import { SwarmStatus } from "../../types/swarm";

export const storeSwarmResult = async (req: StoreSwarmResultRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const { output, metadata } = req.body;
    const now = new Date();

    // Verify job exists
    const job = await SwarmJobModel.findOne({ job_id: jobId });
    if (!job) {
      return res.status(404).json({
        error: "Swarm job not found",
        details: `No job found with ID: ${jobId}`
      });
    }

    // Update job status to completed
    job.status = SwarmStatus.COMPLETED;
    job.updated_at = now;
    await job.save();

    // Store result (set all required fields)
    const result = await SwarmResultModel.create({
      job_id: jobId,
      status: SwarmStatus.COMPLETED,
      output,
      metadata,
      completed_at: now
    });

    return res.status(200).json({
      success: true,
      data: {
        _id: result._id,
        job_id: result.job_id,
        output: result.output,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error("Error storing swarm result:", error);
    res.status(500).json({
      error: "Failed to store swarm result",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 