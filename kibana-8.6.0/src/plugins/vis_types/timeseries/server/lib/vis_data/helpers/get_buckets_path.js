"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketsPath = void 0;
var _lodash = require("lodash");
var _common = require("../../../../../../data/common");
var _to_percentile_number = require("../../../../common/to_percentile_number");
var _enums = require("../../../../common/enums");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const percentileTest = /\[[0-9\.]+\]$/;
const getBucketsPath = (id, metrics) => {
  var _metric$percentiles;
  const metric = metrics.find(m => (0, _lodash.startsWith)(id, m.id));
  let bucketsPath = String(id);
  if (metric) {
    switch (metric.type) {
      case _common.METRIC_TYPES.DERIVATIVE:
        bucketsPath += '[normalized_value]';
        break;
      // For percentiles we need to breakout the percentile key that the user
      // specified. This information is stored in the key using the following pattern
      // {metric.id}[{percentile}]
      case _enums.TSVB_METRIC_TYPES.PERCENTILE:
        if (percentileTest.test(bucketsPath)) break;
        if ((_metric$percentiles = metric.percentiles) !== null && _metric$percentiles !== void 0 && _metric$percentiles.length) {
          const percent = metric.percentiles[0];
          bucketsPath += `[${(0, _to_percentile_number.toPercentileNumber)(percent.value)}]`;
        }
        break;
      case _enums.TSVB_METRIC_TYPES.PERCENTILE_RANK:
        if (percentileTest.test(bucketsPath)) break;
        bucketsPath += `[${(0, _to_percentile_number.toPercentileNumber)(metric.value)}]`;
        break;
      case _enums.TSVB_METRIC_TYPES.STD_DEVIATION:
      case _enums.TSVB_METRIC_TYPES.VARIANCE:
      case _enums.TSVB_METRIC_TYPES.SUM_OF_SQUARES:
        if (/^std_deviation/.test(metric.type) && ['upper', 'lower'].includes(metric.mode)) {
          bucketsPath += `[std_${metric.mode}]`;
        } else {
          bucketsPath += `[${metric.type}]`;
        }
        break;
    }
  }
  return bucketsPath;
};
exports.getBucketsPath = getBucketsPath;