// import { namespaceWrapper } from "@_koii/namespace-wrapper";

import { getOrcaClient } from "@_koii/task-manager/extensions";
import { actionMessage, errorMessage, middleServerUrl } from "../constant";

import { TASK_ID, namespaceWrapper } from "@_koii/namespace-wrapper";
import { LogLevel } from "@_koii/namespace-wrapper/dist/types";
export async function task() {
  while (true) {
    try {
      let requiredWorkResponse;
      const orcaClient = await getOrcaClient();
      // check if the env variable is valid
      const stakingKeypair = await namespaceWrapper.getSubmitterAccount()!;
      const pubKey = await namespaceWrapper.getMainAccountPubkey();
      if (!orcaClient || !stakingKeypair || !pubKey) {
        await namespaceWrapper.logMessage(LogLevel.Error, errorMessage.NO_ORCA_CLIENT, actionMessage.NO_ORCA_CLIENT);
        // Wait for 1 minute before retrying
        await new Promise((resolve) => setTimeout(resolve, 60000));
        continue;
      }
      const stakingKey = stakingKeypair.publicKey.toBase58();

      /****************** All these issues need to be generate a markdown file ******************/

      const signature = await namespaceWrapper.payloadSigning(
        {
          taskId: TASK_ID,
          // roundNumber: roundNumber,
          action: "fetch-todo",
          githubUsername: process.env.GITHUB_USERNAME,
          stakingKey: stakingKey,
        },
        stakingKeypair.secretKey,
      );

      const retryDelay = 60000; // 1 minute in milliseconds

      while (true) {
        requiredWorkResponse = await fetch(`${middleServerUrl}/summarizer/worker/fetch-todo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signature: signature, stakingKey: stakingKey }),
        });

        if (requiredWorkResponse.status === 200) {
          break;
        }

        console.log(
          `[TASK] Server returned status ${requiredWorkResponse.status}, retrying in ${retryDelay / 1000} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }

      // check if the response is 200 after all retries
      if (!requiredWorkResponse || requiredWorkResponse.status !== 200) {
        // return;
        continue;
      }
      const requiredWorkResponseData = await requiredWorkResponse.json();
      console.log("[TASK] requiredWorkResponseData: ", requiredWorkResponseData);
      // const uuid = uuidv4();
      const alreadyAssigned = await namespaceWrapper.storeGet(JSON.stringify(requiredWorkResponseData.data.id));
      if (alreadyAssigned) {
        continue;
        // return;
      } else {
        await namespaceWrapper.storeSet(JSON.stringify(requiredWorkResponseData.data.id), "initialized");
      }

      const podcallPayload = {
        taskId: TASK_ID,
      };

      const podCallSignature = await namespaceWrapper.payloadSigning(podcallPayload, stakingKeypair.secretKey);

      const jsonBody = {
        task_id: TASK_ID,
        swarmBountyId: requiredWorkResponseData.data.id,
        repo_url: `https://github.com/${requiredWorkResponseData.data.repo_owner}/${requiredWorkResponseData.data.repo_name}`,
        podcall_signature: podCallSignature,
      };
      console.log("[TASK] jsonBody: ", jsonBody);
      try {
        const timeout = 100000; // 100 seconds timeout
        let repoSummaryResponse;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            const podcallPromise = orcaClient.podCall(`worker-task`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsonBody),
            });

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Podcall timeout after 100 seconds")), timeout)
            );

            repoSummaryResponse = await Promise.race([podcallPromise, timeoutPromise]);
            console.log("[TASK] repoSummaryResponse: ", repoSummaryResponse);
            break; // If successful, break the retry loop
          } catch (error: any) {
            console.log(`[TASK] Podcall attempt ${retryCount + 1} failed:`, error);
            retryCount++;
            if (retryCount === maxRetries) {
              throw new Error(`Podcall failed after ${maxRetries} attempts: ${error.message}`);
            }
            console.log(`[TASK] Retrying in 10 seconds...`);
            await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds before retry
          }
        }
      } catch (error) {
        //   await namespaceWrapper.storeSet(`result-${roundNumber}`, status.ISSUE_SUMMARIZATION_FAILED);
        console.error("[TASK] EXECUTE TASK ERROR:", error);
        continue;
      }
    } catch (error) {
      console.error("[TASK] EXECUTE TASK ERROR:", error);
      // Wait for 1 minute before retrying on error
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    // Wait for 1 minute before starting the next iteration
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
}
