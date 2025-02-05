"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryReceiver = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../../../../fleet/common");
var _common2 = require("../../../common");
var _types = require("../../../common/types");
var _utils = require("../../routes/saved_query/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TelemetryReceiver {
  // @ts-expect-error used as part of this

  constructor(logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "agentClient", void 0);
    (0, _defineProperty2.default)(this, "agentPolicyService", void 0);
    (0, _defineProperty2.default)(this, "packageService", void 0);
    (0, _defineProperty2.default)(this, "packagePolicyService", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "soClient", void 0);
    (0, _defineProperty2.default)(this, "max_records", 100);
    this.logger = logger.get('telemetry_events');
  }
  async start(core, osqueryContextService) {
    var _osqueryContextServic;
    this.agentClient = osqueryContextService === null || osqueryContextService === void 0 ? void 0 : (_osqueryContextServic = osqueryContextService.getAgentService()) === null || _osqueryContextServic === void 0 ? void 0 : _osqueryContextServic.asInternalUser;
    this.agentPolicyService = osqueryContextService === null || osqueryContextService === void 0 ? void 0 : osqueryContextService.getAgentPolicyService();
    this.packageService = osqueryContextService === null || osqueryContextService === void 0 ? void 0 : osqueryContextService.getPackageService();
    this.packagePolicyService = osqueryContextService === null || osqueryContextService === void 0 ? void 0 : osqueryContextService.getPackagePolicyService();
    this.esClient = core.elasticsearch.client.asInternalUser;
    this.soClient = core.savedObjects.createInternalRepository();
  }
  async fetchPacks() {
    var _this$soClient;
    return (_this$soClient = this.soClient) === null || _this$soClient === void 0 ? void 0 : _this$soClient.find({
      type: _types.packSavedObjectType,
      page: 1,
      perPage: this.max_records,
      sortField: 'updated_at',
      sortOrder: 'desc'
    });
  }
  async fetchSavedQueries() {
    var _this$soClient2;
    return (_this$soClient2 = this.soClient) === null || _this$soClient2 === void 0 ? void 0 : _this$soClient2.find({
      type: _types.savedQuerySavedObjectType,
      page: 1,
      perPage: this.max_records,
      sortField: 'updated_at',
      sortOrder: 'desc'
    });
  }
  async fetchConfigs() {
    if (this.soClient) {
      var _this$packagePolicySe;
      return (_this$packagePolicySe = this.packagePolicyService) === null || _this$packagePolicySe === void 0 ? void 0 : _this$packagePolicySe.list(this.soClient, {
        kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
        perPage: 1000,
        page: 1
      });
    }
    throw Error('elasticsearch client is unavailable: cannot retrieve fleet policy responses');
  }
  async fetchPrebuiltSavedQueryIds() {
    var _this$packageService;
    return (0, _utils.getPrebuiltSavedQueryIds)((_this$packageService = this.packageService) === null || _this$packageService === void 0 ? void 0 : _this$packageService.asInternalUser);
  }
  async fetchFleetAgents() {
    var _this$agentClient;
    if (this.esClient === undefined || this.soClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve fleet policy responses');
    }
    return (_this$agentClient = this.agentClient) === null || _this$agentClient === void 0 ? void 0 : _this$agentClient.listAgents({
      perPage: this.max_records,
      showInactive: true,
      sortField: 'enrolled_at',
      sortOrder: 'desc'
    });
  }
  async fetchPolicyConfigs(id) {
    var _this$agentPolicyServ;
    if (this.soClient === undefined || this.soClient === null) {
      throw Error('saved object client is unavailable: cannot retrieve endpoint policy configurations');
    }
    return (_this$agentPolicyServ = this.agentPolicyService) === null || _this$agentPolicyServ === void 0 ? void 0 : _this$agentPolicyServ.get(this.soClient, id);
  }
}
exports.TelemetryReceiver = TelemetryReceiver;