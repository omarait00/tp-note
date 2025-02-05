"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapInCurrentPeriod = exports.createLastPeriod = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLastPeriod = (lastPeriodEnd, {
  timeUnit,
  timeSize
}) => {
  const start = (0, _moment.default)(lastPeriodEnd).subtract(timeSize, timeUnit).toISOString();
  return {
    lastPeriod: {
      filter: {
        range: {
          [_constants.TIMESTAMP_FIELD]: {
            gte: start,
            lte: (0, _moment.default)(lastPeriodEnd).toISOString()
          }
        }
      }
    }
  };
};
exports.createLastPeriod = createLastPeriod;
const wrapInCurrentPeriod = (timeframe, aggs) => {
  return {
    currentPeriod: {
      filter: {
        range: {
          [_constants.TIMESTAMP_FIELD]: {
            gte: (0, _moment.default)(timeframe.start).toISOString(),
            lte: (0, _moment.default)(timeframe.end).toISOString()
          }
        }
      },
      aggs
    }
  };
};
exports.wrapInCurrentPeriod = wrapInCurrentPeriod;