"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _operators = require("rxjs/operators");
var _licensing = require("../common/licensing");
var _analytics = require("./analytics");
var _anonymous_access = require("./anonymous_access");
var _audit = require("./audit");
var _authentication = require("./authentication");
var _authorization = require("./authorization");
var _config = require("./config");
var _deprecations = require("./deprecations");
var _elasticsearch = require("./elasticsearch");
var _feature_usage = require("./feature_usage");
var _features = require("./features");
var _routes = require("./routes");
var _saved_objects = require("./saved_objects");
var _session_management = require("./session_management");
var _spaces = require("./spaces");
var _usage_collector = require("./usage_collector");
var _user_profile = require("./user_profile");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents Security Plugin instance that will be managed by the Kibana plugin system.
 */
class SecurityPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "authorizationSetup", void 0);
    (0, _defineProperty2.default)(this, "auditSetup", void 0);
    (0, _defineProperty2.default)(this, "configSubscription", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "getConfig", () => {
      if (!this.config) {
        throw new Error('Config is not available.');
      }
      return this.config;
    });
    (0, _defineProperty2.default)(this, "session", void 0);
    (0, _defineProperty2.default)(this, "getSession", () => {
      if (!this.session) {
        throw new Error('Session is not available.');
      }
      return this.session;
    });
    (0, _defineProperty2.default)(this, "kibanaIndexName", void 0);
    (0, _defineProperty2.default)(this, "getKibanaIndexName", () => {
      if (!this.kibanaIndexName) {
        throw new Error('Kibana index name is not available.');
      }
      return this.kibanaIndexName;
    });
    (0, _defineProperty2.default)(this, "authenticationService", void 0);
    (0, _defineProperty2.default)(this, "authenticationStart", void 0);
    (0, _defineProperty2.default)(this, "getAuthentication", () => {
      if (!this.authenticationStart) {
        throw new Error(`authenticationStart is not registered!`);
      }
      return this.authenticationStart;
    });
    (0, _defineProperty2.default)(this, "featureUsageService", new _feature_usage.SecurityFeatureUsageService());
    (0, _defineProperty2.default)(this, "featureUsageServiceStart", void 0);
    (0, _defineProperty2.default)(this, "getFeatureUsageService", () => {
      if (!this.featureUsageServiceStart) {
        throw new Error(`featureUsageServiceStart is not registered!`);
      }
      return this.featureUsageServiceStart;
    });
    (0, _defineProperty2.default)(this, "auditService", void 0);
    (0, _defineProperty2.default)(this, "securityLicenseService", new _licensing.SecurityLicenseService());
    (0, _defineProperty2.default)(this, "analyticsService", void 0);
    (0, _defineProperty2.default)(this, "authorizationService", new _authorization.AuthorizationService());
    (0, _defineProperty2.default)(this, "elasticsearchService", void 0);
    (0, _defineProperty2.default)(this, "sessionManagementService", void 0);
    (0, _defineProperty2.default)(this, "anonymousAccessService", void 0);
    (0, _defineProperty2.default)(this, "anonymousAccessStart", void 0);
    (0, _defineProperty2.default)(this, "getAnonymousAccess", () => {
      if (!this.anonymousAccessStart) {
        throw new Error(`anonymousAccessStart is not registered!`);
      }
      return this.anonymousAccessStart;
    });
    (0, _defineProperty2.default)(this, "userProfileService", void 0);
    (0, _defineProperty2.default)(this, "userProfileStart", void 0);
    (0, _defineProperty2.default)(this, "getUserProfileService", () => {
      if (!this.userProfileStart) {
        throw new Error(`userProfileStart is not registered!`);
      }
      return this.userProfileStart;
    });
    this.initializerContext = initializerContext;
    this.logger = this.initializerContext.logger.get();
    this.authenticationService = new _authentication.AuthenticationService(this.initializerContext.logger.get('authentication'));
    this.auditService = new _audit.AuditService(this.initializerContext.logger.get('audit'));
    this.elasticsearchService = new _elasticsearch.ElasticsearchService(this.initializerContext.logger.get('elasticsearch'));
    this.sessionManagementService = new _session_management.SessionManagementService(this.initializerContext.logger.get('session'));
    this.anonymousAccessService = new _anonymous_access.AnonymousAccessService(this.initializerContext.logger.get('anonymous-access'), this.getConfig);
    this.userProfileService = new _user_profile.UserProfileService(this.initializerContext.logger.get('user-profile'));
    this.analyticsService = new _analytics.AnalyticsService(this.initializerContext.logger.get('analytics'));
  }
  setup(core, {
    features,
    licensing,
    taskManager,
    usageCollection,
    spaces
  }) {
    this.kibanaIndexName = core.savedObjects.getKibanaIndex();
    const config$ = this.initializerContext.config.create().pipe((0, _operators.map)(rawConfig => (0, _config.createConfig)(rawConfig, this.initializerContext.logger.get('config'), {
      isTLSEnabled: core.http.getServerInfo().protocol === 'https'
    })));
    this.configSubscription = config$.subscribe(config => {
      this.config = config;
    });
    const config = this.getConfig();
    const kibanaIndexName = this.getKibanaIndexName();

    // A subset of `start` services we need during `setup`.
    const startServicesPromise = core.getStartServices().then(([coreServices, depsServices]) => ({
      elasticsearch: coreServices.elasticsearch,
      features: depsServices.features
    }));
    const {
      license
    } = this.securityLicenseService.setup({
      license$: licensing.license$
    });
    _features.securityFeatures.forEach(securityFeature => features.registerElasticsearchFeature(securityFeature));
    this.elasticsearchService.setup({
      license,
      status: core.status
    });
    this.featureUsageService.setup({
      featureUsage: licensing.featureUsage
    });
    this.sessionManagementService.setup({
      config,
      http: core.http,
      taskManager
    });
    this.authenticationService.setup({
      http: core.http,
      elasticsearch: core.elasticsearch,
      config,
      license,
      buildNumber: this.initializerContext.env.packageInfo.buildNum
    });
    (0, _usage_collector.registerSecurityUsageCollector)({
      usageCollection,
      config,
      license
    });
    this.auditSetup = this.auditService.setup({
      license,
      config: config.audit,
      logging: core.logging,
      http: core.http,
      getSpaceId: request => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService.getSpaceId(request),
      getSID: request => this.getSession().getSID(request),
      getCurrentUser: request => this.getAuthentication().getCurrentUser(request),
      recordAuditLoggingUsage: () => this.getFeatureUsageService().recordAuditLoggingUsage()
    });
    this.anonymousAccessService.setup();
    this.authorizationSetup = this.authorizationService.setup({
      http: core.http,
      capabilities: core.capabilities,
      getClusterClient: () => startServicesPromise.then(({
        elasticsearch
      }) => elasticsearch.client),
      license,
      loggers: this.initializerContext.logger,
      kibanaIndexName,
      packageVersion: this.initializerContext.env.packageInfo.version,
      buildNumber: this.initializerContext.env.packageInfo.buildNum,
      getSpacesService: () => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService,
      features,
      getCurrentUser: request => this.getAuthentication().getCurrentUser(request)
    });
    this.userProfileService.setup({
      authz: this.authorizationSetup,
      license
    });
    (0, _spaces.setupSpacesClient)({
      spaces,
      audit: this.auditSetup,
      authz: this.authorizationSetup
    });
    (0, _saved_objects.setupSavedObjects)({
      audit: this.auditSetup,
      authz: this.authorizationSetup,
      savedObjects: core.savedObjects,
      getSpacesService: () => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService
    });
    this.registerDeprecations(core, license);
    (0, _routes.defineRoutes)({
      router: core.http.createRouter(),
      basePath: core.http.basePath,
      httpResources: core.http.resources,
      logger: this.initializerContext.logger.get('routes'),
      config,
      config$,
      authz: this.authorizationSetup,
      license,
      getSession: this.getSession,
      getFeatures: () => startServicesPromise.then(services => services.features.getKibanaFeatures()),
      getFeatureUsageService: this.getFeatureUsageService,
      getAuthenticationService: this.getAuthentication,
      getAnonymousAccessService: this.getAnonymousAccess,
      getUserProfileService: this.getUserProfileService,
      analyticsService: this.analyticsService.setup({
        analytics: core.analytics
      })
    });
    return Object.freeze({
      audit: this.auditSetup,
      authc: {
        getCurrentUser: request => this.getAuthentication().getCurrentUser(request)
      },
      authz: {
        actions: this.authorizationSetup.actions,
        checkPrivilegesWithRequest: this.authorizationSetup.checkPrivilegesWithRequest,
        checkPrivilegesDynamicallyWithRequest: this.authorizationSetup.checkPrivilegesDynamicallyWithRequest,
        checkSavedObjectsPrivilegesWithRequest: this.authorizationSetup.checkSavedObjectsPrivilegesWithRequest,
        mode: this.authorizationSetup.mode
      },
      license,
      privilegeDeprecationsService: (0, _deprecations.getPrivilegeDeprecationsService)({
        authz: this.authorizationSetup,
        getFeatures: () => startServicesPromise.then(services => services.features.getKibanaFeatures()),
        license,
        logger: this.logger.get('deprecations')
      })
    });
  }
  start(core, {
    cloud,
    features,
    licensing,
    taskManager,
    spaces
  }) {
    this.logger.debug('Starting plugin');
    this.featureUsageServiceStart = this.featureUsageService.start({
      featureUsage: licensing.featureUsage
    });
    const clusterClient = core.elasticsearch.client;
    const {
      watchOnlineStatus$
    } = this.elasticsearchService.start();
    const {
      session
    } = this.sessionManagementService.start({
      auditLogger: this.auditSetup.withoutRequest,
      elasticsearchClient: clusterClient.asInternalUser,
      kibanaIndexName: this.getKibanaIndexName(),
      online$: watchOnlineStatus$(),
      taskManager
    });
    this.session = session;
    this.userProfileStart = this.userProfileService.start({
      clusterClient,
      session
    });
    const config = this.getConfig();
    this.authenticationStart = this.authenticationService.start({
      audit: this.auditSetup,
      clusterClient,
      config,
      featureUsageService: this.featureUsageServiceStart,
      userProfileService: this.userProfileStart,
      http: core.http,
      loggers: this.initializerContext.logger,
      session,
      applicationName: this.authorizationSetup.applicationName,
      kibanaFeatures: features.getKibanaFeatures(),
      isElasticCloudDeployment: () => (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) === true
    });
    this.authorizationService.start({
      features,
      clusterClient,
      online$: watchOnlineStatus$()
    });
    this.anonymousAccessStart = this.anonymousAccessService.start({
      capabilities: core.capabilities,
      clusterClient,
      basePath: core.http.basePath,
      spaces: spaces === null || spaces === void 0 ? void 0 : spaces.spacesService
    });
    return Object.freeze({
      authc: {
        apiKeys: this.authenticationStart.apiKeys,
        getCurrentUser: this.authenticationStart.getCurrentUser
      },
      authz: {
        actions: this.authorizationSetup.actions,
        checkPrivilegesWithRequest: this.authorizationSetup.checkPrivilegesWithRequest,
        checkPrivilegesDynamicallyWithRequest: this.authorizationSetup.checkPrivilegesDynamicallyWithRequest,
        checkSavedObjectsPrivilegesWithRequest: this.authorizationSetup.checkSavedObjectsPrivilegesWithRequest,
        mode: this.authorizationSetup.mode
      },
      userProfiles: {
        getCurrent: this.userProfileStart.getCurrent,
        bulkGet: this.userProfileStart.bulkGet,
        suggest: this.userProfileStart.suggest
      }
    });
  }
  stop() {
    this.logger.debug('Stopping plugin');
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
      this.configSubscription = undefined;
    }
    if (this.featureUsageServiceStart) {
      this.featureUsageServiceStart = undefined;
    }
    if (this.authenticationStart) {
      this.authenticationStart = undefined;
    }
    if (this.anonymousAccessStart) {
      this.anonymousAccessStart = undefined;
    }
    this.securityLicenseService.stop();
    this.auditService.stop();
    this.authorizationService.stop();
    this.sessionManagementService.stop();
  }
  registerDeprecations(core, license) {
    const logger = this.logger.get('deprecations');
    (0, _deprecations.registerKibanaUserRoleDeprecation)({
      deprecationsService: core.deprecations,
      license,
      logger,
      packageInfo: this.initializerContext.env.packageInfo
    });
  }
}
exports.SecurityPlugin = SecurityPlugin;