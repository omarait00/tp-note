"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatencyChartsForDependency = getLatencyChartsForDependency;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
var _metrics = require("../../lib/helpers/metrics");
var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");
var _get_is_using_service_destination_metrics = require("../../lib/helpers/spans/get_is_using_service_destination_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getLatencyChartsForDependency({
  dependencyName,
  spanName,
  searchServiceDestinationMetrics,
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  offset
}) {
  var _response$aggregation, _response$aggregation2;
  const {
    offsetInMs,
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const response = await apmEventClient.search('get_latency_for_dependency', {
    apm: {
      events: [(0, _get_is_using_service_destination_metrics.getProcessorEventForServiceDestinationStatistics)(searchServiceDestinationMetrics)]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SPAN_NAME, spanName || null), ...(0, _get_is_using_service_destination_metrics.getDocumentTypeFilterForServiceDestinationStatistics)(searchServiceDestinationMetrics), {
            term: {
              [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: dependencyName
            }
          }]
        }
      },
      aggs: {
        timeseries: {
          date_histogram: (0, _metrics.getMetricsDateHistogramParams)({
            start: startWithOffset,
            end: endWithOffset,
            metricsInterval: 60
          }),
          aggs: {
            latency_sum: {
              sum: {
                field: (0, _get_is_using_service_destination_metrics.getLatencyFieldForServiceDestinationStatistics)(searchServiceDestinationMetrics)
              }
            },
            ...(searchServiceDestinationMetrics ? {
              latency_count: {
                sum: {
                  field: (0, _get_is_using_service_destination_metrics.getDocCountFieldForServiceDestinationStatistics)(searchServiceDestinationMetrics)
                }
              }
            } : {})
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    var _bucket$latency_sum$v, _bucket$latency_count, _bucket$latency_count2;
    return {
      x: bucket.key + offsetInMs,
      y: ((_bucket$latency_sum$v = bucket.latency_sum.value) !== null && _bucket$latency_sum$v !== void 0 ? _bucket$latency_sum$v : 0) / ((_bucket$latency_count = (_bucket$latency_count2 = bucket.latency_count) === null || _bucket$latency_count2 === void 0 ? void 0 : _bucket$latency_count2.value) !== null && _bucket$latency_count !== void 0 ? _bucket$latency_count : bucket.doc_count)
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}