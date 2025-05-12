import { getOrcaClient } from "@_koii/task-manager/extensions";
import { namespaceWrapper, TASK_ID } from "@_koii/namespace-wrapper";
import "dotenv/config";
import { status, middleServerUrl } from "../utils/constant";
import dotenv from "dotenv";
// import { checkAnthropicAPIKey, isValidAnthropicApiKey } from "../utils/check/anthropicCheck";
// import { checkGitHub } from "../utils/check/githubCheck";
import { LogLevel } from "@_koii/namespace-wrapper/dist/types";
import { actionMessage } from "../utils/constant";
import { errorMessage } from "../utils/constant";
import { v4 as uuidv4 } from "uuid";
import { preRunCheck } from "../utils/check/checks";
import axios from 'axios';

dotenv.config();

// Swarms API configuration
const SWARMS_API_URL = process.env.SWARMS_API_URL || 'http://localhost:8080';
const SWARMS_API_KEY = process.env.SWARMS_API_KEY;

export async function task(roundNumber: number): Promise<void> {
  try {
    // Get task from middle server
    const taskResponse = await fetch(`${middleServerUrl}/summarizer/worker/get-task`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: TASK_ID, round: roundNumber }),
    });

    if (!taskResponse.ok) {
      throw new Error(`Failed to fetch task: ${taskResponse.statusText}`);
    }

    const taskData = await taskResponse.json();
    
    // Create swarm configuration
    const swarmConfig = {
      name: `swarm-${TASK_ID}-${roundNumber}`,
      description: `Swarm for task ${TASK_ID} round ${roundNumber}`,
      task: taskData.task,
      agents: taskData.agents || [
        {
          agent_name: "primary-agent",
          model_name: "gpt-4o-mini",
          system_prompt: "You are a helpful AI assistant.",
          temperature: 0.7,
          max_tokens: 2048
        }
      ],
      max_loops: 1,
      swarm_type: "SequentialWorkflow"
    };

    // Execute swarm using Swarms API
    const swarmResponse = await axios.post(
      `${SWARMS_API_URL}/v1/swarm/completions`,
      swarmConfig,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SWARMS_API_KEY
        }
      }
    );

    // Store the result
    const result = {
      taskId: TASK_ID,
      roundNumber,
      swarmId: swarmResponse.data.job_id,
      result: swarmResponse.data.output,
      timestamp: new Date().toISOString()
    };

    await namespaceWrapper.storeSet(`result-${roundNumber}`, JSON.stringify(result));
    await namespaceWrapper.storeSet(`shouldMakeSubmission`, "true");

  } catch (error) {
    console.error("[TASK] Error executing swarm:", error);
    await namespaceWrapper.storeSet(`result-${roundNumber}`, status.TASK_EXECUTION_FAILED);
    throw error;
  }
}
