"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canProvideExamplesForField = void 0;
exports.getFieldExampleBuckets = getFieldExampleBuckets;
exports.getFieldValues = getFieldValues;
exports.groupValues = groupValues;
var _lodash = require("lodash");
var _common = require("../../../data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Adapted from src/plugins/discover/public/application/main/components/sidebar/lib/field_calculator.js

const canProvideExamplesForField = field => {
  if (field.name === '_score') {
    return false;
  }
  return ['string', 'text', 'keyword', 'version', 'ip', 'number'].includes(field.type);
};
exports.canProvideExamplesForField = canProvideExamplesForField;
function getFieldExampleBuckets(params) {
  params = (0, _lodash.defaults)(params, {
    count: 5
  });
  if (!canProvideExamplesForField(params.field)) {
    throw new Error(`Analysis is not available this field type: "${params.field.type}". Field name: "${params.field.name}"`);
  }
  const records = getFieldValues(params.hits, params.field, params.dataView);
  const {
    groups,
    sampledValues
  } = groupValues(records);
  const buckets = (0, _lodash.sortBy)(groups, ['count', 'order']).reverse().slice(0, params.count).map(bucket => (0, _lodash.pick)(bucket, ['key', 'count']));
  return {
    buckets,
    sampledValues,
    sampledDocuments: params.hits.length
  };
}
function getFieldValues(hits, field, dataView) {
  return (0, _lodash.map)(hits, function (hit) {
    return (0, _common.flattenHit)(hit, dataView, {
      includeIgnoredValues: true
    })[field.name];
  });
}
function groupValues(records) {
  const groups = {};
  let sampledValues = 0; // counts in each value's occurrence but only once per a record

  records.forEach(function (recordValues) {
    if ((0, _lodash.isObject)(recordValues) && !Array.isArray(recordValues)) {
      throw new Error('Analysis is not available for object fields.');
    }
    let order = 0; // will be used for ordering terms with the same 'count'
    let values;
    const visitedValuesMap = {};
    if (Array.isArray(recordValues)) {
      values = recordValues;
    } else {
      values = recordValues == null ? [] : [recordValues];
    }
    values.forEach(value => {
      if (visitedValuesMap[value]) {
        // already counted in groups
        return;
      }
      if (groups.hasOwnProperty(value)) {
        groups[value].count++;
      } else {
        groups[value] = {
          key: value,
          count: 1,
          order: order++
        };
      }
      visitedValuesMap[value] = true;
      sampledValues++;
    });
  });
  return {
    groups,
    sampledValues
  };
}