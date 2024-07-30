"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lruCache = _interopRequireDefault(require("lru-cache"));
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _server = require("../../../../src/core/server");
var _assets = require("../../rule_registry/common/assets");
var _technical_rule_field_map = require("../../rule_registry/common/assets/field_maps/technical_rule_field_map");
var _mapping_from_field_map = require("../../rule_registry/common/mapping_from_field_map");
var _server2 = require("../../rule_registry/server");
var _rule_types = require("./lib/detection_engine/rule_types");
var _routes = require("./routes");
var _limited_concurrency = require("./routes/limited_concurrency");
var _artifacts = require("./endpoint/lib/artifacts");
var _metadata = require("./endpoint/lib/metadata");
var _saved_objects = require("./saved_objects");
var _client = require("./client");
var _config = require("./config");
var _ui_settings = require("./ui_settings");
var _constants = require("../common/constants");
var _metadata2 = require("./endpoint/routes/metadata");
var _policy = require("./endpoint/routes/policy");
var _actions = require("./endpoint/routes/actions");
var _services = require("./endpoint/services");
var _endpoint_app_context_services = require("./endpoint/endpoint_app_context_services");
var _usage = require("./usage");
var _security_solution = require("./search_strategy/security_solution");
var _sender = require("./lib/telemetry/sender");
var _receiver = require("./lib/telemetry/receiver");
var _license = require("./lib/license");
var _license_watch = require("./endpoint/lib/policy/license_watch");
var _migrate_artifacts_to_fleet = require("./endpoint/lib/artifacts/migrate_artifacts_to_fleet");
var _signal_aad_mapping = _interopRequireDefault(require("./lib/detection_engine/routes/index/signal_aad_mapping.json"));
var _preview_policy = _interopRequireDefault(require("./lib/detection_engine/routes/index/preview_policy.json"));
var _rule_monitoring = require("./lib/detection_engine/rule_monitoring");
var _features = require("./features");
var _metadata3 = require("./endpoint/services/metadata");
var _rule_actions_legacy = require("./lib/detection_engine/rule_actions_legacy");
var _create_security_rule_type_wrapper = require("./lib/detection_engine/rule_types/create_security_rule_type_wrapper");
var _request_context_factory = require("./request_context_factory");
var _field_maps = require("../common/field_maps");
var _fleet = require("./endpoint/services/fleet");
var _feature_usage = require("./endpoint/services/feature_usage");
var _helpers = require("./lib/telemetry/helpers");
var _artifact = require("./lib/telemetry/artifact");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

class Plugin {
  // TODO: can we create ListPluginStart?

  constructor(context) {
    (0, _defineProperty2.default)(this, "pluginContext", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "appClientFactory", void 0);
    (0, _defineProperty2.default)(this, "endpointAppContextService", new _endpoint_app_context_services.EndpointAppContextService());
    (0, _defineProperty2.default)(this, "telemetryReceiver", void 0);
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
    (0, _defineProperty2.default)(this, "lists", void 0);
    (0, _defineProperty2.default)(this, "licensing$", void 0);
    (0, _defineProperty2.default)(this, "policyWatcher", void 0);
    (0, _defineProperty2.default)(this, "manifestTask", void 0);
    (0, _defineProperty2.default)(this, "checkMetadataTransformsTask", void 0);
    (0, _defineProperty2.default)(this, "artifactsCache", void 0);
    (0, _defineProperty2.default)(this, "telemetryUsageCounter", void 0);
    (0, _defineProperty2.default)(this, "kibanaIndex", void 0);
    this.pluginContext = context;
    this.config = (0, _config.createConfig)(context);
    this.logger = context.logger.get();
    this.appClientFactory = new _client.AppClientFactory();

    // Cache up to three artifacts with a max retention of 5 mins each
    this.artifactsCache = new _lruCache.default({
      max: 3,
      maxAge: 1000 * 60 * 5
    });
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger);
    this.telemetryReceiver = new _receiver.TelemetryReceiver(this.logger);
    this.logger.debug('plugin initialized');
  }
  setup(core, plugins) {
    var _plugins$usageCollect, _plugins$encryptedSav, _plugins$cloud$isClou;
    this.logger.debug('plugin setup');
    const {
      appClientFactory,
      pluginContext,
      config,
      logger
    } = this;
    const experimentalFeatures = config.experimentalFeatures;
    this.kibanaIndex = core.savedObjects.getKibanaIndex();
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    (0, _ui_settings.initUiSettings)(core.uiSettings, experimentalFeatures);
    const ruleExecutionLogService = (0, _rule_monitoring.createRuleExecutionLogService)(config, logger, core, plugins);
    ruleExecutionLogService.registerEventLogProvider();
    const queryRuleAdditionalOptions = {
      licensing: plugins.licensing,
      osqueryCreateAction: plugins.osquery.osqueryCreateAction
    };
    const requestContextFactory = new _request_context_factory.RequestContextFactory({
      config,
      logger,
      core,
      plugins,
      endpointAppContextService: this.endpointAppContextService,
      ruleExecutionLogService
    });
    const router = core.http.createRouter();
    core.http.registerRouteHandlerContext(_constants.APP_ID, (context, request) => requestContextFactory.create(context, request));
    const endpointContext = {
      logFactory: pluginContext.logger,
      service: this.endpointAppContextService,
      config: () => Promise.resolve(config),
      experimentalFeatures
    };
    this.endpointAppContextService.setup({
      securitySolutionRequestContextFactory: requestContextFactory
    });
    (0, _usage.initUsageCollectors)({
      core,
      eventLogIndex: plugins.eventLog.getIndexPattern(),
      signalsIndex: _constants.DEFAULT_ALERTS_INDEX,
      ml: plugins.ml,
      usageCollection: plugins.usageCollection,
      logger
    });
    this.telemetryUsageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(_constants.APP_ID);
    const {
      ruleDataService
    } = plugins.ruleRegistry;
    let ruleDataClient = null;
    let previewRuleDataClient = null;

    // rule options are used both to create and preview rules.
    const ruleOptions = {
      experimentalFeatures,
      logger: this.logger,
      ml: plugins.ml,
      eventsTelemetry: this.telemetryEventsSender,
      version: pluginContext.env.packageInfo.version
    };
    const aliasesFieldMap = {};
    Object.entries(_signal_aad_mapping.default).forEach(([key, value]) => {
      aliasesFieldMap[key] = {
        type: 'alias',
        path: value
      };
    });
    const ruleDataServiceOptions = {
      feature: _constants.SERVER_APP_ID,
      registrationContext: 'security',
      dataset: _server2.Dataset.alerts,
      componentTemplateRefs: [_assets.ECS_COMPONENT_TEMPLATE_NAME],
      componentTemplates: [{
        name: 'mappings',
        mappings: (0, _mapping_from_field_map.mappingFromFieldMap)({
          ..._technical_rule_field_map.technicalRuleFieldMap,
          ..._field_maps.alertsFieldMap,
          ..._field_maps.rulesFieldMap,
          ...aliasesFieldMap
        }, false)
      }],
      secondaryAlias: config.signalsIndex
    };
    ruleDataClient = ruleDataService.initializeIndex(ruleDataServiceOptions);
    const previewIlmPolicy = _preview_policy.default.policy;
    previewRuleDataClient = ruleDataService.initializeIndex({
      ...ruleDataServiceOptions,
      additionalPrefix: '.preview',
      ilmPolicy: previewIlmPolicy,
      secondaryAlias: undefined
    });
    const securityRuleTypeOptions = {
      lists: plugins.lists,
      logger: this.logger,
      config: this.config,
      ruleDataClient,
      ruleExecutionLoggerFactory: ruleExecutionLogService.createClientForExecutors,
      version: pluginContext.env.packageInfo.version
    };
    const securityRuleTypeWrapper = (0, _create_security_rule_type_wrapper.createSecurityRuleTypeWrapper)(securityRuleTypeOptions);
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createEqlAlertType)(ruleOptions)));
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createQueryAlertType)({
      ...ruleOptions,
      ...queryRuleAdditionalOptions,
      id: _securitysolutionRules.SAVED_QUERY_RULE_TYPE_ID,
      name: 'Saved Query Rule'
    })));
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createIndicatorMatchAlertType)(ruleOptions)));
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createMlAlertType)(ruleOptions)));
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createQueryAlertType)({
      ...ruleOptions,
      ...queryRuleAdditionalOptions,
      id: _securitysolutionRules.QUERY_RULE_TYPE_ID,
      name: 'Custom Query Rule'
    })));
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createThresholdAlertType)(ruleOptions)));
    plugins.alerting.registerType(securityRuleTypeWrapper((0, _rule_types.createNewTermsAlertType)(ruleOptions)));

    // TODO We need to get the endpoint routes inside of initRoutes
    (0, _routes.initRoutes)(router, config, ((_plugins$encryptedSav = plugins.encryptedSavedObjects) === null || _plugins$encryptedSav === void 0 ? void 0 : _plugins$encryptedSav.canEncrypt) === true, plugins.security, this.telemetryEventsSender, plugins.ml, ruleDataService, logger, ruleDataClient, ruleOptions, core.getStartServices, securityRuleTypeOptions, previewRuleDataClient, this.telemetryReceiver);
    (0, _metadata2.registerEndpointRoutes)(router, endpointContext);
    (0, _limited_concurrency.registerLimitedConcurrencyRoutes)(core);
    (0, _policy.registerPolicyRoutes)(router, endpointContext);
    (0, _actions.registerActionRoutes)(router, endpointContext);
    const ruleTypes = [_constants.LEGACY_NOTIFICATIONS_ID, _securitysolutionRules.EQL_RULE_TYPE_ID, _securitysolutionRules.INDICATOR_RULE_TYPE_ID, _securitysolutionRules.ML_RULE_TYPE_ID, _securitysolutionRules.QUERY_RULE_TYPE_ID, _securitysolutionRules.SAVED_QUERY_RULE_TYPE_ID, _securitysolutionRules.THRESHOLD_RULE_TYPE_ID, _securitysolutionRules.NEW_TERMS_RULE_TYPE_ID];
    plugins.features.registerKibanaFeature((0, _features.getKibanaPrivilegesFeaturePrivileges)(ruleTypes, experimentalFeatures));
    plugins.features.registerKibanaFeature((0, _features.getCasesKibanaFeature)());
    if (plugins.alerting != null) {
      const ruleNotificationType = (0, _rule_actions_legacy.legacyRulesNotificationAlertType)({
        logger
      });
      if ((0, _rule_actions_legacy.legacyIsNotificationAlertExecutor)(ruleNotificationType)) {
        plugins.alerting.registerType(ruleNotificationType);
      }
    }
    const exceptionListsSetupEnabled = () => {
      return plugins.taskManager && plugins.lists;
    };
    if (exceptionListsSetupEnabled()) {
      this.lists = plugins.lists;
      this.manifestTask = new _artifacts.ManifestTask({
        endpointAppContext: endpointContext,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        taskManager: plugins.taskManager
      });
    }
    core.getStartServices().then(([_, depsStart]) => {
      var _depsStart$spaces, _depsStart$spaces$spa, _depsStart$spaces2, _depsStart$spaces2$sp;
      appClientFactory.setup({
        getSpaceId: (_depsStart$spaces = depsStart.spaces) === null || _depsStart$spaces === void 0 ? void 0 : (_depsStart$spaces$spa = _depsStart$spaces.spacesService) === null || _depsStart$spaces$spa === void 0 ? void 0 : _depsStart$spaces$spa.getSpaceId,
        config
      });
      const securitySolutionSearchStrategy = (0, _security_solution.securitySolutionSearchStrategyProvider)(depsStart.data, endpointContext, (_depsStart$spaces2 = depsStart.spaces) === null || _depsStart$spaces2 === void 0 ? void 0 : (_depsStart$spaces2$sp = _depsStart$spaces2.spacesService) === null || _depsStart$spaces2$sp === void 0 ? void 0 : _depsStart$spaces2$sp.getSpaceId, ruleDataClient);
      plugins.data.search.registerSearchStrategy('securitySolutionSearchStrategy', securitySolutionSearchStrategy);
    });
    (0, _helpers.setIsElasticCloudDeployment)((_plugins$cloud$isClou = plugins.cloud.isCloudEnabled) !== null && _plugins$cloud$isClou !== void 0 ? _plugins$cloud$isClou : false);
    this.telemetryEventsSender.setup(this.telemetryReceiver, plugins.telemetry, plugins.taskManager, this.telemetryUsageCounter);
    this.checkMetadataTransformsTask = new _metadata.CheckMetadataTransformsTask({
      endpointAppContext: endpointContext,
      core,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      taskManager: plugins.taskManager
    });
    _feature_usage.featureUsageService.setup(plugins.licensing);
    return {};
  }
  start(core, plugins) {
    var _plugins$fleet, _this$lists;
    const {
      config,
      logger
    } = this;
    const savedObjectsClient = new _server.SavedObjectsClient(core.savedObjects.createInternalRepository());
    const registerIngestCallback = (_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.registerExternalCallback;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const exceptionListClient = this.lists.getExceptionListClient(savedObjectsClient, 'kibana',
    // execution of Lists plugin server extension points callbacks should be turned off
    // here because most of the uses of this client will be in contexts where some endpoint
    // validations (specifically those around authz) can not be done (due ot the lack of a `KibanaRequest`
    // from where authz can be derived)
    false);
    const {
      authz,
      agentService,
      packageService,
      packagePolicyService,
      agentPolicyService
    } =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    plugins.fleet;
    let manifestManager;
    this.licensing$ = plugins.licensing.license$;
    if (this.lists && plugins.taskManager && plugins.fleet) {
      // Exceptions, Artifacts and Manifests start
      const taskManager = plugins.taskManager;
      const artifactClient = new _services.EndpointArtifactClient(plugins.fleet.createArtifactsClient('endpoint'));
      manifestManager = new _services.ManifestManager({
        savedObjectsClient,
        artifactClient,
        exceptionListClient,
        packagePolicyService: plugins.fleet.packagePolicyService,
        logger,
        cache: this.artifactsCache,
        experimentalFeatures: config.experimentalFeatures
      });

      // Migrate artifacts to fleet and then start the minifest task after that is done
      plugins.fleet.fleetSetupCompleted().then(() => {
        (0, _migrate_artifacts_to_fleet.migrateArtifactsToFleet)(savedObjectsClient, artifactClient, logger).finally(() => {
          logger.info('Dependent plugin setup complete - Starting ManifestTask');
          if (this.manifestTask) {
            this.manifestTask.start({
              taskManager
            });
          } else {
            logger.error(new Error('User artifacts task not available.'));
          }
        });
      });

      // License related start
      _license.licenseService.start(this.licensing$);
      _feature_usage.featureUsageService.start(plugins.licensing);
      this.policyWatcher = new _license_watch.PolicyWatcher(plugins.fleet.packagePolicyService, core.savedObjects, core.elasticsearch, logger);
      this.policyWatcher.start(_license.licenseService);
    }
    this.endpointAppContextService.start({
      fleetAuthzService: authz,
      agentService,
      packageService,
      packagePolicyService,
      agentPolicyService,
      endpointMetadataService: new _metadata3.EndpointMetadataService(core.savedObjects, agentPolicyService, packagePolicyService, logger),
      endpointFleetServicesFactory: new _fleet.EndpointFleetServicesFactory({
        agentService,
        packageService,
        packagePolicyService,
        agentPolicyService
      }, core.savedObjects),
      security: plugins.security,
      alerting: plugins.alerting,
      config: this.config,
      cases: plugins.cases,
      logger,
      manifestManager,
      registerIngestCallback,
      licenseService: _license.licenseService,
      exceptionListsClient: exceptionListClient,
      registerListsServerExtension: (_this$lists = this.lists) === null || _this$lists === void 0 ? void 0 : _this$lists.registerExtension,
      featureUsageService: _feature_usage.featureUsageService,
      experimentalFeatures: config.experimentalFeatures
    });
    this.telemetryReceiver.start(core,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.kibanaIndex, _constants.DEFAULT_ALERTS_INDEX, this.endpointAppContextService, exceptionListClient);
    _artifact.artifactService.start(this.telemetryReceiver);
    this.telemetryEventsSender.start(plugins.telemetry, plugins.taskManager, this.telemetryReceiver);
    if (plugins.taskManager) {
      var _this$checkMetadataTr;
      (_this$checkMetadataTr = this.checkMetadataTransformsTask) === null || _this$checkMetadataTr === void 0 ? void 0 : _this$checkMetadataTr.start({
        taskManager: plugins.taskManager
      });
    }
    return {};
  }
  stop() {
    var _this$policyWatcher;
    this.logger.debug('Stopping plugin');
    this.telemetryEventsSender.stop();
    this.endpointAppContextService.stop();
    (_this$policyWatcher = this.policyWatcher) === null || _this$policyWatcher === void 0 ? void 0 : _this$policyWatcher.stop();
    _license.licenseService.stop();
  }
}
exports.Plugin = Plugin;