"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reassignAgent = reassignAgent;
exports.reassignAgentIsAllowed = reassignAgentIsAllowed;
exports.reassignAgents = reassignAgents;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _agent_policy = require("../agent_policy");
var _errors = require("../../errors");
var _constants = require("../../constants");
var _crud = require("./crud");
var _actions = require("./actions");
var _helpers = require("./helpers");
var _reassign_action_runner = require("./reassign_action_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function reassignAgent(soClient, esClient, agentId, newAgentPolicyId) {
  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);
  if (!newAgentPolicy) {
    throw _boom.default.notFound(`Agent policy not found: ${newAgentPolicyId}`);
  }
  await reassignAgentIsAllowed(soClient, esClient, agentId, newAgentPolicyId);
  await (0, _crud.updateAgent)(esClient, agentId, {
    policy_id: newAgentPolicyId,
    policy_revision: null
  });
  await (0, _actions.createAgentAction)(esClient, {
    agents: [agentId],
    created_at: new Date().toISOString(),
    type: 'POLICY_REASSIGN',
    data: {
      policy_id: newAgentPolicyId
    }
  });
}
async function reassignAgentIsAllowed(soClient, esClient, agentId, newAgentPolicyId) {
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);
  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot reassign an agent from hosted agent policy ${agentPolicy.id}`);
  }
  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);
  if (newAgentPolicy !== null && newAgentPolicy !== void 0 && newAgentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot reassign an agent to hosted agent policy ${newAgentPolicy.id}`);
  }
  return true;
}
function isMgetDoc(doc) {
  return Boolean(doc && 'found' in doc);
}
async function reassignAgents(soClient, esClient, options, newAgentPolicyId) {
  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);
  if (!newAgentPolicy) {
    throw _boom.default.notFound(`Agent policy not found: ${newAgentPolicyId}`);
  }
  if (newAgentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot reassign an agent to hosted agent policy ${newAgentPolicy.id}`);
  }
  const outgoingErrors = {};
  let givenAgents = [];
  if ('agents' in options) {
    givenAgents = options.agents;
  } else if ('agentIds' in options) {
    const givenAgentsResults = await (0, _crud.getAgentDocuments)(esClient, options.agentIds);
    for (const agentResult of givenAgentsResults) {
      if (isMgetDoc(agentResult) && agentResult.found === false) {
        outgoingErrors[agentResult._id] = new _errors.AgentReassignmentError(`Cannot find agent ${agentResult._id}`);
      } else {
        givenAgents.push((0, _helpers.searchHitToAgent)(agentResult));
      }
    }
  } else if ('kuery' in options) {
    var _options$batchSize, _options$showInactive;
    const batchSize = (_options$batchSize = options.batchSize) !== null && _options$batchSize !== void 0 ? _options$batchSize : _constants.SO_SEARCH_LIMIT;
    const res = await (0, _crud.getAgentsByKuery)(esClient, {
      kuery: options.kuery,
      showInactive: (_options$showInactive = options.showInactive) !== null && _options$showInactive !== void 0 ? _options$showInactive : false,
      page: 1,
      perPage: batchSize
    });
    // running action in async mode for >10k agents (or actions > batchSize for testing purposes)
    if (res.total <= batchSize) {
      givenAgents = res.agents;
    } else {
      return await new _reassign_action_runner.ReassignActionRunner(esClient, soClient, {
        ...options,
        batchSize,
        total: res.total,
        newAgentPolicyId
      }, {
        pitId: await (0, _crud.openPointInTime)(esClient)
      }).runActionAsyncWithRetry();
    }
  }
  return await (0, _reassign_action_runner.reassignBatch)(soClient, esClient, {
    newAgentPolicyId
  }, givenAgents, outgoingErrors);
}