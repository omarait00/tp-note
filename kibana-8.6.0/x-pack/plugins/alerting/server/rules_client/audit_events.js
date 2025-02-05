"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleAuditAction = void 0;
exports.ruleAuditEvent = ruleAuditEvent;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let RuleAuditAction;
exports.RuleAuditAction = RuleAuditAction;
(function (RuleAuditAction) {
  RuleAuditAction["CREATE"] = "rule_create";
  RuleAuditAction["GET"] = "rule_get";
  RuleAuditAction["RESOLVE"] = "rule_resolve";
  RuleAuditAction["UPDATE"] = "rule_update";
  RuleAuditAction["UPDATE_API_KEY"] = "rule_update_api_key";
  RuleAuditAction["ENABLE"] = "rule_enable";
  RuleAuditAction["DISABLE"] = "rule_disable";
  RuleAuditAction["DELETE"] = "rule_delete";
  RuleAuditAction["FIND"] = "rule_find";
  RuleAuditAction["MUTE"] = "rule_mute";
  RuleAuditAction["UNMUTE"] = "rule_unmute";
  RuleAuditAction["MUTE_ALERT"] = "rule_alert_mute";
  RuleAuditAction["UNMUTE_ALERT"] = "rule_alert_unmute";
  RuleAuditAction["AGGREGATE"] = "rule_aggregate";
  RuleAuditAction["BULK_EDIT"] = "rule_bulk_edit";
  RuleAuditAction["GET_EXECUTION_LOG"] = "rule_get_execution_log";
  RuleAuditAction["GET_GLOBAL_EXECUTION_LOG"] = "rule_get_global_execution_log";
  RuleAuditAction["GET_GLOBAL_EXECUTION_KPI"] = "rule_get_global_execution_kpi";
  RuleAuditAction["GET_ACTION_ERROR_LOG"] = "rule_get_action_error_log";
  RuleAuditAction["GET_RULE_EXECUTION_KPI"] = "rule_get_execution_kpi";
  RuleAuditAction["SNOOZE"] = "rule_snooze";
  RuleAuditAction["UNSNOOZE"] = "rule_unsnooze";
  RuleAuditAction["RUN_SOON"] = "rule_run_soon";
})(RuleAuditAction || (exports.RuleAuditAction = RuleAuditAction = {}));
const eventVerbs = {
  rule_create: ['create', 'creating', 'created'],
  rule_get: ['access', 'accessing', 'accessed'],
  rule_resolve: ['access', 'accessing', 'accessed'],
  rule_update: ['update', 'updating', 'updated'],
  rule_bulk_edit: ['update', 'updating', 'updated'],
  rule_update_api_key: ['update API key of', 'updating API key of', 'updated API key of'],
  rule_enable: ['enable', 'enabling', 'enabled'],
  rule_disable: ['disable', 'disabling', 'disabled'],
  rule_delete: ['delete', 'deleting', 'deleted'],
  rule_find: ['access', 'accessing', 'accessed'],
  rule_mute: ['mute', 'muting', 'muted'],
  rule_unmute: ['unmute', 'unmuting', 'unmuted'],
  rule_alert_mute: ['mute alert of', 'muting alert of', 'muted alert of'],
  rule_alert_unmute: ['unmute alert of', 'unmuting alert of', 'unmuted alert of'],
  rule_aggregate: ['access', 'accessing', 'accessed'],
  rule_get_execution_log: ['access execution log for', 'accessing execution log for', 'accessed execution log for'],
  rule_get_global_execution_log: ['access execution log', 'accessing execution log', 'accessed execution log'],
  rule_get_action_error_log: ['access action error log for', 'accessing action error log for', 'accessed action error log for'],
  rule_snooze: ['snooze', 'snoozing', 'snoozed'],
  rule_unsnooze: ['unsnooze', 'unsnoozing', 'unsnoozed'],
  rule_run_soon: ['run', 'running', 'ran'],
  rule_get_execution_kpi: ['access execution KPI for', 'accessing execution KPI for', 'accessed execution KPI for'],
  rule_get_global_execution_kpi: ['access global execution KPI for', 'accessing global execution KPI for', 'accessed global execution KPI for']
};
const eventTypes = {
  rule_create: 'creation',
  rule_get: 'access',
  rule_resolve: 'access',
  rule_update: 'change',
  rule_bulk_edit: 'change',
  rule_update_api_key: 'change',
  rule_enable: 'change',
  rule_disable: 'change',
  rule_delete: 'deletion',
  rule_find: 'access',
  rule_mute: 'change',
  rule_unmute: 'change',
  rule_alert_mute: 'change',
  rule_alert_unmute: 'change',
  rule_aggregate: 'access',
  rule_get_execution_log: 'access',
  rule_get_global_execution_log: 'access',
  rule_get_action_error_log: 'access',
  rule_snooze: 'change',
  rule_unsnooze: 'change',
  rule_run_soon: 'access',
  rule_get_execution_kpi: 'access',
  rule_get_global_execution_kpi: 'access'
};
function ruleAuditEvent({
  action,
  savedObject,
  outcome,
  error
}) {
  const doc = savedObject ? `rule [id=${savedObject.id}]` : 'a rule';
  const [present, progressive, past] = eventVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === 'unknown' ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = eventTypes[action];
  return {
    message,
    event: {
      action,
      category: ['database'],
      type: type ? [type] : undefined,
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? 'failure' : 'success'
    },
    kibana: {
      saved_object: savedObject
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}