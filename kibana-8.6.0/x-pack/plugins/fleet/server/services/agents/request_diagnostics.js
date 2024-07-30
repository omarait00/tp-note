"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkRequestDiagnostics = bulkRequestDiagnostics;
exports.requestDiagnostics = requestDiagnostics;
var _constants = require("../../constants");
var _crud = require("./crud");
var _actions = require("./actions");
var _request_diagnostics_action_runner = require("./request_diagnostics_action_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function requestDiagnostics(esClient, agentId) {
  const response = await (0, _actions.createAgentAction)(esClient, {
    agents: [agentId],
    created_at: new Date().toISOString(),
    type: 'REQUEST_DIAGNOSTICS'
  });
  return {
    actionId: response.id
  };
}
async function bulkRequestDiagnostics(esClient, soClient, options) {
  var _options$batchSize;
  if ('agentIds' in options) {
    const givenAgents = await (0, _crud.getAgents)(esClient, options);
    return await (0, _request_diagnostics_action_runner.requestDiagnosticsBatch)(esClient, givenAgents, {});
  }
  const batchSize = (_options$batchSize = options.batchSize) !== null && _options$batchSize !== void 0 ? _options$batchSize : _constants.SO_SEARCH_LIMIT;
  const res = await (0, _crud.getAgentsByKuery)(esClient, {
    kuery: options.kuery,
    showInactive: false,
    page: 1,
    perPage: batchSize
  });
  if (res.total <= batchSize) {
    const givenAgents = await (0, _crud.getAgents)(esClient, options);
    return await (0, _request_diagnostics_action_runner.requestDiagnosticsBatch)(esClient, givenAgents, {});
  } else {
    return await new _request_diagnostics_action_runner.RequestDiagnosticsActionRunner(esClient, soClient, {
      ...options,
      batchSize,
      total: res.total
    }, {
      pitId: await (0, _crud.openPointInTime)(esClient)
    }).runActionAsyncWithRetry();
  }
}