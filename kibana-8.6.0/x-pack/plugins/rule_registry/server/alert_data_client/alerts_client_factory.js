"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsClientFactory = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _alerts_client = require("./alerts_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AlertsClientFactory {
  constructor() {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "getAlertingAuthorization", void 0);
    (0, _defineProperty2.default)(this, "securityPluginSetup", void 0);
    (0, _defineProperty2.default)(this, "ruleDataService", void 0);
  }
  initialize(options) {
    /**
     * This should be called by the plugin's start() method.
     */
    if (this.isInitialized) {
      throw new Error('AlertsClientFactory (RAC) already initialized');
    }
    this.getAlertingAuthorization = options.getAlertingAuthorization;
    this.isInitialized = true;
    this.logger = options.logger;
    this.esClient = options.esClient;
    this.securityPluginSetup = options.securityPluginSetup;
    this.ruleDataService = options.ruleDataService;
  }
  async create(request) {
    const {
      securityPluginSetup,
      getAlertingAuthorization,
      logger
    } = this;
    return new _alerts_client.AlertsClient({
      logger,
      authorization: getAlertingAuthorization(request),
      auditLogger: securityPluginSetup === null || securityPluginSetup === void 0 ? void 0 : securityPluginSetup.audit.asScoped(request),
      esClient: this.esClient,
      ruleDataService: this.ruleDataService
    });
  }
}
exports.AlertsClientFactory = AlertsClientFactory;