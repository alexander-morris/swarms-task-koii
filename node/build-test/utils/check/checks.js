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
exports.preRunCheck = preRunCheck;
var anthropicCheck_1 = require("./anthropicCheck");
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
var types_1 = require("@_koii/namespace-wrapper/dist/types");
var constant_1 = require("../constant");
var anthropicCheck_2 = require("./anthropicCheck");
var githubCheck_1 = require("./githubCheck");
function preRunCheck(roundNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var isAnthropicAPIKeyValid, isGitHubValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!process.env.ANTHROPIC_API_KEY) return [3 /*break*/, 3];
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.logMessage(types_1.LogLevel.Error, constant_1.errorMessage.ANTHROPIC_API_KEY_INVALID, constant_1.actionMessage.ANTHROPIC_API_KEY_INVALID)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), constant_1.status.ANTHROPIC_API_KEY_INVALID)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, false];
                case 3:
                    if (!!(0, anthropicCheck_1.isValidAnthropicApiKey)(process.env.ANTHROPIC_API_KEY)) return [3 /*break*/, 6];
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.logMessage(types_1.LogLevel.Error, constant_1.errorMessage.ANTHROPIC_API_KEY_INVALID, constant_1.actionMessage.ANTHROPIC_API_KEY_INVALID)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), constant_1.status.ANTHROPIC_API_KEY_INVALID)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, false];
                case 6: return [4 /*yield*/, (0, anthropicCheck_2.checkAnthropicAPIKey)(process.env.ANTHROPIC_API_KEY)];
                case 7:
                    isAnthropicAPIKeyValid = _a.sent();
                    if (!!isAnthropicAPIKeyValid) return [3 /*break*/, 10];
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.logMessage(types_1.LogLevel.Error, constant_1.errorMessage.ANTHROPIC_API_KEY_NO_CREDIT, constant_1.actionMessage.ANTHROPIC_API_KEY_NO_CREDIT)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), constant_1.status.ANTHROPIC_API_KEY_NO_CREDIT)];
                case 9:
                    _a.sent();
                    return [2 /*return*/, false];
                case 10:
                    if (!(!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN)) return [3 /*break*/, 13];
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.logMessage(types_1.LogLevel.Error, constant_1.errorMessage.GITHUB_CHECK_FAILED, constant_1.actionMessage.GITHUB_CHECK_FAILED)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), constant_1.status.GITHUB_CHECK_FAILED)];
                case 12:
                    _a.sent();
                    return [2 /*return*/, false];
                case 13: return [4 /*yield*/, (0, githubCheck_1.checkGitHub)(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN)];
                case 14:
                    isGitHubValid = _a.sent();
                    if (!!isGitHubValid) return [3 /*break*/, 17];
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.logMessage(types_1.LogLevel.Error, constant_1.errorMessage.GITHUB_CHECK_FAILED, constant_1.actionMessage.GITHUB_CHECK_FAILED)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.storeSet("result-".concat(roundNumber), constant_1.status.GITHUB_CHECK_FAILED)];
                case 16:
                    _a.sent();
                    return [2 /*return*/, false];
                case 17: return [2 /*return*/, true];
            }
        });
    });
}
