"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;
var _legacy = require("./legacy");
var _create_rule = require("./create_rule");
var _get_rule = require("./get_rule");
var _update_rule = require("./update_rule");
var _delete_rule = require("./delete_rule");
var _aggregate_rules = require("./aggregate_rules");
var _disable_rule = require("./disable_rule");
var _enable_rule = require("./enable_rule");
var _find_rules = require("./find_rules");
var _get_rule_alert_summary = require("./get_rule_alert_summary");
var _get_rule_execution_log = require("./get_rule_execution_log");
var _get_global_execution_logs = require("./get_global_execution_logs");
var _get_global_execution_kpi = require("./get_global_execution_kpi");
var _get_action_error_log = require("./get_action_error_log");
var _get_rule_execution_kpi = require("./get_rule_execution_kpi");
var _get_rule_state = require("./get_rule_state");
var _health = require("./health");
var _resolve_rule = require("./resolve_rule");
var _rule_types = require("./rule_types");
var _mute_all_rule = require("./mute_all_rule");
var _mute_alert = require("./mute_alert");
var _unmute_all_rule = require("./unmute_all_rule");
var _unmute_alert = require("./unmute_alert");
var _update_rule_api_key = require("./update_rule_api_key");
var _bulk_edit_rules = require("./bulk_edit_rules");
var _snooze_rule = require("./snooze_rule");
var _unsnooze_rule = require("./unsnooze_rule");
var _run_soon = require("./run_soon");
var _bulk_delete_rules = require("./bulk_delete_rules");
var _bulk_enable_rules = require("./bulk_enable_rules");
var _clone_rule = require("./clone_rule");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineRoutes(opts) {
  const {
    router,
    licenseState,
    encryptedSavedObjects,
    usageCounter
  } = opts;
  (0, _legacy.defineLegacyRoutes)(opts);
  (0, _create_rule.createRuleRoute)(opts);
  (0, _get_rule.getRuleRoute)(router, licenseState);
  (0, _get_rule.getInternalRuleRoute)(router, licenseState);
  (0, _resolve_rule.resolveRuleRoute)(router, licenseState);
  (0, _update_rule.updateRuleRoute)(router, licenseState);
  (0, _delete_rule.deleteRuleRoute)(router, licenseState);
  (0, _aggregate_rules.aggregateRulesRoute)(router, licenseState);
  (0, _disable_rule.disableRuleRoute)(router, licenseState);
  (0, _enable_rule.enableRuleRoute)(router, licenseState);
  (0, _find_rules.findRulesRoute)(router, licenseState, usageCounter);
  (0, _find_rules.findInternalRulesRoute)(router, licenseState, usageCounter);
  (0, _get_rule_alert_summary.getRuleAlertSummaryRoute)(router, licenseState);
  (0, _get_rule_execution_log.getRuleExecutionLogRoute)(router, licenseState);
  (0, _get_global_execution_logs.getGlobalExecutionLogRoute)(router, licenseState);
  (0, _get_action_error_log.getActionErrorLogRoute)(router, licenseState);
  (0, _get_rule_execution_kpi.getRuleExecutionKPIRoute)(router, licenseState);
  (0, _get_global_execution_kpi.getGlobalExecutionKPIRoute)(router, licenseState);
  (0, _get_rule_state.getRuleStateRoute)(router, licenseState);
  (0, _health.healthRoute)(router, licenseState, encryptedSavedObjects);
  (0, _rule_types.ruleTypesRoute)(router, licenseState);
  (0, _mute_all_rule.muteAllRuleRoute)(router, licenseState, usageCounter);
  (0, _mute_alert.muteAlertRoute)(router, licenseState);
  (0, _unmute_all_rule.unmuteAllRuleRoute)(router, licenseState);
  (0, _unmute_alert.unmuteAlertRoute)(router, licenseState);
  (0, _update_rule_api_key.updateRuleApiKeyRoute)(router, licenseState);
  (0, _bulk_edit_rules.bulkEditInternalRulesRoute)(router, licenseState);
  (0, _bulk_delete_rules.bulkDeleteRulesRoute)({
    router,
    licenseState
  });
  (0, _bulk_enable_rules.bulkEnableRulesRoute)({
    router,
    licenseState
  });
  (0, _snooze_rule.snoozeRuleRoute)(router, licenseState);
  (0, _unsnooze_rule.unsnoozeRuleRoute)(router, licenseState);
  (0, _run_soon.runSoonRoute)(router, licenseState);
  (0, _clone_rule.cloneRuleRoute)(router, licenseState);
}