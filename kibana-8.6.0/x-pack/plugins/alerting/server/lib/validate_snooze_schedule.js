"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSnoozeSchedule = void 0;
var _rrule = require("rrule");
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateSnoozeSchedule = schedule => {
  const intervalIsDaily = schedule.rRule.freq === _rrule.Frequency.DAILY;
  const durationInDays = _moment.default.duration(schedule.duration, 'milliseconds').asDays();
  if (intervalIsDaily && schedule.rRule.interval && durationInDays >= schedule.rRule.interval) {
    return 'Recurrence interval must be longer than the snooze duration';
  }
};
exports.validateSnoozeSchedule = validateSnoozeSchedule;