"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = void 0;
var _fleet_integrations = require("../lib/detection_engine/fleet_integrations");
var _prebuilt_rules = require("../lib/detection_engine/prebuilt_rules");
var _rule_actions_legacy = require("../lib/detection_engine/rule_actions_legacy");
var _rule_exceptions = require("../lib/detection_engine/rule_exceptions");
var _rule_management = require("../lib/detection_engine/rule_management");
var _rule_monitoring = require("../lib/detection_engine/rule_monitoring");
var _rule_preview = require("../lib/detection_engine/rule_preview");
var _create_index_route = require("../lib/detection_engine/routes/index/create_index_route");
var _read_index_route = require("../lib/detection_engine/routes/index/read_index_route");
var _create_signals_migration_route = require("../lib/detection_engine/routes/signals/create_signals_migration_route");
var _delete_signals_migration_route = require("../lib/detection_engine/routes/signals/delete_signals_migration_route");
var _finalize_signals_migration_route = require("../lib/detection_engine/routes/signals/finalize_signals_migration_route");
var _get_signals_migration_status_route = require("../lib/detection_engine/routes/signals/get_signals_migration_status_route");
var _query_signals_route = require("../lib/detection_engine/routes/signals/query_signals_route");
var _open_close_signals_route = require("../lib/detection_engine/routes/signals/open_close_signals_route");
var _delete_index_route = require("../lib/detection_engine/routes/index/delete_index_route");
var _read_privileges_route = require("../lib/detection_engine/routes/privileges/read_privileges_route");
var _timelines = require("../lib/timeline/routes/timelines");
var _get_draft_timelines = require("../lib/timeline/routes/draft_timelines/get_draft_timelines");
var _clean_draft_timelines = require("../lib/timeline/routes/draft_timelines/clean_draft_timelines");
var _notes = require("../lib/timeline/routes/notes");
var _pinned_events = require("../lib/timeline/routes/pinned_events");
var _install_prepackaged_timelines = require("../lib/timeline/routes/prepackaged_timelines/install_prepackaged_timelines");
var _routes = require("../lib/sourcerer/routes");
var _telemetry_detection_rules_preview_route = require("../lib/detection_engine/routes/telemetry/telemetry_detection_rules_preview_route");
var _read_alerts_index_exists_route = require("../lib/detection_engine/routes/index/read_alerts_index_exists_route");
var _resolver = require("../endpoint/routes/resolver");
var _routes2 = require("../lib/risk_score/routes");
var _register_routes = require("../lib/exceptions/api/register_routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const initRoutes = (router, config, hasEncryptionKey, security, telemetrySender, ml, ruleDataService, logger, ruleDataClient, ruleOptions, getStartServices, securityRuleTypeOptions, previewRuleDataClient, previewTelemetryReceiver) => {
  (0, _fleet_integrations.registerFleetIntegrationsRoutes)(router, logger);
  (0, _rule_actions_legacy.registerLegacyRuleActionsRoutes)(router, logger);
  (0, _prebuilt_rules.registerPrebuiltRulesRoutes)(router, config, security);
  (0, _rule_exceptions.registerRuleExceptionsRoutes)(router);
  (0, _register_routes.registerManageExceptionsRoutes)(router);
  (0, _rule_management.registerRuleManagementRoutes)(router, config, ml, logger);
  (0, _rule_monitoring.registerRuleMonitoringRoutes)(router);
  (0, _rule_preview.registerRulePreviewRoutes)(router, config, ml, security, ruleOptions, securityRuleTypeOptions, previewRuleDataClient, getStartServices, logger);
  (0, _resolver.registerResolverRoutes)(router, getStartServices, config);
  (0, _timelines.createTimelinesRoute)(router, config, security);
  (0, _timelines.patchTimelinesRoute)(router, config, security);
  (0, _timelines.importTimelinesRoute)(router, config, security);
  (0, _timelines.exportTimelinesRoute)(router, config, security);
  (0, _get_draft_timelines.getDraftTimelinesRoute)(router, config, security);
  (0, _timelines.getTimelineRoute)(router, config, security);
  (0, _timelines.resolveTimelineRoute)(router, config, security);
  (0, _timelines.getTimelinesRoute)(router, config, security);
  (0, _clean_draft_timelines.cleanDraftTimelinesRoute)(router, config, security);
  (0, _timelines.deleteTimelinesRoute)(router, config, security);
  (0, _timelines.persistFavoriteRoute)(router, config, security);
  (0, _install_prepackaged_timelines.installPrepackedTimelinesRoute)(router, config, security);
  (0, _notes.persistNoteRoute)(router, config, security);
  (0, _pinned_events.persistPinnedEventRoute)(router, config, security);

  // Detection Engine Signals routes that have the REST endpoints of /api/detection_engine/signals
  // POST /api/detection_engine/signals/status
  // Example usage can be found in security_solution/server/lib/detection_engine/scripts/signals
  (0, _open_close_signals_route.setSignalsStatusRoute)(router, logger, security, telemetrySender);
  (0, _query_signals_route.querySignalsRoute)(router, ruleDataClient);
  (0, _get_signals_migration_status_route.getSignalsMigrationStatusRoute)(router);
  (0, _create_signals_migration_route.createSignalsMigrationRoute)(router, security);
  (0, _finalize_signals_migration_route.finalizeSignalsMigrationRoute)(router, ruleDataService, security);
  (0, _delete_signals_migration_route.deleteSignalsMigrationRoute)(router, security);

  // Detection Engine index routes that have the REST endpoints of /api/detection_engine/index
  // All REST index creation, policy management for spaces
  (0, _create_index_route.createIndexRoute)(router);
  (0, _read_index_route.readIndexRoute)(router, ruleDataService);
  (0, _read_alerts_index_exists_route.readAlertsIndexExistsRoute)(router);
  (0, _delete_index_route.deleteIndexRoute)(router);

  // Privileges API to get the generic user privileges
  (0, _read_privileges_route.readPrivilegesRoute)(router, hasEncryptionKey);

  // Sourcerer API to generate default pattern
  (0, _routes.createSourcererDataViewRoute)(router, getStartServices);
  (0, _routes.getSourcererDataViewRoute)(router, getStartServices);

  // risky score module
  (0, _routes2.createEsIndexRoute)(router, logger);
  (0, _routes2.deleteEsIndicesRoute)(router);
  (0, _routes2.createStoredScriptRoute)(router, logger);
  (0, _routes2.deleteStoredScriptRoute)(router);
  (0, _routes2.readPrebuiltDevToolContentRoute)(router);
  (0, _routes2.createPrebuiltSavedObjectsRoute)(router, logger, security);
  (0, _routes2.deletePrebuiltSavedObjectsRoute)(router, security);
  (0, _routes2.getRiskScoreIndexStatusRoute)(router);
  (0, _routes2.installRiskScoresRoute)(router, logger, security);
  const {
    previewTelemetryUrlEnabled
  } = config.experimentalFeatures;
  if (previewTelemetryUrlEnabled) {
    // telemetry preview endpoint for e2e integration tests only at the moment.
    (0, _telemetry_detection_rules_preview_route.telemetryDetectionRulesPreviewRoute)(router, logger, previewTelemetryReceiver, telemetrySender);
  }
};
exports.initRoutes = initRoutes;