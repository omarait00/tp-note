"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Actions", {
  enumerable: true,
  get: function () {
    return _actions.Actions;
  }
});
exports.AuthorizationService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _querystring = _interopRequireDefault(require("querystring"));
var _react = _interopRequireDefault(require("react"));
var _server = require("react-dom/server");
var _constants = require("../../common/constants");
var _authentication = require("../authentication");
var _actions = require("./actions");
var _api_authorization = require("./api_authorization");
var _app_authorization = require("./app_authorization");
var _check_privileges = require("./check_privileges");
var _check_privileges_dynamically = require("./check_privileges_dynamically");
var _check_saved_objects_privileges = require("./check_saved_objects_privileges");
var _disable_ui_capabilities = require("./disable_ui_capabilities");
var _mode = require("./mode");
var _privileges = require("./privileges");
var _register_privileges_with_cluster = require("./register_privileges_with_cluster");
var _reset_session_page = require("./reset_session_page");
var _validate_feature_privileges = require("./validate_feature_privileges");
var _validate_reserved_privileges = require("./validate_reserved_privileges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AuthorizationService {
  constructor() {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "applicationName", void 0);
    (0, _defineProperty2.default)(this, "privileges", void 0);
    (0, _defineProperty2.default)(this, "statusSubscription", void 0);
  }
  setup({
    http,
    capabilities,
    packageVersion,
    buildNumber,
    getClusterClient,
    license,
    loggers,
    features,
    kibanaIndexName,
    getSpacesService,
    getCurrentUser
  }) {
    this.logger = loggers.get('authorization');
    this.applicationName = `${_constants.APPLICATION_PREFIX}${kibanaIndexName}`;
    const mode = (0, _mode.authorizationModeFactory)(license);
    const actions = new _actions.Actions(packageVersion);
    this.privileges = (0, _privileges.privilegesFactory)(actions, features, license);
    const {
      checkPrivilegesWithRequest,
      checkUserProfilesPrivileges
    } = (0, _check_privileges.checkPrivilegesFactory)(actions, getClusterClient, this.applicationName);
    const authz = {
      actions,
      applicationName: this.applicationName,
      mode,
      privileges: this.privileges,
      checkPrivilegesWithRequest,
      checkUserProfilesPrivileges,
      checkPrivilegesDynamicallyWithRequest: (0, _check_privileges_dynamically.checkPrivilegesDynamicallyWithRequestFactory)(checkPrivilegesWithRequest, getSpacesService),
      checkSavedObjectsPrivilegesWithRequest: (0, _check_saved_objects_privileges.checkSavedObjectsPrivilegesWithRequestFactory)(checkPrivilegesWithRequest, getSpacesService)
    };
    capabilities.registerSwitcher(async (request, uiCapabilities) => {
      // If we have a license which doesn't enable security, or we're a legacy user we shouldn't
      // disable any ui capabilities
      if (!mode.useRbacForRequest(request)) {
        return uiCapabilities;
      }
      const disableUICapabilities = (0, _disable_ui_capabilities.disableUICapabilitiesFactory)(request, features.getKibanaFeatures(), features.getElasticsearchFeatures(), this.logger, authz, getCurrentUser(request));
      if (!request.auth.isAuthenticated) {
        return disableUICapabilities.all(uiCapabilities);
      }
      return await disableUICapabilities.usingPrivileges(uiCapabilities);
    });
    (0, _api_authorization.initAPIAuthorization)(http, authz, loggers.get('api-authorization'));
    (0, _app_authorization.initAppAuthorization)(http, authz, loggers.get('app-authorization'), features);
    http.registerOnPreResponse((request, preResponse, toolkit) => {
      if (preResponse.statusCode === 403 && (0, _authentication.canRedirectRequest)(request)) {
        const next = `${http.basePath.get(request)}${request.url.pathname}${request.url.search}`;
        const body = (0, _server.renderToString)( /*#__PURE__*/_react.default.createElement(_reset_session_page.ResetSessionPage, {
          buildNumber: buildNumber,
          basePath: http.basePath,
          logoutUrl: http.basePath.prepend(`/api/security/logout?${_querystring.default.stringify({
            next
          })}`)
        }));
        return toolkit.render({
          body,
          headers: {
            'Content-Security-Policy': http.csp.header
          }
        });
      }
      return toolkit.next();
    });
    return authz;
  }
  start({
    clusterClient,
    features,
    online$
  }) {
    const allFeatures = features.getKibanaFeatures();
    (0, _validate_feature_privileges.validateFeaturePrivileges)(allFeatures);
    (0, _validate_reserved_privileges.validateReservedPrivileges)(allFeatures);
    this.statusSubscription = online$.subscribe(async ({
      scheduleRetry
    }) => {
      try {
        await (0, _register_privileges_with_cluster.registerPrivilegesWithCluster)(this.logger, this.privileges, this.applicationName, clusterClient);
      } catch (err) {
        scheduleRetry();
      }
    });
  }
  stop() {
    if (this.statusSubscription !== undefined) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }
  }
}
exports.AuthorizationService = AuthorizationService;