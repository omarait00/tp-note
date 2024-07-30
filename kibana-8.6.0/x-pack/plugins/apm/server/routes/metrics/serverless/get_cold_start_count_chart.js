"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColdStartCountChart = getColdStartCountChart;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../../observability/server");
var _uiTheme = require("@kbn/ui-theme");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _fetch_and_transform_metrics = require("../fetch_and_transform_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.coldStart.title', {
    defaultMessage: 'Cold starts'
  }),
  key: 'cold_start_count',
  type: 'bar',
  yUnit: 'integer',
  series: {
    coldStart: {
      title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.coldStart', {
        defaultMessage: 'Cold start'
      }),
      color: _uiTheme.euiLightVars.euiColorVis5
    }
  }
};
function getColdStartCountChart({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  start,
  end,
  serverlessId
}) {
  return (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
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
        sum: {
          field: _elasticsearch_fieldnames.FAAS_COLDSTART
        }
      }
    },
    additionalFilters: [...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_COLDSTART, true), ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId), ...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'app')],
    operationName: 'get_cold_start_count'
  });
}