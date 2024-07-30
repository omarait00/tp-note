"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulkActionsResolver = exports.BulkActionTaskType = void 0;
exports.createRetryTask = createRetryTask;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../../src/core/server");
var _moment = _interopRequireDefault(require("moment"));
var _app_context = require("../app_context");
var _reassign_action_runner = require("./reassign_action_runner");
var _upgrade_action_runner = require("./upgrade_action_runner");
var _update_agent_tags_action_runner = require("./update_agent_tags_action_runner");
var _unenroll_action_runner = require("./unenroll_action_runner");
var _request_diagnostics_action_runner = require("./request_diagnostics_action_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let BulkActionTaskType;
/**
 * Create and run retry tasks of agent bulk actions
 */
exports.BulkActionTaskType = BulkActionTaskType;
(function (BulkActionTaskType) {
  BulkActionTaskType["REASSIGN_RETRY"] = "fleet:reassign_action:retry";
  BulkActionTaskType["UNENROLL_RETRY"] = "fleet:unenroll_action:retry";
  BulkActionTaskType["UPGRADE_RETRY"] = "fleet:upgrade_action:retry";
  BulkActionTaskType["UPDATE_AGENT_TAGS_RETRY"] = "fleet:update_agent_tags:retry";
  BulkActionTaskType["REQUEST_DIAGNOSTICS_RETRY"] = "fleet:request_diagnostics:retry";
})(BulkActionTaskType || (exports.BulkActionTaskType = BulkActionTaskType = {}));
class BulkActionsResolver {
  createTaskRunner(core, taskType) {
    return ({
      taskInstance
    }) => {
      const getDeps = async () => {
        const [coreStart] = await core.getStartServices();
        return {
          esClient: coreStart.elasticsearch.client.asInternalUser,
          soClient: new _server.SavedObjectsClient(coreStart.savedObjects.createInternalRepository())
        };
      };
      const runnerMap = {
        [BulkActionTaskType.UNENROLL_RETRY]: _unenroll_action_runner.UnenrollActionRunner,
        [BulkActionTaskType.REASSIGN_RETRY]: _reassign_action_runner.ReassignActionRunner,
        [BulkActionTaskType.UPDATE_AGENT_TAGS_RETRY]: _update_agent_tags_action_runner.UpdateAgentTagsActionRunner,
        [BulkActionTaskType.UPGRADE_RETRY]: _upgrade_action_runner.UpgradeActionRunner,
        [BulkActionTaskType.REQUEST_DIAGNOSTICS_RETRY]: _request_diagnostics_action_runner.RequestDiagnosticsActionRunner
      };
      return createRetryTask(taskInstance, getDeps, async (esClient, soClient, actionParams, retryParams) => await new runnerMap[taskType](esClient, soClient, actionParams, retryParams).runActionAsyncWithRetry());
    };
  }
  constructor(taskManager, core) {
    (0, _defineProperty2.default)(this, "taskManager", void 0);
    const definitions = Object.values(BulkActionTaskType).map(type => {
      return [type, {
        title: 'Bulk Action Retry',
        timeout: '1m',
        maxAttempts: 1,
        createTaskRunner: this.createTaskRunner(core, type)
      }];
    }).reduce((acc, current) => {
      acc[current[0]] = current[1];
      return acc;
    }, {});
    taskManager.registerTaskDefinitions(definitions);
  }
  async start(taskManager) {
    this.taskManager = taskManager;
  }
  getTaskId(actionId, type) {
    return `${type}:${actionId}`;
  }
  async run(actionParams, retryParams, taskType, taskId, runAt) {
    var _this$taskManager, _retryParams$retryCou;
    await ((_this$taskManager = this.taskManager) === null || _this$taskManager === void 0 ? void 0 : _this$taskManager.ensureScheduled({
      id: taskId,
      taskType,
      scope: ['fleet'],
      state: {},
      params: {
        actionParams,
        retryParams
      },
      runAt: runAt !== null && runAt !== void 0 ? runAt : (0, _moment.default)(new Date()).add(Math.pow(3, (_retryParams$retryCou = retryParams.retryCount) !== null && _retryParams$retryCou !== void 0 ? _retryParams$retryCou : 1), 's').toDate()
    }));
    _app_context.appContextService.getLogger().info('Scheduling task ' + taskId);
    return taskId;
  }
  async removeIfExists(taskId) {
    var _this$taskManager2;
    _app_context.appContextService.getLogger().info('Removing task ' + taskId);
    await ((_this$taskManager2 = this.taskManager) === null || _this$taskManager2 === void 0 ? void 0 : _this$taskManager2.removeIfExists(taskId));
  }
}
exports.BulkActionsResolver = BulkActionsResolver;
function createRetryTask(taskInstance, getDeps, doRetry) {
  return {
    async run() {
      _app_context.appContextService.getLogger().info('Running bulk action retry task');
      const {
        esClient,
        soClient
      } = await getDeps();
      const retryParams = taskInstance.params.retryParams;
      _app_context.appContextService.getLogger().debug(`Retry #${retryParams.retryCount} of task ${taskInstance.id}`);
      if (retryParams.searchAfter) {
        _app_context.appContextService.getLogger().info('Continuing task from batch ' + retryParams.searchAfter);
      }
      doRetry(esClient, soClient, taskInstance.params.actionParams, {
        ...retryParams,
        taskId: taskInstance.id
      });
      _app_context.appContextService.getLogger().info('Completed bulk action retry task');
    },
    async cancel() {}
  };
}