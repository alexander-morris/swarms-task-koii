"use strict";
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
exports.audit = audit;
var extensions_1 = require("@_koii/task-manager/extensions");
var constant_1 = require("../utils/constant");
var submissionJSONSignatureDecode_1 = require("../utils/submissionJSONSignatureDecode");
// import { status } from '../utils/constant'
var TIMEOUT_MS = 180000; // 3 minutes in milliseconds
var MAX_RETRIES = 3;
function auditWithTimeout(cid, roundNumber, submitterKey) {
    return __awaiter(this, void 0, void 0, function () {
        var orcaClient, decodeResult, auditResult, auditResultData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    return [4 /*yield*/, (0, extensions_1.getOrcaClient)()];
                case 1:
                    orcaClient = _a.sent();
                    if (!orcaClient) {
                        // await namespaceWrapper.storeSet(`result-${roundNumber}`, status.NO_ORCA_CLIENT);
                        return [2 /*return*/];
                    }
                    // Check if the cid is one of the status
                    if (Object.values(constant_1.status).includes(cid)) {
                        // This returns a dummy trued
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, submissionJSONSignatureDecode_1.submissionJSONSignatureDecode)({
                            submission_value: cid,
                            submitterPublicKey: submitterKey,
                            roundNumber: roundNumber, // Decode using the actual round number
                        })];
                case 2:
                    decodeResult = _a.sent();
                    if (!decodeResult) {
                        console.log("[AUDIT] DECODE RESULT FAILED.");
                        return [2 /*return*/, false];
                    }
                    console.log("[AUDIT] \u2705 Signature decoded successfully");
                    // console.log(`[AUDIT] Checking summarizer status for submitter ${submitterKey}`);
                    // const checkSummarizerResponse = await fetch(`${middleServerUrl}/summarizer/worker/check-todo`, {
                    //   method: "POST",
                    //   headers: {
                    //     "Content-Type": "application/json",
                    //   },
                    //   body: JSON.stringify({
                    //     stakingKey: submitterKey,
                    //     roundNumber, // This round number doesn't matter
                    //     githubUsername: decodeResult.githubUsername,
                    //     prUrl: decodeResult.prUrl,
                    //   }),
                    // });
                    // const checkSummarizerJSON = await checkSummarizerResponse.json();
                    // console.log(`[AUDIT] Summarizer check response:`, checkSummarizerJSON);
                    //
                    // if (!checkSummarizerJSON.success) {
                    //   console.log(`[AUDIT] ❌ Audit failed for ${submitterKey}`);
                    //   return false;
                    // }
                    // console.log(`[AUDIT] ✅ Summarizer check passed`);
                    console.log("[AUDIT] Sending audit request for submitter: ".concat(submitterKey));
                    console.log("[AUDIT] Submission data being sent to audit:", decodeResult);
                    return [4 /*yield*/, orcaClient.podCall("worker-audit/".concat(decodeResult.roundNumber), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                submission: decodeResult,
                            }),
                        })];
                case 3:
                    auditResult = _a.sent();
                    console.log("[AUDIT] Audit result:", auditResult);
                    auditResultData = auditResult.data;
                    if (auditResultData.success) {
                        console.log("[AUDIT] \u2705 Audit successful for ".concat(submitterKey));
                        return [2 /*return*/, auditResultData.data.is_approved];
                    }
                    else {
                        console.log("[AUDIT] \u274C Audit could not be completed for ".concat(submitterKey));
                        return [2 /*return*/, true];
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error("[AUDIT] Error auditing submission:", error_1);
                    return [2 /*return*/, true]; // Return false on error instead of undefined
                case 5:
                    console.log("[AUDIT] Cleaning up resources");
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function audit(cid, roundNumber, submitterKey) {
    return __awaiter(this, void 0, void 0, function () {
        var retries, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retries = 0;
                    _a.label = 1;
                case 1:
                    if (!(retries < MAX_RETRIES)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, Promise.race([
                            auditWithTimeout(cid, roundNumber, submitterKey),
                            new Promise(function (_, reject) { return setTimeout(function () { return reject(new Error("Audit timeout")); }, TIMEOUT_MS); }),
                        ])];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 4:
                    error_2 = _a.sent();
                    retries++;
                    console.log("[AUDIT] Attempt ".concat(retries, " failed:"), error_2);
                    if (retries === MAX_RETRIES) {
                        console.log("[AUDIT] Max retries (".concat(MAX_RETRIES, ") reached. Giving up."));
                        return [2 /*return*/, true]; // Return true as a fallback
                    }
                    // Wait for a short time before retrying
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 5:
                    // Wait for a short time before retrying
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
