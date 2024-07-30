"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionResponsesEsSearchResultsMock = exports.createActionRequestsEsSearchResultsMock = exports.applyActionsEsSearchMock = exports.applyActionListEsSearchMock = void 0;
var _common = require("../../../../../fleet/common");
var _endpoint_action_generator = require("../../../../common/endpoint/data_generators/endpoint_action_generator");
var _fleet_action_generator = require("../../../../common/endpoint/data_generators/fleet_action_generator");
var _constants = require("../../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createActionRequestsEsSearchResultsMock = (agentIds, isMultipleActions = false) => {
  const endpointActionGenerator = new _endpoint_action_generator.EndpointActionGenerator('seed');
  return isMultipleActions ? endpointActionGenerator.toEsSearchResponse(Array.from({
    length: 23
  }).map(() => endpointActionGenerator.generateActionEsHit())) : endpointActionGenerator.toEsSearchResponse([endpointActionGenerator.generateActionEsHit({
    EndpointActions: {
      action_id: '123'
    },
    agent: {
      id: agentIds ? agentIds : 'agent-a'
    },
    '@timestamp': '2022-04-27T16:08:47.449Z'
  })]);
};
exports.createActionRequestsEsSearchResultsMock = createActionRequestsEsSearchResultsMock;
const createActionResponsesEsSearchResultsMock = agentIds => {
  const endpointActionGenerator = new _endpoint_action_generator.EndpointActionGenerator('seed');
  const fleetActionGenerator = new _fleet_action_generator.FleetActionGenerator('seed');
  let hitSource = [fleetActionGenerator.generateResponseEsHit({
    action_id: '123',
    agent_id: 'agent-a',
    error: '',
    '@timestamp': '2022-04-30T16:08:47.449Z'
  }), endpointActionGenerator.generateResponseEsHit({
    agent: {
      id: 'agent-a'
    },
    EndpointActions: {
      action_id: '123'
    },
    '@timestamp': '2022-04-30T16:08:47.449Z'
  })];
  if (agentIds !== null && agentIds !== void 0 && agentIds.length) {
    const fleetResponses = agentIds.map(id => {
      return fleetActionGenerator.generateResponseEsHit({
        action_id: '123',
        agent_id: id,
        error: '',
        '@timestamp': '2022-04-30T16:08:47.449Z'
      });
    });
    hitSource = [...fleetResponses, endpointActionGenerator.generateResponseEsHit({
      agent: {
        id: agentIds ? agentIds : 'agent-a'
      },
      EndpointActions: {
        action_id: '123'
      },
      '@timestamp': '2022-04-30T16:08:47.449Z'
    })];
  }
  return endpointActionGenerator.toEsSearchResponse(hitSource);
};

/**
 * Applies a mock implementation to the `esClient.search()` method that will return action requests or responses
 * depending on what indexes the `.search()` was called with.
 * @param esClient
 * @param actionRequests
 * @param actionResponses
 */
exports.createActionResponsesEsSearchResultsMock = createActionResponsesEsSearchResultsMock;
const applyActionsEsSearchMock = (esClient, actionRequests = createActionRequestsEsSearchResultsMock(), actionResponses = createActionResponsesEsSearchResultsMock()) => {
  const priorSearchMockImplementation = esClient.search.getMockImplementation();
  esClient.search.mockImplementation(async (...args) => {
    var _args$;
    const params = (_args$ = args[0]) !== null && _args$ !== void 0 ? _args$ : {};
    const indexes = Array.isArray(params.index) ? params.index : [params.index];
    if (indexes.includes(_constants.ENDPOINT_ACTIONS_INDEX)) {
      return actionRequests;
    } else if (indexes.includes(_common.AGENT_ACTIONS_RESULTS_INDEX) || indexes.includes(_constants.ENDPOINT_ACTION_RESPONSES_INDEX_PATTERN)) {
      return actionResponses;
    }
    if (priorSearchMockImplementation) {
      return priorSearchMockImplementation(...args);
    }
    return new _endpoint_action_generator.EndpointActionGenerator().toEsSearchResponse([]);
  });
};

/**
 * Applies a mock implementation to the `esClient.search()` method that will return action requests or responses
 * depending on what indexes the `.search()` was called with.
 * @param esClient
 * @param actionRequests
 * @param actionResponses
 */
exports.applyActionsEsSearchMock = applyActionsEsSearchMock;
const applyActionListEsSearchMock = (esClient, actionRequests = createActionRequestsEsSearchResultsMock(), actionResponses = createActionResponsesEsSearchResultsMock()) => {
  const priorSearchMockImplementation = esClient.search.getMockImplementation();

  // @ts-expect-error incorrect type
  esClient.search.mockImplementation(async (...args) => {
    var _args$2;
    const params = (_args$2 = args[0]) !== null && _args$2 !== void 0 ? _args$2 : {};
    const indexes = Array.isArray(params.index) ? params.index : [params.index];
    if (indexes.includes(_constants.ENDPOINT_ACTIONS_INDEX)) {
      return {
        body: {
          ...actionRequests
        }
      };
    } else if (indexes.includes(_common.AGENT_ACTIONS_RESULTS_INDEX) || indexes.includes(_constants.ENDPOINT_ACTION_RESPONSES_INDEX_PATTERN)) {
      return {
        body: {
          ...actionResponses
        }
      };
    }
    if (priorSearchMockImplementation) {
      return priorSearchMockImplementation(...args);
    }
    return new _endpoint_action_generator.EndpointActionGenerator().toEsSearchResponse([]);
  });
};
exports.applyActionListEsSearchMock = applyActionListEsSearchMock;