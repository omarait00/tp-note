"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRulesCount = exports.getRules = exports.getNonPackagedRulesCount = exports.getNonPackagedRules = exports.getExistingPrepackagedRules = exports.FILTER_PREPACKED_RULES = exports.FILTER_NON_PREPACKED_RULES = void 0;
var _with_security_span = require("../../../../../utils/with_security_span");
var _find_rules = require("./find_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FILTER_NON_PREPACKED_RULES = 'alert.attributes.params.immutable: false';
exports.FILTER_NON_PREPACKED_RULES = FILTER_NON_PREPACKED_RULES;
const FILTER_PREPACKED_RULES = 'alert.attributes.params.immutable: true';
exports.FILTER_PREPACKED_RULES = FILTER_PREPACKED_RULES;
const getNonPackagedRulesCount = async ({
  rulesClient
}) => {
  return getRulesCount({
    rulesClient,
    filter: FILTER_NON_PREPACKED_RULES
  });
};
exports.getNonPackagedRulesCount = getNonPackagedRulesCount;
const getRulesCount = async ({
  rulesClient,
  filter
}) => {
  return (0, _with_security_span.withSecuritySpan)('getRulesCount', async () => {
    const {
      total
    } = await (0, _find_rules.findRules)({
      rulesClient,
      filter,
      perPage: 0,
      page: 1,
      sortField: 'createdAt',
      sortOrder: 'desc',
      fields: undefined
    });
    return total;
  });
};
exports.getRulesCount = getRulesCount;
const getRules = async ({
  rulesClient,
  filter
}) => (0, _with_security_span.withSecuritySpan)('getRules', async () => {
  const count = await getRulesCount({
    rulesClient,
    filter
  });
  const rules = await (0, _find_rules.findRules)({
    rulesClient,
    filter,
    perPage: count,
    page: 1,
    sortField: 'createdAt',
    sortOrder: 'desc',
    fields: undefined
  });
  return rules.data;
});
exports.getRules = getRules;
const getNonPackagedRules = async ({
  rulesClient
}) => {
  return getRules({
    rulesClient,
    filter: FILTER_NON_PREPACKED_RULES
  });
};
exports.getNonPackagedRules = getNonPackagedRules;
const getExistingPrepackagedRules = async ({
  rulesClient
}) => {
  return getRules({
    rulesClient,
    filter: FILTER_PREPACKED_RULES
  });
};
exports.getExistingPrepackagedRules = getExistingPrepackagedRules;