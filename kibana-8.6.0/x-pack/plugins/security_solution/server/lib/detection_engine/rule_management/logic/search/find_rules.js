"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRules = void 0;
var _enrich_filter_with_rule_type_mappings = require("./enrich_filter_with_rule_type_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findRules = ({
  rulesClient,
  perPage,
  page,
  fields,
  filter,
  sortField,
  sortOrder
}) => {
  return rulesClient.find({
    options: {
      fields,
      page,
      perPage,
      filter: (0, _enrich_filter_with_rule_type_mappings.enrichFilterWithRuleTypeMapping)(filter),
      sortOrder,
      sortField
    }
  });
};
exports.findRules = findRules;