"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mbSafeQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function is designed to enable us to query against `.monitoring-*` and `metricbeat-*`
 * indices SAFELY. We are adding the proper aliases into `metricbeat-*` to ensure all existing
 * queries/aggs continue to work but we need to handle the reality that these aliases will not
 * exist for older metricbeat-* indices, created before the aliases existed.
 *
 * Certain parts of a query will fail in this scenario, throwing an exception because of unmapped fields.
 * So far, this is known to affect `sort` and `collapse` search query parameters. We have a way
 * to handle this error elegantly with `sort` but not with `collapse` so we handle it manually in this spot.
 *
 * We can add future edge cases in here as well.
 *
 * @param queryExecutor
 */
const mbSafeQuery = async queryExecutor => {
  try {
    return await queryExecutor();
  } catch (err) {
    if (err.message.includes('no mapping found for') && err.message.includes('in order to collapse on')) {
      return {};
    }
    throw err;
  }
};
exports.mbSafeQuery = mbSafeQuery;