"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPAuthenticationProvider = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _authentication_result = require("../authentication_result");
var _deauthentication_result = require("../deauthentication_result");
var _http_authentication = require("../http_authentication");
var _base = require("./base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Provider that supports request authentication via forwarding `Authorization` HTTP header to Elasticsearch.
 */
class HTTPAuthenticationProvider extends _base.BaseAuthenticationProvider {
  /**
   * Type of the provider.
   */

  /**
   * Set of the schemes (`Basic`, `Bearer` etc.) that provider expects to see within `Authorization`
   * HTTP header while authenticating request.
   */

  constructor(options, httpOptions) {
    var _httpOptions$supporte, _httpOptions$supporte2;
    super(options);
    (0, _defineProperty2.default)(this, "supportedSchemes", void 0);
    this.options = options;
    if (((_httpOptions$supporte = httpOptions === null || httpOptions === void 0 ? void 0 : (_httpOptions$supporte2 = httpOptions.supportedSchemes) === null || _httpOptions$supporte2 === void 0 ? void 0 : _httpOptions$supporte2.size) !== null && _httpOptions$supporte !== void 0 ? _httpOptions$supporte : 0) === 0) {
      throw new Error('Supported schemes should be specified');
    }
    this.supportedSchemes = new Set([...httpOptions.supportedSchemes].map(scheme => scheme.toLowerCase()));
  }

  /**
   * NOT SUPPORTED.
   */
  async login() {
    this.logger.debug('Login is not supported.');
    return _authentication_result.AuthenticationResult.notHandled();
  }

  /**
   * Performs request authentication using provided `Authorization` HTTP headers.
   * @param request Request instance.
   */
  async authenticate(request) {
    this.logger.debug(`Trying to authenticate user request to ${request.url.pathname}${request.url.search}.`);
    const authorizationHeader = _http_authentication.HTTPAuthorizationHeader.parseFromRequest(request);
    if (authorizationHeader == null) {
      this.logger.debug('Authorization header is not presented.');
      return _authentication_result.AuthenticationResult.notHandled();
    }
    if (!this.supportedSchemes.has(authorizationHeader.scheme.toLowerCase())) {
      this.logger.debug(`Unsupported authentication scheme: ${authorizationHeader.scheme}`);
      return _authentication_result.AuthenticationResult.notHandled();
    }
    try {
      const user = await this.getUser(request);
      this.logger.debug(`Request to ${request.url.pathname}${request.url.search} has been authenticated via authorization header with "${authorizationHeader.scheme}" scheme.`);
      return _authentication_result.AuthenticationResult.succeeded(user);
    } catch (err) {
      this.logger.debug(`Failed to authenticate request to ${request.url.pathname}${request.url.search} via authorization header with "${authorizationHeader.scheme}" scheme: ${err.message}`);
      return _authentication_result.AuthenticationResult.failed(err);
    }
  }

  /**
   * NOT SUPPORTED.
   */
  async logout() {
    this.logger.debug('Logout is not supported.');
    return _deauthentication_result.DeauthenticationResult.notHandled();
  }

  /**
   * Returns `null` since provider doesn't attach any additional `Authorization` HTTP headers to
   * successfully authenticated requests to Elasticsearch.
   */
  getHTTPAuthenticationScheme() {
    return null;
  }
}
exports.HTTPAuthenticationProvider = HTTPAuthenticationProvider;
(0, _defineProperty2.default)(HTTPAuthenticationProvider, "type", 'http');