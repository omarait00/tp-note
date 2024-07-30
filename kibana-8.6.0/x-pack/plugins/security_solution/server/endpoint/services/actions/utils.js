"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToNormalizedActionRequest = exports.isLogsEndpointActionResponse = exports.isLogsEndpointAction = exports.hasNoFleetResponse = exports.hasNoEndpointResponse = exports.hasAckInResponse = exports.getUniqueLogData = exports.getDateFilters = exports.getAgentHostNamesWithIds = exports.getActionStatus = exports.getActionCompletionInfo = exports.formatEndpointActionResults = exports.categorizeResponseResults = exports.categorizeActionResults = void 0;
var _constants = require("../../../../common/endpoint/constants");
var _types = require("../../../../common/endpoint/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Type guard to check if a given Action is in the shape of the Endpoint Action.
 * @param item
 */
const isLogsEndpointAction = item => {
  return 'EndpointActions' in item && 'user' in item && 'agent' in item && '@timestamp' in item;
};

/**
 * Type guard to track if a given action response is in the shape of the Endpoint Action Response (from the endpoint index)
 * @param item
 */
exports.isLogsEndpointAction = isLogsEndpointAction;
const isLogsEndpointActionResponse = item => {
  return 'EndpointActions' in item && 'agent' in item;
};
exports.isLogsEndpointActionResponse = isLogsEndpointActionResponse;
/**
 * Given an Action record - either a fleet action or an endpoint action - this utility
 * will return a normalized data structure based on those two types, which
 * will avoid us having to either cast or do type guards against the two different
 * types of action request.
 */
const mapToNormalizedActionRequest = actionRequest => {
  const type = 'ACTION_REQUEST';
  if (isLogsEndpointAction(actionRequest)) {
    return {
      agents: Array.isArray(actionRequest.agent.id) ? actionRequest.agent.id : [actionRequest.agent.id],
      command: actionRequest.EndpointActions.data.command,
      comment: actionRequest.EndpointActions.data.comment,
      createdBy: actionRequest.user.id,
      createdAt: actionRequest['@timestamp'],
      expiration: actionRequest.EndpointActions.expiration,
      id: actionRequest.EndpointActions.action_id,
      type,
      parameters: actionRequest.EndpointActions.data.parameters
    };
  }

  // Else, it's a Fleet Endpoint Action record
  return {
    agents: actionRequest.agents,
    command: actionRequest.data.command,
    comment: actionRequest.data.comment,
    createdBy: actionRequest.user_id,
    createdAt: actionRequest['@timestamp'],
    expiration: actionRequest.expiration,
    id: actionRequest.action_id,
    type,
    parameters: actionRequest.data.parameters
  };
};
exports.mapToNormalizedActionRequest = mapToNormalizedActionRequest;
const getActionCompletionInfo = (agentIds, actionResponses) => {
  const completedInfo = {
    completedAt: undefined,
    errors: undefined,
    outputs: {},
    agentState: {},
    isCompleted: Boolean(agentIds.length),
    wasSuccessful: Boolean(agentIds.length)
  };
  const responsesByAgentId = mapActionResponsesByAgentId(actionResponses);
  for (const agentId of agentIds) {
    const agentResponses = responsesByAgentId[agentId];

    // Set the overall Action to not completed if at least
    // one of the agent responses is not complete yet.
    if (!agentResponses || !agentResponses.isCompleted) {
      completedInfo.isCompleted = false;
      completedInfo.wasSuccessful = false;
    }

    // individual agent state
    completedInfo.agentState[agentId] = {
      isCompleted: false,
      wasSuccessful: false,
      errors: undefined,
      completedAt: undefined
    };

    // Store the outputs and agent state for any agent that has received a response
    if (agentResponses) {
      completedInfo.agentState[agentId].isCompleted = agentResponses.isCompleted;
      completedInfo.agentState[agentId].wasSuccessful = agentResponses.wasSuccessful;
      completedInfo.agentState[agentId].completedAt = agentResponses.completedAt;
      completedInfo.agentState[agentId].errors = agentResponses.errors;
      if (agentResponses.endpointResponse && agentResponses.endpointResponse.item.data.EndpointActions.data.output) {
        completedInfo.outputs[agentId] = agentResponses.endpointResponse.item.data.EndpointActions.data.output;
      }
    }
  }

  // If completed, then get the completed at date and determine if action as a whole was successful or not
  if (completedInfo.isCompleted) {
    const responseErrors = [];
    for (const normalizedAgentResponse of Object.values(responsesByAgentId)) {
      var _normalizedAgentRespo;
      if (!completedInfo.completedAt || completedInfo.completedAt < ((_normalizedAgentRespo = normalizedAgentResponse.completedAt) !== null && _normalizedAgentRespo !== void 0 ? _normalizedAgentRespo : '')) {
        completedInfo.completedAt = normalizedAgentResponse.completedAt;
      }
      if (!normalizedAgentResponse.wasSuccessful) {
        completedInfo.wasSuccessful = false;
        responseErrors.push(...(normalizedAgentResponse.errors ? normalizedAgentResponse.errors : []));
      }
    }
    if (responseErrors.length) {
      completedInfo.errors = responseErrors;
    }
  }
  return completedInfo;
};
exports.getActionCompletionInfo = getActionCompletionInfo;
const getActionStatus = ({
  expirationDate,
  isCompleted,
  wasSuccessful
}) => {
  const isExpired = !isCompleted && expirationDate < new Date().toISOString();
  const status = isExpired ? 'failed' : isCompleted ? wasSuccessful ? 'successful' : 'failed' : 'pending';
  return {
    isExpired,
    status
  };
};
exports.getActionStatus = getActionStatus;
/**
 * Given a list of Action Responses, it will return a Map where keys are the Agent ID and
 * value is a object having information about the action responses associated with that agent id
 * @param actionResponses
 */
const mapActionResponsesByAgentId = actionResponses => {
  const response = {};
  for (const actionResponse of actionResponses) {
    var _thisAgentActionRespo;
    const agentId = getAgentIdFromActionResponse(actionResponse);
    let thisAgentActionResponses = response[agentId];
    if (!thisAgentActionResponses) {
      response[agentId] = {
        isCompleted: false,
        completedAt: undefined,
        wasSuccessful: false,
        errors: undefined,
        fleetResponse: undefined,
        endpointResponse: undefined
      };
      thisAgentActionResponses = response[agentId];
    }
    if (actionResponse.type === 'fleetResponse') {
      thisAgentActionResponses.fleetResponse = actionResponse;
    } else {
      thisAgentActionResponses.endpointResponse = actionResponse;
    }
    thisAgentActionResponses.isCompleted =
    // Action is complete if an Endpoint Action Response was received
    Boolean(thisAgentActionResponses.endpointResponse) ||
    // OR:
    // If we did not have an endpoint response and the Fleet response has `error`, then
    // action is complete. Elastic Agent was unable to deliver the action request to the
    // endpoint, so we are unlikely to ever receive an Endpoint Response.
    Boolean((_thisAgentActionRespo = thisAgentActionResponses.fleetResponse) === null || _thisAgentActionRespo === void 0 ? void 0 : _thisAgentActionRespo.item.data.error);

    // When completed, calculate additional properties about the action
    if (thisAgentActionResponses.isCompleted) {
      var _thisAgentActionRespo3, _thisAgentActionRespo4, _thisAgentActionRespo5;
      if (thisAgentActionResponses.endpointResponse) {
        var _thisAgentActionRespo2;
        thisAgentActionResponses.completedAt = (_thisAgentActionRespo2 = thisAgentActionResponses.endpointResponse) === null || _thisAgentActionRespo2 === void 0 ? void 0 : _thisAgentActionRespo2.item.data['@timestamp'];
        thisAgentActionResponses.wasSuccessful = true;
      } else if (
      // Check if perhaps the Fleet action response returned an error, in which case, the Fleet Agent
      // failed to deliver the Action to the Endpoint. If that's the case, we are not going to get
      // a Response from endpoint, thus mark the Action as completed and use the Fleet Message's
      // timestamp for the complete data/time.
      thisAgentActionResponses.fleetResponse && thisAgentActionResponses.fleetResponse.item.data.error) {
        thisAgentActionResponses.isCompleted = true;
        thisAgentActionResponses.completedAt = thisAgentActionResponses.fleetResponse.item.data['@timestamp'];
      }
      const errors = [];

      // only one of the errors should be in there
      if ((_thisAgentActionRespo3 = thisAgentActionResponses.endpointResponse) !== null && _thisAgentActionRespo3 !== void 0 && (_thisAgentActionRespo4 = _thisAgentActionRespo3.item.data.error) !== null && _thisAgentActionRespo4 !== void 0 && _thisAgentActionRespo4.message) {
        errors.push(`Endpoint action response error: ${thisAgentActionResponses.endpointResponse.item.data.error.message}`);
      }
      if ((_thisAgentActionRespo5 = thisAgentActionResponses.fleetResponse) !== null && _thisAgentActionRespo5 !== void 0 && _thisAgentActionRespo5.item.data.error) {
        var _thisAgentActionRespo6;
        errors.push(`Fleet action response error: ${(_thisAgentActionRespo6 = thisAgentActionResponses.fleetResponse) === null || _thisAgentActionRespo6 === void 0 ? void 0 : _thisAgentActionRespo6.item.data.error}`);
      }
      if (errors.length) {
        thisAgentActionResponses.wasSuccessful = false;
        thisAgentActionResponses.errors = errors;
      }
    }
  }
  return response;
};

/**
 * Given an Action response, this will return the Agent ID for that action response.
 * @param actionResponse
 */
const getAgentIdFromActionResponse = actionResponse => {
  const responseData = actionResponse.item.data;
  if (isLogsEndpointActionResponse(responseData)) {
    return Array.isArray(responseData.agent.id) ? responseData.agent.id[0] : responseData.agent.id;
  }
  return responseData.agent_id;
};

// common helpers used by old and new log API
const getDateFilters = ({
  startDate,
  endDate
}) => {
  const dateFilters = [];
  if (startDate) {
    dateFilters.push({
      range: {
        '@timestamp': {
          gte: startDate
        }
      }
    });
  }
  if (endDate) {
    dateFilters.push({
      range: {
        '@timestamp': {
          lte: endDate
        }
      }
    });
  }
  return dateFilters;
};
exports.getDateFilters = getDateFilters;
const getUniqueLogData = activityLogEntries => {
  // find the error responses for actions that didn't make it to fleet index
  const onlyResponsesForFleetErrors = activityLogEntries.reduce((acc, curr) => {
    var _curr$item$data$error;
    if (curr.type === _types.ActivityLogItemTypes.RESPONSE && ((_curr$item$data$error = curr.item.data.error) === null || _curr$item$data$error === void 0 ? void 0 : _curr$item$data$error.code) === _constants.failedFleetActionErrorCode) {
      acc.push(curr.item.data.EndpointActions.action_id);
    }
    return acc;
  }, []);

  // all actions and responses minus endpoint actions.
  const nonEndpointActionsDocs = activityLogEntries.filter(e => e.type !== _types.ActivityLogItemTypes.ACTION);

  // only endpoint actions that match the error responses
  const onlyEndpointActionsDocWithoutFleetActions = activityLogEntries.filter(e => e.type === _types.ActivityLogItemTypes.ACTION && onlyResponsesForFleetErrors.includes(e.item.data.EndpointActions.action_id));

  // join the error actions and the rest
  return [...nonEndpointActionsDocs, ...onlyEndpointActionsDocWithoutFleetActions];
};
exports.getUniqueLogData = getUniqueLogData;
const hasAckInResponse = response => {
  var _response$action_resp, _response$action_resp2, _response$action_resp3;
  return (_response$action_resp = (_response$action_resp2 = response.action_response) === null || _response$action_resp2 === void 0 ? void 0 : (_response$action_resp3 = _response$action_resp2.endpoint) === null || _response$action_resp3 === void 0 ? void 0 : _response$action_resp3.ack) !== null && _response$action_resp !== void 0 ? _response$action_resp : false;
};

// return TRUE if for given action_id/agent_id
// there is no doc in .logs-endpoint.action.response-default
exports.hasAckInResponse = hasAckInResponse;
const hasNoEndpointResponse = ({
  action,
  agentId,
  indexedActionIds
}) => {
  return action.agents.includes(agentId) && !indexedActionIds.includes(action.action_id);
};

// return TRUE if for given action_id/agent_id
// there is no doc in .fleet-actions-results
exports.hasNoEndpointResponse = hasNoEndpointResponse;
const hasNoFleetResponse = ({
  action,
  agentId,
  agentResponses
}) => {
  return action.agents.includes(agentId) && !agentResponses.map(e => e.action_id).includes(action.action_id);
};
exports.hasNoFleetResponse = hasNoFleetResponse;
const matchesDsNamePattern = ({
  dataStreamName,
  index
}) => index.includes(dataStreamName);
const categorizeResponseResults = ({
  results
}) => {
  return results !== null && results !== void 0 && results.length ? results === null || results === void 0 ? void 0 : results.map(e => {
    const isResponseDoc = matchesDsNamePattern({
      dataStreamName: _constants.ENDPOINT_ACTION_RESPONSES_DS,
      index: e._index
    });
    return isResponseDoc ? {
      type: _types.ActivityLogItemTypes.RESPONSE,
      item: {
        id: e._id,
        data: e._source
      }
    } : {
      type: _types.ActivityLogItemTypes.FLEET_RESPONSE,
      item: {
        id: e._id,
        data: e._source
      }
    };
  }) : [];
};
exports.categorizeResponseResults = categorizeResponseResults;
const categorizeActionResults = ({
  results
}) => {
  return results !== null && results !== void 0 && results.length ? results === null || results === void 0 ? void 0 : results.map(e => {
    const isActionDoc = matchesDsNamePattern({
      dataStreamName: _constants.ENDPOINT_ACTIONS_DS,
      index: e._index
    });
    return isActionDoc ? {
      type: _types.ActivityLogItemTypes.ACTION,
      item: {
        id: e._id,
        data: e._source
      }
    } : {
      type: _types.ActivityLogItemTypes.FLEET_ACTION,
      item: {
        id: e._id,
        data: e._source
      }
    };
  }) : [];
};

// for 8.4+ we only search on endpoint actions index
// and thus there are only endpoint actions in the results
exports.categorizeActionResults = categorizeActionResults;
const formatEndpointActionResults = results => {
  return results !== null && results !== void 0 && results.length ? results === null || results === void 0 ? void 0 : results.map(e => {
    return {
      type: _types.ActivityLogItemTypes.ACTION,
      item: {
        id: e._id,
        data: e._source
      }
    };
  }) : [];
};
exports.formatEndpointActionResults = formatEndpointActionResults;
const getAgentHostNamesWithIds = async ({
  esClient,
  agentIds,
  metadataService
}) => {
  // get host metadata docs with queried agents
  const metaDataDocs = await metadataService.findHostMetadataForFleetAgents(esClient, [...new Set(agentIds)]);
  // agent ids and names from metadata
  // map this into an object as {id1: name1, id2: name2} etc
  const agentsMetadataInfo = agentIds.reduce((acc, id) => {
    var _metaDataDocs$find$ho, _metaDataDocs$find;
    acc[id] = (_metaDataDocs$find$ho = (_metaDataDocs$find = metaDataDocs.find(doc => doc.agent.id === id)) === null || _metaDataDocs$find === void 0 ? void 0 : _metaDataDocs$find.host.hostname) !== null && _metaDataDocs$find$ho !== void 0 ? _metaDataDocs$find$ho : '';
    return acc;
  }, {});
  return agentsMetadataInfo;
};
exports.getAgentHostNamesWithIds = getAgentHostNamesWithIds;