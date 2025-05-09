import { isValidAnthropicApiKey } from "./anthropicCheck";

import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { LogLevel } from "@_koii/namespace-wrapper/dist/types";
import { errorMessage, actionMessage, status } from "../constant";
import { checkAnthropicAPIKey } from "./anthropicCheck";
import { checkGitHub } from "./githubCheck";
export async function preRunCheck(roundNumber: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    await namespaceWrapper.logMessage(
      LogLevel.Error,
      errorMessage.ANTHROPIC_API_KEY_INVALID,
      actionMessage.ANTHROPIC_API_KEY_INVALID,
    );
    await namespaceWrapper.storeSet(`result-${roundNumber}`, status.ANTHROPIC_API_KEY_INVALID);
    return false;
  }
  if (!isValidAnthropicApiKey(process.env.ANTHROPIC_API_KEY!)) {
    await namespaceWrapper.logMessage(
      LogLevel.Error,
      errorMessage.ANTHROPIC_API_KEY_INVALID,
      actionMessage.ANTHROPIC_API_KEY_INVALID,
    );
    await namespaceWrapper.storeSet(`result-${roundNumber}`, status.ANTHROPIC_API_KEY_INVALID);
    return false;
  }
  const isAnthropicAPIKeyValid = await checkAnthropicAPIKey(process.env.ANTHROPIC_API_KEY!);
  if (!isAnthropicAPIKeyValid) {
    await namespaceWrapper.logMessage(
      LogLevel.Error,
      errorMessage.ANTHROPIC_API_KEY_NO_CREDIT,
      actionMessage.ANTHROPIC_API_KEY_NO_CREDIT,
    );
    await namespaceWrapper.storeSet(`result-${roundNumber}`, status.ANTHROPIC_API_KEY_NO_CREDIT);
    return false;
  }
  if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN) {
    await namespaceWrapper.logMessage(
      LogLevel.Error,
      errorMessage.GITHUB_CHECK_FAILED,
      actionMessage.GITHUB_CHECK_FAILED,
    );
    await namespaceWrapper.storeSet(`result-${roundNumber}`, status.GITHUB_CHECK_FAILED);
    return false;
  }
  const isGitHubValid = await checkGitHub(process.env.GITHUB_USERNAME!, process.env.GITHUB_TOKEN!);
  if (!isGitHubValid) {
    await namespaceWrapper.logMessage(
      LogLevel.Error,
      errorMessage.GITHUB_CHECK_FAILED,
      actionMessage.GITHUB_CHECK_FAILED,
    );
    await namespaceWrapper.storeSet(`result-${roundNumber}`, status.GITHUB_CHECK_FAILED);
    return false;
  }
  return true;
}
