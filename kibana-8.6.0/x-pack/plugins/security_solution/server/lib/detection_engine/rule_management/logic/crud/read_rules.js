"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readRules = void 0;
var _with_security_span = require("../../../../../utils/with_security_span");
var _rule_schema = require("../../../rule_schema");
var _find_rules = require("../search/find_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This reads the rules through a cascade try of what is fastest to what is slowest.
 * @param id - This is the fastest. This is the auto-generated id through the parameter id.
 * and the id will either be found through `rulesClient.get({ id })` or it will not
 * be returned as a not-found or a thrown error that is not 404.
 * @param ruleId - This is a close second to being fast as long as it can find the rule_id from
 * a filter query against the ruleId property in params using `alert.attributes.params.ruleId: "${ruleId}"`
 */
const readRules = async ({
  rulesClient,
  id,
  ruleId
}) => {
  return (0, _with_security_span.withSecuritySpan)('readRules', async () => {
    if (id != null) {
      try {
        const rule = await rulesClient.resolve({
          id
        });
        if ((0, _rule_schema.isAlertType)(rule)) {
          if ((rule === null || rule === void 0 ? void 0 : rule.outcome) === 'exactMatch') {
            const {
              outcome,
              ...restOfRule
            } = rule;
            return restOfRule;
          }
          return rule;
        } else {
          return null;
        }
      } catch (err) {
        var _err$output;
        if ((err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 404) {
          return null;
        } else {
          // throw non-404 as they would be 500 or other internal errors
          throw err;
        }
      }
    } else if (ruleId != null) {
      const ruleFromFind = await (0, _find_rules.findRules)({
        rulesClient,
        filter: `alert.attributes.params.ruleId: "${ruleId}"`,
        page: 1,
        fields: undefined,
        perPage: undefined,
        sortField: undefined,
        sortOrder: undefined
      });
      if (ruleFromFind.data.length === 0 || !(0, _rule_schema.isAlertType)(ruleFromFind.data[0])) {
        return null;
      } else {
        return ruleFromFind.data[0];
      }
    } else {
      // should never get here, and yet here we are.
      return null;
    }
  });
};
exports.readRules = readRules;