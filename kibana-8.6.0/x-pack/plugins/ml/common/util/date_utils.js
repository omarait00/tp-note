"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAbsoluteTimeRange = createAbsoluteTimeRange;
exports.formatHumanReadableDate = formatHumanReadableDate;
exports.formatHumanReadableDateTime = formatHumanReadableDateTime;
exports.formatHumanReadableDateTimeSeconds = formatHumanReadableDateTimeSeconds;
exports.timeFormatter = void 0;
exports.validateTimeRange = validateTimeRange;
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _eui = require("@elastic/eui");
var _time_format = require("../constants/time_format");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// utility functions for handling dates

function formatHumanReadableDate(ts) {
  return (0, _eui.formatDate)(ts, 'MMMM Do YYYY');
}
function formatHumanReadableDateTime(ts) {
  return (0, _eui.formatDate)(ts, 'MMMM Do YYYY, HH:mm');
}
function formatHumanReadableDateTimeSeconds(ts) {
  return (0, _eui.formatDate)(ts, 'MMMM Do YYYY, HH:mm:ss');
}
function validateTimeRange(time) {
  if (!time) return false;
  const momentDateFrom = _datemath.default.parse(time.from);
  const momentDateTo = _datemath.default.parse(time.to);
  return !!(momentDateFrom && momentDateFrom.isValid() && momentDateTo && momentDateTo.isValid());
}
function createAbsoluteTimeRange(time) {
  var _dateMath$parse, _dateMath$parse2;
  if (validateTimeRange(time) === false) {
    return null;
  }
  return {
    to: (_dateMath$parse = _datemath.default.parse(time.to)) === null || _dateMath$parse === void 0 ? void 0 : _dateMath$parse.valueOf(),
    from: (_dateMath$parse2 = _datemath.default.parse(time.from)) === null || _dateMath$parse2 === void 0 ? void 0 : _dateMath$parse2.valueOf()
  };
}
const timeFormatter = value => {
  return (0, _eui.formatDate)(value, _time_format.TIME_FORMAT);
};
exports.timeFormatter = timeFormatter;