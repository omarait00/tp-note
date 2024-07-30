"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleExecutionSoReferences = exports.getRuleExecutionSoId = exports.extractRuleIdFromReferences = void 0;
var _v = _interopRequireDefault(require("uuid/v5"));
var _saved_objects_type = require("./saved_objects_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRuleExecutionSoId = ruleId => {
  // The uuidv5 namespace constant (uuidv5.DNS) is arbitrary.
  return (0, _v.default)(`${_saved_objects_type.RULE_EXECUTION_SO_TYPE}:${ruleId}`, _v.default.DNS);
};
exports.getRuleExecutionSoId = getRuleExecutionSoId;
const RULE_REFERENCE_TYPE = 'alert';
const RULE_REFERENCE_NAME = 'alert_0';
const getRuleExecutionSoReferences = ruleId => {
  return [{
    id: ruleId,
    type: RULE_REFERENCE_TYPE,
    name: RULE_REFERENCE_NAME
  }];
};
exports.getRuleExecutionSoReferences = getRuleExecutionSoReferences;
const extractRuleIdFromReferences = references => {
  const foundReference = references.find(r => r.type === RULE_REFERENCE_TYPE && r.name === RULE_REFERENCE_NAME);
  return (foundReference === null || foundReference === void 0 ? void 0 : foundReference.id) || null;
};
exports.extractRuleIdFromReferences = extractRuleIdFromReferences;