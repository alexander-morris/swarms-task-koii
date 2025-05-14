"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleServerUrl = exports.customReward = exports.defaultBountyMarkdownFile = exports.actionMessage = exports.errorMessage = exports.status = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
exports.status = {
    // ISSUE_SUMMARIZATION_FAILED: "Issue summarization failed",
    // NO_ISSUES_PENDING_TO_BE_SUMMARIZED: "No issues pending to be summarized",
    // NOT_SELECTED_AS_SUMMARIZER: "Not selected as summarizer",
    // SAVING_TODO_PR_FAILED: "Summarizer todo PR not saved",
    // SAVING_TODO_PR_SUCCEEDED: "Summarizer todo PR saved",
    // NO_SUBMISSION_BUT_SUBMISSION_CALLED: "No submission but submission called",
    // Add new Swarms statuses here as needed
    ROUND_LESS_THAN_OR_EQUAL_TO_1: "Round <= 1",
    NO_ORCA_CLIENT: "No orca client",
    UNKNOWN_ERROR: "Unknown error",
    STAR_ISSUE_FAILED: "Star issue failed",
    GITHUB_CHECK_FAILED: "GitHub check failed",
    ANTHROPIC_API_KEY_INVALID: "Anthropic API key invalid",
    ANTHROPIC_API_KEY_NO_CREDIT: "Anthropic API key has no credit",
    NO_DATA_FOR_THIS_ROUND: "No data for this round",
    NOT_FINISHED_TASK: "Not finished task",
    TASK_EXECUTION_FAILED: "Task execution failed"
};
exports.errorMessage = {
    // ISSUE_FAILED_TO_BE_SUMMARIZED: "We couldn't summarize this issue. Please try again later.",
    // ISSUE_SUCCESSFULLY_SUMMARIZED: "The issue was successfully summarized.",
    // NO_ISSUES_PENDING_TO_BE_SUMMARIZED: "There are no issues waiting to be summarized at this time.",
    // NO_CHOSEN_AS_ISSUE_SUMMARIZER: "You haven't been selected as an issue summarizer.",
    // ISSUE_FAILED_TO_ADD_PR_TO_SUMMARIZER_TODO: "We couldn't add the PR to the summarizer todo list.",
    ROUND_LESS_THAN_OR_EQUAL_TO_1: "This operation requires a round number greater than 1.",
    NO_ORCA_CLIENT: "The Orca client is not available.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again later.",
    STAR_ISSUE_FAILED: "We couldn't star the issue. Please try again later.",
    GITHUB_CHECK_FAILED: "The GitHub check failed. Please verify your GitHub Key.",
    ANTHROPIC_API_KEY_INVALID: "The Anthropic API Key is not valid. Please check your API key.",
    ANTHROPIC_API_KEY_NO_CREDIT: "Your Anthropic API key has no remaining credits.",
    NO_DATA_FOR_THIS_ROUND: "There is no data available for this round."
};
exports.actionMessage = {
    // ISSUE_FAILED_TO_BE_SUMMARIZED: "We couldn't summarize this issue. Please try again later.",
    // ISSUE_SUCCESSFULLY_SUMMARIZED: "The issue was successfully summarized.",
    // NO_ISSUES_PENDING_TO_BE_SUMMARIZED: "There are no issues waiting to be summarized at this time.",
    // NO_CHOSEN_AS_ISSUE_SUMMARIZER: "You haven't been selected as an issue summarizer.",
    // ISSUE_FAILED_TO_ADD_PR_TO_SUMMARIZER_TODO: "We couldn't add the PR to the summarizer todo list. Please try again later.",
    ROUND_LESS_THAN_OR_EQUAL_TO_1: "This operation requires a round number greater than 1.",
    NO_ORCA_CLIENT: "Please click Orca icon to connect your Orca Pod.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again later.",
    STAR_ISSUE_FAILED: "We couldn't star the issue. Please try again later.",
    GITHUB_CHECK_FAILED: "Please go to the env variable page to update your GitHub Key.",
    ANTHROPIC_API_KEY_INVALID: "Please follow the guide under task description page to set up your Anthropic API key correctly.",
    ANTHROPIC_API_KEY_NO_CREDIT: "Please add credits to continue.",
    NO_DATA_FOR_THIS_ROUND: "There is no data available for this round."
};
/*********************THE CONSTANTS THAT PROD/TEST ARE DIFFERENT *********************/
exports.defaultBountyMarkdownFile = "https://raw.githubusercontent.com/koii-network/prometheus-swarm-bounties/master/README.md";
exports.customReward = 400 * Math.pow(10, 9); // This should be in ROE!
exports.middleServerUrl = "https://builder247-prod.dev.koii.network";
