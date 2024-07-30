"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rulesToMap = exports.prebuiltRulesToMap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Converts an array of prebuilt rules to a Map with rule IDs as keys
 *
 * @param rules Array of prebuilt rules
 * @returns Map
 */
const prebuiltRulesToMap = rules => new Map(rules.map(rule => [rule.rule_id, rule]));

/**
 * Converts an array of rules to a Map with rule IDs as keys
 *
 * @param rules Array of rules
 * @returns Map
 */
exports.prebuiltRulesToMap = prebuiltRulesToMap;
const rulesToMap = rules => new Map(rules.map(rule => [rule.params.ruleId, rule]));
exports.rulesToMap = rulesToMap;