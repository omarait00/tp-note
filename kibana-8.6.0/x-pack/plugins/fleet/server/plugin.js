"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
var _common = require("../common");
var _experimental_features = require("../common/experimental_features");
var _constants = require("./constants");
var _saved_objects = require("./saved_objects");
var _routes = require("./routes");
var _services = require("./services");
var _register = require("./collectors/register");
var _security = require("./routes/security");
var _artifacts = require("./services/artifacts");
var _sender = require("./telemetry/sender");
var _setup = require("./services/setup");
var _agents = require("./services/agents");
var _package_policy = require("./services/package_policy");
var _fleet_usage_logger = require("./services/fleet_usage_logger");
var _check_deleted_files_task = require("./tasks/check_deleted_files_task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allSavedObjectTypes = [_constants.OUTPUT_SAVED_OBJECT_TYPE, _constants.AGENT_POLICY_SAVED_OBJECT_TYPE, _constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE, _constants.PACKAGES_SAVED_OBJECT_TYPE, _constants.ASSETS_SAVED_OBJECT_TYPE, _constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE, _constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE, _constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE];

/**
 * Describes public Fleet plugin contract returned at the `startup` stage.
 */

class FleetPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "configInitialValue", void 0);
    (0, _defineProperty2.default)(this, "cloud", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "isProductionMode", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "kibanaBranch", void 0);
    (0, _defineProperty2.default)(this, "httpSetup", void 0);
    (0, _defineProperty2.default)(this, "securitySetup", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsSetup", void 0);
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
    (0, _defineProperty2.default)(this, "fleetStatus$", void 0);
    (0, _defineProperty2.default)(this, "bulkActionsResolver", void 0);
    (0, _defineProperty2.default)(this, "fleetUsageSender", void 0);
    (0, _defineProperty2.default)(this, "checkDeletedFilesTask", void 0);
    (0, _defineProperty2.default)(this, "agentService", void 0);
    (0, _defineProperty2.default)(this, "packageService", void 0);
    (0, _defineProperty2.default)(this, "packagePolicyService", void 0);
    this.initializerContext = initializerContext;
    this.config$ = this.initializerContext.config.create();
    this.isProductionMode = this.initializerContext.env.mode.prod;
    this.kibanaVersion = this.initializerContext.env.packageInfo.version;
    this.kibanaBranch = this.initializerContext.env.packageInfo.branch;
    this.logger = this.initializerContext.logger.get();
    this.configInitialValue = this.initializerContext.config.get();
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger.get('telemetry_events'));
    this.fleetStatus$ = new _rxjs.BehaviorSubject({
      level: _server.ServiceStatusLevels.unavailable,
      summary: 'Fleet is unavailable'
    });
  }
  setup(core, deps) {
    this.httpSetup = core.http;
    this.encryptedSavedObjectsSetup = deps.encryptedSavedObjects;
    this.cloud = deps.cloud;
    this.securitySetup = deps.security;
    const config = this.configInitialValue;
    core.status.set(this.fleetStatus$.asObservable());
    (0, _saved_objects.registerSavedObjects)(core.savedObjects, deps.encryptedSavedObjects);
    (0, _saved_objects.registerEncryptedSavedObjects)(deps.encryptedSavedObjects);

    // Register feature
    if (deps.features) {
      deps.features.registerKibanaFeature({
        id: `fleetv2`,
        name: 'Fleet',
        category: _server.DEFAULT_APP_CATEGORIES.management,
        app: [_constants.PLUGIN_ID],
        catalogue: ['fleet'],
        privilegesTooltip: _i18n.i18n.translate('xpack.fleet.serverPlugin.privilegesTooltip', {
          defaultMessage: 'All Spaces is required for Fleet access.'
        }),
        reserved: {
          description: 'Privilege to setup Fleet packages and configured policies. Intended for use by the elastic/fleet-server service account only.',
          privileges: [{
            id: 'fleet-setup',
            privilege: {
              excludeFromBasePrivileges: true,
              api: ['fleet-setup'],
              savedObject: {
                all: [],
                read: []
              },
              ui: []
            }
          }]
        },
        privileges: {
          all: {
            api: [`${_constants.PLUGIN_ID}-read`, `${_constants.PLUGIN_ID}-all`],
            app: [_constants.PLUGIN_ID],
            requireAllSpaces: true,
            catalogue: ['fleet'],
            savedObject: {
              all: allSavedObjectTypes,
              read: []
            },
            ui: ['read', 'all']
          },
          read: {
            api: [`${_constants.PLUGIN_ID}-read`],
            app: [_constants.PLUGIN_ID],
            catalogue: ['fleet'],
            requireAllSpaces: true,
            savedObject: {
              all: [],
              read: allSavedObjectTypes
            },
            ui: ['read'],
            disabled: true
          }
        }
      });
      deps.features.registerKibanaFeature({
        id: 'fleet',
        // for BWC
        name: 'Integrations',
        category: _server.DEFAULT_APP_CATEGORIES.management,
        app: [_common.INTEGRATIONS_PLUGIN_ID],
        catalogue: ['fleet'],
        privileges: {
          all: {
            api: [`${_common.INTEGRATIONS_PLUGIN_ID}-read`, `${_common.INTEGRATIONS_PLUGIN_ID}-all`],
            app: [_common.INTEGRATIONS_PLUGIN_ID],
            catalogue: ['fleet'],
            savedObject: {
              all: allSavedObjectTypes,
              read: []
            },
            ui: ['read', 'all']
          },
          read: {
            api: [`${_common.INTEGRATIONS_PLUGIN_ID}-read`],
            app: [_common.INTEGRATIONS_PLUGIN_ID],
            catalogue: ['fleet'],
            savedObject: {
              all: [],
              read: allSavedObjectTypes
            },
            ui: ['read']
          }
        },
        subFeatures: []
      });
    }
    core.http.registerRouteHandlerContext(_constants.PLUGIN_ID, async (context, request) => {
      const plugin = this;
      const esClient = (await context.core).elasticsearch.client;
      return {
        get agentClient() {
          const agentService = plugin.setupAgentService(esClient.asInternalUser);
          return {
            asCurrentUser: agentService.asScoped(request),
            asInternalUser: agentService.asInternalUser
          };
        },
        get packagePolicyService() {
          const service = plugin.setupPackagePolicyService();
          return {
            asCurrentUser: service.asScoped(request),
            asInternalUser: service.asInternalUser
          };
        },
        authz: await (0, _security.getAuthzFromRequest)(request),
        epm: {
          // Use a lazy getter to avoid constructing this client when not used by a request handler
          get internalSoClient() {
            return _services.appContextService.getSavedObjects().getScopedClient(request, {
              excludedWrappers: ['security']
            });
          }
        },
        get spaceId() {
          return deps.spaces.spacesService.getSpaceId(request);
        }
      };
    });

    // Register usage collection
    (0, _register.registerFleetUsageCollector)(core, config, deps.usageCollection);
    const fetch = async abortController => await (0, _register.fetchFleetUsage)(core, config, abortController);
    this.fleetUsageSender = new _services.FleetUsageSender(deps.taskManager, core, fetch);
    (0, _fleet_usage_logger.registerFleetUsageLogger)(deps.taskManager, async () => (0, _register.fetchAgentsUsage)(core, config));
    const router = core.http.createRouter();
    // Allow read-only users access to endpoints necessary for Integrations UI
    // Only some endpoints require superuser so we pass a raw IRouter here

    // For all the routes we enforce the user to have role superuser
    const {
      router: fleetAuthzRouter,
      onPostAuthHandler: fleetAuthzOnPostAuthHandler
    } = (0, _security.makeRouterWithFleetAuthz)(router);
    core.http.registerOnPostAuth(fleetAuthzOnPostAuthHandler);

    // Always register app routes for permissions checking
    (0, _routes.registerAppRoutes)(fleetAuthzRouter);

    // The upload package route is only authorized for the superuser
    (0, _routes.registerEPMRoutes)(fleetAuthzRouter);
    (0, _routes.registerSetupRoutes)(fleetAuthzRouter, config);
    (0, _routes.registerAgentPolicyRoutes)(fleetAuthzRouter);
    (0, _routes.registerPackagePolicyRoutes)(fleetAuthzRouter);
    (0, _routes.registerOutputRoutes)(fleetAuthzRouter);
    (0, _routes.registerSettingsRoutes)(fleetAuthzRouter);
    (0, _routes.registerDataStreamRoutes)(fleetAuthzRouter);
    (0, _routes.registerPreconfigurationRoutes)(fleetAuthzRouter);
    (0, _routes.registerFleetServerHostRoutes)(fleetAuthzRouter);
    (0, _routes.registerDownloadSourcesRoutes)(fleetAuthzRouter);
    (0, _routes.registerHealthCheckRoutes)(fleetAuthzRouter);

    // Conditional config routes
    if (config.agents.enabled) {
      (0, _routes.registerAgentAPIRoutes)(fleetAuthzRouter, config);
      (0, _routes.registerEnrollmentApiKeyRoutes)(fleetAuthzRouter);
    }
    this.telemetryEventsSender.setup(deps.telemetry);
    this.bulkActionsResolver = new _agents.BulkActionsResolver(deps.taskManager, core);
    this.checkDeletedFilesTask = new _check_deleted_files_task.CheckDeletedFilesTask({
      core,
      taskManager: deps.taskManager,
      logFactory: this.initializerContext.logger
    });
  }
  start(core, plugins) {
    var _this$bulkActionsReso, _this$fleetUsageSende, _this$checkDeletedFil;
    _services.appContextService.start({
      elasticsearch: core.elasticsearch,
      data: plugins.data,
      encryptedSavedObjectsStart: plugins.encryptedSavedObjects,
      encryptedSavedObjectsSetup: this.encryptedSavedObjectsSetup,
      securitySetup: this.securitySetup,
      securityStart: plugins.security,
      configInitialValue: this.configInitialValue,
      config$: this.config$,
      experimentalFeatures: (0, _experimental_features.parseExperimentalConfigValue)(this.configInitialValue.enableExperimental || []),
      savedObjects: core.savedObjects,
      savedObjectsTagging: plugins.savedObjectsTagging,
      isProductionMode: this.isProductionMode,
      kibanaVersion: this.kibanaVersion,
      kibanaBranch: this.kibanaBranch,
      httpSetup: this.httpSetup,
      cloud: this.cloud,
      logger: this.logger,
      telemetryEventsSender: this.telemetryEventsSender,
      bulkActionsResolver: this.bulkActionsResolver
    });
    _services.licenseService.start(plugins.licensing.license$);
    this.telemetryEventsSender.start(plugins.telemetry, core);
    (_this$bulkActionsReso = this.bulkActionsResolver) === null || _this$bulkActionsReso === void 0 ? void 0 : _this$bulkActionsReso.start(plugins.taskManager);
    (_this$fleetUsageSende = this.fleetUsageSender) === null || _this$fleetUsageSende === void 0 ? void 0 : _this$fleetUsageSende.start(plugins.taskManager);
    (_this$checkDeletedFil = this.checkDeletedFilesTask) === null || _this$checkDeletedFil === void 0 ? void 0 : _this$checkDeletedFil.start({
      taskManager: plugins.taskManager
    });
    (0, _fleet_usage_logger.startFleetUsageLogger)(plugins.taskManager);
    const logger = _services.appContextService.getLogger();
    const fleetSetupPromise = (async () => {
      try {
        // Fleet remains `available` during setup as to excessively delay Kibana's boot process.
        // This should be reevaluated as Fleet's setup process is optimized and stabilized.
        this.fleetStatus$.next({
          level: _server.ServiceStatusLevels.available,
          summary: 'Fleet is setting up'
        });

        // We need to wait for the licence feature to be available,
        // to have our internal saved object client with encrypted saved object working properly
        await plugins.licensing.license$.pipe((0, _operators.filter)(licence => licence.getFeature('security').isEnabled && licence.getFeature('security').isAvailable), (0, _operators.take)(1)).toPromise();
        await (0, _setup.setupFleet)(new _server.SavedObjectsClient(core.savedObjects.createInternalRepository()), core.elasticsearch.client.asInternalUser);
        this.fleetStatus$.next({
          level: _server.ServiceStatusLevels.available,
          summary: 'Fleet is available'
        });
      } catch (error) {
        logger.warn('Fleet setup failed');
        logger.warn(error);
        this.fleetStatus$.next({
          // As long as Fleet has a dependency on EPR, we can't reliably set Kibana status to `unavailable` here.
          // See https://github.com/elastic/kibana/issues/120237
          level: _server.ServiceStatusLevels.available,
          summary: 'Fleet setup failed',
          meta: {
            error: error.message
          }
        });
      }
    })();
    return {
      authz: {
        fromRequest: _security.getAuthzFromRequest
      },
      fleetSetupCompleted: () => fleetSetupPromise,
      esIndexPatternService: new _services.ESIndexPatternSavedObjectService(),
      packageService: this.setupPackageService(core.elasticsearch.client.asInternalUser, new _server.SavedObjectsClient(core.savedObjects.createInternalRepository())),
      agentService: this.setupAgentService(core.elasticsearch.client.asInternalUser),
      agentPolicyService: {
        get: _services.agentPolicyService.get,
        list: _services.agentPolicyService.list,
        getFullAgentPolicy: _services.agentPolicyService.getFullAgentPolicy,
        getByIds: _services.agentPolicyService.getByIDs
      },
      packagePolicyService: _services.packagePolicyService,
      registerExternalCallback: (type, callback) => {
        return _services.appContextService.addExternalCallback(type, callback);
      },
      createArtifactsClient(packageName) {
        return new _artifacts.FleetArtifactsClient(core.elasticsearch.client.asInternalUser, packageName);
      }
    };
  }
  async stop() {
    _services.appContextService.stop();
    _services.licenseService.stop();
    this.telemetryEventsSender.stop();
    this.fleetStatus$.complete();
  }
  setupAgentService(internalEsClient) {
    if (this.agentService) {
      return this.agentService;
    }
    this.agentService = new _services.AgentServiceImpl(internalEsClient);
    return this.agentService;
  }
  setupPackagePolicyService() {
    if (this.packagePolicyService) {
      return this.packagePolicyService;
    }
    this.packagePolicyService = new _package_policy.PackagePolicyServiceImpl();
    return this.packagePolicyService;
  }
  setupPackageService(internalEsClient, internalSoClient) {
    if (this.packageService) {
      return this.packageService;
    }
    this.packageService = new _services.PackageServiceImpl(internalEsClient, internalSoClient, this.getLogger());
    return this.packageService;
  }
  getLogger() {
    if (!this.logger) {
      this.logger = this.initializerContext.logger.get();
    }
    return this.logger;
  }
}
exports.FleetPlugin = FleetPlugin;