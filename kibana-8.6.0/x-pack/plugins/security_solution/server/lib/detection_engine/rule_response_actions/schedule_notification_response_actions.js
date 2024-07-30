"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleNotificationResponseActions = void 0;
var _lodash = require("lodash");
var _schemas = require("../../../../common/detection_engine/rule_response_actions/schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const scheduleNotificationResponseActions = ({
  signals,
  responseActions
}, osqueryCreateAction) => {
  const filteredAlerts = signals.filter(alert => {
    var _alert$agent;
    return (_alert$agent = alert.agent) === null || _alert$agent === void 0 ? void 0 : _alert$agent.id;
  });
  const agentIds = (0, _lodash.uniq)(filteredAlerts.map(alert => {
    var _alert$agent2;
    return (_alert$agent2 = alert.agent) === null || _alert$agent2 === void 0 ? void 0 : _alert$agent2.id;
  }));
  const alertIds = (0, _lodash.map)(filteredAlerts, '_id');
  responseActions.forEach(responseAction => {
    if (responseAction.actionTypeId === _schemas.RESPONSE_ACTION_TYPES.OSQUERY && osqueryCreateAction) {
      const {
        savedQueryId,
        packId,
        queries,
        ecsMapping,
        ...rest
      } = responseAction.params;
      return osqueryCreateAction({
        ...rest,
        queries,
        ecs_mapping: ecsMapping,
        saved_query_id: savedQueryId,
        agent_ids: agentIds,
        alert_ids: alertIds
      });
    }
  });
};
exports.scheduleNotificationResponseActions = scheduleNotificationResponseActions;