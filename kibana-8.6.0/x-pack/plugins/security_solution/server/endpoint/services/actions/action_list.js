"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionListByStatus = exports.getActionList = void 0;
var _constants = require("../../../../common/endpoint/constants");
var _custom_http_request_error = require("../../../utils/custom_http_request_error");
var _action_list_helpers = require("../../utils/action_list_helpers");
var _utils = require("./utils");
var _constants2 = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Similar to #getActionList but takes statuses filter options
 * Retrieve a list of all (at most 10k) Actions from index (`ActionDetails`)
 * filter out action details based on statuses filter options
 */
const getActionListByStatus = async ({
  commands,
  elasticAgentIds,
  esClient,
  endDate,
  logger,
  metadataService,
  page: _page,
  pageSize,
  startDate,
  statuses,
  userIds,
  unExpiredOnly = false
}) => {
  const size = pageSize !== null && pageSize !== void 0 ? pageSize : _constants.ENDPOINT_DEFAULT_PAGE_SIZE;
  const page = _page !== null && _page !== void 0 ? _page : 1;
  const {
    actionDetails: allActionDetails
  } = await getActionDetailsList({
    commands,
    elasticAgentIds,
    esClient,
    endDate,
    from: 0,
    logger,
    metadataService,
    size: _constants2.ACTIONS_SEARCH_PAGE_SIZE,
    startDate,
    userIds,
    unExpiredOnly
  });

  // filter out search results based on status filter options
  const actionDetailsByStatus = allActionDetails.filter(detail => statuses.includes(detail.status));
  return {
    page,
    pageSize: size,
    startDate,
    endDate,
    elasticAgentIds,
    userIds,
    commands,
    statuses,
    // for size 20 -> page 1: (0, 20), page 2: (20, 40) ...etc
    data: actionDetailsByStatus.slice((page - 1) * size, size * page),
    total: actionDetailsByStatus.length
  };
};

/**
 * Retrieve a list of Actions (`ActionDetails`)
 */
exports.getActionListByStatus = getActionListByStatus;
const getActionList = async ({
  commands,
  elasticAgentIds,
  esClient,
  endDate,
  logger,
  metadataService,
  page: _page,
  pageSize,
  startDate,
  userIds,
  unExpiredOnly = false
}) => {
  const size = pageSize !== null && pageSize !== void 0 ? pageSize : _constants.ENDPOINT_DEFAULT_PAGE_SIZE;
  const page = _page !== null && _page !== void 0 ? _page : 1;
  // # of hits to skip
  const from = (page - 1) * size;
  const {
    actionDetails,
    totalRecords
  } = await getActionDetailsList({
    commands,
    elasticAgentIds,
    esClient,
    endDate,
    from,
    logger,
    metadataService,
    size,
    startDate,
    userIds,
    unExpiredOnly
  });
  return {
    page,
    pageSize: size,
    startDate,
    endDate,
    elasticAgentIds,
    userIds,
    commands,
    statuses: undefined,
    data: actionDetails,
    total: totalRecords
  };
};
exports.getActionList = getActionList;
const getActionDetailsList = async ({
  commands,
  elasticAgentIds,
  esClient,
  endDate,
  from,
  logger,
  metadataService,
  size,
  startDate,
  userIds,
  unExpiredOnly
}) => {
  var _actionRequests2, _actionRequests2$body, _actionRequests2$body2, _actionRequests3, _actionRequests3$body, _actionRequests3$body2, _actionRequests4, _actionRequests4$body, _actionRequests4$body2, _actionResponses, _actionResponses$body, _actionResponses$body2;
  let actionRequests;
  let actionReqIds;
  let actionResponses;
  let agentsHostInfo;
  try {
    // fetch actions with matching agent_ids if any
    const {
      actionIds,
      actionRequests: _actionRequests
    } = await (0, _action_list_helpers.getActions)({
      commands,
      esClient,
      elasticAgentIds,
      startDate,
      endDate,
      from,
      size,
      userIds,
      unExpiredOnly
    });
    actionRequests = _actionRequests;
    actionReqIds = actionIds;
  } catch (error) {
    var _error$meta$meta$body, _error$meta, _error$meta$meta, _error$meta$meta$body2, _error$meta$meta$body3, _error$meta$meta$stat, _error$meta2, _error$meta2$meta;
    // all other errors
    const err = new _custom_http_request_error.CustomHttpRequestError((_error$meta$meta$body = (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$meta = _error$meta.meta) === null || _error$meta$meta === void 0 ? void 0 : (_error$meta$meta$body2 = _error$meta$meta.body) === null || _error$meta$meta$body2 === void 0 ? void 0 : (_error$meta$meta$body3 = _error$meta$meta$body2.error) === null || _error$meta$meta$body3 === void 0 ? void 0 : _error$meta$meta$body3.reason) !== null && _error$meta$meta$body !== void 0 ? _error$meta$meta$body : `Unknown error while fetching action requests (${error.message})`, (_error$meta$meta$stat = (_error$meta2 = error.meta) === null || _error$meta2 === void 0 ? void 0 : (_error$meta2$meta = _error$meta2.meta) === null || _error$meta2$meta === void 0 ? void 0 : _error$meta2$meta.statusCode) !== null && _error$meta$meta$stat !== void 0 ? _error$meta$meta$stat : 500, error);
    logger.error(err);
    throw err;
  }
  if (!((_actionRequests2 = actionRequests) !== null && _actionRequests2 !== void 0 && (_actionRequests2$body = _actionRequests2.body) !== null && _actionRequests2$body !== void 0 && (_actionRequests2$body2 = _actionRequests2$body.hits) !== null && _actionRequests2$body2 !== void 0 && _actionRequests2$body2.hits)) {
    // return empty details array
    return {
      actionDetails: [],
      totalRecords: 0
    };
  }

  // format endpoint actions into { type, item } structure
  const formattedActionRequests = (0, _utils.formatEndpointActionResults)((_actionRequests3 = actionRequests) === null || _actionRequests3 === void 0 ? void 0 : (_actionRequests3$body = _actionRequests3.body) === null || _actionRequests3$body === void 0 ? void 0 : (_actionRequests3$body2 = _actionRequests3$body.hits) === null || _actionRequests3$body2 === void 0 ? void 0 : _actionRequests3$body2.hits);
  const totalRecords = ((_actionRequests4 = actionRequests) === null || _actionRequests4 === void 0 ? void 0 : (_actionRequests4$body = _actionRequests4.body) === null || _actionRequests4$body === void 0 ? void 0 : (_actionRequests4$body2 = _actionRequests4$body.hits) === null || _actionRequests4$body2 === void 0 ? void 0 : _actionRequests4$body2.total).value;

  // normalized actions with a flat structure to access relevant values
  const normalizedActionRequests = formattedActionRequests.map(action => (0, _utils.mapToNormalizedActionRequest)(action.item.data));
  try {
    // get all responses for given action Ids and agent Ids
    // and get host metadata info with queried agents
    [actionResponses, agentsHostInfo] = await Promise.all([(0, _action_list_helpers.getActionResponses)({
      actionIds: actionReqIds,
      elasticAgentIds,
      esClient
    }), await (0, _utils.getAgentHostNamesWithIds)({
      esClient,
      metadataService,
      agentIds: normalizedActionRequests.map(action => action.agents).flat()
    })]);
  } catch (error) {
    var _error$meta$meta$body4, _error$meta3, _error$meta3$meta, _error$meta3$meta$bod, _error$meta3$meta$bod2, _error$meta$meta$stat2, _error$meta4, _error$meta4$meta;
    // all other errors
    const err = new _custom_http_request_error.CustomHttpRequestError((_error$meta$meta$body4 = (_error$meta3 = error.meta) === null || _error$meta3 === void 0 ? void 0 : (_error$meta3$meta = _error$meta3.meta) === null || _error$meta3$meta === void 0 ? void 0 : (_error$meta3$meta$bod = _error$meta3$meta.body) === null || _error$meta3$meta$bod === void 0 ? void 0 : (_error$meta3$meta$bod2 = _error$meta3$meta$bod.error) === null || _error$meta3$meta$bod2 === void 0 ? void 0 : _error$meta3$meta$bod2.reason) !== null && _error$meta$meta$body4 !== void 0 ? _error$meta$meta$body4 : `Unknown error while fetching action responses (${error.message})`, (_error$meta$meta$stat2 = (_error$meta4 = error.meta) === null || _error$meta4 === void 0 ? void 0 : (_error$meta4$meta = _error$meta4.meta) === null || _error$meta4$meta === void 0 ? void 0 : _error$meta4$meta.statusCode) !== null && _error$meta$meta$stat2 !== void 0 ? _error$meta$meta$stat2 : 500, error);
    logger.error(err);
    throw err;
  }

  // categorize responses as fleet and endpoint responses
  const categorizedResponses = (0, _utils.categorizeResponseResults)({
    results: (_actionResponses = actionResponses) === null || _actionResponses === void 0 ? void 0 : (_actionResponses$body = _actionResponses.body) === null || _actionResponses$body === void 0 ? void 0 : (_actionResponses$body2 = _actionResponses$body.hits) === null || _actionResponses$body2 === void 0 ? void 0 : _actionResponses$body2.hits
  });

  // compute action details list for each action id
  const actionDetails = normalizedActionRequests.map(action => {
    // pick only those responses that match the current action id
    const matchedResponses = categorizedResponses.filter(categorizedResponse => categorizedResponse.type === 'response' ? categorizedResponse.item.data.EndpointActions.action_id === action.id : categorizedResponse.item.data.action_id === action.id);

    // find the specific response's details using that set of matching responses
    const {
      isCompleted,
      completedAt,
      wasSuccessful,
      errors,
      agentState
    } = (0, _utils.getActionCompletionInfo)(action.agents, matchedResponses);
    const {
      isExpired,
      status
    } = (0, _utils.getActionStatus)({
      expirationDate: action.expiration,
      isCompleted,
      wasSuccessful
    });

    // NOTE: `outputs` is not returned in this service because including it on a list of data
    // could result in a very large response unnecessarily. In the future, we might include
    // an option to optionally include it.
    const actionRecord = {
      id: action.id,
      agents: action.agents,
      hosts: action.agents.reduce((acc, id) => {
        var _agentsHostInfo$id;
        acc[id] = {
          name: (_agentsHostInfo$id = agentsHostInfo[id]) !== null && _agentsHostInfo$id !== void 0 ? _agentsHostInfo$id : ''
        };
        return acc;
      }, {}),
      command: action.command,
      startedAt: action.createdAt,
      isCompleted,
      completedAt,
      wasSuccessful,
      errors,
      agentState,
      isExpired,
      status,
      createdBy: action.createdBy,
      comment: action.comment,
      parameters: action.parameters
    };
    return actionRecord;
  });
  return {
    actionDetails,
    totalRecords
  };
};