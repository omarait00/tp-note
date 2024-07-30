"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEsQuery = fetchEsQuery;
var _build_sorted_events_query = require("../../../../common/build_sorted_events_query");
var _constants = require("../constants");
var _get_search_params = require("./get_search_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Fetching matching documents for a given rule from elasticsearch by a given index and query
 */
async function fetchEsQuery(ruleId, name, params, timestamp, services) {
  const {
    scopedClusterClient,
    logger
  } = services;
  const esClient = scopedClusterClient.asCurrentUser;
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    parsedQuery: {
      query,
      fields,
      runtime_mappings,
      _source
    },
    dateStart,
    dateEnd
  } = (0, _get_search_params.getSearchParams)(params);
  const filter = timestamp && params.excludeHitsFromPreviousRun ? {
    bool: {
      filter: [query, {
        bool: {
          must_not: [{
            bool: {
              filter: [{
                range: {
                  [params.timeField]: {
                    lte: timestamp,
                    format: 'strict_date_optional_time'
                  }
                }
              }]
            }
          }]
        }
      }]
    }
  } : query;
  const sortedQuery = (0, _build_sorted_events_query.buildSortedEventsQuery)({
    index: params.index,
    from: dateStart,
    to: dateEnd,
    filter,
    size: params.size,
    sortOrder: 'desc',
    searchAfterSortId: undefined,
    timeField: params.timeField,
    track_total_hits: true,
    fields,
    runtime_mappings,
    _source
  });
  logger.debug(`es query rule ${_constants.ES_QUERY_ID}:${ruleId} "${name}" query - ${JSON.stringify(sortedQuery)}`);
  const {
    body: searchResult
  } = await esClient.search(sortedQuery, {
    meta: true
  });
  logger.debug(` es query rule ${_constants.ES_QUERY_ID}:${ruleId} "${name}" result - ${JSON.stringify(searchResult)}`);
  return {
    numMatches: searchResult.hits.total.value,
    searchResult,
    dateStart,
    dateEnd
  };
}