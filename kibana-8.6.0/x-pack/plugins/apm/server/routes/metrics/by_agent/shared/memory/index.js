"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMemoryChartData = getMemoryChartData;
exports.percentSystemMemoryUsedScript = exports.percentCgroupMemoryUsedScript = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../../../../observability/server");
var _with_apm_span = require("../../../../../utils/with_apm_span");
var _elasticsearch_fieldnames = require("../../../../../../common/elasticsearch_fieldnames");
var _fetch_and_transform_metrics = require("../../../fetch_and_transform_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const series = {
  memoryUsedMax: {
    title: _i18n.i18n.translate('xpack.apm.chart.memorySeries.systemMaxLabel', {
      defaultMessage: 'Max'
    })
  },
  memoryUsedAvg: {
    title: _i18n.i18n.translate('xpack.apm.chart.memorySeries.systemAverageLabel', {
      defaultMessage: 'Average'
    })
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.serviceDetails.metrics.memoryUsageChartTitle', {
    defaultMessage: 'System memory usage'
  }),
  key: 'memory_usage_chart',
  type: 'linemark',
  yUnit: 'percent',
  series
};
const percentSystemMemoryUsedScript = {
  lang: 'painless',
  source: `
    if(doc.containsKey('${_elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY}') && doc.containsKey('${_elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY}')){
      double freeMemoryValue =  doc['${_elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY}'].value;
      double totalMemoryValue = doc['${_elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY}'].value;
      return 1 - freeMemoryValue / totalMemoryValue
    }
    
    return null;
  `
};
exports.percentSystemMemoryUsedScript = percentSystemMemoryUsedScript;
const percentCgroupMemoryUsedScript = {
  lang: 'painless',
  source: `
    /*
      When no limit is specified in the container, docker allows the app as much memory / swap memory as it wants.
      This number represents the max possible value for the limit field.
    */
    double CGROUP_LIMIT_MAX_VALUE = 9223372036854771712L;

    String limitKey = '${_elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_LIMIT_BYTES}';

    //Should use cgropLimit when value is not empty and not equals to the max limit value.
    boolean useCgroupLimit = doc.containsKey(limitKey) && !doc[limitKey].empty && doc[limitKey].value != CGROUP_LIMIT_MAX_VALUE;

    double total = useCgroupLimit ? doc[limitKey].value : doc['${_elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY}'].value;

    double used = doc['${_elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_USAGE_BYTES}'].value;

    return used / total;
    `
};
exports.percentCgroupMemoryUsedScript = percentCgroupMemoryUsedScript;
async function getMemoryChartData({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  serviceNodeName,
  serverlessId,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_memory_metrics_charts', async () => {
    const cgroupResponse = await (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
      environment,
      kuery,
      config,
      apmEventClient,
      serviceName,
      serviceNodeName,
      start,
      end,
      chartBase,
      aggs: {
        memoryUsedAvg: {
          avg: {
            script: percentCgroupMemoryUsedScript
          }
        },
        memoryUsedMax: {
          max: {
            script: percentCgroupMemoryUsedScript
          }
        }
      },
      additionalFilters: [{
        exists: {
          field: _elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_USAGE_BYTES
        }
      }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)],
      operationName: 'get_cgroup_memory_metrics_charts'
    });
    if (cgroupResponse.series.length === 0) {
      return await (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
        environment,
        kuery,
        config,
        apmEventClient,
        serviceName,
        serviceNodeName,
        start,
        end,
        chartBase,
        aggs: {
          memoryUsedAvg: {
            avg: {
              script: percentSystemMemoryUsedScript
            }
          },
          memoryUsedMax: {
            max: {
              script: percentSystemMemoryUsedScript
            }
          }
        },
        additionalFilters: [{
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY
          }
        }, {
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
          }
        }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)],
        operationName: 'get_system_memory_metrics_charts'
      });
    }
    return cgroupResponse;
  });
}