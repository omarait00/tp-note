"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logAlerts = logAlerts;
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _plugin = require("../plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function logAlerts({
  logger,
  alertingEventLogger,
  newAlerts,
  activeAlerts,
  recoveredAlerts,
  ruleLogPrefix,
  ruleRunMetricsStore,
  canSetRecoveryContext,
  shouldPersistAlerts
}) {
  const newAlertIds = Object.keys(newAlerts);
  const activeAlertIds = Object.keys(activeAlerts);
  const recoveredAlertIds = Object.keys(recoveredAlerts);
  if (_elasticApmNode.default.currentTransaction) {
    _elasticApmNode.default.currentTransaction.addLabels({
      alerting_new_alerts: newAlertIds.length,
      alerting_active_alerts: activeAlertIds.length,
      alerting_recovered_alerts: recoveredAlertIds.length
    });
  }
  if (activeAlertIds.length > 0) {
    logger.debug(`rule ${ruleLogPrefix} has ${activeAlertIds.length} active alerts: ${JSON.stringify(activeAlertIds.map(alertId => {
      var _activeAlerts$alertId;
      return {
        instanceId: alertId,
        actionGroup: (_activeAlerts$alertId = activeAlerts[alertId].getScheduledActionOptions()) === null || _activeAlerts$alertId === void 0 ? void 0 : _activeAlerts$alertId.actionGroup
      };
    }))}`);
  }
  if (recoveredAlertIds.length > 0) {
    logger.debug(`rule ${ruleLogPrefix} has ${recoveredAlertIds.length} recovered alerts: ${JSON.stringify(recoveredAlertIds)}`);
    if (canSetRecoveryContext) {
      for (const id of recoveredAlertIds) {
        if (!recoveredAlerts[id].hasContext()) {
          logger.debug(`rule ${ruleLogPrefix} has no recovery context specified for recovered alert ${id}`);
        }
      }
    }
  }
  if (shouldPersistAlerts) {
    ruleRunMetricsStore.setNumberOfNewAlerts(newAlertIds.length);
    ruleRunMetricsStore.setNumberOfActiveAlerts(activeAlertIds.length);
    ruleRunMetricsStore.setNumberOfRecoveredAlerts(recoveredAlertIds.length);
    for (const id of recoveredAlertIds) {
      var _recoveredAlerts$id$g;
      const {
        group: actionGroup
      } = (_recoveredAlerts$id$g = recoveredAlerts[id].getLastScheduledActions()) !== null && _recoveredAlerts$id$g !== void 0 ? _recoveredAlerts$id$g : {};
      const state = recoveredAlerts[id].getState();
      const message = `${ruleLogPrefix} alert '${id}' has recovered`;
      alertingEventLogger.logAlert({
        action: _plugin.EVENT_LOG_ACTIONS.recoveredInstance,
        id,
        group: actionGroup,
        message,
        state,
        flapping: false
      });
    }
    for (const id of newAlertIds) {
      var _activeAlerts$id$getS;
      const {
        actionGroup
      } = (_activeAlerts$id$getS = activeAlerts[id].getScheduledActionOptions()) !== null && _activeAlerts$id$getS !== void 0 ? _activeAlerts$id$getS : {};
      const state = activeAlerts[id].getState();
      const message = `${ruleLogPrefix} created new alert: '${id}'`;
      alertingEventLogger.logAlert({
        action: _plugin.EVENT_LOG_ACTIONS.newInstance,
        id,
        group: actionGroup,
        message,
        state,
        flapping: false
      });
    }
    for (const id of activeAlertIds) {
      var _activeAlerts$id$getS2;
      const {
        actionGroup
      } = (_activeAlerts$id$getS2 = activeAlerts[id].getScheduledActionOptions()) !== null && _activeAlerts$id$getS2 !== void 0 ? _activeAlerts$id$getS2 : {};
      const state = activeAlerts[id].getState();
      const message = `${ruleLogPrefix} active alert: '${id}' in actionGroup: '${actionGroup}'`;
      alertingEventLogger.logAlert({
        action: _plugin.EVENT_LOG_ACTIONS.activeInstance,
        id,
        group: actionGroup,
        message,
        state,
        flapping: false
      });
    }
  }
}