"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopDependencyOperations = getTopDependencyOperations;
var _server = require("../../../../observability/server");
var _is_finite_number = require("../../../../observability/common/utils/is_finite_number");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _event_outcome = require("../../../common/event_outcome");
var _environment_query = require("../../../common/utils/environment_query");
var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");
var _calculate_throughput = require("../../lib/helpers/calculate_throughput");
var _get_bucket_size_for_aggregated_transactions = require("../../lib/helpers/get_bucket_size_for_aggregated_transactions");
var _get_is_using_service_destination_metrics = require("../../lib/helpers/spans/get_is_using_service_destination_metrics");
var _calculate_impact_builder = require("../traces/calculate_impact_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_NUM_OPERATIONS = 500;
async function getTopDependencyOperations({
  apmEventClient,
  dependencyName,
  start,
  end,
  offset,
  environment,
  kuery,
  searchServiceDestinationMetrics
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;
  const {
    startWithOffset,
    endWithOffset,
    offsetInMs
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
    searchAggregatedServiceMetrics: searchServiceDestinationMetrics
  });
  const field = (0, _get_is_using_service_destination_metrics.getLatencyFieldForServiceDestinationStatistics)(searchServiceDestinationMetrics);
  const aggs = {
    latency: {
      ...(searchServiceDestinationMetrics ? {
        sum: {
          field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM
        }
      } : {
        avg: {
          field
        }
      })
    },
    count: {
      sum: {
        field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
      }
    },
    successful: {
      filter: {
        term: {
          [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.success
        }
      }
    },
    failure: {
      filter: {
        term: {
          [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.failure
        }
      }
    }
  };
  const response = await apmEventClient.search('get_top_dependency_operations', {
    apm: {
      events: [(0, _get_is_using_service_destination_metrics.getProcessorEventForServiceDestinationStatistics)(searchServiceDestinationMetrics)]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE, dependencyName), ...(0, _get_is_using_service_destination_metrics.getDocumentTypeFilterForServiceDestinationStatistics)(searchServiceDestinationMetrics)]
        }
      },
      aggs: {
        operationName: {
          terms: {
            field: _elasticsearch_fieldnames.SPAN_NAME,
            size: MAX_NUM_OPERATIONS
          },
          aggs: {
            over_time: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                min_doc_count: 0,
                extended_bounds: {
                  min: startWithOffset,
                  max: endWithOffset
                }
              },
              aggs
            },
            ...aggs,
            total_time: {
              sum: {
                field
              }
            }
          }
        }
      }
    }
  });
  const getImpact = (0, _calculate_impact_builder.calculateImpactBuilder)((_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.operationName.buckets.map(bucket => bucket.total_time.value)) !== null && _response$aggregation !== void 0 ? _response$aggregation : []);
  return (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.operationName.buckets.map(bucket => {
    var _bucket$total_time$va;
    const timeseries = {
      latency: [],
      throughput: [],
      failureRate: []
    };
    bucket.over_time.buckets.forEach(dateBucket => {
      const x = dateBucket.key + offsetInMs;
      const latencyValue = (0, _is_finite_number.isFiniteNumber)(dateBucket.latency.value) ? dateBucket.latency.value : 0;
      const count = (0, _is_finite_number.isFiniteNumber)(dateBucket.count.value) ? dateBucket.count.value : 1;
      timeseries.throughput.push({
        x,
        y: (0, _calculate_throughput.calculateThroughputWithRange)({
          start: startWithOffset,
          end: endWithOffset,
          value: searchServiceDestinationMetrics ? dateBucket.count.value || 0 : dateBucket.doc_count
        })
      });
      timeseries.latency.push({
        x,
        y: searchServiceDestinationMetrics ? latencyValue / count : dateBucket.latency.value
      });
      timeseries.failureRate.push({
        x,
        y: dateBucket.failure.doc_count > 0 || dateBucket.successful.doc_count > 0 ? dateBucket.failure.doc_count / (dateBucket.successful.doc_count + dateBucket.failure.doc_count) : null
      });
    });
    const latencyValue = (0, _is_finite_number.isFiniteNumber)(bucket.latency.value) ? bucket.latency.value : 0;
    const count = (0, _is_finite_number.isFiniteNumber)(bucket.count.value) ? bucket.count.value : 1;
    return {
      spanName: bucket.key,
      latency: searchServiceDestinationMetrics ? latencyValue / count : bucket.latency.value,
      throughput: (0, _calculate_throughput.calculateThroughputWithRange)({
        start: startWithOffset,
        end: endWithOffset,
        value: searchServiceDestinationMetrics ? bucket.count.value || 0 : bucket.doc_count
      }),
      failureRate: bucket.failure.doc_count > 0 || bucket.successful.doc_count > 0 ? bucket.failure.doc_count / (bucket.successful.doc_count + bucket.failure.doc_count) : null,
      impact: getImpact((_bucket$total_time$va = bucket.total_time.value) !== null && _bucket$total_time$va !== void 0 ? _bucket$total_time$va : 0),
      timeseries
    };
  })) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : [];
}