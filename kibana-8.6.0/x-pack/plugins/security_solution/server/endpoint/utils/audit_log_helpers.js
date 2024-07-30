"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeSortedData = exports.getActionResponsesResult = exports.getActionRequestsResult = void 0;
var _common = require("../../../../fleet/common");
var _constants = require("../../../common/endpoint/constants");
var _yes_no_data_stream = require("./yes_no_data_stream");
var _utils = require("../services/actions/utils");
var _constants2 = require("../services/actions/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const queryOptions = {
  headers: {
    'X-elastic-product-origin': 'fleet'
  },
  ignore: [404]
};
const getTimeSortedData = data => {
  return data.sort((a, b) => new Date(b.item.data['@timestamp']) > new Date(a.item.data['@timestamp']) ? 1 : -1);
};
exports.getTimeSortedData = getTimeSortedData;
const getActionRequestsResult = async ({
  context,
  logger,
  elasticAgentId,
  startDate,
  endDate,
  size,
  from
}) => {
  const dateFilters = (0, _utils.getDateFilters)({
    startDate,
    endDate
  });
  const baseActionFilters = [{
    term: {
      agents: elasticAgentId
    }
  }, {
    term: {
      input_type: 'endpoint'
    }
  }, {
    term: {
      type: 'INPUT_ACTION'
    }
  }];
  const actionsFilters = [...baseActionFilters, ...dateFilters];
  const hasLogsEndpointActionsIndex = await (0, _yes_no_data_stream.doesLogsEndpointActionsIndexExist)({
    context,
    logger,
    indexName: _constants.ENDPOINT_ACTIONS_INDEX
  });
  const actionsSearchQuery = {
    index: hasLogsEndpointActionsIndex ? _constants2.ACTION_REQUEST_INDICES : _common.AGENT_ACTIONS_INDEX,
    size,
    from,
    body: {
      query: {
        bool: {
          filter: actionsFilters
        }
      },
      sort: [{
        '@timestamp': {
          order: 'desc'
        }
      }]
    }
  };
  let actionRequests;
  try {
    var _actionRequests, _actionRequests$body, _actionRequests$body$, _actionRequests$body$2;
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    actionRequests = await esClient.search(actionsSearchQuery, {
      ...queryOptions,
      meta: true
    });
    const actionIds = (_actionRequests = actionRequests) === null || _actionRequests === void 0 ? void 0 : (_actionRequests$body = _actionRequests.body) === null || _actionRequests$body === void 0 ? void 0 : (_actionRequests$body$ = _actionRequests$body.hits) === null || _actionRequests$body$ === void 0 ? void 0 : (_actionRequests$body$2 = _actionRequests$body$.hits) === null || _actionRequests$body$2 === void 0 ? void 0 : _actionRequests$body$2.map(e => {
      return e._index.includes(_constants.ENDPOINT_ACTIONS_DS) ? e._source.EndpointActions.action_id : e._source.action_id;
    });
    return {
      actionIds,
      actionRequests
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
exports.getActionRequestsResult = getActionRequestsResult;
const getActionResponsesResult = async ({
  context,
  logger,
  elasticAgentId,
  actionIds,
  startDate,
  endDate
}) => {
  const dateFilters = (0, _utils.getDateFilters)({
    startDate,
    endDate
  });
  const baseResponsesFilter = [{
    term: {
      agent_id: elasticAgentId
    }
  }, {
    terms: {
      action_id: actionIds
    }
  }];
  const responsesFilters = [...baseResponsesFilter, ...dateFilters];
  const hasLogsEndpointActionResponsesIndex = await (0, _yes_no_data_stream.doesLogsEndpointActionsIndexExist)({
    context,
    logger,
    indexName: _constants.ENDPOINT_ACTION_RESPONSES_INDEX_PATTERN
  });
  const responsesSearchQuery = {
    index: hasLogsEndpointActionResponsesIndex ? _constants2.ACTION_RESPONSE_INDICES : _common.AGENT_ACTIONS_RESULTS_INDEX,
    size: 1000,
    body: {
      query: {
        bool: {
          filter: responsesFilters
        }
      }
    }
  };
  let actionResponses;
  try {
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    actionResponses = await esClient.search(responsesSearchQuery, {
      ...queryOptions,
      meta: true
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
  return actionResponses;
};
exports.getActionResponsesResult = getActionResponsesResult;