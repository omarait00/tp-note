"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeUsageAvgScript = void 0;
exports.getComputeUsageChart = getComputeUsageChart;
var _i18n = require("@kbn/i18n");
var _common = require("../../../../../observability/common");
var _server = require("../../../../../observability/server");
var _uiTheme = require("@kbn/ui-theme");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _metrics = require("../../../lib/helpers/metrics");
var _helper = require("./helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const computeUsageAvgScript = {
  avg: {
    script: `return doc['${_elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY}'].value * doc['${_elasticsearch_fieldnames.FAAS_BILLED_DURATION}'].value`
  }
};
exports.computeUsageAvgScript = computeUsageAvgScript;
async function getComputeUsageChart({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  start,
  end,
  serverlessId
}) {
  var _convertComputeUsageT;
  const aggs = {
    countInvocations: {
      value_count: {
        field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
      }
    },
    avgComputeUsageBytesMs: computeUsageAvgScript
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
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), {
            exists: {
              field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
            }
          }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'app'), ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)]
        }
      },
      aggs: {
        timeseriesData: {
          date_histogram: (0, _metrics.getMetricsDateHistogramParams)({
            start,
            end,
            metricsInterval: config.metricsInterval
          }),
          aggs
        },
        ...aggs
      }
    }
  };
  const {
    aggregations
  } = await apmEventClient.search('get_compute_usage', params);
  const timeseriesData = aggregations === null || aggregations === void 0 ? void 0 : aggregations.timeseriesData;
  return {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.computeUsage', {
      defaultMessage: 'Compute usage'
    }),
    key: 'compute_usage',
    yUnit: 'number',
    description: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.computeUsage.description', {
      defaultMessage: "Compute usage (in GB-seconds) is the execution time multiplied by the available memory size of your function's instances. The compute usage is a direct indicator for the costs of your serverless function."
    }),
    series: !timeseriesData || timeseriesData.buckets.length === 0 ? [] : [{
      title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.computeUsage', {
        defaultMessage: 'Compute usage'
      }),
      key: 'compute_usage',
      type: 'bar',
      overallValue: (_convertComputeUsageT = (0, _helper.convertComputeUsageToGbSec)({
        computeUsageBytesMs: aggregations === null || aggregations === void 0 ? void 0 : aggregations.avgComputeUsageBytesMs.value,
        countInvocations: aggregations === null || aggregations === void 0 ? void 0 : aggregations.countInvocations.value
      })) !== null && _convertComputeUsageT !== void 0 ? _convertComputeUsageT : 0,
      color: _uiTheme.euiLightVars.euiColorVis0,
      data: timeseriesData.buckets.map(bucket => {
        var _convertComputeUsageT2;
        const computeUsage = (_convertComputeUsageT2 = (0, _helper.convertComputeUsageToGbSec)({
          computeUsageBytesMs: bucket.avgComputeUsageBytesMs.value,
          countInvocations: bucket.countInvocations.value
        })) !== null && _convertComputeUsageT2 !== void 0 ? _convertComputeUsageT2 : 0;
        return {
          x: bucket.key,
          y: computeUsage
        };
      })
    }]
  };
}