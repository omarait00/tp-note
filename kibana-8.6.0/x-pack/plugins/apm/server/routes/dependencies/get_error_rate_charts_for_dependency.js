"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorRateChartsForDependency = getErrorRateChartsForDependency;
var _server = require("../../../../observability/server");
var _event_outcome = require("../../../common/event_outcome");
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

async function getErrorRateChartsForDependency({
  dependencyName,
  spanName,
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  searchServiceDestinationMetrics,
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
  const response = await apmEventClient.search('get_error_rate_for_dependency', {
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
          }, {
            terms: {
              [_elasticsearch_fieldnames.EVENT_OUTCOME]: [_event_outcome.EventOutcome.success, _event_outcome.EventOutcome.failure]
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
            ...(searchServiceDestinationMetrics ? {
              total_count: {
                sum: {
                  field: (0, _get_is_using_service_destination_metrics.getDocCountFieldForServiceDestinationStatistics)(searchServiceDestinationMetrics)
                }
              }
            } : {}),
            failures: {
              filter: {
                term: {
                  [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.failure
                }
              },
              aggs: {
                ...(searchServiceDestinationMetrics ? {
                  total_count: {
                    sum: {
                      field: (0, _get_is_using_service_destination_metrics.getDocCountFieldForServiceDestinationStatistics)(searchServiceDestinationMetrics)
                    }
                  }
                } : {})
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    var _bucket$total_count$v, _bucket$total_count, _bucket$failures$tota, _bucket$failures$tota2;
    const totalCount = (_bucket$total_count$v = (_bucket$total_count = bucket.total_count) === null || _bucket$total_count === void 0 ? void 0 : _bucket$total_count.value) !== null && _bucket$total_count$v !== void 0 ? _bucket$total_count$v : bucket.doc_count;
    const failureCount = (_bucket$failures$tota = (_bucket$failures$tota2 = bucket.failures.total_count) === null || _bucket$failures$tota2 === void 0 ? void 0 : _bucket$failures$tota2.value) !== null && _bucket$failures$tota !== void 0 ? _bucket$failures$tota : bucket.failures.doc_count;
    return {
      x: bucket.key + offsetInMs,
      y: failureCount / totalCount
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}