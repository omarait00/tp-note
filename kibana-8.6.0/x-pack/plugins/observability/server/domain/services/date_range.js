"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDateRange = void 0;
var _std = require("@kbn/std");
var _moment = _interopRequireDefault(require("moment"));
var _models = require("../models");
var _schema = require("../../types/schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const toDateRange = (timeWindow, currentDate = new Date()) => {
  if (_schema.calendarAlignedTimeWindowSchema.is(timeWindow)) {
    const unit = (0, _models.toMomentUnitOfTime)(timeWindow.duration.unit);
    const now = _moment.default.utc(currentDate).startOf('minute');
    const startTime = _moment.default.utc(timeWindow.calendar.start_time);
    const differenceInUnit = now.diff(startTime, unit);
    if (differenceInUnit < 0) {
      throw new Error('Cannot compute date range with future starting time');
    }
    const from = startTime.clone().add(differenceInUnit, unit);
    const to = from.clone().add(timeWindow.duration.value, unit);
    return {
      from: from.toDate(),
      to: to.toDate()
    };
  }
  if (_schema.rollingTimeWindowSchema.is(timeWindow)) {
    const unit = (0, _models.toMomentUnitOfTime)(timeWindow.duration.unit);
    const now = (0, _moment.default)(currentDate).startOf('minute');
    return {
      from: now.clone().subtract(timeWindow.duration.value, unit).toDate(),
      to: now.toDate()
    };
  }
  (0, _std.assertNever)(timeWindow);
};
exports.toDateRange = toDateRange;