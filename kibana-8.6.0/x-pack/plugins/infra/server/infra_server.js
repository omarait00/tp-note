"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initInfraServer = void 0;
var _infra_ml = require("./routes/infra_ml");
var _inventory_metadata = require("./routes/inventory_metadata");
var _ip_to_hostname = require("./routes/ip_to_hostname");
var _log_alerts = require("./routes/log_alerts");
var _log_analysis = require("./routes/log_analysis");
var _log_entries = require("./routes/log_entries");
var _log_views = require("./routes/log_views");
var _metadata = require("./routes/metadata");
var _metrics_api = require("./routes/metrics_api");
var _metrics_explorer = require("./routes/metrics_explorer");
var _metrics_sources = require("./routes/metrics_sources");
var _node_details = require("./routes/node_details");
var _overview = require("./routes/overview");
var _process_list = require("./routes/process_list");
var _snapshot = require("./routes/snapshot");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initInfraServer = libs => {
  (0, _ip_to_hostname.initIpToHostName)(libs);
  (0, _log_analysis.initGetLogEntryCategoriesRoute)(libs);
  (0, _log_analysis.initGetLogEntryCategoryDatasetsRoute)(libs);
  (0, _log_analysis.initGetLogEntryCategoryDatasetsStatsRoute)(libs);
  (0, _log_analysis.initGetLogEntryCategoryExamplesRoute)(libs);
  (0, _log_analysis.initGetLogEntryAnomaliesRoute)(libs);
  (0, _log_analysis.initGetLogEntryAnomaliesDatasetsRoute)(libs);
  (0, _infra_ml.initGetK8sAnomaliesRoute)(libs);
  (0, _infra_ml.initGetHostsAnomaliesRoute)(libs);
  (0, _snapshot.initSnapshotRoute)(libs);
  (0, _node_details.initNodeDetailsRoute)(libs);
  (0, _metrics_sources.initMetricsSourceConfigurationRoutes)(libs);
  (0, _log_analysis.initValidateLogAnalysisDatasetsRoute)(libs);
  (0, _log_analysis.initValidateLogAnalysisIndicesRoute)(libs);
  (0, _log_analysis.initGetLogEntryExamplesRoute)(libs);
  (0, _log_entries.initLogEntriesHighlightsRoute)(libs);
  (0, _log_entries.initLogEntriesSummaryRoute)(libs);
  (0, _log_entries.initLogEntriesSummaryHighlightsRoute)(libs);
  (0, _log_views.initLogViewRoutes)(libs);
  (0, _metrics_explorer.initMetricExplorerRoute)(libs);
  (0, _metrics_api.initMetricsAPIRoute)(libs);
  (0, _metadata.initMetadataRoute)(libs);
  (0, _inventory_metadata.initInventoryMetaRoute)(libs);
  (0, _log_alerts.initGetLogAlertsChartPreviewDataRoute)(libs);
  (0, _process_list.initProcessListRoute)(libs);
  (0, _overview.initOverviewRoute)(libs);
};
exports.initInfraServer = initInfraServer;