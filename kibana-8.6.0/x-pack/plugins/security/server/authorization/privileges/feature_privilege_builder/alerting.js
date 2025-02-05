"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeAlertingBuilder = void 0;
var _lodash = require("lodash");
var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var AlertingEntity;
(function (AlertingEntity) {
  AlertingEntity["RULE"] = "rule";
  AlertingEntity["ALERT"] = "alert";
})(AlertingEntity || (AlertingEntity = {}));
const readOperations = {
  rule: ['get', 'getRuleState', 'getAlertSummary', 'getExecutionLog', 'find', 'getRuleExecutionKPI'],
  alert: ['get', 'find', 'getAuthorizedAlertsIndices']
};
const writeOperations = {
  rule: ['create', 'delete', 'update', 'updateApiKey', 'enable', 'disable', 'muteAll', 'unmuteAll', 'muteAlert', 'unmuteAlert', 'snooze', 'bulkEdit', 'bulkDelete', 'bulkEnable', 'unsnooze'],
  alert: ['update']
};
const allOperations = {
  rule: [...readOperations.rule, ...writeOperations.rule],
  alert: [...readOperations.alert, ...writeOperations.alert]
};
class FeaturePrivilegeAlertingBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition, feature) {
    const getAlertingPrivilege = (operations, privilegedTypes, alertingEntity, consumer) => privilegedTypes.flatMap(type => operations.map(operation => this.actions.alerting.get(type, consumer, alertingEntity, operation)));
    const getPrivilegesForEntity = entity => {
      var _get, _get2;
      const all = (_get = (0, _lodash.get)(privilegeDefinition.alerting, `${entity}.all`)) !== null && _get !== void 0 ? _get : [];
      const read = (_get2 = (0, _lodash.get)(privilegeDefinition.alerting, `${entity}.read`)) !== null && _get2 !== void 0 ? _get2 : [];
      return (0, _lodash.uniq)([...getAlertingPrivilege(allOperations[entity], all, entity, feature.id), ...getAlertingPrivilege(readOperations[entity], read, entity, feature.id)]);
    };
    return (0, _lodash.uniq)([...getPrivilegesForEntity(AlertingEntity.RULE), ...getPrivilegesForEntity(AlertingEntity.ALERT)]);
  }
}
exports.FeaturePrivilegeAlertingBuilder = FeaturePrivilegeAlertingBuilder;