"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../src/core/server");
var _mapping_from_field_map = require("../../rule_registry/common/mapping_from_field_map");
var _experimental_rule_field_map = require("../../rule_registry/common/assets/field_maps/experimental_rule_field_map");
var _server2 = require("../../rule_registry/server");
var _synthetics_monitor_client = require("./synthetics_service/synthetics_monitor/synthetics_monitor_client");
var _server3 = require("./server");
var _uptime_server = require("./legacy_uptime/uptime_server");
var _feature = require("./feature");
var _uptime_rule_field_map = require("../common/rules/uptime_rule_field_map");
var _adapters = require("./legacy_uptime/lib/adapters");
var _sender = require("./legacy_uptime/lib/telemetry/sender");
var _saved_objects = require("./legacy_uptime/lib/saved_objects/saved_objects");
var _synthetics_service = require("./synthetics_service/synthetics_service");
var _service_api_key = require("./legacy_uptime/lib/saved_objects/service_api_key");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class Plugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "initContext", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "server", void 0);
    (0, _defineProperty2.default)(this, "syntheticsService", void 0);
    (0, _defineProperty2.default)(this, "syntheticsMonitorClient", void 0);
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
    this.initContext = initializerContext;
    this.logger = initializerContext.logger.get();
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger);
  }
  setup(core, plugins) {
    const config = this.initContext.config.get();
    _saved_objects.savedObjectsAdapter.config = config;
    this.logger = this.initContext.logger.get();
    const {
      ruleDataService
    } = plugins.ruleRegistry;
    const ruleDataClient = ruleDataService.initializeIndex({
      feature: 'uptime',
      registrationContext: 'observability.uptime',
      dataset: _server2.Dataset.alerts,
      componentTemplateRefs: [],
      componentTemplates: [{
        name: 'mappings',
        mappings: (0, _mapping_from_field_map.mappingFromFieldMap)({
          ..._uptime_rule_field_map.uptimeRuleFieldMap,
          ..._experimental_rule_field_map.experimentalRuleFieldMap
        }, 'strict')
      }]
    });
    this.server = {
      config,
      router: core.http.createRouter(),
      cloud: plugins.cloud,
      stackVersion: this.initContext.env.packageInfo.version,
      basePath: core.http.basePath,
      logger: this.logger,
      telemetry: this.telemetryEventsSender,
      isDev: this.initContext.env.mode.dev,
      spaces: plugins.spaces
    };
    this.syntheticsService = new _synthetics_service.SyntheticsService(this.server);
    this.syntheticsService.setup(plugins.taskManager);
    this.syntheticsMonitorClient = new _synthetics_monitor_client.SyntheticsMonitorClient(this.syntheticsService, this.server);
    this.telemetryEventsSender.setup(plugins.telemetry);
    plugins.features.registerKibanaFeature(_feature.uptimeFeature);
    (0, _uptime_server.initUptimeServer)(this.server, plugins, ruleDataClient, this.logger);
    (0, _server3.initSyntheticsServer)(this.server, this.syntheticsMonitorClient, plugins);
    (0, _saved_objects.registerUptimeSavedObjects)(core.savedObjects, plugins.encryptedSavedObjects);
    _adapters.KibanaTelemetryAdapter.registerUsageCollector(plugins.usageCollection, () => this.savedObjectsClient);
    return {
      ruleRegistry: ruleDataClient
    };
  }
  start(coreStart, pluginsStart) {
    var _this$syntheticsServi;
    this.savedObjectsClient = new _server.SavedObjectsClient(coreStart.savedObjects.createInternalRepository([_service_api_key.syntheticsServiceApiKey.name]));
    if (this.server) {
      this.server.coreStart = coreStart;
      this.server.security = pluginsStart.security;
      this.server.fleet = pluginsStart.fleet;
      this.server.encryptedSavedObjects = pluginsStart.encryptedSavedObjects;
      this.server.savedObjectsClient = this.savedObjectsClient;
    }
    (_this$syntheticsServi = this.syntheticsService) === null || _this$syntheticsServi === void 0 ? void 0 : _this$syntheticsServi.start(pluginsStart.taskManager);
    this.telemetryEventsSender.start(pluginsStart.telemetry, coreStart);
  }
  stop() {}
}
exports.Plugin = Plugin;