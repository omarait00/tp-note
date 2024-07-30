"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSnoozeActive = isSnoozeActive;
exports.parseByWeekday = parseByWeekday;
var _rrule = require("rrule");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_TIMESTAMP = 8640000000000000;
function isSnoozeActive(snooze) {
  var _snooze$skipRecurrenc;
  const {
    duration,
    rRule,
    id
  } = snooze;
  if (duration === -1) return {
    id,
    snoozeEndTime: new Date(MAX_TIMESTAMP)
  };
  const startTimeMS = Date.parse(rRule.dtstart);
  const initialEndTime = startTimeMS + duration;
  const isInitialStartSkipped = (_snooze$skipRecurrenc = snooze.skipRecurrences) === null || _snooze$skipRecurrenc === void 0 ? void 0 : _snooze$skipRecurrenc.includes(rRule.dtstart);
  // If now is during the first occurrence of the snooze
  const now = Date.now();
  if (now >= startTimeMS && now < initialEndTime && !isInitialStartSkipped) return {
    snoozeEndTime: new Date(initialEndTime),
    lastOccurrence: new Date(rRule.dtstart),
    id
  };

  // Check to see if now is during a recurrence of the snooze
  try {
    var _snooze$skipRecurrenc2;
    const rRuleOptions = {
      ...rRule,
      dtstart: new Date(rRule.dtstart),
      until: rRule.until ? new Date(rRule.until) : null,
      wkst: rRule.wkst ? _rrule.Weekday.fromStr(rRule.wkst) : null,
      byweekday: rRule.byweekday ? parseByWeekday(rRule.byweekday) : null
    };
    const recurrenceRule = new _rrule.RRule(rRuleOptions);
    const lastOccurrence = recurrenceRule.before(new Date(now), true);
    if (!lastOccurrence) return null;
    // Check if the current recurrence has been skipped manually
    if ((_snooze$skipRecurrenc2 = snooze.skipRecurrences) !== null && _snooze$skipRecurrenc2 !== void 0 && _snooze$skipRecurrenc2.includes(lastOccurrence.toISOString())) return null;
    const lastOccurrenceEndTime = lastOccurrence.getTime() + duration;
    if (now < lastOccurrenceEndTime) return {
      lastOccurrence,
      snoozeEndTime: new Date(lastOccurrenceEndTime),
      id
    };
  } catch (e) {
    throw new Error(`Failed to process RRule ${rRule}: ${e}`);
  }
  return null;
}
function parseByWeekday(byweekday) {
  const rRuleString = `RRULE:BYDAY=${byweekday.join(',')}`;
  const parsedRRule = (0, _rrule.rrulestr)(rRuleString);
  return parsedRRule.origOptions.byweekday;
}