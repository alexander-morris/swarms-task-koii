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
exports.routes = routes;
var namespace_wrapper_1 = require("@_koii/task-manager/namespace-wrapper");
var leader_1 = require("../utils/leader");
var _1_task_1 = require("./1-task");
var _2_submission_1 = require("./2-submission");
var _3_audit_1 = require("./3-audit");
var task_manager_1 = require("@_koii/task-manager");
var constant_1 = require("../utils/constant");
var axios_1 = require("axios");
// Swarms API configuration
var SWARMS_API_URL = process.env.SWARMS_API_URL || 'http://localhost:8080';
var SWARMS_API_KEY = process.env.SWARMS_API_KEY;
/**
 *
 * Define all your custom routes here
 *
 */
//Example route
function routes() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            namespace_wrapper_1.app.get("/value", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
                var value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeGet("value")];
                        case 1:
                            value = _a.sent();
                            console.log("value", value);
                            res.status(200).json({ value: value });
                            return [2 /*return*/];
                    }
                });
            }); });
            namespace_wrapper_1.app.get("/leader/:roundNumber/:submitterPublicKey", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var roundNumber, submitterPublicKey, _a, isLeader, leaderNode;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            roundNumber = req.params.roundNumber;
                            submitterPublicKey = req.params.submitterPublicKey;
                            return [4 /*yield*/, (0, leader_1.getLeaderNode)({
                                    roundNumber: Number(roundNumber),
                                    submitterPublicKey: submitterPublicKey,
                                })];
                        case 1:
                            _a = _b.sent(), isLeader = _a.isLeader, leaderNode = _a.leaderNode;
                            res.status(200).json({ isLeader: isLeader, leaderNode: leaderNode });
                            return [2 /*return*/];
                    }
                });
            }); });
            namespace_wrapper_1.app.get("/task/:roundNumber", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var roundNumber, taskResult, storedResult, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            console.log("task endpoint called with round number: ", req.params.roundNumber);
                            roundNumber = req.params.roundNumber;
                            return [4 /*yield*/, (0, _1_task_1.task)(Number(roundNumber))];
                        case 1:
                            taskResult = _a.sent();
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeGet("result-".concat(roundNumber))];
                        case 2:
                            storedResult = _a.sent();
                            if (!storedResult) {
                                throw new Error("No result found for this round");
                            }
                            result = JSON.parse(storedResult);
                            res.status(200).json({
                                result: taskResult,
                                swarmResult: result
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error("[TASK] Error in task endpoint:", error_1);
                            res.status(500).json({ error: "Failed to execute task" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            namespace_wrapper_1.app.get("/audit/:roundNumber/:cid/:submitterPublicKey", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var cid, roundNumber, submitterPublicKey, auditResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cid = req.params.cid;
                            roundNumber = req.params.roundNumber;
                            submitterPublicKey = req.params.submitterPublicKey;
                            return [4 /*yield*/, (0, _3_audit_1.audit)(cid, Number(roundNumber), submitterPublicKey)];
                        case 1:
                            auditResult = _a.sent();
                            res.status(200).json({ result: auditResult });
                            return [2 /*return*/];
                    }
                });
            }); });
            namespace_wrapper_1.app.get("/submission/:roundNumber", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var roundNumber, submissionResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roundNumber = req.params.roundNumber;
                            return [4 /*yield*/, (0, _2_submission_1.submission)(Number(roundNumber))];
                        case 1:
                            submissionResult = _a.sent();
                            res.status(200).json({ result: submissionResult });
                            return [2 /*return*/];
                    }
                });
            }); });
            namespace_wrapper_1.app.get("/submitDistribution/:roundNumber", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var roundNumber, submitDistributionResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roundNumber = req.params.roundNumber;
                            return [4 /*yield*/, task_manager_1.taskRunner.submitDistributionList(Number(roundNumber))];
                        case 1:
                            submitDistributionResult = _a.sent();
                            res.status(200).json({ result: submitDistributionResult });
                            return [2 /*return*/];
                    }
                });
            }); });
            namespace_wrapper_1.app.post("/add-todo-pr", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var signature, prUrl, swarmBountyId, success, message, publicKey, stakingKeypair, stakingKey, secretKey, middleServerPayload_1, middleServerSignature_1, middleServerResponse, payload, data, jsonData, middleServerPayload, middleServerSignature, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            signature = req.body.signature;
                            prUrl = req.body.prUrl;
                            swarmBountyId = req.body.swarmBountyId;
                            success = req.body.success;
                            message = req.body.message;
                            console.log("[TASK] req.body", req.body);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 11, , 12]);
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getMainAccountPubkey()];
                        case 2:
                            publicKey = _a.sent();
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getSubmitterAccount()];
                        case 3:
                            stakingKeypair = _a.sent();
                            if (!stakingKeypair) {
                                throw new Error("No staking key found");
                            }
                            stakingKey = stakingKeypair.publicKey.toBase58();
                            secretKey = stakingKeypair.secretKey;
                            if (!!success) return [3 /*break*/, 6];
                            middleServerPayload_1 = {
                                taskId: namespace_wrapper_1.TASK_ID,
                                swarmBountyId: swarmBountyId,
                                action: "add-todo-status",
                                stakingKey: stakingKey,
                            };
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.payloadSigning(middleServerPayload_1, secretKey)];
                        case 4:
                            middleServerSignature_1 = _a.sent();
                            console.error("[TASK] Error summarizing repository:", message);
                            console.log("[TASK] middleServerSignature", middleServerSignature_1);
                            return [4 /*yield*/, fetch("".concat(constant_1.middleServerUrl, "/summarizer/worker/add-todo-status"), {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ signature: middleServerSignature_1, stakingKey: stakingKey }),
                                })];
                        case 5:
                            middleServerResponse = _a.sent();
                            if (middleServerResponse.status !== 200) {
                                console.error("[TASK] Error posting to middle server:", middleServerResponse.statusText);
                                // throw new Error(`Posting to middle server failed: ${middleServerResponse.statusText}`);
                            }
                            return [2 /*return*/];
                        case 6:
                            if (!publicKey) {
                                throw new Error("No public key found");
                            }
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.verifySignature(signature, stakingKey)];
                        case 7:
                            payload = _a.sent();
                            if (!payload) {
                                throw new Error("Invalid signature");
                            }
                            console.log("[TASK] payload: ", payload);
                            data = payload.data;
                            if (!data) {
                                throw new Error("No signature data found");
                            }
                            jsonData = JSON.parse(data);
                            if (jsonData.taskId !== namespace_wrapper_1.TASK_ID) {
                                throw new Error("Invalid task ID from signature: ".concat(jsonData.taskId, ". Actual task ID: ").concat(namespace_wrapper_1.TASK_ID));
                            }
                            middleServerPayload = {
                                taskId: jsonData.taskId,
                                swarmBountyId: swarmBountyId,
                                prUrl: prUrl,
                                stakingKey: stakingKey,
                                publicKey: publicKey,
                                action: "add-todo-pr",
                            };
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.payloadSigning(middleServerPayload, secretKey)];
                        case 8:
                            middleServerSignature = _a.sent();
                            // const middleServerResponse = await fetch(`${middleServerUrl}/summarizer/worker/add-todo-pr`, {
                            //   method: "POST",
                            //   headers: {
                            //     "Content-Type": "application/json",
                            //   },
                            //   body: JSON.stringify({ signature: middleServerSignature, stakingKey: stakingKey }),
                            // });
                            // console.log("[TASK] Add PR Response: ", middleServerResponse);
                            //
                            // if (middleServerResponse.status !== 200) {
                            //   throw new Error(`Posting to middle server failed: ${middleServerResponse.statusText}`);
                            // }
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("shouldMakeSubmission", "true")];
                        case 9:
                            // const middleServerResponse = await fetch(`${middleServerUrl}/summarizer/worker/add-todo-pr`, {
                            //   method: "POST",
                            //   headers: {
                            //     "Content-Type": "application/json",
                            //   },
                            //   body: JSON.stringify({ signature: middleServerSignature, stakingKey: stakingKey }),
                            // });
                            // console.log("[TASK] Add PR Response: ", middleServerResponse);
                            //
                            // if (middleServerResponse.status !== 200) {
                            //   throw new Error(`Posting to middle server failed: ${middleServerResponse.statusText}`);
                            // }
                            _a.sent();
                            return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("swarmBountyId", swarmBountyId.toString())];
                        case 10:
                            _a.sent();
                            res.status(200).json({ result: "Successfully saved PR" });
                            return [3 /*break*/, 12];
                        case 11:
                            error_2 = _a.sent();
                            console.error("[TASK] Error adding PR to summarizer todo:", error_2);
                            // await namespaceWrapper.storeSet(`result-${roundNumber}`, status.SAVING_TODO_PR_FAILED);
                            res.status(400).json({ error: "Failed to save PR" });
                            return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            }); });
            // New route to check swarm status
            namespace_wrapper_1.app.get("/swarm-status/:jobId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var jobId, response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            jobId = req.params.jobId;
                            return [4 /*yield*/, axios_1.default.get("".concat(SWARMS_API_URL, "/v1/swarm/logs"), {
                                    headers: {
                                        'x-api-key': SWARMS_API_KEY
                                    },
                                    params: {
                                        job_id: jobId
                                    }
                                })];
                        case 1:
                            response = _a.sent();
                            res.status(200).json(response.data);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error("[TASK] Error fetching swarm status:", error_3);
                            res.status(500).json({ error: "Failed to fetch swarm status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // New route to get available models
            namespace_wrapper_1.app.get("/available-models", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
                var response, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.get("".concat(SWARMS_API_URL, "/v1/models/available"), {
                                    headers: {
                                        'x-api-key': SWARMS_API_KEY
                                    }
                                })];
                        case 1:
                            response = _a.sent();
                            res.status(200).json(response.data);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            console.error("[TASK] Error fetching available models:", error_4);
                            res.status(500).json({ error: "Failed to fetch available models" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // New route to get available swarm types
            namespace_wrapper_1.app.get("/available-swarm-types", function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
                var response, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.get("".concat(SWARMS_API_URL, "/v1/swarms/available"), {
                                    headers: {
                                        'x-api-key': SWARMS_API_KEY
                                    }
                                })];
                        case 1:
                            response = _a.sent();
                            res.status(200).json(response.data);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            console.error("[TASK] Error fetching available swarm types:", error_5);
                            res.status(500).json({ error: "Failed to fetch available swarm types" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
// TODO: To be completed
namespace_wrapper_1.app.post("/failed-task", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).json({ result: "Successfully saved task result" });
        return [2 /*return*/];
    });
}); });
