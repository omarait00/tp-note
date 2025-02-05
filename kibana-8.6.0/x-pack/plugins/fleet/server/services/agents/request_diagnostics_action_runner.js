"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestDiagnosticsActionRunner = void 0;
exports.requestDiagnosticsBatch = requestDiagnosticsBatch;
var _uuid = _interopRequireDefault(require("uuid"));
var _action_runner = require("./action_runner");
var _actions = require("./actions");
var _bulk_actions_resolver = require("./bulk_actions_resolver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class RequestDiagnosticsActionRunner extends _action_runner.ActionRunner {
  async processAgents(agents) {
    return await requestDiagnosticsBatch(this.esClient, agents, this.actionParams);
  }
  getTaskType() {
    return _bulk_actions_resolver.BulkActionTaskType.REQUEST_DIAGNOSTICS_RETRY;
  }
  getActionType() {
    return 'REQUEST_DIAGNOSTICS';
  }
}
exports.RequestDiagnosticsActionRunner = RequestDiagnosticsActionRunner;
async function requestDiagnosticsBatch(esClient, givenAgents, options) {
  var _options$actionId, _options$total;
  const now = new Date().toISOString();
  const actionId = (_options$actionId = options.actionId) !== null && _options$actionId !== void 0 ? _options$actionId : (0, _uuid.default)();
  const total = (_options$total = options.total) !== null && _options$total !== void 0 ? _options$total : givenAgents.length;
  const agentIds = givenAgents.map(agent => agent.id);
  await (0, _actions.createAgentAction)(esClient, {
    id: actionId,
    agents: agentIds,
    created_at: now,
    type: 'REQUEST_DIAGNOSTICS',
    total
  });
  return {
    actionId
  };
}