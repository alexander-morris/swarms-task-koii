"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submission = submission;
var ipfs_1 = require("../utils/ipfs");
var extensions_1 = require("@_koii/task-manager/extensions");
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
var checks_1 = require("../utils/check/checks");
function submission(roundNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var stakingKeypair, pubKey, stakingKey, secretKey, orcaClient, shouldMakeSubmission, cid, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, checks_1.preRunCheck)(roundNumber.toString())];
                case 1:
                    /**
                     * Retrieve the task proofs from your container and submit for auditing
                     * Must return a string of max 512 bytes to be submitted on chain
                     * The default implementation handles uploading the proofs to IPFS
                     * and returning the CID
                     */
                    if (!(_a.sent())) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getSubmitterAccount()];
                case 2:
                    stakingKeypair = _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getMainAccountPubkey()];
                case 3:
                    pubKey = _a.sent();
                    if (!stakingKeypair || !pubKey) {
                        console.error("[SUBMISSION] No staking keypair or public key found");
                        throw new Error("No staking keypair or public key found");
                    }
                    stakingKey = stakingKeypair.publicKey.toBase58();
                    secretKey = stakingKeypair.secretKey;
                    console.log("[SUBMISSION] Starting submission process for round ".concat(roundNumber));
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, initializeOrcaClient()];
                case 5:
                    orcaClient = _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeGet("shouldMakeSubmission")];
                case 6:
                    shouldMakeSubmission = _a.sent();
                    if (!shouldMakeSubmission || shouldMakeSubmission !== "true") {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, makeSubmission({
                            orcaClient: orcaClient,
                            roundNumber: roundNumber,
                            stakingKey: stakingKey,
                            publicKey: pubKey,
                            secretKey: secretKey,
                        })];
                case 7:
                    cid = _a.sent();
                    return [2 /*return*/, cid || void 0];
                case 8:
                    error_1 = _a.sent();
                    console.error("[SUBMISSION] Error during submission process:", error_1);
                    throw error_1;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function initializeOrcaClient() {
    return __awaiter(this, void 0, void 0, function () {
        var orcaClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SUBMISSION] Initializing Orca client...");
                    return [4 /*yield*/, (0, extensions_1.getOrcaClient)()];
                case 1:
                    orcaClient = _a.sent();
                    if (!orcaClient) {
                        console.error("[SUBMISSION] Failed to initialize Orca client");
                        throw new Error("Failed to initialize Orca client");
                    }
                    console.log("[SUBMISSION] Orca client initialized successfully");
                    return [2 /*return*/, orcaClient];
            }
        });
    });
}
function makeSubmission(params) {
    return __awaiter(this, void 0, void 0, function () {
        var orcaClient, roundNumber, stakingKey, publicKey, secretKey, swarmBountyId, submissionData, signature, cid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    orcaClient = params.orcaClient, roundNumber = params.roundNumber, stakingKey = params.stakingKey, publicKey = params.publicKey, secretKey = params.secretKey;
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeGet("swarmBountyId")];
                case 1:
                    swarmBountyId = _a.sent();
                    if (!swarmBountyId) {
                        console.log("[SUBMISSION] No swarm bounty id found for this round");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetchSubmissionData(orcaClient, swarmBountyId)];
                case 2:
                    submissionData = _a.sent();
                    if (!submissionData) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, notifyMiddleServer({
                            taskId: namespace_wrapper_1.TASK_ID,
                            swarmBountyId: swarmBountyId,
                            prUrl: submissionData.prUrl,
                            stakingKey: stakingKey,
                            publicKey: publicKey,
                            secretKey: secretKey,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, signSubmissionPayload(__assign({ taskId: namespace_wrapper_1.TASK_ID, roundNumber: roundNumber, stakingKey: stakingKey, pubKey: publicKey }, submissionData), secretKey)];
                case 4:
                    signature = _a.sent();
                    return [4 /*yield*/, storeSubmissionOnIPFS(signature)];
                case 5:
                    cid = _a.sent();
                    return [4 /*yield*/, cleanupSubmissionState()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, cid];
            }
        });
    });
}
function fetchSubmissionData(orcaClient, swarmBountyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, submission;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SUBMISSION] Fetching submission data for swarm bounty ".concat(swarmBountyId));
                    return [4 /*yield*/, orcaClient.podCall("submission/".concat(swarmBountyId))];
                case 1:
                    result = _a.sent();
                    if (!result || result.data === "No submission") {
                        console.log("[SUBMISSION] No existing submission found");
                        return [2 /*return*/, null];
                    }
                    submission = typeof result.data === "object" && "data" in result.data ? result.data.data : result.data;
                    if (!(submission === null || submission === void 0 ? void 0 : submission.prUrl)) {
                        throw new Error("Submission is missing PR URL");
                    }
                    return [2 /*return*/, submission];
            }
        });
    });
}
function notifyMiddleServer(params) {
    return __awaiter(this, void 0, void 0, function () {
        var taskId, swarmBountyId, prUrl, stakingKey, publicKey, secretKey, payload, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskId = params.taskId, swarmBountyId = params.swarmBountyId, prUrl = params.prUrl, stakingKey = params.stakingKey, publicKey = params.publicKey, secretKey = params.secretKey;
                    payload = {
                        taskId: taskId,
                        swarmBountyId: swarmBountyId,
                        prUrl: prUrl,
                        stakingKey: stakingKey,
                        publicKey: publicKey,
                        action: "add-round-number",
                    };
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.payloadSigning(payload, secretKey)];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function signSubmissionPayload(payload, secretKey) {
    return __awaiter(this, void 0, void 0, function () {
        var signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SUBMISSION] Signing submission payload...");
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.payloadSigning(payload, secretKey)];
                case 1:
                    signature = _a.sent();
                    console.log("[SUBMISSION] Payload signed successfully");
                    return [2 /*return*/, signature];
            }
        });
    });
}
function storeSubmissionOnIPFS(signature) {
    return __awaiter(this, void 0, void 0, function () {
        var cid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[SUBMISSION] Storing submission on IPFS...");
                    return [4 /*yield*/, (0, ipfs_1.storeFile)({ signature: signature }, "submission.json")];
                case 1:
                    cid = _a.sent();
                    if (!cid) {
                        throw new Error("Failed to store submission on IPFS");
                    }
                    console.log("[SUBMISSION] Submission stored successfully. CID:", cid);
                    return [2 /*return*/, cid];
            }
        });
    });
}
function cleanupSubmissionState() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("shouldMakeSubmission", "false")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("swarmBountyId", "")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
