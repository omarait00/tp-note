"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildBaseFilterCriteria = buildBaseFilterCriteria;
exports.getSafeAggregationName = getSafeAggregationName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Contains utility functions for building and processing queries.
 */

// Builds the base filter criteria used in queries,
// adding criteria for the time range and an optional query.
function buildBaseFilterCriteria(timeFieldName, earliestMs, latestMs, query) {
  const filterCriteria = [];
  if (timeFieldName && earliestMs && latestMs) {
    filterCriteria.push({
      range: {
        [timeFieldName]: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    });
  }
  if (query && typeof query === 'object') {
    filterCriteria.push(query);
  }
  return filterCriteria;
}

// Returns a name which is safe to use in elasticsearch aggregations for the supplied
// field name. Aggregation names must be alpha-numeric and can only contain '_' and '-' characters,
// so if the supplied field names contains disallowed characters, the provided index
// identifier is used to return a safe 'dummy' name in the format 'field_index' e.g. field_0, field_1
function getSafeAggregationName(fieldName, index) {
  return fieldName.match(/^[a-zA-Z0-9-_.]+$/) ? fieldName : `field_${index}`;
}