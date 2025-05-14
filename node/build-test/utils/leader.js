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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRoundSubmissionGitHubRepoOwner = fetchRoundSubmissionGitHubRepoOwner;
exports.selectShortestDistance = selectShortestDistance;
exports.getRandomNodes = getRandomNodes;
exports.getLeaderNode = getLeaderNode;
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
var ipfs_1 = require("./ipfs");
var seedrandom_1 = require("seedrandom");
function fetchRoundSubmissionGitHubRepoOwner(roundNumber, submitterPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var taskSubmissionInfo, submissions, lastRound, lastRoundSubmissions, lastRoundSubmitterSubmission, cid, submissionString, submission, signaturePayload, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getTaskSubmissionInfo(roundNumber)];
                case 1:
                    taskSubmissionInfo = _a.sent();
                    if (!taskSubmissionInfo) {
                        console.error("NO TASK SUBMISSION INFO");
                        return [2 /*return*/, null];
                    }
                    submissions = taskSubmissionInfo.submissions;
                    lastRound = Object.keys(submissions).pop();
                    if (!lastRound) {
                        return [2 /*return*/, null];
                    }
                    lastRoundSubmissions = submissions[lastRound];
                    lastRoundSubmitterSubmission = lastRoundSubmissions[submitterPublicKey];
                    console.log("lastRoundSubmitterSubmission", { lastRoundSubmitterSubmission: lastRoundSubmitterSubmission });
                    if (!lastRoundSubmitterSubmission) {
                        return [2 /*return*/, null];
                    }
                    cid = lastRoundSubmitterSubmission.submission_value;
                    return [4 /*yield*/, (0, ipfs_1.getFile)(cid)];
                case 2:
                    submissionString = _a.sent();
                    submission = JSON.parse(submissionString);
                    console.log({ submission: submission });
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.verifySignature(submission.signature, submitterPublicKey)];
                case 3:
                    signaturePayload = _a.sent();
                    console.log({ signaturePayload: signaturePayload });
                    // verify the signature payload
                    if (signaturePayload.error || !signaturePayload.data) {
                        console.error("INVALID SIGNATURE");
                        return [2 /*return*/, null];
                    }
                    data = JSON.parse(signaturePayload.data);
                    if (data.taskId !== namespace_wrapper_1.TASK_ID || data.stakingKey !== submitterPublicKey) {
                        console.error("INVALID SIGNATURE DATA");
                        return [2 /*return*/, null];
                    }
                    if (!data.githubUsername) {
                        console.error("NO GITHUB USERNAME");
                        console.log("data", { data: data });
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data.githubUsername];
                case 4:
                    error_1 = _a.sent();
                    console.error("FETCH LAST ROUND SUBMISSION GITHUB REPO OWNER ERROR:", error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function selectShortestDistance(keys, submitterPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var shortestDistance, closestKey, _i, keys_1, key, distance;
        return __generator(this, function (_a) {
            shortestDistance = Infinity;
            closestKey = "";
            for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                key = keys_1[_i];
                distance = knnDistance(submitterPublicKey, key);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    closestKey = key;
                }
            }
            return [2 /*return*/, closestKey];
        });
    });
}
function getSubmissionInfo(roundNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getTaskSubmissionInfo(roundNumber)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_2 = _a.sent();
                    console.error("GET SUBMISSION INFO ERROR:", error_2);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function calculatePublicKeyFrequency(submissions) {
    var frequency = {};
    for (var round in submissions) {
        for (var publicKey in submissions[round]) {
            if (frequency[publicKey]) {
                frequency[publicKey]++;
            }
            else {
                frequency[publicKey] = 1;
            }
        }
    }
    return frequency;
}
function handleAuditTrigger(submissionAuditTrigger) {
    var auditTriggerKeys = new Set();
    for (var round in submissionAuditTrigger) {
        for (var publicKey in submissionAuditTrigger[round]) {
            auditTriggerKeys.add(publicKey);
        }
    }
    return auditTriggerKeys;
}
function selectLeaderKey(sortedKeys, leaderNumber, submitterPublicKey, submissionPublicKeysFrequency) {
    return __awaiter(this, void 0, void 0, function () {
        var topValue, count, rng_1, guaranteedKeys, randomKeys, keys, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    topValue = sortedKeys[leaderNumber - 1];
                    count = sortedKeys.filter(function (key) { return submissionPublicKeysFrequency[key] >= submissionPublicKeysFrequency[topValue]; }).length;
                    if (!(count >= leaderNumber)) return [3 /*break*/, 2];
                    rng_1 = (0, seedrandom_1.default)(String(namespace_wrapper_1.TASK_ID));
                    guaranteedKeys = sortedKeys.filter(function (key) { return submissionPublicKeysFrequency[key] > submissionPublicKeysFrequency[topValue]; });
                    randomKeys = sortedKeys
                        .filter(function (key) { return submissionPublicKeysFrequency[key] === submissionPublicKeysFrequency[topValue]; })
                        .sort(function () { return rng_1() - 0.5; })
                        .slice(0, leaderNumber - guaranteedKeys.length);
                    keys = __spreadArray(__spreadArray([], guaranteedKeys, true), randomKeys, true);
                    return [4 /*yield*/, selectShortestDistance(keys, submitterPublicKey)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    keys = sortedKeys.slice(0, leaderNumber);
                    return [4 /*yield*/, selectShortestDistance(keys, submitterPublicKey)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getRandomNodes(roundNumber, numberOfNodes) {
    return __awaiter(this, void 0, void 0, function () {
        var lastRoundSubmission, lastRoundSubmissions, lastRound, submissions, availableKeys, seed, rng, randomKeys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Getting random nodes for round:", roundNumber, "with number of nodes:", numberOfNodes);
                    return [4 /*yield*/, getSubmissionInfo(roundNumber - 1)];
                case 1:
                    lastRoundSubmission = _a.sent();
                    console.log("Last round submission:", lastRoundSubmission);
                    if (!lastRoundSubmission) {
                        return [2 /*return*/, []];
                    }
                    lastRoundSubmissions = lastRoundSubmission.submissions;
                    console.log("Last round submissions:", lastRoundSubmissions);
                    lastRound = Object.keys(lastRoundSubmissions).pop();
                    if (!lastRound) {
                        return [2 /*return*/, []];
                    }
                    submissions = lastRoundSubmissions[lastRound];
                    console.log("Submissions:", submissions);
                    availableKeys = Object.keys(submissions);
                    console.log("Available keys:", availableKeys);
                    // If we have fewer submissions than requested nodes, return all available submissions
                    if (availableKeys.length <= numberOfNodes) {
                        return [2 /*return*/, availableKeys];
                    }
                    seed = namespace_wrapper_1.TASK_ID + roundNumber.toString() || "default" + roundNumber;
                    rng = (0, seedrandom_1.default)(seed);
                    randomKeys = availableKeys.sort(function () { return rng() - 0.5; }).slice(0, numberOfNodes);
                    console.log("Random keys:", randomKeys);
                    return [2 /*return*/, randomKeys];
            }
        });
    });
}
// Helper function that finds the leader for a specific round
function getLeaderForRound(roundNumber, maxLeaderNumber, submitterPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var submissionPublicKeysFrequency, submissionAuditTriggerKeys, i, taskSubmissionInfo, submissions, frequency, auditTriggerKeys, keysNotInAuditTrigger, sortedKeys, chosenKey, leaderNumber, i, githubUsername;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (roundNumber <= 0) {
                        return [2 /*return*/, { chosenKey: null, leaderNode: null }];
                    }
                    submissionPublicKeysFrequency = {};
                    submissionAuditTriggerKeys = new Set();
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 4];
                    return [4 /*yield*/, getSubmissionInfo(roundNumber - i)];
                case 2:
                    taskSubmissionInfo = _a.sent();
                    console.log({ taskSubmissionInfo: taskSubmissionInfo });
                    if (taskSubmissionInfo) {
                        submissions = taskSubmissionInfo.submissions;
                        frequency = calculatePublicKeyFrequency(submissions);
                        Object.assign(submissionPublicKeysFrequency, frequency);
                        auditTriggerKeys = handleAuditTrigger(taskSubmissionInfo.submissions_audit_trigger);
                        auditTriggerKeys.forEach(function (key) { return submissionAuditTriggerKeys.add(key); });
                    }
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    keysNotInAuditTrigger = Object.keys(submissionPublicKeysFrequency).filter(function (key) { return !submissionAuditTriggerKeys.has(key); });
                    sortedKeys = keysNotInAuditTrigger.sort(function (a, b) { return submissionPublicKeysFrequency[b] - submissionPublicKeysFrequency[a]; });
                    console.log({ sortedKeys: sortedKeys });
                    chosenKey = null;
                    leaderNumber = sortedKeys.length < maxLeaderNumber ? sortedKeys.length : maxLeaderNumber;
                    return [4 /*yield*/, selectLeaderKey(sortedKeys, leaderNumber, submitterPublicKey, submissionPublicKeysFrequency)];
                case 5:
                    chosenKey = _a.sent();
                    i = 1;
                    _a.label = 6;
                case 6:
                    if (!(i < 5)) return [3 /*break*/, 9];
                    return [4 /*yield*/, fetchRoundSubmissionGitHubRepoOwner(roundNumber - i, chosenKey)];
                case 7:
                    githubUsername = _a.sent();
                    if (githubUsername) {
                        return [2 /*return*/, { chosenKey: chosenKey, leaderNode: githubUsername }];
                    }
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/, { chosenKey: chosenKey, leaderNode: null }];
            }
        });
    });
}
function getLeaderNode(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var currentLeader, previousLeader;
        var roundNumber = _b.roundNumber, _c = _b.leaderNumber, leaderNumber = _c === void 0 ? 5 : _c, submitterPublicKey = _b.submitterPublicKey;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getLeaderForRound(roundNumber, leaderNumber, submitterPublicKey)];
                case 1:
                    currentLeader = _d.sent();
                    console.log({ currentLeader: currentLeader });
                    if (!(currentLeader.chosenKey === submitterPublicKey)) return [3 /*break*/, 3];
                    return [4 /*yield*/, getLeaderForRound(roundNumber - 3, leaderNumber, submitterPublicKey)];
                case 2:
                    previousLeader = _d.sent();
                    console.log({ previousLeader: previousLeader });
                    return [2 /*return*/, { isLeader: true, leaderNode: previousLeader.leaderNode }];
                case 3: 
                // Not the leader, return the current leader's info
                return [2 /*return*/, { isLeader: false, leaderNode: currentLeader.leaderNode }];
            }
        });
    });
}
function base58ToNumber(char) {
    var base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    return base58Chars.indexOf(char);
}
function knnDistance(a, b) {
    if (a.length !== b.length) {
        throw new Error("Strings must be of the same length for KNN distance calculation.");
    }
    var truncatedA = a.slice(0, 30);
    var truncatedB = b.slice(0, 30);
    var distance = 0;
    for (var i = 0; i < truncatedA.length; i++) {
        var numA = base58ToNumber(truncatedA[i]);
        var numB = base58ToNumber(truncatedB[i]);
        distance += Math.abs(numA - numB);
    }
    return distance;
}
