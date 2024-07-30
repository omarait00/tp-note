"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasePlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../common/constants");
var _saved_object_types = require("./saved_object_types");
var _factory = require("./client/factory");
var _features = require("./features");
var _register_routes = require("./routes/api/register_routes");
var _get_external_routes = require("./routes/api/get_external_routes");
var _telemetry = require("./telemetry");
var _get_internal_routes = require("./routes/api/get_internal_routes");
var _persistable_state_registry = require("./attachment_framework/persistable_state_registry");
var _external_reference_registry = require("./attachment_framework/external_reference_registry");
var _services = require("./services");
var _constants2 = require("./common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CasePlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "clientFactory", void 0);
    (0, _defineProperty2.default)(this, "securityPluginSetup", void 0);
    (0, _defineProperty2.default)(this, "lensEmbeddableFactory", void 0);
    (0, _defineProperty2.default)(this, "persistableStateAttachmentTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "externalReferenceAttachmentTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "userProfileService", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", ({
      core
    }) => {
      return async (context, request, response) => {
        return {
          getCasesClient: async () => {
            const [{
              savedObjects
            }] = await core.getStartServices();
            const coreContext = await context.core;
            return this.clientFactory.create({
              request,
              scopedClusterClient: coreContext.elasticsearch.client.asCurrentUser,
              savedObjectsService: savedObjects
            });
          }
        };
      };
    });
    this.initializerContext = initializerContext;
    this.kibanaVersion = initializerContext.env.packageInfo.version;
    this.logger = this.initializerContext.logger.get();
    this.clientFactory = new _factory.CasesClientFactory(this.logger);
    this.persistableStateAttachmentTypeRegistry = new _persistable_state_registry.PersistableStateAttachmentTypeRegistry();
    this.externalReferenceAttachmentTypeRegistry = new _external_reference_registry.ExternalReferenceAttachmentTypeRegistry();
    this.userProfileService = new _services.UserProfileService(this.logger);
  }
  setup(core, plugins) {
    var _plugins$usageCollect;
    this.logger.debug(`Setting up Case Workflow with core contract [${Object.keys(core)}] and plugins [${Object.keys(plugins)}]`);
    this.securityPluginSetup = plugins.security;
    this.lensEmbeddableFactory = plugins.lens.lensEmbeddableFactory;
    plugins.features.registerKibanaFeature((0, _features.getCasesKibanaFeature)());
    core.savedObjects.registerType((0, _saved_object_types.createCaseCommentSavedObjectType)({
      migrationDeps: {
        persistableStateAttachmentTypeRegistry: this.persistableStateAttachmentTypeRegistry,
        lensEmbeddableFactory: this.lensEmbeddableFactory
      }
    }));
    core.savedObjects.registerType(_saved_object_types.caseConfigureSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseConnectorMappingsSavedObjectType);
    core.savedObjects.registerType((0, _saved_object_types.createCaseSavedObjectType)(core, this.logger));
    core.savedObjects.registerType((0, _saved_object_types.createCaseUserActionSavedObjectType)({
      persistableStateAttachmentTypeRegistry: this.persistableStateAttachmentTypeRegistry
    }));
    core.savedObjects.registerType(_saved_object_types.casesTelemetrySavedObjectType);
    core.http.registerRouteHandlerContext(_constants.APP_ID, this.createRouteHandlerContext({
      core
    }));
    if (plugins.taskManager && plugins.usageCollection) {
      (0, _telemetry.createCasesTelemetry)({
        core,
        taskManager: plugins.taskManager,
        usageCollection: plugins.usageCollection,
        logger: this.logger,
        kibanaVersion: this.kibanaVersion
      });
    }
    const router = core.http.createRouter();
    const telemetryUsageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(_constants.APP_ID);
    (0, _register_routes.registerRoutes)({
      router,
      routes: [...(0, _get_external_routes.getExternalRoutes)(), ...(0, _get_internal_routes.getInternalRoutes)(this.userProfileService)],
      logger: this.logger,
      kibanaVersion: this.kibanaVersion,
      telemetryUsageCounter
    });
    plugins.licensing.featureUsage.register(_constants2.LICENSING_CASE_ASSIGNMENT_FEATURE, 'platinum');
    return {
      attachmentFramework: {
        registerExternalReference: externalReferenceAttachmentType => {
          this.externalReferenceAttachmentTypeRegistry.register(externalReferenceAttachmentType);
        },
        registerPersistableState: persistableStateAttachmentType => {
          this.persistableStateAttachmentTypeRegistry.register(persistableStateAttachmentType);
        }
      }
    };
  }
  start(core, plugins) {
    this.logger.debug(`Starting Case Workflow`);
    if (plugins.taskManager) {
      (0, _telemetry.scheduleCasesTelemetryTask)(plugins.taskManager, this.logger);
    }
    this.userProfileService.initialize({
      spaces: plugins.spaces,
      // securityPluginSetup will be set to a defined value in the setup() function
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      securityPluginSetup: this.securityPluginSetup,
      securityPluginStart: plugins.security,
      licensingPluginStart: plugins.licensing
    });
    this.clientFactory.initialize({
      // securityPluginSetup will be set to a defined value in the setup() function
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      securityPluginSetup: this.securityPluginSetup,
      securityPluginStart: plugins.security,
      spacesPluginStart: plugins.spaces,
      featuresPluginStart: plugins.features,
      actionsPluginStart: plugins.actions,
      licensingPluginStart: plugins.licensing,
      /**
       * Lens will be always defined as
       * it is declared as required plugin in kibana.json
       */
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      lensEmbeddableFactory: this.lensEmbeddableFactory,
      persistableStateAttachmentTypeRegistry: this.persistableStateAttachmentTypeRegistry,
      externalReferenceAttachmentTypeRegistry: this.externalReferenceAttachmentTypeRegistry,
      publicBaseUrl: core.http.basePath.publicBaseUrl,
      notifications: plugins.notifications
    });
    const client = core.elasticsearch.client;
    const getCasesClientWithRequest = async request => {
      return this.clientFactory.create({
        request,
        scopedClusterClient: client.asScoped(request).asCurrentUser,
        savedObjectsService: core.savedObjects
      });
    };
    return {
      getCasesClientWithRequest
    };
  }
  stop() {
    this.logger.debug(`Stopping Case Workflow`);
  }
}
exports.CasePlugin = CasePlugin;