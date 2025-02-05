"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatVisualizeData = formatVisualizeData;
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function formatVisualizeData({
  aggType,
  termField
}, results) {
  if (aggType === _constants.AGG_TYPES.COUNT && !Boolean(termField)) {
    return formatCount(aggType, results);
  }
  if (aggType === _constants.AGG_TYPES.COUNT && Boolean(termField)) {
    return formatCountTerms(results);
  }
  if (aggType !== _constants.AGG_TYPES.COUNT && !Boolean(termField)) {
    return formatNonCount(aggType, results);
  }
  if (aggType !== _constants.AGG_TYPES.COUNT && Boolean(termField)) {
    return formatNonCountTerms(results);
  }
}

// Count without terms
// See ./data_samples/count.json
function formatCount(aggType, results) {
  const result = {};
  const buckets = results.aggregations.dateAgg.buckets;
  buckets.forEach(({
    key: date,
    doc_count: value
  }) => {
    result[aggType] = result[aggType] || [];
    result[aggType].push([date, value]);
  });
  return result;
}

// Count with terms
// See ./data_samples/count_terms.json
function formatCountTerms(results) {
  const result = {};
  const buckets = results.aggregations.bucketAgg.buckets;
  buckets.forEach(({
    key: term,
    dateAgg: {
      buckets: subBuckets
    }
  }) => {
    subBuckets.forEach(({
      key: date,
      doc_count: value
    }) => {
      result[term] = result[term] || [];
      result[term].push([date, value]);
    });
  });
  return result;
}

// Other metric without terms
// See ./data_samples/non_count.json
function formatNonCount(aggType, results) {
  const result = {};
  const buckets = results.aggregations.dateAgg.buckets;
  buckets.forEach(({
    key: date,
    metricAgg: {
      value
    }
  }) => {
    result[aggType] = result[aggType] || [];
    result[aggType].push([date, value]);
  });
  return result;
}

// Other metric with terms
// See ./data_samples/non_count_terms.json
function formatNonCountTerms(results) {
  const result = {};
  const buckets = results.aggregations.bucketAgg.buckets;
  buckets.forEach(({
    key: term,
    dateAgg: {
      buckets: subBuckets
    }
  }) => {
    subBuckets.forEach(({
      key: date,
      metricAgg: {
        value
      }
    }) => {
      result[term] = result[term] || [];
      result[term].push([date, value]);
    });
  });
  return result;
}