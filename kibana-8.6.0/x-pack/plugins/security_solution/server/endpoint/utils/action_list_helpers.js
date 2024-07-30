"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActions = exports.getActionResponses = void 0;
var _esQuery = require("@kbn/es-query");
var _constants = require("../../../common/endpoint/constants");
var _constants2 = require("../services/actions/constants");
var _utils = require("../services/actions/utils");
var _wrap_errors = require("./wrap_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const queryOptions = Object.freeze({
  ignore: [404]
});
const getActions = async ({
  commands,
  elasticAgentIds,
  esClient,
  endDate,
  from,
  size,
  startDate,
  userIds,
  unExpiredOnly
}) => {
  var _actionRequests$body, _actionRequests$body$;
  const additionalFilters = [];
  if (commands !== null && commands !== void 0 && commands.length) {
    additionalFilters.push({
      terms: {
        'data.command': commands
      }
    });
  }
  if (elasticAgentIds !== null && elasticAgentIds !== void 0 && elasticAgentIds.length) {
    additionalFilters.push({
      terms: {
        agents: elasticAgentIds
      }
    });
  }
  if (unExpiredOnly) {
    additionalFilters.push({
      range: {
        expiration: {
          gte: 'now'
        }
      }
    });
  }
  const dateFilters = (0, _utils.getDateFilters)({
    startDate,
    endDate
  });
  const actionsFilters = [{
    term: {
      input_type: 'endpoint'
    }
  }, {
    term: {
      type: 'INPUT_ACTION'
    }
  }, ...dateFilters, ...additionalFilters];
  const must = [{
    bool: {
      filter: actionsFilters
    }
  }];
  if (userIds !== null && userIds !== void 0 && userIds.length) {
    const userIdsKql = userIds.map(userId => `user_id:${userId}`).join(' or ');
    const mustClause = (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(userIdsKql));
    must.push(mustClause);
  }
  const actionsSearchQuery = {
    index: _constants.ENDPOINT_ACTIONS_INDEX,
    size,
    from,
    body: {
      query: {
        bool: {
          must
        }
      },
      sort: [{
        '@timestamp': {
          order: 'desc'
        }
      }]
    }
  };
  const actionRequests = await esClient.search(actionsSearchQuery, {
    ...queryOptions,
    meta: true
  }).catch(_wrap_errors.catchAndWrapError);

  // only one type of actions
  const actionIds = actionRequests === null || actionRequests === void 0 ? void 0 : (_actionRequests$body = actionRequests.body) === null || _actionRequests$body === void 0 ? void 0 : (_actionRequests$body$ = _actionRequests$body.hits) === null || _actionRequests$body$ === void 0 ? void 0 : _actionRequests$body$.hits.map(e => {
    return e._source.EndpointActions.action_id;
  });
  return {
    actionIds,
    actionRequests
  };
};
exports.getActions = getActions;
const getActionResponses = async ({
  actionIds,
  elasticAgentIds,
  esClient
}) => {
  const filter = [];
  if (elasticAgentIds !== null && elasticAgentIds !== void 0 && elasticAgentIds.length) {
    filter.push({
      terms: {
        agent_id: elasticAgentIds
      }
    });
  }
  if (actionIds.length) {
    filter.push({
      terms: {
        action_id: actionIds
      }
    });
  }
  const responsesSearchQuery = {
    index: _constants2.ACTION_RESPONSE_INDICES,
    size: _constants2.ACTIONS_SEARCH_PAGE_SIZE,
    from: 0,
    body: {
      query: {
        bool: {
          filter: filter.length ? filter : []
        }
      }
    }
  };
  const actionResponses = await esClient.search(responsesSearchQuery, {
    ...queryOptions,
    headers: {
      'X-elastic-product-origin': 'fleet'
    },
    meta: true
  }).catch(_wrap_errors.catchAndWrapError);
  return actionResponses;
};
exports.getActionResponses = getActionResponses;