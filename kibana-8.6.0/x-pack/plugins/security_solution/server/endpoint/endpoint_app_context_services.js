"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointAppContextService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _fleet_integration = require("../fleet_integration/fleet_integration");
var _errors = require("./errors");
var _lists_integration = require("../lists_integration");
var _authz = require("../../common/endpoint/service/authz");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A singleton that holds shared services that are initialized during the start up phase
 * of the plugin lifecycle. And stop during the stop phase, if needed.
 */
class EndpointAppContextService {
  constructor() {
    (0, _defineProperty2.default)(this, "setupDependencies", null);
    (0, _defineProperty2.default)(this, "startDependencies", null);
    (0, _defineProperty2.default)(this, "fleetServicesFactory", null);
    (0, _defineProperty2.default)(this, "security", void 0);
  }
  setup(dependencies) {
    this.setupDependencies = dependencies;
  }
  start(dependencies) {
    if (!this.setupDependencies) {
      throw new _errors.EndpointAppContentServicesNotSetUpError();
    }
    this.startDependencies = dependencies;
    this.security = dependencies.security;
    this.fleetServicesFactory = dependencies.endpointFleetServicesFactory;
    if (dependencies.registerIngestCallback && dependencies.manifestManager && dependencies.packagePolicyService) {
      const {
        registerIngestCallback,
        logger,
        manifestManager,
        alerting,
        licenseService,
        exceptionListsClient,
        featureUsageService,
        endpointMetadataService
      } = dependencies;
      registerIngestCallback('packagePolicyCreate', (0, _fleet_integration.getPackagePolicyCreateCallback)(logger, manifestManager, this.setupDependencies.securitySolutionRequestContextFactory, alerting, licenseService, exceptionListsClient));
      registerIngestCallback('packagePolicyPostCreate', (0, _fleet_integration.getPackagePolicyPostCreateCallback)(logger, exceptionListsClient));
      registerIngestCallback('packagePolicyUpdate', (0, _fleet_integration.getPackagePolicyUpdateCallback)(logger, licenseService, featureUsageService, endpointMetadataService));
      registerIngestCallback('postPackagePolicyDelete', (0, _fleet_integration.getPackagePolicyDeleteCallback)(exceptionListsClient));
    }
    if (this.startDependencies.registerListsServerExtension) {
      const {
        registerListsServerExtension
      } = this.startDependencies;
      (0, _lists_integration.registerListsPluginEndpointExtensionPoints)(registerListsServerExtension, this);
    }
  }
  stop() {}
  getFleetAuthzService() {
    var _this$startDependenci;
    if (!((_this$startDependenci = this.startDependencies) !== null && _this$startDependenci !== void 0 && _this$startDependenci.fleetAuthzService)) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.startDependencies.fleetAuthzService;
  }
  async getEndpointAuthz(request) {
    var _this$security$authc$, _this$security, _this$security$authc$2;
    const fleetAuthz = await this.getFleetAuthzService().fromRequest(request);
    const userRoles = (_this$security$authc$ = (_this$security = this.security) === null || _this$security === void 0 ? void 0 : (_this$security$authc$2 = _this$security.authc.getCurrentUser(request)) === null || _this$security$authc$2 === void 0 ? void 0 : _this$security$authc$2.roles) !== null && _this$security$authc$ !== void 0 ? _this$security$authc$ : [];
    const {
      endpointRbacEnabled,
      endpointRbacV1Enabled
    } = this.experimentalFeatures;
    let endpointPermissions = (0, _authz.defaultEndpointPermissions)();
    if (this.security) {
      const checkPrivileges = this.security.authz.checkPrivilegesDynamicallyWithRequest(request);
      const {
        privileges
      } = await checkPrivileges({
        kibana: [this.security.authz.actions.ui.get('siem', 'crud'), this.security.authz.actions.ui.get('siem', 'show')]
      });
      endpointPermissions = (0, _authz.calculatePermissionsFromPrivileges)(privileges.kibana);
    }
    return (0, _authz.calculateEndpointAuthz)(this.getLicenseService(), fleetAuthz, userRoles, endpointRbacEnabled || endpointRbacV1Enabled, endpointPermissions);
  }
  getEndpointMetadataService() {
    if (this.startDependencies == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.startDependencies.endpointMetadataService;
  }
  getScopedFleetServices(req) {
    if (this.fleetServicesFactory === null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.fleetServicesFactory.asScoped(req);
  }
  getInternalFleetServices() {
    if (this.fleetServicesFactory === null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.fleetServicesFactory.asInternalUser();
  }

  /** @deprecated use `getScopedFleetServices()` instead */
  getAgentService() {
    var _this$startDependenci2;
    return (_this$startDependenci2 = this.startDependencies) === null || _this$startDependenci2 === void 0 ? void 0 : _this$startDependenci2.agentService;
  }

  /** @deprecated use `getScopedFleetServices()` instead */
  getAgentPolicyService() {
    var _this$startDependenci3;
    return (_this$startDependenci3 = this.startDependencies) === null || _this$startDependenci3 === void 0 ? void 0 : _this$startDependenci3.agentPolicyService;
  }
  getManifestManager() {
    var _this$startDependenci4;
    return (_this$startDependenci4 = this.startDependencies) === null || _this$startDependenci4 === void 0 ? void 0 : _this$startDependenci4.manifestManager;
  }
  getLicenseService() {
    if (this.startDependencies == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.startDependencies.licenseService;
  }
  async getCasesClient(req) {
    var _this$startDependenci5;
    if (((_this$startDependenci5 = this.startDependencies) === null || _this$startDependenci5 === void 0 ? void 0 : _this$startDependenci5.cases) == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.startDependencies.cases.getCasesClientWithRequest(req);
  }
  getFeatureUsageService() {
    if (this.startDependencies == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.startDependencies.featureUsageService;
  }
  get experimentalFeatures() {
    if (this.startDependencies == null) {
      throw new _errors.EndpointAppContentServicesNotStartedError();
    }
    return this.startDependencies.experimentalFeatures;
  }
}
exports.EndpointAppContextService = EndpointAppContextService;