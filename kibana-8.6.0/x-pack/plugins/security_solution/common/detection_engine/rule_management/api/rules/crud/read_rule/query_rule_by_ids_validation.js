"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateQueryRuleByIds = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Additional validation that is implemented outside of the schema itself.
 */
const validateQueryRuleByIds = schema => {
  return [...validateId(schema)];
};
exports.validateQueryRuleByIds = validateQueryRuleByIds;
const validateId = rule => {
  if (rule.id != null && rule.rule_id != null) {
    return ['both "id" and "rule_id" cannot exist, choose one or the other'];
  } else if (rule.id == null && rule.rule_id == null) {
    return ['either "id" or "rule_id" must be set'];
  } else {
    return [];
  }
};