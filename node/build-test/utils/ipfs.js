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
exports.storeFile = storeFile;
exports.getFile = getFile;
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
var storage_task_sdk_1 = require("@_koii/storage-task-sdk");
var fs_1 = require("fs");
function storeFile(data_1) {
    return __awaiter(this, arguments, void 0, function (data, filename) {
        var client, basePath, userStaking, cid, error_1;
        if (filename === void 0) { filename = "submission.json"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = storage_task_sdk_1.KoiiStorageClient.getInstance({});
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getBasePath()];
                case 1:
                    basePath = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, 6, 7]);
                    // Write the data to a temp file
                    fs_1.default.writeFileSync("".concat(basePath, "/").concat(filename), typeof data === "string" ? data : JSON.stringify(data));
                    return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getSubmitterAccount()];
                case 3:
                    userStaking = _a.sent();
                    if (!userStaking) {
                        throw new Error("No staking keypair found");
                    }
                    return [4 /*yield*/, client.uploadFile("".concat(basePath, "/").concat(filename), userStaking)];
                case 4:
                    cid = (_a.sent()).cid;
                    return [2 /*return*/, cid];
                case 5:
                    error_1 = _a.sent();
                    throw error_1;
                case 6:
                    // Delete the temp file
                    fs_1.default.unlinkSync("".concat(basePath, "/").concat(filename));
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getFile(cid_1) {
    return __awaiter(this, arguments, void 0, function (cid, filename) {
        var storageClient, fileBlob;
        if (filename === void 0) { filename = "submission.json"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storageClient = storage_task_sdk_1.KoiiStorageClient.getInstance({});
                    return [4 /*yield*/, storageClient.getFile(cid, filename)];
                case 1:
                    fileBlob = _a.sent();
                    return [4 /*yield*/, fileBlob.text()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
