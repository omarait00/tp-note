"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CspPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _subscription = require("../common/utils/subscription");
var _setup_routes = require("./routes/setup_routes");
var _saved_objects = require("./saved_objects");
var _create_indices = require("./create_indices/create_indices");
var _create_transforms = require("./create_transforms/create_transforms");
var _fleet_integration = require("./fleet_integration/fleet_integration");
var _constants = require("../common/constants");
var _findings_stats_task = require("./tasks/findings_stats_task");
var _register = require("./lib/telemetry/collectors/register");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CspPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "isCloudEnabled", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core, plugins) {
    (0, _saved_objects.setupSavedObjects)(core.savedObjects);
    (0, _setup_routes.setupRoutes)({
      core,
      logger: this.logger
    });
    const coreStartServices = core.getStartServices();
    this.setupCspTasks(plugins.taskManager, coreStartServices, this.logger);
    (0, _register.registerCspmUsageCollector)(this.logger, plugins.usageCollection);
    this.isCloudEnabled = plugins.cloud.isCloudEnabled;
    return {};
  }
  start(core, plugins) {
    plugins.fleet.fleetSetupCompleted().then(async () => {
      const packageInfo = await plugins.fleet.packageService.asInternalUser.getInstallation(_constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME);

      // If package is installed we want to make sure all needed assets are installed
      if (packageInfo) {
        // noinspection ES6MissingAwait
        this.initialize(core, plugins.taskManager);
      }
      plugins.fleet.registerExternalCallback('packagePolicyCreate', async (packagePolicy, _context, _request) => {
        var _packagePolicy$packag;
        const license = await plugins.licensing.refresh();
        if ((0, _fleet_integration.isCspPackage)((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name)) {
          if (!(0, _subscription.isSubscriptionAllowed)(this.isCloudEnabled, license)) {
            throw new Error('To use this feature you must upgrade your subscription or start a trial');
          }
        }
        return packagePolicy;
      });
      plugins.fleet.registerExternalCallback('packagePolicyPostCreate', async (packagePolicy, context, _) => {
        var _packagePolicy$packag2;
        if ((0, _fleet_integration.isCspPackage)((_packagePolicy$packag2 = packagePolicy.package) === null || _packagePolicy$packag2 === void 0 ? void 0 : _packagePolicy$packag2.name)) {
          await this.initialize(core, plugins.taskManager);
          const soClient = (await context.core).savedObjects.client;
          await (0, _fleet_integration.onPackagePolicyPostCreateCallback)(this.logger, packagePolicy, soClient);
          return packagePolicy;
        }
        return packagePolicy;
      });
      plugins.fleet.registerExternalCallback('postPackagePolicyDelete', async deletedPackagePolicies => {
        for (const deletedPackagePolicy of deletedPackagePolicies) {
          var _deletedPackagePolicy;
          if ((0, _fleet_integration.isCspPackage)((_deletedPackagePolicy = deletedPackagePolicy.package) === null || _deletedPackagePolicy === void 0 ? void 0 : _deletedPackagePolicy.name)) {
            const soClient = core.savedObjects.createInternalRepository();
            await (0, _fleet_integration.removeCspRulesInstancesCallback)(deletedPackagePolicy, soClient, this.logger);
            const isPackageExists = await (0, _fleet_integration.isCspPackageInstalled)(soClient, this.logger);
            if (isPackageExists) {
              await this.uninstallResources(plugins.taskManager, this.logger);
            }
          }
        }
      });
    });
    return {};
  }
  stop() {}
  async initialize(core, taskManager) {
    this.logger.debug('initialize');
    const esClient = core.elasticsearch.client.asInternalUser;
    await (0, _create_indices.initializeCspIndices)(esClient, this.logger);
    await (0, _create_transforms.initializeCspTransforms)(esClient, this.logger);
    await (0, _findings_stats_task.scheduleFindingsStatsTask)(taskManager, this.logger);
  }
  async uninstallResources(taskManager, logger) {
    await (0, _findings_stats_task.removeFindingsStatsTask)(taskManager, logger);
  }
  setupCspTasks(taskManager, coreStartServices, logger) {
    (0, _findings_stats_task.setupFindingsStatsTask)(taskManager, coreStartServices, logger);
  }
}
exports.CspPlugin = CspPlugin;