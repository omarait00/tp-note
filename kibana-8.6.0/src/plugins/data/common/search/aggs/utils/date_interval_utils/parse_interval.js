"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseInterval = parseInterval;
exports.splitStringInterval = void 0;
var _lodash = require("lodash");
var _moment = _interopRequireDefault(require("moment"));
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Assume interval is in the form (value)(unit), such as "1h"
const INTERVAL_STRING_RE = new RegExp('^([0-9\\.]*)\\s*(' + _datemath.default.units.join('|') + ')$');
const splitStringInterval = interval => {
  if (interval) {
    const matches = interval.toString().trim().match(INTERVAL_STRING_RE);
    if (matches) {
      return {
        value: parseFloat(matches[1]) || 1,
        unit: matches[2]
      };
    }
  }
  return null;
};
exports.splitStringInterval = splitStringInterval;
function parseInterval(interval) {
  const parsedInterval = splitStringInterval(interval);
  if (!parsedInterval) return null;
  try {
    const {
      value,
      unit
    } = parsedInterval;
    const duration = _moment.default.duration(value, unit);

    // There is an error with moment, where if you have a fractional interval between 0 and 1, then when you add that
    // interval to an existing moment object, it will remain unchanged, which causes problems in the ordered_x_keys
    // code. To counteract this, we find the first unit that doesn't result in a value between 0 and 1.
    // For example, if you have '0.5d', then when calculating the x-axis series, we take the start date and begin
    // adding 0.5 days until we hit the end date. However, since there is a bug in moment, when you add 0.5 days to
    // the start date, you get the same exact date (instead of being ahead by 12 hours). So instead of returning
    // a duration corresponding to 0.5 hours, we return a duration corresponding to 12 hours.
    const selectedUnit = (0, _lodash.find)(_datemath.default.units, u => Math.abs(duration.as(u)) >= 1);

    // however if we do this fhe other way around it will also fail
    // go from 500m to hours as this will result in infinite number (dividing 500/60 = 8.3*)
    // so we can only do this if we are changing to smaller units
    if (_datemath.default.units.indexOf(selectedUnit) < _datemath.default.units.indexOf(unit)) {
      return duration;
    }
    return _moment.default.duration(duration.as(selectedUnit), selectedUnit);
  } catch (e) {
    return null;
  }
}