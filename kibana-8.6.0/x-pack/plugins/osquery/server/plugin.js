"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsqueryPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../src/core/server");
var _update_global_packs = require("./lib/update_global_packs");
var _types = require("../common/types");
var _create_config = require("./create_config");
var _routes = require("./routes");
var _osquery = require("./search_strategy/osquery");
var _saved_objects = require("./saved_objects");
var _usage = require("./usage");
var _osquery_app_context_services = require("./lib/osquery_app_context_services");
var _common = require("../common");
var _fleet_integration = require("./lib/fleet_integration");
var _sender = require("./lib/telemetry/sender");
var _receiver = require("./lib/telemetry/receiver");
var _create_transforms_indices = require("./create_indices/create_transforms_indices");
var _create_transforms = require("./create_transforms/create_transforms");
var _create_data_views = require("./create_data_views");
var _action = require("./handlers/action");
var _register_features = require("./utils/register_features");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class OsqueryPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "osqueryAppContextService", new _osquery_app_context_services.OsqueryAppContextService());
    (0, _defineProperty2.default)(this, "telemetryReceiver", void 0);
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
    this.initializerContext = initializerContext;
    this.context = initializerContext;
    this.logger = initializerContext.logger.get();
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger);
    this.telemetryReceiver = new _receiver.TelemetryReceiver(this.logger);
  }
  setup(core, plugins) {
    this.logger.debug('osquery: Setup');
    const config = (0, _create_config.createConfig)(this.initializerContext);
    (0, _register_features.registerFeatures)(plugins.features);
    const router = core.http.createRouter();
    const osqueryContext = {
      logFactory: this.context.logger,
      getStartServices: core.getStartServices,
      service: this.osqueryAppContextService,
      config: () => config,
      security: plugins.security,
      telemetryEventsSender: this.telemetryEventsSender
    };
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    (0, _usage.initUsageCollectors)({
      core,
      osqueryContext,
      usageCollection: plugins.usageCollection
    });
    core.getStartServices().then(([{
      elasticsearch
    }, depsStart]) => {
      const osquerySearchStrategy = (0, _osquery.osquerySearchStrategyProvider)(depsStart.data, elasticsearch.client);
      plugins.data.search.registerSearchStrategy('osquerySearchStrategy', osquerySearchStrategy);
      (0, _routes.defineRoutes)(router, osqueryContext);
    });
    this.telemetryEventsSender.setup(this.telemetryReceiver, plugins.taskManager, core.analytics);
    return {
      osqueryCreateAction: params => (0, _action.createActionHandler)(osqueryContext, params)
    };
  }
  start(core, plugins) {
    var _plugins$fleet, _plugins$fleet2;
    this.logger.debug('osquery: Started');
    const registerIngestCallback = (_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.registerExternalCallback;
    this.osqueryAppContextService.start({
      ...plugins.fleet,
      ruleRegistryService: plugins.ruleRegistry,
      // @ts-expect-error update types
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      config: this.config,
      logger: this.logger,
      registerIngestCallback
    });
    this.telemetryReceiver.start(core, this.osqueryAppContextService);
    this.telemetryEventsSender.start(plugins.taskManager, this.telemetryReceiver);
    (_plugins$fleet2 = plugins.fleet) === null || _plugins$fleet2 === void 0 ? void 0 : _plugins$fleet2.fleetSetupCompleted().then(async () => {
      var _plugins$fleet3;
      const packageInfo = await ((_plugins$fleet3 = plugins.fleet) === null || _plugins$fleet3 === void 0 ? void 0 : _plugins$fleet3.packageService.asInternalUser.getInstallation(_common.OSQUERY_INTEGRATION_NAME));
      const client = new _server.SavedObjectsClient(core.savedObjects.createInternalRepository());
      const esClient = core.elasticsearch.client.asInternalUser;
      const dataViewsService = await plugins.dataViews.dataViewsServiceFactory(client, esClient, undefined, true);

      // If package is installed we want to make sure all needed assets are installed
      if (packageInfo) {
        await this.initialize(core, dataViewsService);
      }
      if (registerIngestCallback) {
        registerIngestCallback('packagePolicyPostCreate', async packagePolicy => {
          var _packagePolicy$packag;
          if (((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) === _common.OSQUERY_INTEGRATION_NAME) {
            await this.initialize(core, dataViewsService);
            const allPacks = await client.find({
              type: _types.packSavedObjectType
            });
            if (allPacks.saved_objects) {
              await (0, _update_global_packs.updateGlobalPacksCreateCallback)(packagePolicy, client, allPacks, this.osqueryAppContextService, esClient);
            }
          }
          return packagePolicy;
        });
        registerIngestCallback('postPackagePolicyDelete', (0, _fleet_integration.getPackagePolicyDeleteCallback)(client));
      }
    });
    return {};
  }
  stop() {
    this.logger.debug('osquery: Stopped');
    this.telemetryEventsSender.stop();
    this.osqueryAppContextService.stop();
  }
  async initialize(core, dataViewsService) {
    this.logger.debug('initialize');
    await (0, _create_transforms_indices.initializeTransformsIndices)(core.elasticsearch.client.asInternalUser, this.logger);
    await (0, _create_transforms.initializeTransforms)(core.elasticsearch.client.asInternalUser, this.logger);
    await (0, _create_data_views.createDataViews)(dataViewsService);
  }
}
exports.OsqueryPlugin = OsqueryPlugin;