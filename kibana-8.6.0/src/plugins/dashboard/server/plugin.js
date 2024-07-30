"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _saved_objects = require("./saved_objects");
var _capabilities_provider = require("./capabilities_provider");
var _register_collector = require("./usage/register_collector");
var _dashboard_container_embeddable_factory = require("./embeddable/dashboard_container_embeddable_factory");
var _ui_settings = require("./ui_settings");
var _dashboard_telemetry_collection_task = require("./usage/dashboard_telemetry_collection_task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class DashboardPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core, plugins) {
    this.logger.debug('dashboard: Setup');
    core.savedObjects.registerType((0, _saved_objects.createDashboardSavedObjectType)({
      migrationDeps: {
        embeddable: plugins.embeddable
      }
    }));
    if (plugins.taskManager) {
      (0, _dashboard_telemetry_collection_task.initializeDashboardTelemetryTask)(this.logger, core, plugins.taskManager, plugins.embeddable);
    }
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    if (plugins.usageCollection && plugins.taskManager) {
      (0, _register_collector.registerDashboardUsageCollector)(plugins.usageCollection, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
    }
    plugins.embeddable.registerEmbeddableFactory((0, _dashboard_container_embeddable_factory.dashboardPersistableStateServiceFactory)(plugins.embeddable));
    core.uiSettings.register((0, _ui_settings.getUISettings)());
    return {};
  }
  start(core, plugins) {
    this.logger.debug('dashboard: Started');
    if (plugins.taskManager) {
      (0, _dashboard_telemetry_collection_task.scheduleDashboardTelemetry)(this.logger, plugins.taskManager).then(async () => {
        await plugins.taskManager.runSoon(_dashboard_telemetry_collection_task.TASK_ID);
      }).catch(e => {
        this.logger.debug(`Error scheduling task, received ${e.message}`);
      });
    }
    return {};
  }
  stop() {}
}
exports.DashboardPlugin = DashboardPlugin;