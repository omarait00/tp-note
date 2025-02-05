"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReassignActionRunner = void 0;
exports.reassignBatch = reassignBatch;
var _uuid = _interopRequireDefault(require("uuid"));
var _errors = require("../../errors");
var _app_context = require("../app_context");
var _action_runner = require("./action_runner");
var _crud = require("./crud");
var _actions = require("./actions");
var _hosted_agent = require("./hosted_agent");
var _bulk_actions_resolver = require("./bulk_actions_resolver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ReassignActionRunner extends _action_runner.ActionRunner {
  async processAgents(agents) {
    return await reassignBatch(this.soClient, this.esClient, this.actionParams, agents, {});
  }
  getTaskType() {
    return _bulk_actions_resolver.BulkActionTaskType.REASSIGN_RETRY;
  }
  getActionType() {
    return 'POLICY_REASSIGN';
  }
}
exports.ReassignActionRunner = ReassignActionRunner;
async function reassignBatch(soClient, esClient, options, givenAgents, outgoingErrors) {
  var _options$actionId, _options$total;
  const errors = {
    ...outgoingErrors
  };
  const hostedPolicies = await (0, _hosted_agent.getHostedPolicies)(soClient, givenAgents);
  const agentsToUpdate = givenAgents.reduce((agents, agent) => {
    if (agent.policy_id === options.newAgentPolicyId) {
      errors[agent.id] = new _errors.AgentReassignmentError(`Agent ${agent.id} is already assigned to agent policy ${options.newAgentPolicyId}`);
    } else if ((0, _hosted_agent.isHostedAgent)(hostedPolicies, agent)) {
      errors[agent.id] = new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot reassign an agent from hosted agent policy ${agent.policy_id}`);
    } else {
      agents.push(agent);
    }
    return agents;
  }, []);
  if (agentsToUpdate.length === 0) {
    // early return if all agents failed validation
    _app_context.appContextService.getLogger().debug('No agents to update, skipping agent update and action creation');
    throw new _errors.AgentReassignmentError('No agents to reassign, already assigned or hosted agents');
  }
  await (0, _crud.bulkUpdateAgents)(esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      policy_id: options.newAgentPolicyId,
      policy_revision: null
    }
  })), errors);
  const actionId = (_options$actionId = options.actionId) !== null && _options$actionId !== void 0 ? _options$actionId : (0, _uuid.default)();
  const total = (_options$total = options.total) !== null && _options$total !== void 0 ? _options$total : givenAgents.length;
  const now = new Date().toISOString();
  await (0, _actions.createAgentAction)(esClient, {
    id: actionId,
    agents: agentsToUpdate.map(agent => agent.id),
    created_at: now,
    type: 'POLICY_REASSIGN',
    total,
    data: {
      policy_id: options.newAgentPolicyId
    }
  });
  await (0, _actions.createErrorActionResults)(esClient, actionId, errors, 'already assigned or assigned to hosted policy');
  return {
    actionId
  };
}