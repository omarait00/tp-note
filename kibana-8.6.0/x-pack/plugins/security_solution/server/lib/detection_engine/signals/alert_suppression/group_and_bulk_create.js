"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupAndBulkCreate = exports.filterBucketHistory = exports.buildBucketHistoryFilter = void 0;
var _with_security_span = require("../../../../utils/with_security_span");
var _build_events_query = require("../build_events_query");
var _utils = require("../utils");
var _wrap_suppressed_alerts = require("../../rule_types/factories/utils/wrap_suppressed_alerts");
var _build_group_by_field_aggregation = require("./build_group_by_field_aggregation");
var _single_search_after = require("../single_search_after");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds a filter that excludes documents from existing buckets.
 */
const buildBucketHistoryFilter = ({
  bucketHistory,
  primaryTimestamp,
  secondaryTimestamp,
  from
}) => {
  if (bucketHistory.length === 0) {
    return undefined;
  }
  return [{
    bool: {
      must_not: bucketHistory.map(bucket => ({
        bool: {
          filter: [...Object.entries(bucket.key).map(([field, value]) => ({
            term: {
              [field]: value
            }
          })), (0, _build_events_query.buildTimeRangeFilter)({
            to: bucket.endDate,
            from: from.toISOString(),
            primaryTimestamp,
            secondaryTimestamp
          })]
        }
      }))
    }
  }];
};
exports.buildBucketHistoryFilter = buildBucketHistoryFilter;
const filterBucketHistory = ({
  bucketHistory,
  fromDate
}) => {
  return bucketHistory.filter(bucket => new Date(bucket.endDate) > fromDate);
};
exports.filterBucketHistory = filterBucketHistory;
const groupAndBulkCreate = async ({
  runOpts,
  services,
  spaceId,
  filter,
  buildReasonMessage,
  bucketHistory,
  groupByFields
}) => {
  return (0, _with_security_span.withSecuritySpan)('groupAndBulkCreate', async () => {
    const tuple = runOpts.tuple;
    const filteredBucketHistory = filterBucketHistory({
      bucketHistory: bucketHistory !== null && bucketHistory !== void 0 ? bucketHistory : [],
      fromDate: tuple.from.toDate()
    });
    const toReturn = {
      success: true,
      warning: false,
      searchAfterTimes: [],
      enrichmentTimes: [],
      bulkCreateTimes: [],
      lastLookBackDate: null,
      createdSignalsCount: 0,
      createdSignals: [],
      errors: [],
      warningMessages: [],
      state: {
        suppressionGroupHistory: filteredBucketHistory
      }
    };
    const exceptionsWarning = (0, _utils.getUnprocessedExceptionsWarnings)(runOpts.unprocessedExceptions);
    if (exceptionsWarning) {
      toReturn.warningMessages.push(exceptionsWarning);
    }
    try {
      if (groupByFields.length === 0) {
        throw new Error('groupByFields length must be greater than 0');
      }
      const bucketHistoryFilter = buildBucketHistoryFilter({
        bucketHistory: filteredBucketHistory,
        primaryTimestamp: runOpts.primaryTimestamp,
        secondaryTimestamp: runOpts.secondaryTimestamp,
        from: tuple.from
      });
      const groupingAggregation = (0, _build_group_by_field_aggregation.buildGroupByFieldAggregation)({
        groupByFields,
        maxSignals: tuple.maxSignals,
        aggregatableTimestampField: runOpts.aggregatableTimestampField
      });
      const {
        searchResult,
        searchDuration,
        searchErrors
      } = await (0, _single_search_after.singleSearchAfter)({
        aggregations: groupingAggregation,
        searchAfterSortIds: undefined,
        index: runOpts.inputIndex,
        from: tuple.from.toISOString(),
        to: tuple.to.toISOString(),
        services,
        ruleExecutionLogger: runOpts.ruleExecutionLogger,
        filter,
        pageSize: 0,
        primaryTimestamp: runOpts.primaryTimestamp,
        secondaryTimestamp: runOpts.secondaryTimestamp,
        runtimeMappings: runOpts.runtimeMappings,
        additionalFilters: bucketHistoryFilter
      });
      toReturn.searchAfterTimes.push(searchDuration);
      toReturn.errors.push(...searchErrors);
      const eventsByGroupResponseWithAggs = searchResult;
      if (!eventsByGroupResponseWithAggs.aggregations) {
        throw new Error('expected to find aggregations on search result');
      }
      const buckets = eventsByGroupResponseWithAggs.aggregations.eventGroups.buckets;
      if (buckets.length === 0) {
        return toReturn;
      }
      const suppressionBuckets = buckets.map(bucket => ({
        event: bucket.topHits.hits.hits[0],
        count: bucket.doc_count,
        start: bucket.min_timestamp.value_as_string ? new Date(bucket.min_timestamp.value_as_string) : tuple.from.toDate(),
        end: bucket.max_timestamp.value_as_string ? new Date(bucket.max_timestamp.value_as_string) : tuple.to.toDate(),
        terms: Object.entries(bucket.key).map(([key, value]) => ({
          field: key,
          value
        }))
      }));
      const wrappedAlerts = (0, _wrap_suppressed_alerts.wrapSuppressedAlerts)({
        suppressionBuckets,
        spaceId,
        completeRule: runOpts.completeRule,
        mergeStrategy: runOpts.mergeStrategy,
        indicesToQuery: runOpts.inputIndex,
        buildReasonMessage,
        alertTimestampOverride: runOpts.alertTimestampOverride
      });
      const bulkCreateResult = await runOpts.bulkCreate(wrappedAlerts);
      (0, _utils.addToSearchAfterReturn)({
        current: toReturn,
        next: bulkCreateResult
      });
      runOpts.ruleExecutionLogger.debug(`created ${bulkCreateResult.createdItemsCount} signals`);
      const newBucketHistory = buckets.filter(bucket => {
        return !Object.values(bucket.key).includes(null);
      }).map(bucket => {
        return {
          // This cast should be safe as we just filtered out buckets where any key has a null value.
          key: bucket.key,
          endDate: bucket.max_timestamp.value_as_string ? bucket.max_timestamp.value_as_string : tuple.to.toISOString()
        };
      });
      toReturn.state.suppressionGroupHistory.push(...newBucketHistory);
    } catch (exc) {
      toReturn.success = false;
      toReturn.errors.push(exc.message);
    }
    return toReturn;
  });
};
exports.groupAndBulkCreate = groupAndBulkCreate;