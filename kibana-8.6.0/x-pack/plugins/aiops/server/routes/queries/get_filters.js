"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilters = getFilters;
exports.rangeQuery = rangeQuery;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function rangeQuery(start, end, field = '@timestamp') {
  return [{
    range: {
      [field]: {
        gte: start,
        lte: end,
        format: 'epoch_millis'
      }
    }
  }];
}
function getFilters({
  start,
  end,
  timeFieldName
}) {
  const filters = [];
  if (timeFieldName !== '') {
    filters.push(...rangeQuery(start, end, timeFieldName));
  }
  return filters;
}