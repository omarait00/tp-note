"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "NETWORK_TIMINGS_FIELDS", {
  enumerable: true,
  get: function () {
    return _synthetics.NETWORK_TIMINGS_FIELDS;
  }
});
Object.defineProperty(exports, "ProcessorEvent", {
  enumerable: true,
  get: function () {
    return _processor_event.ProcessorEvent;
  }
});
Object.defineProperty(exports, "ProgressiveLoadingQuality", {
  enumerable: true,
  get: function () {
    return _progressive_loading.ProgressiveLoadingQuality;
  }
});
Object.defineProperty(exports, "SYNTHETICS_BLOCKED_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_BLOCKED_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_CONNECT_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_CONNECT_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_DNS_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_DNS_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_RECEIVE_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_RECEIVE_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_SEND_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_SEND_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_SSL_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_SSL_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_STEP_DURATION", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_STEP_DURATION;
  }
});
Object.defineProperty(exports, "SYNTHETICS_TOTAL_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_TOTAL_TIMINGS;
  }
});
Object.defineProperty(exports, "SYNTHETICS_WAIT_TIMINGS", {
  enumerable: true,
  get: function () {
    return _synthetics.SYNTHETICS_WAIT_TIMINGS;
  }
});
Object.defineProperty(exports, "apmAWSLambdaPriceFactor", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmAWSLambdaPriceFactor;
  }
});
Object.defineProperty(exports, "apmAWSLambdaRequestCostPerMillion", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmAWSLambdaRequestCostPerMillion;
  }
});
Object.defineProperty(exports, "apmLabsButton", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmLabsButton;
  }
});
Object.defineProperty(exports, "apmProgressiveLoading", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmProgressiveLoading;
  }
});
Object.defineProperty(exports, "apmServiceGroupMaxNumberOfServices", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmServiceGroupMaxNumberOfServices;
  }
});
Object.defineProperty(exports, "apmServiceInventoryOptimizedSorting", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmServiceInventoryOptimizedSorting;
  }
});
Object.defineProperty(exports, "apmTraceExplorerTab", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.apmTraceExplorerTab;
  }
});
exports.casesPath = exports.casesFeatureId = void 0;
Object.defineProperty(exports, "defaultApmServiceEnvironment", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.defaultApmServiceEnvironment;
  }
});
Object.defineProperty(exports, "enableAgentExplorerView", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableAgentExplorerView;
  }
});
Object.defineProperty(exports, "enableAwsLambdaMetrics", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableAwsLambdaMetrics;
  }
});
Object.defineProperty(exports, "enableComparisonByDefault", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableComparisonByDefault;
  }
});
Object.defineProperty(exports, "enableCriticalPath", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableCriticalPath;
  }
});
Object.defineProperty(exports, "enableInfrastructureHostsView", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableInfrastructureHostsView;
  }
});
Object.defineProperty(exports, "enableInspectEsQueries", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableInspectEsQueries;
  }
});
Object.defineProperty(exports, "enableNewSyntheticsView", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.enableNewSyntheticsView;
  }
});
Object.defineProperty(exports, "formatDurationFromTimeUnitChar", {
  enumerable: true,
  get: function () {
    return _formatters.formatDurationFromTimeUnitChar;
  }
});
Object.defineProperty(exports, "getProbabilityFromProgressiveLoadingQuality", {
  enumerable: true,
  get: function () {
    return _progressive_loading.getProbabilityFromProgressiveLoadingQuality;
  }
});
Object.defineProperty(exports, "maxSuggestions", {
  enumerable: true,
  get: function () {
    return _ui_settings_keys.maxSuggestions;
  }
});
exports.uptimeOverviewLocatorID = exports.syntheticsMonitorDetailLocatorID = exports.syntheticsEditMonitorLocatorID = exports.observabilityFeatureId = exports.observabilityAppId = void 0;
var _formatters = require("./utils/formatters");
var _processor_event = require("./processor_event");
var _ui_settings_keys = require("./ui_settings_keys");
var _progressive_loading = require("./progressive_loading");
var _synthetics = require("./field_names/synthetics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const casesFeatureId = 'observabilityCases';

// The ID of the observability app. Should more appropriately be called
// 'observability' but it's used in telemetry by applicationUsage so we don't
// want to change it.
exports.casesFeatureId = casesFeatureId;
const observabilityAppId = 'observability-overview';

// Used by feature and "solution" registration
exports.observabilityAppId = observabilityAppId;
const observabilityFeatureId = 'observability';

// Used by Cases to install routes
exports.observabilityFeatureId = observabilityFeatureId;
const casesPath = '/cases';

// Name of a locator created by the uptime plugin. Intended for use
// by other plugins as well, so defined here to prevent cross-references.
exports.casesPath = casesPath;
const uptimeOverviewLocatorID = 'UPTIME_OVERVIEW_LOCATOR';
exports.uptimeOverviewLocatorID = uptimeOverviewLocatorID;
const syntheticsMonitorDetailLocatorID = 'SYNTHETICS_MONITOR_DETAIL_LOCATOR';
exports.syntheticsMonitorDetailLocatorID = syntheticsMonitorDetailLocatorID;
const syntheticsEditMonitorLocatorID = 'SYNTHETICS_EDIT_MONITOR_LOCATOR';
exports.syntheticsEditMonitorLocatorID = syntheticsEditMonitorLocatorID;