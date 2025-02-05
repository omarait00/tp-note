"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ELASTIC_CLOUD_SSO_REALM_NAME = exports.BaseAuthenticationProvider = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _std = require("@kbn/std");
var _authentication_result = require("../authentication_result");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Name of the Elastic Cloud built-in SSO realm.
 */
const ELASTIC_CLOUD_SSO_REALM_NAME = 'cloud-saml-kibana';

/**
 * Base class that all authentication providers should extend.
 */
exports.ELASTIC_CLOUD_SSO_REALM_NAME = ELASTIC_CLOUD_SSO_REALM_NAME;
class BaseAuthenticationProvider {
  /**
   * Type of the provider.
   */

  /**
   * Type of the provider. We use `this.constructor` trick to get access to the static `type` field
   * of the specific `BaseAuthenticationProvider` subclass.
   */

  /**
   * Logger instance bound to a specific provider context.
   */

  /**
   * Instantiates AuthenticationProvider.
   * @param options Provider options object.
   */
  constructor(options) {
    (0, _defineProperty2.default)(this, "type", this.constructor.type);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.options = options;
    this.logger = options.logger;
  }

  /**
   * Performs initial login request and creates user session. Provider isn't required to implement
   * this method if it doesn't support initial login request.
   * @param request Request instance.
   * @param loginAttempt Login attempt associated with the provider.
   * @param [state] Optional state object associated with the provider.
   */
  async login(request, loginAttempt, state) {
    return _authentication_result.AuthenticationResult.notHandled();
  }

  /**
   * Performs request authentication based on the session created during login or other information
   * associated with the request (e.g. `Authorization` HTTP header).
   * @param request Request instance.
   * @param [state] Optional state object associated with the provider.
   */

  /**
   * Queries Elasticsearch `_authenticate` endpoint to authenticate request and retrieve the user
   * information of authenticated user.
   * @param request Request instance.
   * @param [authHeaders] Optional `Headers` dictionary to send with the request.
   */
  async getUser(request, authHeaders = {}) {
    return this.authenticationInfoToAuthenticatedUser(
    // @ts-expect-error Metadata is defined as Record<string, any>
    await this.options.client.asScoped({
      headers: {
        ...request.headers,
        ...authHeaders
      }
    }).asCurrentUser.security.authenticate());
  }

  /**
   * Converts Elasticsearch Authentication result to a Kibana authenticated user.
   * @param authenticationInfo Result returned from the `_authenticate` operation.
   */
  authenticationInfoToAuthenticatedUser(authenticationInfo) {
    return (0, _std.deepFreeze)({
      ...authenticationInfo,
      authentication_provider: {
        type: this.type,
        name: this.options.name
      },
      elastic_cloud_user: this.options.isElasticCloudDeployment() && authenticationInfo.authentication_realm.type === 'saml' && authenticationInfo.authentication_realm.name === ELASTIC_CLOUD_SSO_REALM_NAME
    });
  }
}
exports.BaseAuthenticationProvider = BaseAuthenticationProvider;
(0, _defineProperty2.default)(BaseAuthenticationProvider, "type", void 0);