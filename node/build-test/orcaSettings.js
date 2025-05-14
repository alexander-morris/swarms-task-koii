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
exports.getConfig = getConfig;
var namespace_wrapper_1 = require("@_koii/namespace-wrapper");
require("dotenv/config");
var os_1 = require("os");
var imageUrl = "docker.io/hermanyiqunliang/summarizer-agent:0.5";
function getHostIP() {
    var interfaces = os_1.default.networkInterfaces();
    for (var _i = 0, _a = Object.keys(interfaces); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        for (var _b = 0, _c = interfaces[name_1] || []; _b < _c.length; _b++) {
            var iface = _c[_b];
            // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    throw new Error("Unable to determine host IP address");
}
function createPodSpec() {
    return __awaiter(this, void 0, void 0, function () {
        var basePath, podSpec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, namespace_wrapper_1.namespaceWrapper.getBasePath()];
                case 1:
                    basePath = _a.sent();
                    podSpec = "apiVersion: v1\nkind: Pod\nmetadata:\n  name: 247-builder-test\nspec:\n  containers:\n    - name: user-".concat(namespace_wrapper_1.TASK_ID, "\n      image: ").concat(imageUrl, "\n      env:\n      - name: GITHUB_TOKEN\n        value: \"").concat(process.env.GITHUB_TOKEN, "\"\n      - name: GITHUB_USERNAME\n        value: \"").concat(process.env.GITHUB_USERNAME, "\"\n      - name: ANTHROPIC_API_KEY\n        value: \"").concat(process.env.ANTHROPIC_API_KEY, "\"\n      volumeMounts:\n        - name: builder-data\n          mountPath: /data\n  volumes:\n    - name: builder-data\n      hostPath:\n        path: ").concat(basePath, "/orca/data\n        type: DirectoryOrCreate\n  hostAliases:\n  - ip: \"").concat(getHostIP(), "\"\n    hostnames:\n    - \"host.docker.internal\"\n");
                    return [2 /*return*/, podSpec];
            }
        });
    });
}
function getConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        imageURL: imageUrl
                    };
                    return [4 /*yield*/, createPodSpec()];
                case 1: return [2 /*return*/, (_a.customPodSpec = _b.sent(),
                        _a.rootCA = null,
                        _a.timeout = 900000,
                        _a)];
            }
        });
    });
}
