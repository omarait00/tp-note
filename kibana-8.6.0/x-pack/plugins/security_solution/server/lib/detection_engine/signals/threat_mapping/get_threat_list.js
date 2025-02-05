"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThreatListCount = exports.getThreatList = exports.getSortForThreatList = exports.getAllThreatListHits = exports.INDICATOR_PER_PAGE = void 0;
var _get_query_filter = require("../get_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This should not exceed 10000 (10k)
 */
const INDICATOR_PER_PAGE = 1000;
exports.INDICATOR_PER_PAGE = INDICATOR_PER_PAGE;
const getThreatList = async ({
  esClient,
  index,
  language,
  perPage,
  query,
  ruleExecutionLogger,
  searchAfter,
  threatFilters,
  threatListConfig,
  pitId,
  reassignPitId,
  runtimeMappings,
  listClient,
  exceptionFilter
}) => {
  const calculatedPerPage = perPage !== null && perPage !== void 0 ? perPage : INDICATOR_PER_PAGE;
  if (calculatedPerPage > 10000) {
    throw new TypeError('perPage cannot exceed the size of 10000');
  }
  const queryFilter = (0, _get_query_filter.getQueryFilter)({
    query,
    language: language !== null && language !== void 0 ? language : 'kuery',
    filters: threatFilters,
    index,
    exceptionFilter
  });
  ruleExecutionLogger.debug(`Querying the indicator items from the index: "${index}" with searchAfter: "${searchAfter}" for up to ${calculatedPerPage} indicator items`);
  const response = await esClient.search({
    body: {
      ...threatListConfig,
      query: queryFilter,
      search_after: searchAfter,
      runtime_mappings: runtimeMappings,
      sort: getSortForThreatList({
        index,
        listItemIndex: listClient.getListItemIndex()
      })
    },
    track_total_hits: false,
    size: calculatedPerPage,
    pit: {
      id: pitId
    }
  });
  ruleExecutionLogger.debug(`Retrieved indicator items of size: ${response.hits.hits.length}`);
  reassignPitId(response.pit_id);
  return response;
};
exports.getThreatList = getThreatList;
const getSortForThreatList = ({
  index,
  listItemIndex
}) => {
  const defaultSort = ['_shard_doc'];
  if (index.length === 1 && index[0] === listItemIndex) {
    return defaultSort;
  }
  return [...defaultSort, {
    '@timestamp': 'asc'
  }];
};
exports.getSortForThreatList = getSortForThreatList;
const getThreatListCount = async ({
  esClient,
  query,
  language,
  threatFilters,
  index,
  exceptionFilter
}) => {
  const queryFilter = (0, _get_query_filter.getQueryFilter)({
    query,
    language: language !== null && language !== void 0 ? language : 'kuery',
    filters: threatFilters,
    index,
    exceptionFilter
  });
  const response = await esClient.count({
    body: {
      query: queryFilter
    },
    ignore_unavailable: true,
    index
  });
  return response.count;
};
exports.getThreatListCount = getThreatListCount;
const getAllThreatListHits = async params => {
  let allThreatListHits = [];
  let threatList = await getThreatList({
    ...params,
    searchAfter: undefined
  });
  allThreatListHits = allThreatListHits.concat(threatList.hits.hits);
  while (threatList.hits.hits.length !== 0) {
    threatList = await getThreatList({
      ...params,
      searchAfter: threatList.hits.hits[threatList.hits.hits.length - 1].sort
    });
    allThreatListHits = allThreatListHits.concat(threatList.hits.hits);
  }
  return allThreatListHits;
};
exports.getAllThreatListHits = getAllThreatListHits;