"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUpgradeAgentAction = sendUpgradeAgentAction;
exports.sendUpgradeAgentsActions = sendUpgradeAgentsActions;
var _errors = require("../../errors");
var _constants = require("../../constants");
var _actions = require("./actions");
var _crud = require("./crud");
var _helpers = require("./helpers");
var _upgrade_action_runner = require("./upgrade_action_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isMgetDoc(doc) {
  return Boolean(doc && 'found' in doc);
}
async function sendUpgradeAgentAction({
  soClient,
  esClient,
  agentId,
  version,
  sourceUri
}) {
  const now = new Date().toISOString();
  const data = {
    version,
    sourceURI: sourceUri
  };
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);
  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot upgrade agent ${agentId} in hosted agent policy ${agentPolicy.id}`);
  }
  await (0, _actions.createAgentAction)(esClient, {
    agents: [agentId],
    created_at: now,
    data,
    ack_data: data,
    type: 'UPGRADE'
  });
  await (0, _crud.updateAgent)(esClient, agentId, {
    upgraded_at: null,
    upgrade_started_at: now
  });
}
async function sendUpgradeAgentsActions(soClient, esClient, options) {
  // Full set of agents
  const outgoingErrors = {};
  let givenAgents = [];
  if ('agents' in options) {
    givenAgents = options.agents;
  } else if ('agentIds' in options) {
    const givenAgentsResults = await (0, _crud.getAgentDocuments)(esClient, options.agentIds);
    for (const agentResult of givenAgentsResults) {
      if (!isMgetDoc(agentResult) || agentResult.found === false) {
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
    if (res.total <= batchSize) {
      givenAgents = res.agents;
    } else {
      return await new _upgrade_action_runner.UpgradeActionRunner(esClient, soClient, {
        ...options,
        batchSize,
        total: res.total
      }, {
        pitId: await (0, _crud.openPointInTime)(esClient)
      }).runActionAsyncWithRetry();
    }
  }
  return await (0, _upgrade_action_runner.upgradeBatch)(soClient, esClient, givenAgents, outgoingErrors, options);
}