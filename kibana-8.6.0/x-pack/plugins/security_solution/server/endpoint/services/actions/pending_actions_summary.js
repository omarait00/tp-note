"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPendingActionsSummary = void 0;
var _ = require("..");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PENDING_ACTION_RESPONSE_MAX_LAPSED_TIME = 300000; // 300k ms === 5 minutes

/**
 * Returns an array containing the pending action summary for each of the Agent IDs provided on input
 */
const getPendingActionsSummary = async (esClient, metadataService, logger, agentIDs, isPendingActionResponsesWithAckEnabled) => {
  const {
    data: unExpiredActionList
  } = await (0, _.getActionList)({
    esClient,
    metadataService,
    unExpiredOnly: true,
    elasticAgentIds: agentIDs,
    pageSize: _constants.ACTIONS_SEARCH_PAGE_SIZE,
    logger
  });

  // Store a map of `agent_id => array of actions`
  const unExpiredByAgentId = unExpiredActionList.reduce((byAgentMap, action) => {
    for (const agent of action.agents) {
      if (!byAgentMap[agent]) {
        byAgentMap[agent] = [];
      }
      byAgentMap[agent].push(action);
    }
    return byAgentMap;
  }, {});
  const pending = [];
  let endpointMetadataLastUpdated;
  for (const agentID of agentIDs) {
    var _unExpiredByAgentId$a;
    const agentPendingActions = {};
    const setActionAsPending = commandName => {
      var _agentPendingActions$;
      // Add the command to the list of pending actions, but set it to zero if the
      // `pendingActionResponsesWithAck` feature flag is false.
      // Otherwise, just increment the count for this command
      agentPendingActions[commandName] = !isPendingActionResponsesWithAckEnabled ? 0 : ((_agentPendingActions$ = agentPendingActions[commandName]) !== null && _agentPendingActions$ !== void 0 ? _agentPendingActions$ : 0) + 1;
    };
    pending.push({
      agent_id: agentID,
      pending_actions: agentPendingActions
    });
    const agentUnexpiredActions = (_unExpiredByAgentId$a = unExpiredByAgentId[agentID]) !== null && _unExpiredByAgentId$a !== void 0 ? _unExpiredByAgentId$a : [];
    for (const unExpiredAction of agentUnexpiredActions) {
      // If this agent's action state is not completed, then mark it as pending
      if (!unExpiredAction.agentState[agentID].isCompleted) {
        setActionAsPending(unExpiredAction.command);
      } else if (unExpiredAction.wasSuccessful && (unExpiredAction.command === 'isolate' || unExpiredAction.command === 'unisolate')) {
        var _unExpiredAction$comp;
        // For Isolate and Un-Isolate, we want to ensure that the isolation status being reported in the
        // endpoint metadata was received after the action was completed. This is to ensure that the
        // isolation status being reported in the UI remains as accurate as possible.

        // If the metadata documents for all agents has not yet been retrieved, do it now
        if (!endpointMetadataLastUpdated) {
          endpointMetadataLastUpdated = (await metadataService.findHostMetadataForFleetAgents(esClient, agentIDs)).reduce((acc, endpointMetadata) => {
            acc[endpointMetadata.elastic.agent.id] = new Date(endpointMetadata.event.created);
            return acc;
          }, {});
        }
        const lastEndpointMetadataEventTimestamp = endpointMetadataLastUpdated[agentID];
        const actionCompletedAtTimestamp = new Date((_unExpiredAction$comp = unExpiredAction.completedAt) !== null && _unExpiredAction$comp !== void 0 ? _unExpiredAction$comp : Date.now());
        const enoughTimeHasLapsed = Date.now() - actionCompletedAtTimestamp.getTime() > PENDING_ACTION_RESPONSE_MAX_LAPSED_TIME;

        // If an endpoint metadata update was not received after the action completed,
        // and we are still within the lapse time of waiting for it, then show this action
        // as pending.
        if (!enoughTimeHasLapsed && lastEndpointMetadataEventTimestamp && lastEndpointMetadataEventTimestamp < actionCompletedAtTimestamp) {
          setActionAsPending(unExpiredAction.command);
        }
      }
    }
  }
  return pending;
};
exports.getPendingActionsSummary = getPendingActionsSummary;