"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColdStartDurationChart = getColdStartDurationChart;
var _i18n = require("@kbn/i18n");
var _uiTheme = require("@kbn/ui-theme");
var _server = require("../../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _fetch_and_transform_metrics = require("../fetch_and_transform_metrics");
var _is_finite_number = require("../../../../common/utils/is_finite_number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.coldStartDuration', {
    defaultMessage: 'Cold start duration'
  }),
  key: 'cold_start_duration',
  type: 'linemark',
  yUnit: 'time',
  series: {
    coldStart: {
      title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.coldStartDuration', {
        defaultMessage: 'Cold start duration'
      }),
      color: _uiTheme.euiLightVars.euiColorVis5
    }
  },
  description: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.coldStartDuration.description', {
    defaultMessage: 'Cold start duration shows the execution duration of the serverless runtime for requests that experience cold starts.'
  })
};
async function getColdStartDurationChart({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  start,
  end,
  serverlessId
}) {
  var _series$data;
  const coldStartDurationMetric = await (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
    environment,
    kuery,
    config,
    apmEventClient,
    serviceName,
    start,
    end,
    chartBase,
    aggs: {
      coldStart: {
        avg: {
          field: _elasticsearch_fieldnames.FAAS_COLDSTART_DURATION
        }
      }
    },
    additionalFilters: [{
      exists: {
        field: _elasticsearch_fieldnames.FAAS_COLDSTART_DURATION
      }
    }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId), ...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'app')],
    operationName: 'get_cold_start_duration'
  });
  const [series] = coldStartDurationMetric.series;
  const data = series === null || series === void 0 ? void 0 : (_series$data = series.data) === null || _series$data === void 0 ? void 0 : _series$data.map(({
    x,
    y
  }) => ({
    x,
    // Cold start duration duration is stored in ms, convert it to microseconds so it uses the same unit as the other charts
    y: (0, _is_finite_number.isFiniteNumber)(y) ? y * 1000 : y
  }));
  return {
    ...coldStartDurationMetric,
    series: series ? [{
      ...series,
      // Cold start duration duration is stored in ms, convert it to microseconds
      overallValue: series.overallValue * 1000,
      data
    }] : []
  };
}