"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPrebuiltRules = void 0;
var _constants = require("../../../../../common/constants");
var _promise_pool = require("../../../../utils/promise_pool");
var _with_security_span = require("../../../../utils/with_security_span");
var _create_rules = require("../../rule_management/logic/crud/create_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createPrebuiltRules = (rulesClient, rules) => (0, _with_security_span.withSecuritySpan)('createPrebuiltRules', async () => {
  const result = await (0, _promise_pool.initPromisePool)({
    concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
    items: rules,
    executor: async rule => {
      return (0, _create_rules.createRules)({
        rulesClient,
        params: rule,
        immutable: true,
        defaultEnabled: false
      });
    }
  });
  if (result.errors.length > 0) {
    throw new AggregateError(result.errors, 'Error installing new prebuilt rules');
  }
});
exports.createPrebuiltRules = createPrebuiltRules;