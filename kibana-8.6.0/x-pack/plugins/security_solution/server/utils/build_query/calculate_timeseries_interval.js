"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateTimeSeriesInterval = void 0;
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 ** Applying the same logic as:
 ** x-pack/plugins/apm/server/lib/helpers/get_bucket_size/calculate_auto.js
 */

const calculateTimeSeriesInterval = (from, to) => {
  return `${Math.floor((0, _moment.default)(to).diff((0, _moment.default)(from)) / 32)}ms`;
};
exports.calculateTimeSeriesInterval = calculateTimeSeriesInterval;