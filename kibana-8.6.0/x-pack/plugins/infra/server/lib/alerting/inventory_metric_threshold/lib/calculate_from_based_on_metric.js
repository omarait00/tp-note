"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateFromBasedOnMetric = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _inventory_models = require("../../../../../common/inventory_models");
var _is_rate = require("./is_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const calculateFromBasedOnMetric = (to, condition, nodeType, metric, customMetric) => {
  const inventoryModel = (0, _inventory_models.findInventoryModel)(nodeType);
  const metricAgg = inventoryModel.metrics.snapshot[metric];
  if ((0, _is_rate.isRate)(metricAgg, customMetric)) {
    return (0, _moment.default)(to).subtract(condition.timeSize * 2, condition.timeUnit).valueOf();
  } else {
    return (0, _moment.default)(to).subtract(condition.timeSize, condition.timeUnit).valueOf();
  }
};
exports.calculateFromBasedOnMetric = calculateFromBasedOnMetric;