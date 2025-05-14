const result = await Promise.race([
  auditWithTimeout(cid, roundNumber, submitterKey),
  new Promise((_, reject) => setTimeout(() => reject(new Error("Audit timeout")), TIMEOUT_MS)),
]) as boolean | void;
if (typeof result === "boolean" || typeof result === "undefined") {
  return result;
} else {
  return true;
} 