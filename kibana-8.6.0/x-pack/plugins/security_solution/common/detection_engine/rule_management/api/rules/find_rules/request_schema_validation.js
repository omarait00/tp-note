"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateFindRulesRequestQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Additional validation that is implemented outside of the schema itself.
 */
const validateFindRulesRequestQuery = query => {
  return [...validateSortOrder(query)];
};
exports.validateFindRulesRequestQuery = validateFindRulesRequestQuery;
const validateSortOrder = query => {
  if (query.sort_order != null || query.sort_field != null) {
    if (query.sort_order == null || query.sort_field == null) {
      return ['when "sort_order" and "sort_field" must exist together or not at all'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};