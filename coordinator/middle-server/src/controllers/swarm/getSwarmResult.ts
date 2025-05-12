import { Response } from "express";
import { GetSwarmResultRequest } from "../../types/swarm";
import { SwarmResultModel } from "../../models/swarm";

export const getSwarmResult = async (req: GetSwarmResultRequest, res: Response) => {
  try {
    const { jobId } = req.params;

    const result = await SwarmResultModel.findOne({ job_id: jobId });
    if (!result) {
      return res.status(404).json({
        error: "Swarm result not found",
        details: `No result found for job ID: ${jobId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: result._id,
        job_id: result.job_id
      }
    });
  } catch (error) {
    console.error("Error getting swarm result:", error);
    res.status(500).json({
      error: "Failed to get swarm result",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}; 