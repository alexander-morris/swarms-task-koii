async function signSubmissionPayload(payload: any, secretKey: Uint8Array<ArrayBufferLike>): Promise<string | void> {
  console.log("[SUBMISSION] Signing submission payload...");
  const signature = await namespaceWrapper.payloadSigning(payload, secretKey);
  console.log("[SUBMISSION] Payload signed successfully");
  return signature;
} 