import { storeFile } from "../utils/ipfs";
import { getOrcaClient } from "@_koii/task-manager/extensions";
import { namespaceWrapper, TASK_ID } from "@_koii/namespace-wrapper";
import { middleServerUrl, status } from "../utils/constant";
import { preRunCheck } from "../utils/check/checks";

interface SubmissionData {
  prUrl: string;
  [key: string]: any;
}

interface SubmissionParams {
  orcaClient: any;
  roundNumber: number;
  stakingKey: string;
  publicKey: string;
  secretKey: Uint8Array<ArrayBufferLike>;
}

export async function submission(roundNumber: number): Promise<string | void> {
  /**
   * Retrieve the task proofs from your container and submit for auditing
   * Must return a string of max 512 bytes to be submitted on chain
   * The default implementation handles uploading the proofs to IPFS
   * and returning the CID
   */
  if (!(await preRunCheck(roundNumber.toString()))) {
    return;
  }
  const stakingKeypair = await namespaceWrapper.getSubmitterAccount();
  const pubKey = await namespaceWrapper.getMainAccountPubkey();
  if (!stakingKeypair || !pubKey) {
    console.error("[SUBMISSION] No staking keypair or public key found");
    throw new Error("No staking keypair or public key found");
  }
  const stakingKey = stakingKeypair.publicKey.toBase58();

  const secretKey = stakingKeypair.secretKey;
  console.log(`[SUBMISSION] Starting submission process for round ${roundNumber}`);

  try {
    const orcaClient = await initializeOrcaClient();
    const shouldMakeSubmission = await namespaceWrapper.storeGet(`shouldMakeSubmission`);

    if (!shouldMakeSubmission || shouldMakeSubmission !== "true") {
      return;
    }

    const cid = await makeSubmission({
      orcaClient,
      roundNumber,
      stakingKey,
      publicKey: pubKey,
      secretKey,
    });

    return cid || void 0;
  } catch (error) {
    console.error("[SUBMISSION] Error during submission process:", error);
    throw error;
  }
}

async function initializeOrcaClient() {
  console.log("[SUBMISSION] Initializing Orca client...");
  const orcaClient = await getOrcaClient();

  if (!orcaClient) {
    console.error("[SUBMISSION] Failed to initialize Orca client");
    throw new Error("Failed to initialize Orca client");
  }

  console.log("[SUBMISSION] Orca client initialized successfully");
  return orcaClient;
}

async function makeSubmission(params: SubmissionParams): Promise<string | void> {
  const { orcaClient, roundNumber, stakingKey, publicKey, secretKey } = params;

  const swarmBountyId = await namespaceWrapper.storeGet(`swarmBountyId`);
  if (!swarmBountyId) {
    console.log("[SUBMISSION] No swarm bounty id found for this round");
    return;
  }

  const submissionData = await fetchSubmissionData(orcaClient, swarmBountyId);
  if (!submissionData) {
    return;
  }

  await notifyMiddleServer({
    taskId: TASK_ID!,
    swarmBountyId,
    prUrl: submissionData.prUrl,
    stakingKey,
    publicKey,
    secretKey,
  });

  const signature = await signSubmissionPayload(
    {
      taskId: TASK_ID,
      roundNumber,
      stakingKey,
      pubKey: publicKey,
      ...submissionData,
    },
    secretKey,
  );

  const cid = await storeSubmissionOnIPFS(signature);
  await cleanupSubmissionState();

  return cid;
}

async function fetchSubmissionData(orcaClient: any, swarmBountyId: string): Promise<SubmissionData | null> {
  console.log(`[SUBMISSION] Fetching submission data for swarm bounty ${swarmBountyId}`);
  const result = await orcaClient.podCall(`submission/${swarmBountyId}`);

  if (!result || result.data === "No submission") {
    console.log("[SUBMISSION] No existing submission found");
    return null;
  }

  const submission = typeof result.data === "object" && "data" in result.data ? result.data.data : result.data;

  if (!submission?.prUrl) {
    throw new Error("Submission is missing PR URL");
  }

  return submission as SubmissionData;
}

async function notifyMiddleServer(params: {
  taskId: string;
  swarmBountyId: string;
  prUrl: string;
  stakingKey: string;
  publicKey: string;
  secretKey: Uint8Array<ArrayBufferLike>;
}) {
  const { taskId, swarmBountyId, prUrl, stakingKey, publicKey, secretKey } = params;

  const payload = {
    taskId,
    swarmBountyId,
    prUrl,
    stakingKey,
    publicKey,
    action: "add-round-number",
  };

  const signature = await namespaceWrapper.payloadSigning(payload, secretKey);
  const response = await fetch(`${middleServerUrl}/summarizer/worker/add-round-number`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signature, stakingKey }),
  });

  console.log("[SUBMISSION] Add PR Response: ", response);

  if (response.status !== 200) {
    throw new Error(`Posting to middle server failed: ${response.statusText}`);
  }
}

async function signSubmissionPayload(payload: any, secretKey: Uint8Array<ArrayBufferLike>): Promise<string> {
  console.log("[SUBMISSION] Signing submission payload...");
  const signature = await namespaceWrapper.payloadSigning(payload, secretKey);
  console.log("[SUBMISSION] Payload signed successfully");
  return signature!;
}

async function storeSubmissionOnIPFS(signature: string): Promise<string> {
  console.log("[SUBMISSION] Storing submission on IPFS...");
  const cid = await storeFile({ signature }, "submission.json");
  if (!cid) {
    throw new Error("Failed to store submission on IPFS");
  }
  console.log("[SUBMISSION] Submission stored successfully. CID:", cid);
  return cid;
}

async function cleanupSubmissionState(): Promise<void> {
  await namespaceWrapper.storeSet(`shouldMakeSubmission`, "false");
  await namespaceWrapper.storeSet(`swarmBountyId`, "");
}
