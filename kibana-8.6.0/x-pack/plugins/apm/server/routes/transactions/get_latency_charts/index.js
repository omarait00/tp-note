"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatencyPeriods = getLatencyPeriods;
exports.getLatencyTimeseries = getLatencyTimeseries;
var _server = require("../../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _offset_previous_period_coordinate = require("../../../../common/utils/offset_previous_period_coordinate");
var _environment_query = require("../../../../common/utils/environment_query");
var _transactions = require("../../../lib/helpers/transactions");
var _get_bucket_size_for_aggregated_transactions = require("../../../lib/helpers/get_bucket_size_for_aggregated_transactions");
var _latency_aggregation_type = require("../../../lib/helpers/latency_aggregation_type");
var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function searchLatency({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  apmEventClient,
  searchAggregatedTransactions,
  latencyAggregationType,
  start,
  end,
  offset,
  serverlessId
}) {
  const {
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const {
    intervalString
  } = (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
    start: startWithOffset,
    end: endWithOffset,
    searchAggregatedTransactions
  });
  const transactionDurationField = (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions);
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)]
        }
      },
      aggs: {
        latencyTimeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: startWithOffset,
              max: endWithOffset
            }
          },
          aggs: (0, _latency_aggregation_type.getLatencyAggregation)(latencyAggregationType, transactionDurationField)
        },
        overall_avg_duration: {
          avg: {
            field: transactionDurationField
          }
        }
      }
    }
  };
  return apmEventClient.search('get_latency_charts', params);
}
async function getLatencyTimeseries({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  apmEventClient,
  searchAggregatedTransactions,
  latencyAggregationType,
  start,
  end,
  offset,
  serverlessId
}) {
  const response = await searchLatency({
    environment,
    kuery,
    serviceName,
    transactionType,
    transactionName,
    apmEventClient,
    searchAggregatedTransactions,
    latencyAggregationType,
    start,
    end,
    offset,
    serverlessId
  });
  if (!response.aggregations) {
    return {
      latencyTimeseries: [],
      overallAvgDuration: null
    };
  }
  return {
    overallAvgDuration: response.aggregations.overall_avg_duration.value || null,
    latencyTimeseries: response.aggregations.latencyTimeseries.buckets.map(bucket => {
      return {
        x: bucket.key,
        y: (0, _latency_aggregation_type.getLatencyValue)({
          latencyAggregationType,
          aggregation: bucket.latency
        })
      };
    })
  };
}
async function getLatencyPeriods({
  serviceName,
  transactionType,
  transactionName,
  apmEventClient,
  searchAggregatedTransactions,
  latencyAggregationType,
  kuery,
  environment,
  start,
  end,
  offset
}) {
  const options = {
    serviceName,
    transactionType,
    transactionName,
    apmEventClient,
    searchAggregatedTransactions,
    kuery,
    environment
  };
  const currentPeriodPromise = getLatencyTimeseries({
    ...options,
    start,
    end,
    latencyAggregationType: latencyAggregationType
  });
  const previousPeriodPromise = offset ? getLatencyTimeseries({
    ...options,
    start,
    end,
    offset,
    latencyAggregationType: latencyAggregationType
  }) : {
    latencyTimeseries: [],
    overallAvgDuration: null
  };
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  return {
    currentPeriod,
    previousPeriod: {
      ...previousPeriod,
      latencyTimeseries: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: currentPeriod.latencyTimeseries,
        previousPeriodTimeseries: previousPeriod.latencyTimeseries
      })
    }
  };
}