"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRateAggsBuckets = exports.createRateAggsBucketScript = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _calculate_rate_timeranges = require("../../inventory_metric_threshold/lib/calculate_rate_timeranges");
var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRateAggsBucketScript = (timeframe, id) => {
  const {
    intervalInSeconds
  } = (0, _calculate_rate_timeranges.calculateRateTimeranges)({
    to: timeframe.end,
    from: timeframe.start
  });
  return {
    [id]: {
      bucket_script: {
        buckets_path: {
          first: `currentPeriod>${id}_first_bucket.maxValue`,
          second: `currentPeriod>${id}_second_bucket.maxValue`
        },
        script: `params.second > 0.0 && params.first > 0.0 && params.second > params.first ? (params.second - params.first) / ${intervalInSeconds}: null`
      }
    }
  };
};
exports.createRateAggsBucketScript = createRateAggsBucketScript;
const createRateAggsBuckets = (timeframe, id, field) => {
  const {
    firstBucketRange,
    secondBucketRange
  } = (0, _calculate_rate_timeranges.calculateRateTimeranges)({
    to: timeframe.end,
    from: timeframe.start
  });
  return {
    [`${id}_first_bucket`]: {
      filter: {
        range: {
          [_constants.TIMESTAMP_FIELD]: {
            gte: (0, _moment.default)(firstBucketRange.from).toISOString(),
            lt: (0, _moment.default)(firstBucketRange.to).toISOString()
          }
        }
      },
      aggs: {
        maxValue: {
          max: {
            field
          }
        }
      }
    },
    [`${id}_second_bucket`]: {
      filter: {
        range: {
          [_constants.TIMESTAMP_FIELD]: {
            gte: (0, _moment.default)(secondBucketRange.from).toISOString(),
            lt: (0, _moment.default)(secondBucketRange.to).toISOString()
          }
        }
      },
      aggs: {
        maxValue: {
          max: {
            field
          }
        }
      }
    }
  };
};
exports.createRateAggsBuckets = createRateAggsBuckets;