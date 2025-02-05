"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnenrollActionRunner = void 0;
exports.invalidateAPIKeysForAgents = invalidateAPIKeysForAgents;
exports.isAgentUnenrolled = isAgentUnenrolled;
exports.unenrollBatch = unenrollBatch;
exports.updateActionsForForceUnenroll = updateActionsForForceUnenroll;
var _uuid = _interopRequireDefault(require("uuid"));
var _lodash = require("lodash");
var _common = require("../../../common");
var _errors = require("../../errors");
var _api_keys = require("../api_keys");
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

class UnenrollActionRunner extends _action_runner.ActionRunner {
  async processAgents(agents) {
    return await unenrollBatch(this.soClient, this.esClient, agents, this.actionParams);
  }
  getTaskType() {
    return _bulk_actions_resolver.BulkActionTaskType.UNENROLL_RETRY;
  }
  getActionType() {
    return 'UNENROLL';
  }
}
exports.UnenrollActionRunner = UnenrollActionRunner;
function isAgentUnenrolled(agent, revoke) {
  return Boolean(revoke && agent.unenrolled_at || !revoke && (agent.unenrollment_started_at || agent.unenrolled_at));
}
async function unenrollBatch(soClient, esClient, givenAgents, options) {
  var _options$actionId, _options$total;
  const hostedPolicies = await (0, _hosted_agent.getHostedPolicies)(soClient, givenAgents);
  const outgoingErrors = {};

  // And which are allowed to unenroll
  const agentsToUpdate = options.force ? givenAgents : givenAgents.reduce((agents, agent) => {
    if (isAgentUnenrolled(agent, options.revoke)) {
      outgoingErrors[agent.id] = new _errors.FleetError(`Agent ${agent.id} already unenrolled`);
    } else if ((0, _hosted_agent.isHostedAgent)(hostedPolicies, agent)) {
      outgoingErrors[agent.id] = new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot unenroll ${agent.id} from a hosted agent policy ${agent.policy_id}`);
    } else {
      agents.push(agent);
    }
    return agents;
  }, []);
  const now = new Date().toISOString();

  // Update the necessary agents
  const updateData = options.revoke ? {
    unenrolled_at: now,
    active: false
  } : {
    unenrollment_started_at: now
  };
  await (0, _crud.bulkUpdateAgents)(esClient, agentsToUpdate.map(({
    id
  }) => ({
    agentId: id,
    data: updateData
  })), outgoingErrors);
  const actionId = (_options$actionId = options.actionId) !== null && _options$actionId !== void 0 ? _options$actionId : (0, _uuid.default)();
  const total = (_options$total = options.total) !== null && _options$total !== void 0 ? _options$total : givenAgents.length;
  const agentIds = agentsToUpdate.map(agent => agent.id);
  if (options.revoke) {
    // Get all API keys that need to be invalidated
    await invalidateAPIKeysForAgents(agentsToUpdate);
    await updateActionsForForceUnenroll(esClient, agentIds, actionId, total);
  } else {
    // Create unenroll action for each agent
    await (0, _actions.createAgentAction)(esClient, {
      id: actionId,
      agents: agentIds,
      created_at: now,
      type: 'UNENROLL',
      total
    });
  }
  await (0, _actions.createErrorActionResults)(esClient, actionId, outgoingErrors, 'cannot unenroll from a hosted policy or already unenrolled');
  return {
    actionId
  };
}
async function updateActionsForForceUnenroll(esClient, agentIds, actionId, total) {
  // creating an action doc so that force unenroll shows up in activity
  await (0, _actions.createAgentAction)(esClient, {
    id: actionId,
    agents: [],
    created_at: new Date().toISOString(),
    type: 'FORCE_UNENROLL',
    total
  });
  await (0, _actions.bulkCreateAgentActionResults)(esClient, agentIds.map(agentId => ({
    agentId,
    actionId
  })));

  // updating action results for those agents that are there in a pending unenroll action
  const unenrollActions = await (0, _actions.getUnenrollAgentActions)(esClient);
  for (const action of unenrollActions) {
    const commonAgents = (0, _lodash.intersection)(action.agents, agentIds);
    if (commonAgents.length > 0) {
      // filtering out agents with action results
      const agentsToUpdate = await getAgentsWithoutActionResults(esClient, action.action_id, commonAgents);
      if (agentsToUpdate.length > 0) {
        await (0, _actions.bulkCreateAgentActionResults)(esClient, agentsToUpdate.map(agentId => ({
          agentId,
          actionId: action.action_id
        })));
      }
    }
  }
}
async function getAgentsWithoutActionResults(esClient, actionId, commonAgents) {
  try {
    const res = await esClient.search({
      index: _common.AGENT_ACTIONS_RESULTS_INDEX,
      query: {
        bool: {
          must: [{
            term: {
              action_id: actionId
            }
          }, {
            terms: {
              agent_id: commonAgents
            }
          }]
        }
      },
      size: commonAgents.length
    });
    const agentsToUpdate = commonAgents.filter(agentId => !res.hits.hits.find(hit => {
      var _hit$_source;
      return ((_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.agent_id) === agentId;
    }));
    return agentsToUpdate;
  } catch (err) {
    if (err.statusCode === 404) {
      // .fleet-actions-results does not yet exist
      _app_context.appContextService.getLogger().debug(err);
    } else {
      throw err;
    }
  }
  return commonAgents;
}
async function invalidateAPIKeysForAgents(agents) {
  const apiKeys = agents.reduce((keys, agent) => {
    if (agent.access_api_key_id) {
      keys.push(agent.access_api_key_id);
    }
    if (agent.default_api_key_id) {
      keys.push(agent.default_api_key_id);
    }
    if (agent.default_api_key_history) {
      agent.default_api_key_history.forEach(apiKey => keys.push(apiKey.id));
    }
    if (agent.outputs) {
      Object.values(agent.outputs).forEach(output => {
        if (output.api_key_id) {
          keys.push(output.api_key_id);
        }
        if (output.to_retire_api_key_ids) {
          Object.values(output.to_retire_api_key_ids).forEach(apiKey => {
            if (apiKey !== null && apiKey !== void 0 && apiKey.id) {
              keys.push(apiKey.id);
            }
          });
        }
      });
    }
    return keys;
  }, []);
  if (apiKeys.length) {
    await (0, _api_keys.invalidateAPIKeys)(apiKeys);
  }
}