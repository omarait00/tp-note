"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapseFn = void 0;
var _common = require("../../../../../../src/plugins/expressions/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getValueAsNumberArray(value) {
  if (Array.isArray(value)) {
    return value.map(innerVal => Number(innerVal));
  } else {
    return [Number(value)];
  }
}
const collapseFn = (input, {
  by,
  metric,
  fn
}) => {
  const collapseFunctionsByMetricIndex = fn.length > 1 ? fn : metric ? new Array(metric.length).fill(fn[0]) : [];
  if (metric && metric.length !== collapseFunctionsByMetricIndex.length) {
    throw Error(`lens_collapse - Called with ${metric.length} metrics and ${fn.length} collapse functions. 
Must be called with either a single collapse function for all metrics,
or a number of collapse functions matching the number of metrics.`);
  }
  const accumulators = {};
  const valueCounter = {};
  metric === null || metric === void 0 ? void 0 : metric.forEach(m => {
    accumulators[m] = {};
    valueCounter[m] = {};
  });
  const setMarker = {};
  input.rows.forEach(row => {
    const bucketIdentifier = (0, _common.getBucketIdentifier)(row, by);
    metric === null || metric === void 0 ? void 0 : metric.forEach((m, i) => {
      var _valueCounter$m$bucke;
      const accumulatorValue = accumulators[m][bucketIdentifier];
      const currentValue = row[m];
      if (currentValue != null) {
        const currentNumberValues = getValueAsNumberArray(currentValue);
        switch (collapseFunctionsByMetricIndex[i]) {
          case 'avg':
            valueCounter[m][bucketIdentifier] = ((_valueCounter$m$bucke = valueCounter[m][bucketIdentifier]) !== null && _valueCounter$m$bucke !== void 0 ? _valueCounter$m$bucke : 0) + currentNumberValues.length;
          case 'sum':
            accumulators[m][bucketIdentifier] = currentNumberValues.reduce((a, b) => a + b, accumulatorValue || 0);
            break;
          case 'min':
            if (typeof accumulatorValue !== 'undefined') {
              accumulators[m][bucketIdentifier] = Math.min(accumulatorValue, ...currentNumberValues);
            } else {
              accumulators[m][bucketIdentifier] = Math.min(...currentNumberValues);
            }
            break;
          case 'max':
            if (typeof accumulatorValue !== 'undefined') {
              accumulators[m][bucketIdentifier] = Math.max(accumulatorValue, ...currentNumberValues);
            } else {
              accumulators[m][bucketIdentifier] = Math.max(...currentNumberValues);
            }
            break;
        }
      }
    });
  });
  metric === null || metric === void 0 ? void 0 : metric.forEach((m, i) => {
    if (collapseFunctionsByMetricIndex[i] === 'avg') {
      Object.keys(accumulators[m]).forEach(bucketIdentifier => {
        const accumulatorValue = accumulators[m][bucketIdentifier];
        const valueCount = valueCounter[m][bucketIdentifier];
        if (typeof accumulatorValue !== 'undefined' && typeof valueCount !== 'undefined') {
          accumulators[m][bucketIdentifier] = accumulatorValue / valueCount;
        }
      });
    }
  });
  return {
    ...input,
    columns: input.columns.filter(c => (by === null || by === void 0 ? void 0 : by.indexOf(c.id)) !== -1 || (metric === null || metric === void 0 ? void 0 : metric.indexOf(c.id)) !== -1),
    rows: input.rows.map(row => {
      const bucketIdentifier = (0, _common.getBucketIdentifier)(row, by);
      if (setMarker[bucketIdentifier]) return undefined;
      setMarker[bucketIdentifier] = true;
      const newRow = {};
      metric === null || metric === void 0 ? void 0 : metric.forEach(m => {
        newRow[m] = accumulators[m][bucketIdentifier];
      });
      by === null || by === void 0 ? void 0 : by.forEach(b => {
        newRow[b] = row[b];
      });
      return newRow;
    }).filter(Boolean)
  };
};
exports.collapseFn = collapseFn;