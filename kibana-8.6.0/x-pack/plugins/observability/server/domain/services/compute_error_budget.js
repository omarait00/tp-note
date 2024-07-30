"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeErrorBudget = computeErrorBudget;
var _moment = _interopRequireDefault(require("moment"));
var _models = require("../models");
var _schema = require("../../types/schema");
var _number = require("../../utils/number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// More details about calculus: https://github.com/elastic/kibana/issues/143980
function computeErrorBudget(slo, sliData) {
  const {
    good,
    total,
    date_range: dateRange
  } = sliData;
  const initialErrorBudget = (0, _number.toHighPrecision)(1 - slo.objective.target);
  if (total === 0 || good >= total) {
    return {
      initial: initialErrorBudget,
      consumed: 0,
      remaining: 1
    };
  }
  if (_schema.timeslicesBudgetingMethodSchema.is(slo.budgeting_method) && _schema.calendarAlignedTimeWindowSchema.is(slo.time_window)) {
    const dateRangeDurationInUnit = (0, _moment.default)(dateRange.to).diff(dateRange.from, (0, _models.toMomentUnitOfTime)(slo.objective.timeslice_window.unit));
    const totalSlices = Math.ceil(dateRangeDurationInUnit / slo.objective.timeslice_window.value);
    const consumedErrorBudget = (0, _number.toHighPrecision)((total - good) / (totalSlices * initialErrorBudget));
    const remainingErrorBudget = Math.max((0, _number.toHighPrecision)(1 - consumedErrorBudget), 0);
    return {
      initial: initialErrorBudget,
      consumed: consumedErrorBudget,
      remaining: remainingErrorBudget
    };
  }
  const consumedErrorBudget = (0, _number.toHighPrecision)((total - good) / (total * initialErrorBudget));
  const remainingErrorBudget = Math.max((0, _number.toHighPrecision)(1 - consumedErrorBudget), 0);
  return {
    initial: initialErrorBudget,
    consumed: consumedErrorBudget,
    remaining: remainingErrorBudget
  };
}