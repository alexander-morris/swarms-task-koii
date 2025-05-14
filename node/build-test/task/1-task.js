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
exports.task = task;
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
require("dotenv/config");
var constant_1 = require("../utils/constant");
var dotenv_1 = require("dotenv");
var axios_1 = require("axios");
dotenv_1.default.config();
// Swarms API configuration
var SWARMS_API_URL = process.env.SWARMS_API_URL || 'http://localhost:8080';
var SWARMS_API_KEY = process.env.SWARMS_API_KEY;
function task(roundNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var swarmConfig, swarmResponse, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 6]);
                    swarmConfig = {
                        name: "swarm-".concat(namespace_wrapper_1.TASK_ID, "-").concat(roundNumber),
                        description: "Swarm for task ".concat(namespace_wrapper_1.TASK_ID, " round ").concat(roundNumber),
                        task: "<replace-with-task>", // TODO: Replace with actual task if needed
                        agents: [
                            {
                                agent_name: "primary-agent",
                                model_name: "gpt-4o-mini",
                                system_prompt: "You are a helpful AI assistant.",
                                temperature: 0.7,
                                max_tokens: 2048
                            }
                        ],
                        max_loops: 1,
                        swarm_type: "SequentialWorkflow"
                    };
                    return [4 /*yield*/, axios_1.default.post("".concat(SWARMS_API_URL, "/v1/swarm/completions"), swarmConfig, {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': SWARMS_API_KEY
                            }
                        })];
                case 1:
                    swarmResponse = _a.sent();
                    result = {
                        taskId: namespace_wrapper_1.TASK_ID,
                        roundNumber: roundNumber,
                        swarmId: swarmResponse.data.job_id,
                        result: swarmResponse.data.output,
                        timestamp: new Date().toISOString()
                    };
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), JSON.stringify(result))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("shouldMakeSubmission", "true")];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error("[TASK] Error executing swarm:", error_1);
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), constant_1.status.TASK_EXECUTION_FAILED)];
                case 5:
                    _a.sent();
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
