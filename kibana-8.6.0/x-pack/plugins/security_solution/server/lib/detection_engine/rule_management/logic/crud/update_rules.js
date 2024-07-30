"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRules = void 0;
var _constants = require("../../../../../../common/constants");
var _transform_actions = require("../../../../../../common/detection_engine/transform_actions");
var _rule_actions = require("../../normalization/rule_actions");
var _rule_converters = require("../../normalization/rule_converters");
var _muting = require("../rule_actions/muting");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable complexity */

const updateRules = async ({
  rulesClient,
  existingRule,
  ruleUpdate
}) => {
  var _ruleUpdate$enabled, _ruleUpdate$tags, _ruleUpdate$author, _ruleUpdate$false_pos, _ruleUpdate$from, _ruleUpdate$output_in, _ruleUpdate$max_signa, _ruleUpdate$risk_scor, _ruleUpdate$severity_, _ruleUpdate$threat, _ruleUpdate$to, _ruleUpdate$reference, _ruleUpdate$version, _ruleUpdate$exception, _ruleUpdate$interval;
  if (existingRule == null) {
    return null;
  }
  const typeSpecificParams = (0, _rule_converters.typeSpecificSnakeToCamel)(ruleUpdate);
  const enabled = (_ruleUpdate$enabled = ruleUpdate.enabled) !== null && _ruleUpdate$enabled !== void 0 ? _ruleUpdate$enabled : true;
  const newInternalRule = {
    name: ruleUpdate.name,
    tags: (_ruleUpdate$tags = ruleUpdate.tags) !== null && _ruleUpdate$tags !== void 0 ? _ruleUpdate$tags : [],
    params: {
      author: (_ruleUpdate$author = ruleUpdate.author) !== null && _ruleUpdate$author !== void 0 ? _ruleUpdate$author : [],
      buildingBlockType: ruleUpdate.building_block_type,
      description: ruleUpdate.description,
      ruleId: existingRule.params.ruleId,
      falsePositives: (_ruleUpdate$false_pos = ruleUpdate.false_positives) !== null && _ruleUpdate$false_pos !== void 0 ? _ruleUpdate$false_pos : [],
      from: (_ruleUpdate$from = ruleUpdate.from) !== null && _ruleUpdate$from !== void 0 ? _ruleUpdate$from : 'now-6m',
      // Unlike the create route, immutable comes from the existing rule here
      immutable: existingRule.params.immutable,
      license: ruleUpdate.license,
      outputIndex: (_ruleUpdate$output_in = ruleUpdate.output_index) !== null && _ruleUpdate$output_in !== void 0 ? _ruleUpdate$output_in : '',
      timelineId: ruleUpdate.timeline_id,
      timelineTitle: ruleUpdate.timeline_title,
      meta: ruleUpdate.meta,
      maxSignals: (_ruleUpdate$max_signa = ruleUpdate.max_signals) !== null && _ruleUpdate$max_signa !== void 0 ? _ruleUpdate$max_signa : _constants.DEFAULT_MAX_SIGNALS,
      relatedIntegrations: existingRule.params.relatedIntegrations,
      requiredFields: existingRule.params.requiredFields,
      riskScore: ruleUpdate.risk_score,
      riskScoreMapping: (_ruleUpdate$risk_scor = ruleUpdate.risk_score_mapping) !== null && _ruleUpdate$risk_scor !== void 0 ? _ruleUpdate$risk_scor : [],
      ruleNameOverride: ruleUpdate.rule_name_override,
      setup: existingRule.params.setup,
      severity: ruleUpdate.severity,
      severityMapping: (_ruleUpdate$severity_ = ruleUpdate.severity_mapping) !== null && _ruleUpdate$severity_ !== void 0 ? _ruleUpdate$severity_ : [],
      threat: (_ruleUpdate$threat = ruleUpdate.threat) !== null && _ruleUpdate$threat !== void 0 ? _ruleUpdate$threat : [],
      timestampOverride: ruleUpdate.timestamp_override,
      timestampOverrideFallbackDisabled: ruleUpdate.timestamp_override_fallback_disabled,
      to: (_ruleUpdate$to = ruleUpdate.to) !== null && _ruleUpdate$to !== void 0 ? _ruleUpdate$to : 'now',
      references: (_ruleUpdate$reference = ruleUpdate.references) !== null && _ruleUpdate$reference !== void 0 ? _ruleUpdate$reference : [],
      namespace: ruleUpdate.namespace,
      note: ruleUpdate.note,
      // Always use the version from the request if specified. If it isn't specified, leave immutable rules alone and
      // increment the version of mutable rules by 1.
      version: ((_ruleUpdate$version = ruleUpdate.version) !== null && _ruleUpdate$version !== void 0 ? _ruleUpdate$version : existingRule.params.immutable) ? existingRule.params.version : existingRule.params.version + 1,
      exceptionsList: (_ruleUpdate$exception = ruleUpdate.exceptions_list) !== null && _ruleUpdate$exception !== void 0 ? _ruleUpdate$exception : [],
      ...typeSpecificParams
    },
    schedule: {
      interval: (_ruleUpdate$interval = ruleUpdate.interval) !== null && _ruleUpdate$interval !== void 0 ? _ruleUpdate$interval : '5m'
    },
    actions: ruleUpdate.actions != null ? ruleUpdate.actions.map(_transform_actions.transformRuleToAlertAction) : [],
    throttle: (0, _rule_actions.transformToAlertThrottle)(ruleUpdate.throttle),
    notifyWhen: (0, _rule_actions.transformToNotifyWhen)(ruleUpdate.throttle)
  };
  const update = await rulesClient.update({
    id: existingRule.id,
    data: newInternalRule
  });
  await (0, _muting.maybeMute)({
    rulesClient,
    muteAll: existingRule.muteAll,
    throttle: ruleUpdate.throttle,
    id: update.id
  });
  if (existingRule.enabled && enabled === false) {
    await rulesClient.disable({
      id: existingRule.id
    });
  } else if (!existingRule.enabled && enabled === true) {
    await rulesClient.enable({
      id: existingRule.id
    });
  }
  return {
    ...update,
    enabled
  };
};
exports.updateRules = updateRules;