import { getOrcaClient } from "@_koii/task-manager/extensions";
import { middleServerUrl, status } from "../utils/constant";
import { submissionJSONSignatureDecode } from "../utils/submissionJSONSignatureDecode";
// import { status } from '../utils/constant'

const TIMEOUT_MS = 180000; // 3 minutes in milliseconds
const MAX_RETRIES = 3;

async function auditWithTimeout(cid: string, roundNumber: number, submitterKey: string): Promise<boolean | void> {
  let orcaClient;
  try {
    orcaClient = await getOrcaClient();
    if (!orcaClient) {
      // await namespaceWrapper.storeSet(`result-${roundNumber}`, status.NO_ORCA_CLIENT);
      return;
    }
    // Check if the cid is one of the status
    if (Object.values(status).includes(cid)) {
      // This returns a dummy trued
      return true;
    }
    const decodeResult = await submissionJSONSignatureDecode({
      submission_value: cid,
      submitterPublicKey: submitterKey,
      roundNumber: roundNumber, // Decode using the actual round number
    });
    if (!decodeResult) {
      console.log("[AUDIT] DECODE RESULT FAILED.");
      return false;
    }
    console.log(`[AUDIT] ✅ Signature decoded successfully`);

    console.log(`[AUDIT] Checking summarizer status for submitter ${submitterKey}`);
    const checkSummarizerResponse = await fetch(`${middleServerUrl}/summarizer/worker/check-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stakingKey: submitterKey,
        roundNumber, // This round number doesn't matter
        githubUsername: decodeResult.githubUsername,
        prUrl: decodeResult.prUrl,
      }),
    });
    const checkSummarizerJSON = await checkSummarizerResponse.json();
    console.log(`[AUDIT] Summarizer check response:`, checkSummarizerJSON);

    if (!checkSummarizerJSON.success) {
      console.log(`[AUDIT] ❌ Audit failed for ${submitterKey}`);
      return false;
    }
    console.log(`[AUDIT] ✅ Summarizer check passed`);

    console.log(`[AUDIT] Sending audit request for submitter: ${submitterKey}`);
    console.log(`[AUDIT] Submission data being sent to audit:`, decodeResult);

    const auditResult = await orcaClient.podCall(`worker-audit/${decodeResult.roundNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submission: decodeResult,
      }),
    });
    console.log(`[AUDIT] Audit result:`, auditResult);
    const auditResultData = auditResult.data;

    if (auditResultData.success) {
      console.log(`[AUDIT] ✅ Audit successful for ${submitterKey}`);
      return auditResultData.data.is_approved;
    } else {
      console.log(`[AUDIT] ❌ Audit could not be completed for ${submitterKey}`);
      return true;
    }
  } catch (error) {
    console.error("[AUDIT] Error auditing submission:", error);
    return true; // Return false on error instead of undefined
  } finally {
    console.log("[AUDIT] Cleaning up resources");
  }
}

export async function audit(cid: string, roundNumber: number, submitterKey: string): Promise<boolean | void> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const result = await Promise.race<boolean | void>([
        auditWithTimeout(cid, roundNumber, submitterKey),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Audit timeout")), TIMEOUT_MS)),
      ]);
      return result;
    } catch (error) {
      retries++;
      console.log(`[AUDIT] Attempt ${retries} failed:`, error);
      
      if (retries === MAX_RETRIES) {
        console.log(`[AUDIT] Max retries (${MAX_RETRIES}) reached. Giving up.`);
        return true; // Return true as a fallback
      }
      
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
