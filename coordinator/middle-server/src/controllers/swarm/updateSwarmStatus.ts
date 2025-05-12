import { Response } from "express";
import { UpdateSwarmStatusRequest, SwarmStatus } from "../../types/swarm";
import { SwarmJobModel, SwarmStatusModel } from "../../models/swarm";

export const updateSwarmStatus = async (req: UpdateSwarmStatusRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const { status, progress, error } = req.body;
    const now = new Date();

    // Verify job exists
    const job = await SwarmJobModel.findOne({ job_id: jobId });
    if (!job) {
      return res.status(404).json({
        error: "Swarm job not found",
        details: `No job found with ID: ${jobId}`
      });
    }

    // Validate status
    if (!Object.values(SwarmStatus).includes(status as SwarmStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Update job status
    job.status = status as SwarmStatus;
    job.updated_at = now;
    await job.save();

    // Update or create status record
    const statusUpdate = {
      job_id: jobId,
      status,
      progress,
      started_at: job.created_at,
      updated_at: now,
      ...(error && { error })
    };

    await SwarmStatusModel.findOneAndUpdate(
      { job_id: jobId },
      statusUpdate,
      { upsert: true, new: true }
    );

    res.json({
      job_id: jobId,
      status,
      progress,
      started_at: job.created_at,
      updated_at: now,
      ...(error && { error })
    });
  } catch (error) {
    console.error("Error updating swarm status:", error);
    res.status(500).json({
      error: "Failed to update swarm status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 