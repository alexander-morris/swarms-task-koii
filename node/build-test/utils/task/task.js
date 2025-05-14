"use strict";
// import { namespaceWrapper } from "@_koii/namespace-wrapper";
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
exports.task = task;
var extensions_1 = require("@_koii/task-manager/extensions");
var constant_1 = require("../constant");
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
var types_1 = require("@_koii/namespace-wrapper/dist/types");
function task() {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function () {
                        var requiredWorkResponse, orcaClient, stakingKeypair, pubKey, stakingKey, signature, retryDelay_1, requiredWorkResponseData, alreadyAssigned, podcallPayload, podCallSignature, jsonBody, timeout_1, repoSummaryResponse, retryCount, maxRetries, podcallPromise, timeoutPromise, error_1, error_2, error_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 28, , 30]);
                                    requiredWorkResponse = void 0;
                                    return [4 /*yield*/, (0, extensions_1.getOrcaClient)()];
                                case 1:
                                    orcaClient = _b.sent();
                                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getSubmitterAccount()];
                                case 2:
                                    stakingKeypair = _b.sent();
                                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getMainAccountPubkey()];
                                case 3:
                                    pubKey = _b.sent();
                                    if (!(!orcaClient || !stakingKeypair || !pubKey)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.logMessage(types_1.LogLevel.Error, constant_1.errorMessage.NO_ORCA_CLIENT, constant_1.actionMessage.NO_ORCA_CLIENT)];
                                case 4:
                                    _b.sent();
                                    // Wait for 1 minute before retrying
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                                case 5:
                                    // Wait for 1 minute before retrying
                                    _b.sent();
                                    return [2 /*return*/, "continue"];
                                case 6:
                                    stakingKey = stakingKeypair.publicKey.toBase58();
                                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.payloadSigning({
                                            taskId: namespace_wrapper_1.TASK_ID,
                                            // roundNumber: roundNumber,
                                            action: "fetch-todo",
                                            githubUsername: process.env.GITHUB_USERNAME,
                                            stakingKey: stakingKey,
                                        }, stakingKeypair.secretKey)];
                                case 7:
                                    signature = _b.sent();
                                    retryDelay_1 = 60000;
                                    _b.label = 8;
                                case 8:
                                    if (!true) return [3 /*break*/, 11];
                                    return [4 /*yield*/, fetch("".concat(constant_1.middleServerUrl, "/summarizer/worker/fetch-todo"), {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ signature: signature, stakingKey: stakingKey }),
                                        })];
                                case 9:
                                    requiredWorkResponse = _b.sent();
                                    if (requiredWorkResponse.status === 200) {
                                        return [3 /*break*/, 11];
                                    }
                                    console.log("[TASK] Server returned status ".concat(requiredWorkResponse.status, ", retrying in ").concat(retryDelay_1 / 1000, " seconds..."));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelay_1); })];
                                case 10:
                                    _b.sent();
                                    return [3 /*break*/, 8];
                                case 11:
                                    // check if the response is 200 after all retries
                                    if (!requiredWorkResponse || requiredWorkResponse.status !== 200) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, requiredWorkResponse.json()];
                                case 12:
                                    requiredWorkResponseData = _b.sent();
                                    console.log("[TASK] requiredWorkResponseData: ", requiredWorkResponseData);
                                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeGet(JSON.stringify(requiredWorkResponseData.data.id))];
                                case 13:
                                    alreadyAssigned = _b.sent();
                                    if (!alreadyAssigned) return [3 /*break*/, 14];
                                    return [2 /*return*/, "continue"];
                                case 14: return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet(JSON.stringify(requiredWorkResponseData.data.id), "initialized")];
                                case 15:
                                    _b.sent();
                                    _b.label = 16;
                                case 16:
                                    podcallPayload = {
                                        taskId: namespace_wrapper_1.TASK_ID,
                                    };
                                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.payloadSigning(podcallPayload, stakingKeypair.secretKey)];
                                case 17:
                                    podCallSignature = _b.sent();
                                    jsonBody = {
                                        task_id: namespace_wrapper_1.TASK_ID,
                                        swarmBountyId: requiredWorkResponseData.data.id,
                                        repo_url: "https://github.com/".concat(requiredWorkResponseData.data.repo_owner, "/").concat(requiredWorkResponseData.data.repo_name),
                                        podcall_signature: podCallSignature,
                                    };
                                    console.log("[TASK] jsonBody: ", jsonBody);
                                    _b.label = 18;
                                case 18:
                                    _b.trys.push([18, 26, , 27]);
                                    timeout_1 = 100000;
                                    repoSummaryResponse = void 0;
                                    retryCount = 0;
                                    maxRetries = 3;
                                    _b.label = 19;
                                case 19:
                                    if (!(retryCount < maxRetries)) return [3 /*break*/, 25];
                                    _b.label = 20;
                                case 20:
                                    _b.trys.push([20, 22, , 24]);
                                    podcallPromise = orcaClient.podCall("worker-task", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(jsonBody),
                                    });
                                    timeoutPromise = new Promise(function (_, reject) {
                                        return setTimeout(function () { return reject(new Error("Podcall timeout after 100 seconds")); }, timeout_1);
                                    });
                                    return [4 /*yield*/, Promise.race([podcallPromise, timeoutPromise])];
                                case 21:
                                    repoSummaryResponse = _b.sent();
                                    console.log("[TASK] repoSummaryResponse: ", repoSummaryResponse);
                                    return [3 /*break*/, 25]; // If successful, break the retry loop
                                case 22:
                                    error_1 = _b.sent();
                                    console.log("[TASK] Podcall attempt ".concat(retryCount + 1, " failed:"), error_1);
                                    retryCount++;
                                    if (retryCount === maxRetries) {
                                        throw new Error("Podcall failed after ".concat(maxRetries, " attempts: ").concat(error_1.message));
                                    }
                                    console.log("[TASK] Retrying in 10 seconds...");
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                                case 23:
                                    _b.sent(); // Wait 10 seconds before retry
                                    return [3 /*break*/, 24];
                                case 24: return [3 /*break*/, 19];
                                case 25: return [3 /*break*/, 27];
                                case 26:
                                    error_2 = _b.sent();
                                    //   await namespaceWrapper.storeSet(`result-${roundNumber}`, status.ISSUE_SUMMARIZATION_FAILED);
                                    console.error("[TASK] EXECUTE TASK ERROR:", error_2);
                                    return [2 /*return*/, "continue"];
                                case 27: return [3 /*break*/, 30];
                                case 28:
                                    error_3 = _b.sent();
                                    console.error("[TASK] EXECUTE TASK ERROR:", error_3);
                                    // Wait for 1 minute before retrying on error
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                                case 29:
                                    // Wait for 1 minute before retrying on error
                                    _b.sent();
                                    return [3 /*break*/, 30];
                                case 30: 
                                // Wait for 1 minute before starting the next iteration
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
                                case 31:
                                    // Wait for 1 minute before starting the next iteration
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
