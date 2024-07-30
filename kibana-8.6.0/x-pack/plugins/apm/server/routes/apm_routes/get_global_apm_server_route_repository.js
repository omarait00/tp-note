"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalApmServerRouteRepository = void 0;
var _route = require("../agent_explorer/route");
var _route2 = require("../agent_keys/route");
var _route3 = require("../alerts/route");
var _route4 = require("../correlations/route");
var _route5 = require("../data_view/route");
var _route6 = require("../debug_telemetry/route");
var _route7 = require("../dependencies/route");
var _route8 = require("../environments/route");
var _route9 = require("../errors/route");
var _route10 = require("../event_metadata/route");
var _route11 = require("../fallback_to_transactions/route");
var _route12 = require("../fleet/route");
var _route13 = require("../historical_data/route");
var _route14 = require("../infrastructure/route");
var _route15 = require("../latency_distribution/route");
var _route16 = require("../metrics/route");
var _route17 = require("../mobile/route");
var _route18 = require("../observability_overview/route");
var _route19 = require("../services/route");
var _route20 = require("../service_groups/route");
var _route21 = require("../service_map/route");
var _route22 = require("../settings/agent_configuration/route");
var _route23 = require("../settings/anomaly_detection/route");
var _route24 = require("../settings/apm_indices/route");
var _route25 = require("../settings/custom_link/route");
var _route26 = require("../settings/labs/route");
var _route27 = require("../source_maps/route");
var _route28 = require("../span_links/route");
var _route29 = require("../storage_explorer/route");
var _route30 = require("../suggestions/route");
var _route31 = require("../time_range_metadata/route");
var _route32 = require("../traces/route");
var _route33 = require("../transactions/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getTypedGlobalApmServerRouteRepository() {
  const repository = {
    ..._route5.dataViewRouteRepository,
    ..._route8.environmentsRouteRepository,
    ..._route9.errorsRouteRepository,
    ..._route15.latencyDistributionRouteRepository,
    ..._route16.metricsRouteRepository,
    ..._route18.observabilityOverviewRouteRepository,
    ..._route21.serviceMapRouteRepository,
    ..._route19.serviceRouteRepository,
    ..._route20.serviceGroupRouteRepository,
    ..._route30.suggestionsRouteRepository,
    ..._route32.traceRouteRepository,
    ..._route33.transactionRouteRepository,
    ..._route3.alertsChartPreviewRouteRepository,
    ..._route22.agentConfigurationRouteRepository,
    ..._route23.anomalyDetectionRouteRepository,
    ..._route24.apmIndicesRouteRepository,
    ..._route25.customLinkRouteRepository,
    ..._route27.sourceMapsRouteRepository,
    ..._route12.apmFleetRouteRepository,
    ..._route7.dependencisRouteRepository,
    ..._route4.correlationsRouteRepository,
    ..._route11.fallbackToTransactionsRouteRepository,
    ..._route13.historicalDataRouteRepository,
    ..._route10.eventMetadataRouteRepository,
    ..._route2.agentKeysRouteRepository,
    ..._route29.storageExplorerRouteRepository,
    ..._route28.spanLinksRouteRepository,
    ..._route14.infrastructureRouteRepository,
    ..._route6.debugTelemetryRoute,
    ..._route31.timeRangeMetadataRoute,
    ..._route26.labsRouteRepository,
    ..._route.agentExplorerRouteRepository,
    ..._route17.mobileRouteRepository
  };
  return repository;
}
const getGlobalApmServerRouteRepository = () => {
  return getTypedGlobalApmServerRouteRepository();
};
exports.getGlobalApmServerRouteRepository = getGlobalApmServerRouteRepository;
function assertType() {}

// if any endpoint has an array-like return type, the assertion below will fail
assertType();