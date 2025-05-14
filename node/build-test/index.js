"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_manager_1 = require("@_koii/task-manager");
var _0_setup_1 = require("./task/0-setup");
var _1_task_1 = require("./task/1-task");
var _2_submission_1 = require("./task/2-submission");
var _3_audit_1 = require("./task/3-audit");
var _4_distribution_1 = require("./task/4-distribution");
var _5_routes_1 = require("./task/5-routes");
var extensions_1 = require("@_koii/task-manager/extensions");
var orcaSettings_1 = require("./orcaSettings");
(0, task_manager_1.initializeTaskManager)({
    setup: _0_setup_1.setup,
    task: _1_task_1.task,
    submission: _2_submission_1.submission,
    audit: _3_audit_1.audit,
    distribution: _4_distribution_1.distribution,
    routes: _5_routes_1.routes,
});
(0, extensions_1.initializeOrcaClient)(orcaSettings_1.getConfig);
