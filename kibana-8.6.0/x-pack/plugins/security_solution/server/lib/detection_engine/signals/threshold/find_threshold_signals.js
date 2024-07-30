"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findThresholdSignals = void 0;
var _single_search_after = require("../single_search_after");
var _build_threshold_aggregation = require("./build_threshold_aggregation");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasThresholdFields = threshold => !!threshold.field.length;
const findThresholdSignals = async ({
  from,
  to,
  maxSignals,
  inputIndexPattern,
  services,
  ruleExecutionLogger,
  filter,
  threshold,
  runtimeMappings,
  primaryTimestamp,
  secondaryTimestamp,
  aggregatableTimestampField
}) => {
  // Leaf aggregations used below
  let sortKeys;
  const buckets = [];
  const searchAfterResults = {
    searchDurations: [],
    searchErrors: []
  };
  const includeCardinalityFilter = (0, _utils.shouldFilterByCardinality)(threshold);
  if (hasThresholdFields(threshold)) {
    do {
      var _searchResultWithAggs;
      const {
        searchResult,
        searchDuration,
        searchErrors
      } = await (0, _single_search_after.singleSearchAfter)({
        aggregations: (0, _build_threshold_aggregation.buildThresholdMultiBucketAggregation)({
          threshold,
          aggregatableTimestampField,
          sortKeys
        }),
        index: inputIndexPattern,
        searchAfterSortIds: undefined,
        from,
        to,
        services,
        ruleExecutionLogger,
        filter,
        pageSize: 0,
        sortOrder: 'desc',
        runtimeMappings,
        primaryTimestamp,
        secondaryTimestamp
      });
      const searchResultWithAggs = searchResult;
      if (!searchResultWithAggs.aggregations) {
        throw new Error('Aggregations were missing on threshold rule search result');
      }
      searchAfterResults.searchDurations.push(searchDuration);
      searchAfterResults.searchErrors.push(...searchErrors);
      const thresholdTerms = (_searchResultWithAggs = searchResultWithAggs.aggregations) === null || _searchResultWithAggs === void 0 ? void 0 : _searchResultWithAggs.thresholdTerms;
      sortKeys = thresholdTerms.after_key;
      buckets.push(...searchResultWithAggs.aggregations.thresholdTerms.buckets);
    } while (sortKeys && buckets.length <= maxSignals);
  } else {
    var _searchResultWithAggs2, _searchResultWithAggs3;
    const {
      searchResult,
      searchDuration,
      searchErrors
    } = await (0, _single_search_after.singleSearchAfter)({
      aggregations: (0, _build_threshold_aggregation.buildThresholdSingleBucketAggregation)({
        threshold,
        aggregatableTimestampField
      }),
      searchAfterSortIds: undefined,
      index: inputIndexPattern,
      from,
      to,
      services,
      ruleExecutionLogger,
      filter,
      pageSize: 0,
      sortOrder: 'desc',
      trackTotalHits: true,
      runtimeMappings,
      primaryTimestamp,
      secondaryTimestamp
    });
    const searchResultWithAggs = searchResult;
    if (!searchResultWithAggs.aggregations) {
      throw new Error('Aggregations were missing on threshold rule search result');
    }
    searchAfterResults.searchDurations.push(searchDuration);
    searchAfterResults.searchErrors.push(...searchErrors);
    const docCount = searchResultWithAggs.hits.total.value;
    if (docCount >= threshold.value && (!includeCardinalityFilter || ((_searchResultWithAggs2 = (_searchResultWithAggs3 = searchResultWithAggs.aggregations.cardinality_count) === null || _searchResultWithAggs3 === void 0 ? void 0 : _searchResultWithAggs3.value) !== null && _searchResultWithAggs2 !== void 0 ? _searchResultWithAggs2 : 0) >= threshold.cardinality[0].value)) {
      buckets.push({
        doc_count: docCount,
        key: {},
        max_timestamp: searchResultWithAggs.aggregations.max_timestamp,
        min_timestamp: searchResultWithAggs.aggregations.min_timestamp,
        ...(includeCardinalityFilter ? {
          cardinality_count: searchResultWithAggs.aggregations.cardinality_count
        } : {})
      });
    }
  }
  return {
    buckets: buckets.slice(0, maxSignals),
    ...searchAfterResults
  };
};
exports.findThresholdSignals = findThresholdSignals;