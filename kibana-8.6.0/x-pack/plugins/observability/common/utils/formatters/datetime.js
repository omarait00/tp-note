"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asAbsoluteDateTime = asAbsoluteDateTime;
exports.asRelativeDateTimeRange = asRelativeDateTimeRange;
exports.getDateDifference = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the timezone set on momentTime.
 * (UTC+offset) when offset if bigger than 0.
 * (UTC-offset) when offset if lower than 0.
 * @param momentTime Moment
 */
function formatTimezone(momentTime) {
  const DEFAULT_TIMEZONE_FORMAT = 'Z';
  const utcOffsetHours = momentTime.utcOffset() / 60;
  const customTimezoneFormat = utcOffsetHours > 0 ? `+${utcOffsetHours}` : utcOffsetHours;
  const utcOffsetFormatted = Number.isInteger(utcOffsetHours) ? customTimezoneFormat : DEFAULT_TIMEZONE_FORMAT;
  return momentTime.format(`(UTC${utcOffsetFormatted})`);
}
function getTimeFormat(timeUnit) {
  switch (timeUnit) {
    case 'hours':
      return 'HH';
    case 'minutes':
      return 'HH:mm';
    case 'seconds':
      return 'HH:mm:ss';
    case 'milliseconds':
      return 'HH:mm:ss.SSS';
    default:
      return '';
  }
}
function getDateFormat(dateUnit) {
  switch (dateUnit) {
    case 'years':
      return 'YYYY';
    case 'months':
      return 'MMM YYYY';
    case 'days':
      return 'MMM D, YYYY';
    default:
      return '';
  }
}
const getDateDifference = ({
  start,
  end,
  unitOfTime,
  precise
}) => end.diff(start, unitOfTime, precise);
exports.getDateDifference = getDateDifference;
function getFormatsAccordingToDateDifference(start, end) {
  if (getDateDifference({
    start,
    end,
    unitOfTime: 'years'
  }) >= 5) {
    return {
      dateFormat: getDateFormat('years')
    };
  }
  if (getDateDifference({
    start,
    end,
    unitOfTime: 'months'
  }) >= 5) {
    return {
      dateFormat: getDateFormat('months')
    };
  }
  const dateFormatWithDays = getDateFormat('days');
  if (getDateDifference({
    start,
    end,
    unitOfTime: 'days'
  }) > 1) {
    return {
      dateFormat: dateFormatWithDays
    };
  }
  if (getDateDifference({
    start,
    end,
    unitOfTime: 'minutes'
  }) >= 1) {
    return {
      dateFormat: dateFormatWithDays,
      timeFormat: getTimeFormat('minutes')
    };
  }
  if (getDateDifference({
    start,
    end,
    unitOfTime: 'seconds'
  }) >= 10) {
    return {
      dateFormat: dateFormatWithDays,
      timeFormat: getTimeFormat('seconds')
    };
  }
  return {
    dateFormat: dateFormatWithDays,
    timeFormat: getTimeFormat('milliseconds')
  };
}
function asAbsoluteDateTime(time, timeUnit = 'milliseconds') {
  const momentTime = (0, _momentTimezone.default)(time);
  const formattedTz = formatTimezone(momentTime);
  return momentTime.format(`${getDateFormat('days')}, ${getTimeFormat(timeUnit)} ${formattedTz}`);
}

/**
 *
 * Returns the dates formatted according to the difference between the two dates:
 *
 * | Difference     |           Format                               |
 * | -------------- |:----------------------------------------------:|
 * | >= 5 years     | YYYY - YYYY                                    |
 * | >= 5 months    | MMM YYYY - MMM YYYY                            |
 * | > 1 day        | MMM D, YYYY - MMM D, YYYY                      |
 * | >= 1 minute    | MMM D, YYYY, HH:mm - HH:mm (UTC)               |
 * | >= 10 seconds  | MMM D, YYYY, HH:mm:ss - HH:mm:ss (UTC)         |
 * | default        | MMM D, YYYY, HH:mm:ss.SSS - HH:mm:ss.SSS (UTC) |
 *
 * @param start timestamp
 * @param end timestamp
 */
function asRelativeDateTimeRange(start, end) {
  const momentStartTime = (0, _momentTimezone.default)(start);
  const momentEndTime = (0, _momentTimezone.default)(end);
  const {
    dateFormat,
    timeFormat
  } = getFormatsAccordingToDateDifference(momentStartTime, momentEndTime);
  if (timeFormat) {
    const startFormatted = momentStartTime.format(`${dateFormat}, ${timeFormat}`);
    const endFormatted = momentEndTime.format(timeFormat);
    const formattedTz = formatTimezone(momentStartTime);
    return `${startFormatted} - ${endFormatted} ${formattedTz}`;
  }
  const startFormatted = momentStartTime.format(dateFormat);
  const endFormatted = momentEndTime.format(dateFormat);
  return `${startFormatted} - ${endFormatted}`;
}