"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBulkEnableRule = exports.validateBulkEditRule = exports.validateBulkDuplicateRule = exports.validateBulkDisableRule = exports.dryRunValidateBulkEditRule = void 0;
var _invariant = require("../../../../../../common/utils/invariant");
var _helpers = require("../../../../../../common/machine_learning/helpers");
var _constants = require("../../../../../../common/constants");
var _request_schema = require("../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
var _utils = require("./utils");
var _dry_run = require("./dry_run");
var _validation = require("../../../../machine_learning/validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * throws ML authorization error wrapped with MACHINE_LEARNING_AUTH error code
 * @param mlAuthz - {@link MlAuthz}
 * @param ruleType - {@link RuleType}
 */
const throwMlAuthError = (mlAuthz, ruleType) => (0, _dry_run.throwDryRunError)(async () => (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(ruleType)), _constants.BulkActionsDryRunErrCode.MACHINE_LEARNING_AUTH);

/**
 * runs validation for bulk enable for a single rule
 * @param params - {@link BulkActionsValidationArgs}
 */
const validateBulkEnableRule = async ({
  rule,
  mlAuthz
}) => {
  if (!rule.enabled) {
    await throwMlAuthError(mlAuthz, rule.params.type);
  }
};

/**
 * runs validation for bulk disable for a single rule
 * @param params - {@link BulkActionsValidationArgs}
 */
exports.validateBulkEnableRule = validateBulkEnableRule;
const validateBulkDisableRule = async ({
  rule,
  mlAuthz
}) => {
  if (rule.enabled) {
    await throwMlAuthError(mlAuthz, rule.params.type);
  }
};

/**
 * runs validation for bulk duplicate for a single rule
 * @param params - {@link BulkActionsValidationArgs}
 */
exports.validateBulkDisableRule = validateBulkDisableRule;
const validateBulkDuplicateRule = async ({
  rule,
  mlAuthz
}) => {
  await throwMlAuthError(mlAuthz, rule.params.type);
};

/**
 * runs validation for bulk edit for a single rule
 * @param params - {@link BulkActionsValidationArgs}
 */
exports.validateBulkDuplicateRule = validateBulkDuplicateRule;
const validateBulkEditRule = async ({
  ruleType,
  mlAuthz,
  edit,
  immutable
}) => {
  await throwMlAuthError(mlAuthz, ruleType);

  // if rule can't be edited error will be thrown
  const canRuleBeEdited = !immutable || istEditApplicableToImmutableRule(edit);
  await (0, _dry_run.throwDryRunError)(() => (0, _invariant.invariant)(canRuleBeEdited, "Elastic rule can't be edited"), _constants.BulkActionsDryRunErrCode.IMMUTABLE);
};

/**
 * add_rule_actions, set_rule_actions can be applied to prebuilt/immutable rules
 */
exports.validateBulkEditRule = validateBulkEditRule;
const istEditApplicableToImmutableRule = edit => {
  return edit.every(({
    type
  }) => [_request_schema.BulkActionEditType.set_rule_actions, _request_schema.BulkActionEditType.add_rule_actions].includes(type));
};

/**
 * executes dry run validations for bulk edit of a single rule
 * @param params - {@link DryRunBulkEditBulkActionsValidationArgs}
 */
const dryRunValidateBulkEditRule = async ({
  rule,
  edit,
  mlAuthz
}) => {
  await validateBulkEditRule({
    ruleType: rule.params.type,
    mlAuthz,
    edit,
    immutable: rule.params.immutable
  });

  // if rule is machine_learning, index pattern action can't be applied to it
  await (0, _dry_run.throwDryRunError)(() => (0, _invariant.invariant)(!(0, _helpers.isMlRule)(rule.params.type) || !edit.some(action => (0, _utils.isIndexPatternsBulkEditAction)(action.type)), "Machine learning rule doesn't have index patterns"), _constants.BulkActionsDryRunErrCode.MACHINE_LEARNING_INDEX_PATTERN);
};
exports.dryRunValidateBulkEditRule = dryRunValidateBulkEditRule;