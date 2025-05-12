import { getTaskStateInfo } from "@_koii/create-task-cli";
import { Connection, PublicKey } from "@_koii/web3.js";

export async function getMaxSubmissionRound(taskId: string): Promise<number | null> {
  if (!taskId) {
    console.error("Task ID is required");
    return null;
  }

  try {
    // Validate that taskId is a valid Solana public key
    new PublicKey(taskId);
  } catch (error) {
    console.error("Invalid task ID format:", error);
    return null;
  }

  const connection = new Connection("https://mainnet.koii.network", "confirmed");

  try {
    const taskStateInfo = await getTaskStateInfo(connection, taskId);
    if (!taskStateInfo || !taskStateInfo.submissions) {
      console.error("No task state info found for task:", taskId);
      return null;
    }
    const roundsInSubmission = Object.keys(taskStateInfo.submissions);
    if (roundsInSubmission.length === 0) {
      console.error("No submission rounds found for task:", taskId);
      return null;
    }
    const largestRound = Math.max(...roundsInSubmission.map(Number));
    // Return the largest round, even if it's 0
    return largestRound;
  } catch (error) {
    console.error("Error in getMaxSubmissionRound:", error);
    return null;
  }
}
// Create a dictionary to store starting slot for each task
const startingSlotCache = new Map<string, { startingSlot: number; roundTime: number }>();
export async function getStartingSlot(taskId: string): Promise<{ startingSlot: number; roundTime: number }> {
  if (startingSlotCache.has(taskId) && startingSlotCache.get(taskId) !== undefined) {
    return startingSlotCache.get(taskId)!;
  }
  const connection = new Connection("https://mainnet.koii.network", "confirmed");
  try {
    const taskStateInfo = await getTaskStateInfo(connection, taskId);
    if (!taskStateInfo) {
      console.error("No task state info returned for task:", taskId);
      throw new Error("No task state info found");
    }
    if (!taskStateInfo.starting_slot || !taskStateInfo.round_time) {
      console.error("Invalid task state info:", taskStateInfo);
      throw new Error("Invalid task state info - missing starting_slot or round_time");
    }
    startingSlotCache.set(taskId, { startingSlot: taskStateInfo.starting_slot, roundTime: taskStateInfo.round_time });
    return { startingSlot: taskStateInfo.starting_slot, roundTime: taskStateInfo.round_time };
  } catch (error) {
    console.error("Error in getStartingSlot:", error);
    throw error;
  }
}

export async function getCurrentRound(taskId: string): Promise<number | null> {
  try {
    const connection = new Connection("https://mainnet.koii.network", "confirmed");
    const currentSlot = await connection.getSlot();
    console.log("currentSlot", currentSlot);

    const startingSlotInfo = await getStartingSlot(taskId);
    if (!startingSlotInfo) {
      console.error("Failed to get starting slot info for task:", taskId);
      return null;
    }

    const { startingSlot, roundTime } = startingSlotInfo;
    if (!startingSlot || !roundTime) {
      console.error(
        "Invalid starting slot or round time for task:",
        taskId,
        "startingSlot:",
        startingSlot,
        "roundTime:",
        roundTime,
      );
      return null;
    }

    const currentRound = Math.floor((currentSlot - startingSlot) / roundTime);
    console.log("Calculated current round:", currentRound, "for task:", taskId);
    return currentRound;
  } catch (error) {
    console.error("Error in getCurrentRound:", error);
    return null;
  }
}
