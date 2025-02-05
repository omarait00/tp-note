"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singleSearchAfter = void 0;
var _perf_hooks = require("perf_hooks");
var _build_events_query = require("./build_events_query");
var _utils = require("./utils");
var _with_security_span = require("../../../utils/with_security_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// utilize search_after for paging results into bulk.
const singleSearchAfter = async ({
  aggregations,
  searchAfterSortIds,
  index,
  runtimeMappings,
  from,
  to,
  services,
  filter,
  ruleExecutionLogger,
  pageSize,
  sortOrder,
  primaryTimestamp,
  secondaryTimestamp,
  trackTotalHits,
  additionalFilters
}) => {
  return (0, _with_security_span.withSecuritySpan)('singleSearchAfter', async () => {
    try {
      var _nextSearchAfterResul;
      const searchAfterQuery = (0, _build_events_query.buildEventsSearchQuery)({
        aggregations,
        index,
        from,
        to,
        runtimeMappings,
        filter,
        size: pageSize,
        sortOrder,
        searchAfterSortIds,
        primaryTimestamp,
        secondaryTimestamp,
        trackTotalHits,
        additionalFilters
      });
      const start = _perf_hooks.performance.now();
      const {
        body: nextSearchAfterResult
      } = await services.scopedClusterClient.asCurrentUser.search(searchAfterQuery, {
        meta: true
      });
      const end = _perf_hooks.performance.now();
      const searchErrors = (0, _utils.createErrorsFromShard)({
        errors: (_nextSearchAfterResul = nextSearchAfterResult._shards.failures) !== null && _nextSearchAfterResul !== void 0 ? _nextSearchAfterResul : []
      });
      return {
        searchResult: nextSearchAfterResult,
        searchDuration: (0, _utils.makeFloatString)(end - start),
        searchErrors
      };
    } catch (exc) {
      ruleExecutionLogger.error(`[-] nextSearchAfter threw an error ${exc}`);
      if (exc.message.includes(`No mapping found for [${primaryTimestamp}] in order to sort on`) || secondaryTimestamp && exc.message.includes(`No mapping found for [${secondaryTimestamp}] in order to sort on`)) {
        ruleExecutionLogger.error(`[-] failure reason: ${exc.message}`);
        const searchRes = {
          took: 0,
          timed_out: false,
          _shards: {
            total: 1,
            successful: 1,
            failed: 0,
            skipped: 0
          },
          hits: {
            total: 0,
            max_score: 0,
            hits: []
          }
        };
        return {
          searchResult: searchRes,
          searchDuration: '-1.0',
          searchErrors: exc.message
        };
      }
      throw exc;
    }
  });
};
exports.singleSearchAfter = singleSearchAfter;