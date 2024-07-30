"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleExecutionStatusToNumber = exports.TRuleExecutionStatus = exports.RuleExecutionStatusOrder = exports.RuleExecutionStatus = exports.RULE_EXECUTION_STATUSES = void 0;
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _utility_types = require("../../../utility_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/**
 * Custom execution status of Security rules that is different from the status
 * used in the Alerting Framework. We merge our custom status with the
 * Framework's status to determine the resulting status of a rule.
 */
let RuleExecutionStatus;
exports.RuleExecutionStatus = RuleExecutionStatus;
(function (RuleExecutionStatus) {
  RuleExecutionStatus["going to run"] = "going to run";
  RuleExecutionStatus["running"] = "running";
  RuleExecutionStatus["partial failure"] = "partial failure";
  RuleExecutionStatus["failed"] = "failed";
  RuleExecutionStatus["succeeded"] = "succeeded";
})(RuleExecutionStatus || (exports.RuleExecutionStatus = RuleExecutionStatus = {}));
const TRuleExecutionStatus = (0, _securitysolutionIoTsTypes.enumeration)('RuleExecutionStatus', RuleExecutionStatus);

/**
 * An array of supported rule execution statuses.
 */
exports.TRuleExecutionStatus = TRuleExecutionStatus;
const RULE_EXECUTION_STATUSES = Object.values(RuleExecutionStatus);
exports.RULE_EXECUTION_STATUSES = RULE_EXECUTION_STATUSES;
const RuleExecutionStatusOrder = _securitysolutionIoTsTypes.PositiveInteger;
exports.RuleExecutionStatusOrder = RuleExecutionStatusOrder;
const ruleExecutionStatusToNumber = status => {
  switch (status) {
    case RuleExecutionStatus.succeeded:
      return 0;
    case RuleExecutionStatus['going to run']:
      return 10;
    case RuleExecutionStatus.running:
      return 15;
    case RuleExecutionStatus['partial failure']:
      return 20;
    case RuleExecutionStatus.failed:
      return 30;
    default:
      (0, _utility_types.assertUnreachable)(status);
      return 0;
  }
};
exports.ruleExecutionStatusToNumber = ruleExecutionStatusToNumber;