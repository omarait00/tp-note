"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonAlertFields = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCommonAlertFields = options => {
  return {
    [_ruleDataUtils.ALERT_RULE_CATEGORY]: options.rule.ruleTypeName,
    [_ruleDataUtils.ALERT_RULE_CONSUMER]: options.rule.consumer,
    [_ruleDataUtils.ALERT_RULE_EXECUTION_UUID]: options.executionId,
    [_ruleDataUtils.ALERT_RULE_NAME]: options.rule.name,
    [_ruleDataUtils.ALERT_RULE_PRODUCER]: options.rule.producer,
    [_ruleDataUtils.ALERT_RULE_TYPE_ID]: options.rule.ruleTypeId,
    [_ruleDataUtils.ALERT_RULE_UUID]: options.rule.id,
    [_ruleDataUtils.SPACE_IDS]: [options.spaceId],
    [_ruleDataUtils.ALERT_RULE_TAGS]: options.rule.tags,
    [_ruleDataUtils.TIMESTAMP]: options.startedAt.toISOString()
  };
};
exports.getCommonAlertFields = getCommonAlertFields;