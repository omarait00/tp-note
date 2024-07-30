"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentTypeFilterForServiceMetrics = getDocumentTypeFilterForServiceMetrics;
exports.getHasServicesMetrics = getHasServicesMetrics;
exports.getSearchServiceMetrics = getSearchServiceMetrics;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getSearchServiceMetrics({
  serviceMetricsEnabled,
  start,
  end,
  apmEventClient,
  kuery
}) {
  if (serviceMetricsEnabled) {
    return getHasServicesMetrics({
      start,
      end,
      apmEventClient,
      kuery
    });
  }
  return false;
}
async function getHasServicesMetrics({
  start,
  end,
  apmEventClient,
  kuery
}) {
  const response = await apmEventClient.search('get_has_aggregated_service_metrics', {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: 1,
      size: 0,
      query: {
        bool: {
          filter: [...getDocumentTypeFilterForServiceMetrics(), ...(start && end ? (0, _server.rangeQuery)(start, end) : []), ...(0, _server.kqlQuery)(kuery)]
        }
      }
    },
    terminate_after: 1
  });
  return response.hits.total.value > 0;
}
function getDocumentTypeFilterForServiceMetrics() {
  return [{
    term: {
      [_elasticsearch_fieldnames.METRICSET_NAME]: 'service'
    }
  }];
}