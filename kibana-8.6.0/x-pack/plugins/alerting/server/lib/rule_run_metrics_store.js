"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleRunMetricsStore = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class RuleRunMetricsStore {
  constructor() {
    (0, _defineProperty2.default)(this, "state", {
      numSearches: 0,
      totalSearchDurationMs: 0,
      esSearchDurationMs: 0,
      numberOfTriggeredActions: 0,
      numberOfGeneratedActions: 0,
      numberOfActiveAlerts: 0,
      numberOfRecoveredAlerts: 0,
      numberOfNewAlerts: 0,
      hasReachedAlertLimit: false,
      connectorTypes: {}
    });
    (0, _defineProperty2.default)(this, "getTriggeredActionsStatus", () => {
      const hasPartial = Object.values(this.state.connectorTypes).some(connectorType => (connectorType === null || connectorType === void 0 ? void 0 : connectorType.triggeredActionsStatus) === _types.ActionsCompletion.PARTIAL);
      return hasPartial ? _types.ActionsCompletion.PARTIAL : _types.ActionsCompletion.COMPLETE;
    });
    (0, _defineProperty2.default)(this, "getNumSearches", () => {
      return this.state.numSearches;
    });
    (0, _defineProperty2.default)(this, "getTotalSearchDurationMs", () => {
      return this.state.totalSearchDurationMs;
    });
    (0, _defineProperty2.default)(this, "getEsSearchDurationMs", () => {
      return this.state.esSearchDurationMs;
    });
    (0, _defineProperty2.default)(this, "getNumberOfTriggeredActions", () => {
      return this.state.numberOfTriggeredActions;
    });
    (0, _defineProperty2.default)(this, "getNumberOfGeneratedActions", () => {
      return this.state.numberOfGeneratedActions;
    });
    (0, _defineProperty2.default)(this, "getNumberOfActiveAlerts", () => {
      return this.state.numberOfActiveAlerts;
    });
    (0, _defineProperty2.default)(this, "getNumberOfRecoveredAlerts", () => {
      return this.state.numberOfRecoveredAlerts;
    });
    (0, _defineProperty2.default)(this, "getNumberOfNewAlerts", () => {
      return this.state.numberOfNewAlerts;
    });
    (0, _defineProperty2.default)(this, "getStatusByConnectorType", actionTypeId => {
      return this.state.connectorTypes[actionTypeId];
    });
    (0, _defineProperty2.default)(this, "getMetrics", () => {
      const {
        connectorTypes,
        ...metrics
      } = this.state;
      return {
        ...metrics,
        triggeredActionsStatus: this.getTriggeredActionsStatus()
      };
    });
    (0, _defineProperty2.default)(this, "getHasReachedAlertLimit", () => {
      return this.state.hasReachedAlertLimit;
    });
    (0, _defineProperty2.default)(this, "setSearchMetrics", searchMetrics => {
      for (const metric of searchMetrics) {
        var _metric$numSearches, _metric$totalSearchDu, _metric$esSearchDurat;
        this.incrementNumSearches((_metric$numSearches = metric.numSearches) !== null && _metric$numSearches !== void 0 ? _metric$numSearches : 0);
        this.incrementTotalSearchDurationMs((_metric$totalSearchDu = metric.totalSearchDurationMs) !== null && _metric$totalSearchDu !== void 0 ? _metric$totalSearchDu : 0);
        this.incrementEsSearchDurationMs((_metric$esSearchDurat = metric.esSearchDurationMs) !== null && _metric$esSearchDurat !== void 0 ? _metric$esSearchDurat : 0);
      }
    });
    (0, _defineProperty2.default)(this, "setNumSearches", numSearches => {
      this.state.numSearches = numSearches;
    });
    (0, _defineProperty2.default)(this, "setTotalSearchDurationMs", totalSearchDurationMs => {
      this.state.totalSearchDurationMs = totalSearchDurationMs;
    });
    (0, _defineProperty2.default)(this, "setEsSearchDurationMs", esSearchDurationMs => {
      this.state.esSearchDurationMs = esSearchDurationMs;
    });
    (0, _defineProperty2.default)(this, "setNumberOfTriggeredActions", numberOfTriggeredActions => {
      this.state.numberOfTriggeredActions = numberOfTriggeredActions;
    });
    (0, _defineProperty2.default)(this, "setNumberOfGeneratedActions", numberOfGeneratedActions => {
      this.state.numberOfGeneratedActions = numberOfGeneratedActions;
    });
    (0, _defineProperty2.default)(this, "setNumberOfActiveAlerts", numberOfActiveAlerts => {
      this.state.numberOfActiveAlerts = numberOfActiveAlerts;
    });
    (0, _defineProperty2.default)(this, "setNumberOfRecoveredAlerts", numberOfRecoveredAlerts => {
      this.state.numberOfRecoveredAlerts = numberOfRecoveredAlerts;
    });
    (0, _defineProperty2.default)(this, "setNumberOfNewAlerts", numberOfNewAlerts => {
      this.state.numberOfNewAlerts = numberOfNewAlerts;
    });
    (0, _defineProperty2.default)(this, "setTriggeredActionsStatusByConnectorType", ({
      actionTypeId,
      status
    }) => {
      (0, _lodash.set)(this.state, `connectorTypes["${actionTypeId}"].triggeredActionsStatus`, status);
    });
    (0, _defineProperty2.default)(this, "setHasReachedAlertLimit", hasReachedAlertLimit => {
      this.state.hasReachedAlertLimit = hasReachedAlertLimit;
    });
    (0, _defineProperty2.default)(this, "hasReachedTheExecutableActionsLimit", actionsConfigMap => this.state.numberOfTriggeredActions >= actionsConfigMap.default.max);
    (0, _defineProperty2.default)(this, "hasReachedTheExecutableActionsLimitByConnectorType", ({
      actionsConfigMap,
      actionTypeId
    }) => {
      var _this$state$connector, _actionsConfigMap$act;
      const numberOfTriggeredActionsByConnectorType = ((_this$state$connector = this.state.connectorTypes[actionTypeId]) === null || _this$state$connector === void 0 ? void 0 : _this$state$connector.numberOfTriggeredActions) || 0;
      const executableActionsLimitByConnectorType = ((_actionsConfigMap$act = actionsConfigMap[actionTypeId]) === null || _actionsConfigMap$act === void 0 ? void 0 : _actionsConfigMap$act.max) || actionsConfigMap.default.max;
      return numberOfTriggeredActionsByConnectorType >= executableActionsLimitByConnectorType;
    });
    (0, _defineProperty2.default)(this, "hasConnectorTypeReachedTheLimit", actionTypeId => {
      var _this$state$connector2;
      return ((_this$state$connector2 = this.state.connectorTypes[actionTypeId]) === null || _this$state$connector2 === void 0 ? void 0 : _this$state$connector2.triggeredActionsStatus) === _types.ActionsCompletion.PARTIAL;
    });
    (0, _defineProperty2.default)(this, "incrementNumSearches", incrementBy => {
      this.state.numSearches += incrementBy;
    });
    (0, _defineProperty2.default)(this, "incrementTotalSearchDurationMs", incrementBy => {
      this.state.totalSearchDurationMs += incrementBy;
    });
    (0, _defineProperty2.default)(this, "incrementEsSearchDurationMs", incrementBy => {
      this.state.esSearchDurationMs += incrementBy;
    });
    (0, _defineProperty2.default)(this, "incrementNumberOfTriggeredActions", () => {
      this.state.numberOfTriggeredActions++;
    });
    (0, _defineProperty2.default)(this, "incrementNumberOfGeneratedActions", incrementBy => {
      this.state.numberOfGeneratedActions += incrementBy;
    });
    (0, _defineProperty2.default)(this, "incrementNumberOfTriggeredActionsByConnectorType", actionTypeId => {
      var _this$state$connector3;
      const currentVal = ((_this$state$connector3 = this.state.connectorTypes[actionTypeId]) === null || _this$state$connector3 === void 0 ? void 0 : _this$state$connector3.numberOfTriggeredActions) || 0;
      (0, _lodash.set)(this.state, `connectorTypes["${actionTypeId}"].numberOfTriggeredActions`, currentVal + 1);
    });
    (0, _defineProperty2.default)(this, "incrementNumberOfGeneratedActionsByConnectorType", actionTypeId => {
      var _this$state$connector4;
      const currentVal = ((_this$state$connector4 = this.state.connectorTypes[actionTypeId]) === null || _this$state$connector4 === void 0 ? void 0 : _this$state$connector4.numberOfGeneratedActions) || 0;
      (0, _lodash.set)(this.state, `connectorTypes["${actionTypeId}"].numberOfGeneratedActions`, currentVal + 1);
    });
  }
}
exports.RuleRunMetricsStore = RuleRunMetricsStore;