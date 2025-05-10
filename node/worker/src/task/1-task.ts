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
dotenv.config();

export async function task(roundNumber: number): Promise<void> {
  /**
   * Run your task and store the proofs to be submitted for auditing
   * It is expected you will store the proofs in your container
   * The submission of the proofs is done in the submission function
   */
  // FORCE TO PAUSE 30 SECONDS
  // No submission on Round 0 so no need to trigger fetch audit result before round 3
  // Changed from 3 to 4 to have more time
  // if (roundNumber >= 4) {
  //   const auditRound = roundNumber - 4;
  //   const response = await fetch(`${middleServerUrl}/summarizer/worker/update-audit-result`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ taskId: TASK_ID, round: auditRound }),
  //   });
  //   console.log(`[TASK] Fetched audit result for round ${auditRound}. Status: ${response.status}`);
  // }
  // console.log(`[TASK] EXECUTE TASK FOR ROUND ${roundNumber}`);
}
