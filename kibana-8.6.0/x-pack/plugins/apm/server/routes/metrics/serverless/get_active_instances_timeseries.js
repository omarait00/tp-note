"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveInstancesTimeseries = getActiveInstancesTimeseries;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _metrics = require("../../../lib/helpers/metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getActiveInstancesTimeseries({
  environment,
  kuery,
  serviceName,
  start,
  end,
  serverlessId,
  config,
  apmEventClient
}) {
  var _aggregations$timeser, _aggregations$timeser2;
  const aggs = {
    activeInstances: {
      cardinality: {
        field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
      }
    }
  };
  const params = {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'app'), {
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)]
        }
      },
      aggs: {
        ...aggs,
        timeseriesData: {
          date_histogram: (0, _metrics.getMetricsDateHistogramParams)({
            start,
            end,
            metricsInterval: config.metricsInterval
          }),
          aggs
        }
      }
    }
  };
  const {
    aggregations
  } = await apmEventClient.search('get_active_instances', params);
  return (aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$timeser = aggregations.timeseriesData) === null || _aggregations$timeser === void 0 ? void 0 : (_aggregations$timeser2 = _aggregations$timeser.buckets) === null || _aggregations$timeser2 === void 0 ? void 0 : _aggregations$timeser2.map(timeseriesBucket => ({
    x: timeseriesBucket.key,
    y: timeseriesBucket.activeInstances.value
  }))) || [];
}