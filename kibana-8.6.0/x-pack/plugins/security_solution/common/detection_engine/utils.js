"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeThresholdObject = exports.normalizeThresholdField = exports.normalizeMachineLearningJobIds = exports.isThresholdRule = exports.isThreatMatchRule = exports.isQueryRule = exports.isNewTermsRule = exports.isMlRule = exports.isEqlRule = exports.hasNestedEntry = exports.hasLargeValueItem = exports.hasEqlSequenceQuery = void 0;
var _lodash = require("lodash");
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasLargeValueItem = exceptionItems => {
  return exceptionItems.some(exceptionItem => (0, _securitysolutionListUtils.hasLargeValueList)(exceptionItem.entries));
};
exports.hasLargeValueItem = hasLargeValueItem;
const hasNestedEntry = entries => {
  const found = entries.filter(({
    type
  }) => type === 'nested');
  return found.length > 0;
};
exports.hasNestedEntry = hasNestedEntry;
const hasEqlSequenceQuery = ruleQuery => {
  if (ruleQuery != null) {
    const parsedQuery = ruleQuery.trim().split(/[ \t\r\n]+/);
    return parsedQuery[0] === 'sequence' && parsedQuery[1] !== 'where';
  }
  return false;
};

// these functions should be typeguards and accept an entire rule.
exports.hasEqlSequenceQuery = hasEqlSequenceQuery;
const isEqlRule = ruleType => ruleType === 'eql';
exports.isEqlRule = isEqlRule;
const isThresholdRule = ruleType => ruleType === 'threshold';
exports.isThresholdRule = isThresholdRule;
const isQueryRule = ruleType => ruleType === 'query' || ruleType === 'saved_query';
exports.isQueryRule = isQueryRule;
const isThreatMatchRule = ruleType => ruleType === 'threat_match';
exports.isThreatMatchRule = isThreatMatchRule;
const isMlRule = ruleType => ruleType === 'machine_learning';
exports.isMlRule = isMlRule;
const isNewTermsRule = ruleType => ruleType === 'new_terms';
exports.isNewTermsRule = isNewTermsRule;
const normalizeThresholdField = thresholdField => {
  return Array.isArray(thresholdField) ? thresholdField : (0, _lodash.isEmpty)(thresholdField) ? [] :
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  [thresholdField];
};
exports.normalizeThresholdField = normalizeThresholdField;
const normalizeThresholdObject = threshold => {
  return {
    ...threshold,
    field: normalizeThresholdField(threshold.field)
  };
};
exports.normalizeThresholdObject = normalizeThresholdObject;
const normalizeMachineLearningJobIds = value => Array.isArray(value) ? value : [value];
exports.normalizeMachineLearningJobIds = normalizeMachineLearningJobIds;