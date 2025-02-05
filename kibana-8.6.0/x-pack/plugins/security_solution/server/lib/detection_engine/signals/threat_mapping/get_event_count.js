"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventList = exports.getEventCount = exports.MAX_PER_PAGE = void 0;
var _get_query_filter = require("../get_query_filter");
var _single_search_after = require("../single_search_after");
var _build_events_query = require("../build_events_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_PER_PAGE = 3000;
exports.MAX_PER_PAGE = MAX_PER_PAGE;
const getEventList = async ({
  services,
  ruleExecutionLogger,
  query,
  language,
  index,
  perPage,
  searchAfter,
  filters,
  tuple,
  primaryTimestamp,
  secondaryTimestamp,
  runtimeMappings,
  exceptionFilter
}) => {
  const calculatedPerPage = perPage !== null && perPage !== void 0 ? perPage : MAX_PER_PAGE;
  if (calculatedPerPage > 10000) {
    throw new TypeError('perPage cannot exceed the size of 10000');
  }
  ruleExecutionLogger.debug(`Querying the events items from the index: "${index}" with searchAfter: "${searchAfter}" for up to ${calculatedPerPage} indicator items`);
  const queryFilter = (0, _get_query_filter.getQueryFilter)({
    query,
    language: language !== null && language !== void 0 ? language : 'kuery',
    filters,
    index,
    exceptionFilter
  });
  const {
    searchResult
  } = await (0, _single_search_after.singleSearchAfter)({
    searchAfterSortIds: searchAfter,
    index,
    from: tuple.from.toISOString(),
    to: tuple.to.toISOString(),
    services,
    ruleExecutionLogger,
    pageSize: calculatedPerPage,
    filter: queryFilter,
    primaryTimestamp,
    secondaryTimestamp,
    sortOrder: 'desc',
    trackTotalHits: false,
    runtimeMappings
  });
  ruleExecutionLogger.debug(`Retrieved events items of size: ${searchResult.hits.hits.length}`);
  return searchResult;
};
exports.getEventList = getEventList;
const getEventCount = async ({
  esClient,
  query,
  language,
  filters,
  index,
  tuple,
  primaryTimestamp,
  secondaryTimestamp,
  exceptionFilter
}) => {
  const queryFilter = (0, _get_query_filter.getQueryFilter)({
    query,
    language: language !== null && language !== void 0 ? language : 'kuery',
    filters,
    index,
    exceptionFilter
  });
  const eventSearchQueryBodyQuery = (0, _build_events_query.buildEventsSearchQuery)({
    index,
    from: tuple.from.toISOString(),
    to: tuple.to.toISOString(),
    filter: queryFilter,
    size: 0,
    primaryTimestamp,
    secondaryTimestamp,
    searchAfterSortIds: undefined,
    runtimeMappings: undefined
  }).body.query;
  const response = await esClient.count({
    body: {
      query: eventSearchQueryBodyQuery
    },
    ignore_unavailable: true,
    index
  });
  return response.count;
};
exports.getEventCount = getEventCount;