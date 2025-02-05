"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpsgenieConnector = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _server = require("../../../../../actions/server");
var _lodash = require("lodash");
var _common = require("../../../../common");
var _schema = require("./schema");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class OpsgenieConnector extends _server.SubActionConnector {
  constructor(params) {
    super(params);
    this.registerSubAction({
      method: this.createAlert.name,
      name: _common.OpsgenieSubActions.CreateAlert,
      schema: _schema.CreateAlertParamsSchema
    });
    this.registerSubAction({
      method: this.closeAlert.name,
      name: _common.OpsgenieSubActions.CloseAlert,
      schema: _schema.CloseAlertParamsSchema
    });
  }
  getResponseErrorMessage(error) {
    var _ref, _error$response$data$, _error$response, _error$response2, _error$response2$data;
    const mainMessage = (_ref = (_error$response$data$ = (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data.message) !== null && _error$response$data$ !== void 0 ? _error$response$data$ : error.message) !== null && _ref !== void 0 ? _ref : i18n.UNKNOWN_ERROR;
    if (((_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : (_error$response2$data = _error$response2.data) === null || _error$response2$data === void 0 ? void 0 : _error$response2$data.errors) != null) {
      var _error$response3, _error$response3$data;
      const message = this.getDetailedErrorMessage((_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : (_error$response3$data = _error$response3.data) === null || _error$response3$data === void 0 ? void 0 : _error$response3$data.errors);
      if (!(0, _lodash.isEmpty)(message)) {
        return `${mainMessage}: ${message}`;
      }
    }
    return mainMessage;
  }

  /**
   * When testing invalid requests with Opsgenie the response seems to take the form:
   * {
   *   ['field that is invalid']: 'message about what the issue is'
   * }
   *
   * e.g.
   *
   * {
   *   "message": "Message can not be empty.",
   *   "username": "must be a well-formed email address"
   * }
   *
   * So we'll just stringify it.
   */
  getDetailedErrorMessage(errorField) {
    try {
      return JSON.stringify(errorField);
    } catch (error) {
      return;
    }
  }
  async createAlert(params) {
    const res = await this.request({
      method: 'post',
      url: this.concatPathToURL('v2/alerts').toString(),
      data: {
        ...params,
        ...OpsgenieConnector.createAliasObj(params.alias)
      },
      headers: this.createHeaders(),
      responseSchema: _schema.Response
    });
    return res.data;
  }
  static createAliasObj(alias) {
    if (!alias) {
      return {};
    }
    const newAlias = OpsgenieConnector.createAlias(alias);
    return {
      alias: newAlias
    };
  }
  static createAlias(alias) {
    // opsgenie v2 requires that the alias length be no more than 512 characters
    // see their docs for more details https://docs.opsgenie.com/docs/alert-api#create-alert
    if (alias.length <= 512) {
      return alias;
    }

    // To give preference to avoiding collisions we're using sha256 over of md5 but we are compromising on speed a bit here
    const hasher = _crypto.default.createHash('sha256');
    const sha256Hash = hasher.update(alias);
    return `sha-${sha256Hash.digest('hex')}`;
  }
  createHeaders() {
    return {
      Authorization: `GenieKey ${this.secrets.apiKey}`
    };
  }
  async closeAlert(params) {
    const newAlias = OpsgenieConnector.createAlias(params.alias);
    const fullURL = this.concatPathToURL(`v2/alerts/${newAlias}/close`);
    fullURL.searchParams.set('identifierType', 'alias');
    const {
      alias,
      ...paramsWithoutAlias
    } = params;
    const res = await this.request({
      method: 'post',
      url: fullURL.toString(),
      data: paramsWithoutAlias,
      headers: this.createHeaders(),
      responseSchema: _schema.Response
    });
    return res.data;
  }
  concatPathToURL(path) {
    const fullURL = new URL(path, this.config.apiUrl);
    return fullURL;
  }
}
exports.OpsgenieConnector = OpsgenieConnector;