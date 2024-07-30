"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricsServerlessRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _common = require("../../../../../observability/common");
var _create_apm_server_route = require("../../apm_routes/create_apm_server_route");
var _default_api_types = require("../../default_api_types");
var _get_serverless_agent_metrics_chart = require("./get_serverless_agent_metrics_chart");
var _get_active_instances_overview = require("./get_active_instances_overview");
var _get_serverless_functions_overview = require("./get_serverless_functions_overview");
var _get_serverless_summary = require("./get_serverless_summary");
var _get_active_instances_timeseries = require("./get_active_instances_timeseries");
var _get_apm_event_client = require("../../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const serverlessMetricsChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metrics/serverless/charts',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.partial({
      serverlessId: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params,
      config
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end,
      serverlessId
    } = params.query;
    const charts = await (0, _get_serverless_agent_metrics_chart.getServerlessAgentMetricsCharts)({
      environment,
      start,
      end,
      kuery,
      config,
      apmEventClient,
      serviceName,
      serverlessId
    });
    return {
      charts
    };
  }
});
const serverlessMetricsActiveInstancesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metrics/serverless/active_instances',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.partial({
      serverlessId: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params,
      config
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end,
      serverlessId
    } = params.query;
    const options = {
      environment,
      start,
      end,
      kuery,
      serviceName,
      serverlessId,
      apmEventClient
    };
    const [activeInstances, timeseries] = await Promise.all([(0, _get_active_instances_overview.getServerlessActiveInstancesOverview)(options), (0, _get_active_instances_timeseries.getActiveInstancesTimeseries)({
      ...options,
      config
    })]);
    return {
      activeInstances,
      timeseries
    };
  }
});
const serverlessMetricsFunctionsOverviewRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metrics/serverless/functions_overview',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end
    } = params.query;
    const serverlessFunctionsOverview = await (0, _get_serverless_functions_overview.getServerlessFunctionsOverview)({
      environment,
      start,
      end,
      kuery,
      apmEventClient,
      serviceName
    });
    return {
      serverlessFunctionsOverview
    };
  }
});
const serverlessMetricsSummaryRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metrics/serverless/summary',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.partial({
      serverlessId: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params,
      context
    } = resources;
    const {
      uiSettings: {
        client: uiSettingsClient
      }
    } = await context.core;
    const [apmEventClient, awsLambdaPriceFactor, awsLambdaRequestCostPerMillion] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), uiSettingsClient.get(_common.apmAWSLambdaPriceFactor).then(value => JSON.parse(value)), uiSettingsClient.get(_common.apmAWSLambdaRequestCostPerMillion)]);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end,
      serverlessId
    } = params.query;
    return (0, _get_serverless_summary.getServerlessSummary)({
      environment,
      start,
      end,
      kuery,
      apmEventClient,
      serviceName,
      serverlessId,
      awsLambdaPriceFactor,
      awsLambdaRequestCostPerMillion
    });
  }
});
const metricsServerlessRouteRepository = {
  ...serverlessMetricsChartsRoute,
  ...serverlessMetricsSummaryRoute,
  ...serverlessMetricsFunctionsOverviewRoute,
  ...serverlessMetricsActiveInstancesRoute
};
exports.metricsServerlessRouteRepository = metricsServerlessRouteRepository;