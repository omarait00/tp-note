"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestContextFactory = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _constants = require("../common/constants");
var _client = require("./client");
var _common = require("./lib/timeline/utils/common");
var _authz = require("../common/endpoint/service/authz");
var _license = require("./lib/license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class RequestContextFactory {
  constructor(options) {
    (0, _defineProperty2.default)(this, "appClientFactory", void 0);
    this.options = options;
    this.appClientFactory = new _client.AppClientFactory();
  }
  async create(context, request) {
    var _startPlugins$spaces, _startPlugins$spaces$;
    const {
      options,
      appClientFactory
    } = this;
    const {
      config,
      core,
      plugins,
      endpointAppContextService,
      ruleExecutionLogService
    } = options;
    const {
      lists,
      ruleRegistry,
      security,
      licensing,
      osquery
    } = plugins;
    const [, startPlugins] = await core.getStartServices();
    const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
    appClientFactory.setup({
      getSpaceId: (_startPlugins$spaces = startPlugins.spaces) === null || _startPlugins$spaces === void 0 ? void 0 : (_startPlugins$spaces$ = _startPlugins$spaces.spacesService) === null || _startPlugins$spaces$ === void 0 ? void 0 : _startPlugins$spaces$.getSpaceId,
      config
    });
    let endpointAuthz;
    let fleetAuthz;

    // If Fleet is enabled, then get its Authz
    if (startPlugins.fleet) {
      var _await$context$fleet$, _await$context$fleet, _startPlugins$fleet;
      fleetAuthz = (_await$context$fleet$ = (_await$context$fleet = await context.fleet) === null || _await$context$fleet === void 0 ? void 0 : _await$context$fleet.authz) !== null && _await$context$fleet$ !== void 0 ? _await$context$fleet$ : await ((_startPlugins$fleet = startPlugins.fleet) === null || _startPlugins$fleet === void 0 ? void 0 : _startPlugins$fleet.authz.fromRequest(request));
    }
    const coreContext = await context.core;
    let endpointPermissions = (0, _authz.defaultEndpointPermissions)();
    if (endpointAppContextService.security) {
      const checkPrivileges = endpointAppContextService.security.authz.checkPrivilegesDynamicallyWithRequest(request);
      const {
        privileges
      } = await checkPrivileges({
        kibana: [endpointAppContextService.security.authz.actions.ui.get('siem', 'crud'), endpointAppContextService.security.authz.actions.ui.get('siem', 'show')]
      });
      endpointPermissions = (0, _authz.calculatePermissionsFromPrivileges)(privileges.kibana);
    }
    return {
      core: coreContext,
      get endpointAuthz() {
        // Lazy getter of endpoint Authz. No point in defining it if it is never used.
        if (!endpointAuthz) {
          // If no fleet (fleet plugin is optional in the configuration), then just turn off all permissions
          if (!startPlugins.fleet) {
            endpointAuthz = (0, _authz.getEndpointAuthzInitialState)();
          } else {
            var _security$authc$getCu, _security$authc$getCu2;
            const {
              endpointRbacEnabled,
              endpointRbacV1Enabled
            } = endpointAppContextService.experimentalFeatures;
            const userRoles = (_security$authc$getCu = security === null || security === void 0 ? void 0 : (_security$authc$getCu2 = security.authc.getCurrentUser(request)) === null || _security$authc$getCu2 === void 0 ? void 0 : _security$authc$getCu2.roles) !== null && _security$authc$getCu !== void 0 ? _security$authc$getCu : [];
            endpointAuthz = (0, _authz.calculateEndpointAuthz)(_license.licenseService, fleetAuthz, userRoles, endpointRbacEnabled || endpointRbacV1Enabled, endpointPermissions);
          }
        }
        return endpointAuthz;
      },
      getConfig: () => config,
      getFrameworkRequest: () => frameworkRequest,
      getAppClient: () => appClientFactory.create(request),
      getSpaceId: () => {
        var _startPlugins$spaces2, _startPlugins$spaces3;
        return ((_startPlugins$spaces2 = startPlugins.spaces) === null || _startPlugins$spaces2 === void 0 ? void 0 : (_startPlugins$spaces3 = _startPlugins$spaces2.spacesService) === null || _startPlugins$spaces3 === void 0 ? void 0 : _startPlugins$spaces3.getSpaceId(request)) || _constants.DEFAULT_SPACE_ID;
      },
      getRuleDataService: () => ruleRegistry.ruleDataService,
      getRacClient: startPlugins.ruleRegistry.getRacClientWithRequest,
      getRuleExecutionLog: (0, _lodash.memoize)(() => ruleExecutionLogService.createClientForRoutes({
        savedObjectsClient: coreContext.savedObjects.client,
        eventLogClient: startPlugins.eventLog.getClient(request)
      })),
      getExceptionListClient: () => {
        var _security$authc$getCu3;
        if (!lists) {
          return null;
        }
        const username = (security === null || security === void 0 ? void 0 : (_security$authc$getCu3 = security.authc.getCurrentUser(request)) === null || _security$authc$getCu3 === void 0 ? void 0 : _security$authc$getCu3.username) || 'elastic';
        return lists.getExceptionListClient(coreContext.savedObjects.client, username);
      },
      getInternalFleetServices: (0, _lodash.memoize)(() => endpointAppContextService.getInternalFleetServices()),
      getScopedFleetServices: (0, _lodash.memoize)(req => endpointAppContextService.getScopedFleetServices(req)),
      getQueryRuleAdditionalOptions: {
        licensing,
        osqueryCreateAction: osquery.osqueryCreateAction
      }
    };
  }
}
exports.RequestContextFactory = RequestContextFactory;