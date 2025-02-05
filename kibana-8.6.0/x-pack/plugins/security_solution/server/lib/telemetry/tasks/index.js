"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryTaskConfigs = createTelemetryTaskConfigs;
var _diagnostic = require("./diagnostic");
var _endpoint = require("./endpoint");
var _security_lists = require("./security_lists");
var _detection_rule = require("./detection_rule");
var _prebuilt_rule_alerts = require("./prebuilt_rule_alerts");
var _timelines = require("./timelines");
var _configuration = require("./configuration");
var _configuration2 = require("../configuration");
var _filterlists = require("./filterlists");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryTaskConfigs() {
  return [(0, _diagnostic.createTelemetryDiagnosticsTaskConfig)(), (0, _endpoint.createTelemetryEndpointTaskConfig)(_configuration2.telemetryConfiguration.max_security_list_telemetry_batch), (0, _security_lists.createTelemetrySecurityListTaskConfig)(_configuration2.telemetryConfiguration.max_endpoint_telemetry_batch), (0, _detection_rule.createTelemetryDetectionRuleListsTaskConfig)(_configuration2.telemetryConfiguration.max_detection_rule_telemetry_batch), (0, _prebuilt_rule_alerts.createTelemetryPrebuiltRuleAlertsTaskConfig)(_configuration2.telemetryConfiguration.max_detection_alerts_batch), (0, _timelines.createTelemetryTimelineTaskConfig)(), (0, _configuration.createTelemetryConfigurationTaskConfig)(), (0, _filterlists.createTelemetryFilterListArtifactTaskConfig)()];
}