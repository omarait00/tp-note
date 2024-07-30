"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_RETRY_COUNT = exports.ActionRunner = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _uuid = _interopRequireDefault(require("uuid"));
var _apmUtils = require("@kbn/apm-utils");
var _esErrors = require("@kbn/es-errors");
var _moment = _interopRequireDefault(require("moment"));
var _ = require("..");
var _constants = require("../../../common/constants");
var _actions = require("./actions");
var _crud = require("./crud");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_RETRY_COUNT = 5;
exports.MAX_RETRY_COUNT = MAX_RETRY_COUNT;
class ActionRunner {
  constructor(esClient, soClient, actionParams, retryParams) {
    var _actionParams$actionI;
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "soClient", void 0);
    (0, _defineProperty2.default)(this, "actionParams", void 0);
    (0, _defineProperty2.default)(this, "retryParams", void 0);
    (0, _defineProperty2.default)(this, "bulkActionsResolver", void 0);
    (0, _defineProperty2.default)(this, "checkTaskId", void 0);
    this.esClient = esClient;
    this.soClient = soClient;
    this.actionParams = {
      ...actionParams,
      actionId: (_actionParams$actionI = actionParams.actionId) !== null && _actionParams$actionI !== void 0 ? _actionParams$actionI : (0, _uuid.default)()
    };
    this.retryParams = retryParams;
  }
  /**
   * Common runner logic accross all agent bulk actions
   * Starts action execution immeditalely, asynchronously
   * On errors, starts a task with Task Manager to retry max 3 times
   * If the last batch was stored in state, retry continues from there (searchAfter)
   */
  async runActionAsyncWithRetry() {
    _.appContextService.getLogger().info(`Running action asynchronously, actionId: ${this.actionParams.actionId}, total agents: ${this.actionParams.total}`);
    if (!this.bulkActionsResolver) {
      this.bulkActionsResolver = await _.appContextService.getBulkActionsResolver();
    }

    // create task to check result with some delay, this runs in case of kibana crash too
    this.checkTaskId = await this.createCheckResultTask();
    (0, _apmUtils.withSpan)({
      name: this.getActionType(),
      type: 'action'
    }, () => this.processAgentsInBatches().then(() => {
      if (this.checkTaskId) {
        // no need for check task, action succeeded
        this.bulkActionsResolver.removeIfExists(this.checkTaskId);
      }
    }).catch(async error => {
      var _this$retryParams$ret;
      // 404 error comes when PIT query is closed
      if ((0, _esErrors.isResponseError)(error) && error.statusCode === 404) {
        const errorMessage = '404 error from elasticsearch, not retrying. Error: ' + error.message;
        _.appContextService.getLogger().warn(errorMessage);
        return;
      }
      if (this.retryParams.retryCount) {
        _.appContextService.getLogger().error(`Retry #${this.retryParams.retryCount} of task ${this.retryParams.taskId} failed: ${error.message}`);
        if (this.retryParams.retryCount === MAX_RETRY_COUNT) {
          const errorMessage = `Stopping after retry #${MAX_RETRY_COUNT}. Error: ${error.message}`;
          _.appContextService.getLogger().warn(errorMessage);

          // clean up tasks after last retry reached
          await Promise.all([this.bulkActionsResolver.removeIfExists(this.checkTaskId), this.bulkActionsResolver.removeIfExists(this.retryParams.taskId)]);
          return;
        }
      } else {
        _.appContextService.getLogger().error(`Action failed: ${error.message}`);
      }
      const taskId = this.bulkActionsResolver.getTaskId(this.actionParams.actionId, this.getTaskType());
      await this.bulkActionsResolver.run(this.actionParams, {
        ...this.retryParams,
        retryCount: ((_this$retryParams$ret = this.retryParams.retryCount) !== null && _this$retryParams$ret !== void 0 ? _this$retryParams$ret : 0) + 1
      }, this.getTaskType(), taskId);
      _.appContextService.getLogger().info(`Retrying in task: ${taskId}`);
    }));
    return {
      actionId: this.actionParams.actionId
    };
  }
  async createCheckResultTask() {
    const taskId = this.bulkActionsResolver.getTaskId(this.actionParams.actionId, this.getTaskType() + ':check');
    return await this.bulkActionsResolver.run(this.actionParams, {
      ...this.retryParams,
      retryCount: 1
    }, this.getTaskType(), taskId, (0, _moment.default)(new Date()).add(5, 'm').toDate());
  }
  async processBatch(agents) {
    if (this.retryParams.retryCount) {
      try {
        const actions = await (0, _actions.getAgentActions)(this.esClient, this.actionParams.actionId);

        // skipping batch if there is already an action document present with last agent ids
        for (const action of actions) {
          var _action$agents;
          if (((_action$agents = action.agents) === null || _action$agents === void 0 ? void 0 : _action$agents[0]) === agents[0].id) {
            return {
              actionId: this.actionParams.actionId
            };
          }
        }
      } catch (error) {
        _.appContextService.getLogger().debug(error.message); // if action not found, swallow
      }
    }

    return await this.processAgents(agents);
  }
  async processAgentsInBatches() {
    var _this$actionParams$ba;
    const start = Date.now();
    const pitId = this.retryParams.pitId;
    const perPage = (_this$actionParams$ba = this.actionParams.batchSize) !== null && _this$actionParams$ba !== void 0 ? _this$actionParams$ba : _constants.SO_SEARCH_LIMIT;
    const getAgents = () => {
      var _this$actionParams$sh;
      return (0, _crud.getAgentsByKuery)(this.esClient, {
        kuery: this.actionParams.kuery,
        showInactive: (_this$actionParams$sh = this.actionParams.showInactive) !== null && _this$actionParams$sh !== void 0 ? _this$actionParams$sh : false,
        page: 1,
        perPage,
        pitId,
        searchAfter: this.retryParams.searchAfter
      });
    };
    const res = await getAgents();
    let currentAgents = res.agents;
    if (currentAgents.length === 0) {
      _.appContextService.getLogger().debug('currentAgents returned 0 hits, returning from bulk action query');
      return {
        actionId: this.actionParams.actionId
      }; // stop executing if there are no more results
    }

    await this.processBatch(currentAgents);
    let allAgentsProcessed = currentAgents.length;
    while (allAgentsProcessed < res.total) {
      const lastAgent = currentAgents[currentAgents.length - 1];
      this.retryParams.searchAfter = lastAgent.sort;
      const nextPage = await getAgents();
      currentAgents = nextPage.agents;
      if (currentAgents.length === 0) {
        _.appContextService.getLogger().debug('currentAgents returned 0 hits, returning from bulk action query');
        break; // stop executing if there are no more results
      }

      await this.processBatch(currentAgents);
      allAgentsProcessed += currentAgents.length;
      if (this.checkTaskId) {
        var _this$bulkActionsReso;
        // updating check task with latest checkpoint (this.retryParams.searchAfter)
        (_this$bulkActionsReso = this.bulkActionsResolver) === null || _this$bulkActionsReso === void 0 ? void 0 : _this$bulkActionsReso.removeIfExists(this.checkTaskId);
        this.checkTaskId = await this.createCheckResultTask();
      }
    }
    await (0, _crud.closePointInTime)(this.esClient, pitId);
    _.appContextService.getLogger().info(`processed ${allAgentsProcessed} agents, took ${Date.now() - start}ms`);
    return {
      actionId: this.actionParams.actionId
    };
  }
}
exports.ActionRunner = ActionRunner;