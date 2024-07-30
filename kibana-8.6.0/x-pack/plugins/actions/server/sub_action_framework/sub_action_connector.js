"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubActionConnector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _axios = _interopRequireDefault(require("axios"));
var i18n = _interopRequireWildcard(require("./translations"));
var _axios_utils = require("../lib/axios_utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isObject = value => {
  return (0, _lodash.isPlainObject)(value);
};
const isAxiosError = error => error.isAxiosError;
class SubActionConnector {
  constructor(params) {
    (0, _defineProperty2.default)(this, "axiosInstance", void 0);
    (0, _defineProperty2.default)(this, "validProtocols", ['http:', 'https:']);
    (0, _defineProperty2.default)(this, "subActions", new Map());
    (0, _defineProperty2.default)(this, "configurationUtilities", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "connector", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "secrets", void 0);
    this.connector = params.connector;
    this.logger = params.logger;
    this.config = params.config;
    this.secrets = params.secrets;
    this.configurationUtilities = params.configurationUtilities;
    this.axiosInstance = _axios.default.create();
  }
  normalizeURL(url) {
    const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
    const replaceDoubleSlashesRegex = new RegExp('([^:]/)/+', 'g');
    return urlWithoutTrailingSlash.replace(replaceDoubleSlashesRegex, '$1');
  }
  normalizeData(data) {
    if ((0, _lodash.isEmpty)(data)) {
      return {};
    }
    return data;
  }
  assertURL(url) {
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.hostname) {
        throw new Error('URL must contain hostname');
      }
      if (!this.validProtocols.includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      throw new Error(`URL Error: ${error.message}`);
    }
  }
  ensureUriAllowed(url) {
    try {
      this.configurationUtilities.ensureUriAllowed(url);
    } catch (allowedListError) {
      throw new Error(i18n.ALLOWED_HOSTS_ERROR(allowedListError.message));
    }
  }
  getHeaders(headers) {
    return {
      ...headers,
      'Content-Type': 'application/json'
    };
  }
  validateResponse(responseSchema, data) {
    try {
      responseSchema.validate(data);
    } catch (resValidationError) {
      throw new Error(`Response validation failed (${resValidationError})`);
    }
  }
  registerSubAction(subAction) {
    this.subActions.set(subAction.name, subAction);
  }
  removeNullOrUndefinedFields(data) {
    if (isObject(data)) {
      return Object.fromEntries(Object.entries(data).filter(([_, value]) => value != null));
    }
    return data;
  }
  getSubActions() {
    return this.subActions;
  }
  async request({
    url,
    data,
    method = 'get',
    responseSchema,
    headers,
    ...config
  }) {
    try {
      this.assertURL(url);
      this.ensureUriAllowed(url);
      const normalizedURL = this.normalizeURL(url);
      this.logger.debug(`Request to external service. Connector Id: ${this.connector.id}. Connector type: ${this.connector.type} Method: ${method}. URL: ${normalizedURL}`);
      const res = await (0, _axios_utils.request)({
        ...config,
        axios: this.axiosInstance,
        url: normalizedURL,
        logger: this.logger,
        method,
        data: this.normalizeData(data),
        configurationUtilities: this.configurationUtilities,
        headers: this.getHeaders(headers)
      });
      this.validateResponse(responseSchema, res.data);
      return res;
    } catch (error) {
      if (isAxiosError(error)) {
        var _error$status, _error$response;
        this.logger.debug(`Request to external service failed. Connector Id: ${this.connector.id}. Connector type: ${this.connector.type}. Method: ${error.config.method}. URL: ${error.config.url}`);
        const errorMessage = `Status code: ${(_error$status = error.status) !== null && _error$status !== void 0 ? _error$status : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status}. Message: ${this.getResponseErrorMessage(error)}`;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
}
exports.SubActionConnector = SubActionConnector;