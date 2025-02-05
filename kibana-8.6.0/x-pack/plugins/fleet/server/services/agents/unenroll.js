"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceUnenrollAgent = forceUnenrollAgent;
exports.unenrollAgent = unenrollAgent;
exports.unenrollAgents = unenrollAgents;
var _uuid = _interopRequireDefault(require("uuid"));
var _errors = require("../../errors");
var _constants = require("../../constants");
var _actions = require("./actions");
var _crud = require("./crud");
var _unenroll_action_runner = require("./unenroll_action_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function unenrollAgentIsAllowed(soClient, esClient, agentId) {
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);
  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot unenroll ${agentId} from a hosted agent policy ${agentPolicy.id}`);
  }
  return true;
}
async function unenrollAgent(soClient, esClient, agentId, options) {
  if (!(options !== null && options !== void 0 && options.force)) {
    await unenrollAgentIsAllowed(soClient, esClient, agentId);
  }
  if (options !== null && options !== void 0 && options.revoke) {
    return forceUnenrollAgent(esClient, agentId);
  }
  const now = new Date().toISOString();
  await (0, _actions.createAgentAction)(esClient, {
    agents: [agentId],
    created_at: now,
    type: 'UNENROLL'
  });
  await (0, _crud.updateAgent)(esClient, agentId, {
    unenrollment_started_at: now
  });
}
async function unenrollAgents(soClient, esClient, options) {
  var _options$batchSize, _options$showInactive;
  if ('agentIds' in options) {
    const givenAgents = await (0, _crud.getAgents)(esClient, options);
    return await (0, _unenroll_action_runner.unenrollBatch)(soClient, esClient, givenAgents, options);
  }
  const batchSize = (_options$batchSize = options.batchSize) !== null && _options$batchSize !== void 0 ? _options$batchSize : _constants.SO_SEARCH_LIMIT;
  const res = await (0, _crud.getAgentsByKuery)(esClient, {
    kuery: options.kuery,
    showInactive: (_options$showInactive = options.showInactive) !== null && _options$showInactive !== void 0 ? _options$showInactive : false,
    page: 1,
    perPage: batchSize
  });
  if (res.total <= batchSize) {
    const givenAgents = await (0, _crud.getAgents)(esClient, options);
    return await (0, _unenroll_action_runner.unenrollBatch)(soClient, esClient, givenAgents, options);
  } else {
    return await new _unenroll_action_runner.UnenrollActionRunner(esClient, soClient, {
      ...options,
      batchSize,
      total: res.total
    }, {
      pitId: await (0, _crud.openPointInTime)(esClient)
    }).runActionAsyncWithRetry();
  }
}
async function forceUnenrollAgent(esClient, agentIdOrAgent) {
  const agent = typeof agentIdOrAgent === 'string' ? await (0, _crud.getAgentById)(esClient, agentIdOrAgent) : agentIdOrAgent;
  await (0, _unenroll_action_runner.invalidateAPIKeysForAgents)([agent]);
  await (0, _crud.updateAgent)(esClient, agent.id, {
    active: false,
    unenrolled_at: new Date().toISOString()
  });
  await (0, _unenroll_action_runner.updateActionsForForceUnenroll)(esClient, [agent.id], (0, _uuid.default)(), 1);
}