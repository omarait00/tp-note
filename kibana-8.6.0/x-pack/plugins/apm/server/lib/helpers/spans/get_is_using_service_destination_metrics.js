"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocCountFieldForServiceDestinationStatistics = getDocCountFieldForServiceDestinationStatistics;
exports.getDocumentTypeFilterForServiceDestinationStatistics = getDocumentTypeFilterForServiceDestinationStatistics;
exports.getIsUsingServiceDestinationMetrics = getIsUsingServiceDestinationMetrics;
exports.getLatencyFieldForServiceDestinationStatistics = getLatencyFieldForServiceDestinationStatistics;
exports.getProcessorEventForServiceDestinationStatistics = getProcessorEventForServiceDestinationStatistics;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getProcessorEventForServiceDestinationStatistics(searchServiceDestinationMetrics) {
  return searchServiceDestinationMetrics ? _common.ProcessorEvent.metric : _common.ProcessorEvent.span;
}
function getDocumentTypeFilterForServiceDestinationStatistics(searchServiceDestinationMetrics) {
  return searchServiceDestinationMetrics ? (0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'service_destination') : [];
}
function getLatencyFieldForServiceDestinationStatistics(searchServiceDestinationMetrics) {
  return searchServiceDestinationMetrics ? _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM : _elasticsearch_fieldnames.SPAN_DURATION;
}
function getDocCountFieldForServiceDestinationStatistics(searchServiceDestinationMetrics) {
  return searchServiceDestinationMetrics ? _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT : undefined;
}
async function getIsUsingServiceDestinationMetrics({
  apmEventClient,
  useSpanName,
  kuery,
  start,
  end
}) {
  async function getServiceDestinationMetricsCount(query) {
    const response = await apmEventClient.search('get_service_destination_metrics_count', {
      apm: {
        events: [getProcessorEventForServiceDestinationStatistics(true)]
      },
      body: {
        track_total_hits: 1,
        size: 0,
        terminate_after: 1,
        query: {
          bool: {
            filter: [...(0, _server.rangeQuery)(start, end), ...(0, _server.kqlQuery)(kuery), ...getDocumentTypeFilterForServiceDestinationStatistics(true), ...(query ? [query] : [])]
          }
        }
      }
    });
    return response.hits.total.value;
  }
  if (!useSpanName) {
    // if span.name is not required,
    // use service destination metrics if there is at least one service destination metric
    // for the given time range
    return (await getServiceDestinationMetricsCount()) > 0;
  }
  const [anyServiceDestinationMetricsCount, serviceDestinationMetricsWithoutSpanNameCount] = await Promise.all([getServiceDestinationMetricsCount(), getServiceDestinationMetricsCount({
    bool: {
      must_not: [{
        exists: {
          field: _elasticsearch_fieldnames.SPAN_NAME
        }
      }]
    }
  })]);
  return (
    // use service destination metrics, IF:
    // - there is at least ONE service destination metric for the given time range
    // - AND, there is NO service destination metric WITHOUT span.name for the given time range
    anyServiceDestinationMetricsCount > 0 && serviceDestinationMetricsWithoutSpanNameCount === 0
  );
}