"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSLO = validateSLO;
var _errors = require("../../errors");
var _duration = require("../models/duration");
var _schema = require("../../types/schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Asserts the SLO is valid from a business invariants point of view.
 * e.g. a 'target' objective requires a number between ]0, 1]
 * e.g. a 'timeslices' budgeting method requires an objective's timeslice_target to be defined.
 *
 * @param slo {SLO}
 */
function validateSLO(slo) {
  if (!isValidTargetNumber(slo.objective.target)) {
    throw new _errors.IllegalArgumentError('Invalid objective.target');
  }
  if (!isValidTimeWindowDuration(slo.time_window.duration)) {
    throw new _errors.IllegalArgumentError('Invalid time_window.duration');
  }
  if (_schema.timeslicesBudgetingMethodSchema.is(slo.budgeting_method)) {
    if (slo.objective.timeslice_target === undefined || !isValidTargetNumber(slo.objective.timeslice_target)) {
      throw new _errors.IllegalArgumentError('Invalid objective.timeslice_target');
    }
    if (slo.objective.timeslice_window === undefined || !isValidTimesliceWindowDuration(slo.objective.timeslice_window, slo.time_window.duration)) {
      throw new _errors.IllegalArgumentError('Invalid objective.timeslice_window');
    }
  }
}
function isValidTargetNumber(value) {
  return value > 0 && value < 1;
}
function isValidTimeWindowDuration(duration) {
  return [_duration.DurationUnit.Day, _duration.DurationUnit.Week, _duration.DurationUnit.Month, _duration.DurationUnit.Quarter, _duration.DurationUnit.Year].includes(duration.unit);
}
function isValidTimesliceWindowDuration(timesliceWindow, timeWindow) {
  return [_duration.DurationUnit.Minute, _duration.DurationUnit.Hour].includes(timesliceWindow.unit) && timesliceWindow.isShorterThan(timeWindow);
}