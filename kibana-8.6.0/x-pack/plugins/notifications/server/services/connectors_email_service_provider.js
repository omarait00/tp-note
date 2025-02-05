"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmailServiceProvider = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _licensed_email_service = require("./licensed_email_service");
var _connectors_email_service = require("./connectors_email_service");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MINIMUM_LICENSE = 'platinum';
class EmailServiceProvider {
  constructor(config, logger) {
    (0, _defineProperty2.default)(this, "setupSuccessful", void 0);
    (0, _defineProperty2.default)(this, "setupError", void 0);
    this.config = config;
    this.logger = logger;
    this.setupSuccessful = false;
    this.setupError = 'Email Service Error: setup() has not been run';
  }
  setup(plugins) {
    var _this$config$connecto, _this$config$connecto2;
    const {
      actions,
      licensing
    } = plugins;
    if (!actions || !licensing) {
      return this._registerInitializationError(`Error: 'actions' and 'licensing' plugins are required.`);
    }
    const emailConnector = (_this$config$connecto = this.config.connectors) === null || _this$config$connecto === void 0 ? void 0 : (_this$config$connecto2 = _this$config$connecto.default) === null || _this$config$connecto2 === void 0 ? void 0 : _this$config$connecto2.email;
    if (!emailConnector) {
      return this._registerInitializationError('Error: Email connector not specified.', 'info');
    }
    if (!actions.isPreconfiguredConnector(emailConnector)) {
      return this._registerInitializationError(`Error: Unexisting email connector '${emailConnector}' specified.`);
    }
    this.setupSuccessful = true;
    this.setupError = '';
  }
  start(plugins) {
    const {
      actions,
      licensing
    } = plugins;
    let email;
    if (this.setupSuccessful && actions && licensing) {
      const emailConnector = this.config.connectors.default.email;
      try {
        const unsecuredActionsClient = actions.getUnsecuredActionsClient();
        email = new _licensed_email_service.LicensedEmailService(new _connectors_email_service.ConnectorsEmailService(_common.PLUGIN_ID, emailConnector, unsecuredActionsClient), licensing.license$, MINIMUM_LICENSE, this.logger);
      } catch (err) {
        this._registerInitializationError(err);
      }
    }
    return {
      isEmailServiceAvailable: () => !!email,
      getEmailService: () => {
        if (!email) {
          throw new Error(this.setupError);
        }
        return email;
      }
    };
  }
  _registerInitializationError(error, level = 'warn') {
    const message = `Email Service ${error}`;
    this.setupError = message;
    if (level === 'info') {
      this.logger.info(message);
    } else {
      this.logger.warn(message);
    }
  }
}
exports.EmailServiceProvider = EmailServiceProvider;