"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toMomentUnitOfTime = exports.DurationUnit = exports.Duration = void 0;
var _std = require("@kbn/std");
var moment = _interopRequireWildcard(require("moment"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var DurationUnit;
exports.DurationUnit = DurationUnit;
(function (DurationUnit) {
  DurationUnit["Minute"] = "m";
  DurationUnit["Hour"] = "h";
  DurationUnit["Day"] = "d";
  DurationUnit["Week"] = "w";
  DurationUnit["Month"] = "M";
  DurationUnit["Quarter"] = "Q";
  DurationUnit["Year"] = "Y";
})(DurationUnit || (exports.DurationUnit = DurationUnit = {}));
class Duration {
  constructor(value, unit) {
    this.value = value;
    this.unit = unit;
    if (isNaN(value) || value <= 0) {
      throw new Error('invalid duration value');
    }
    if (!Object.values(DurationUnit).includes(unit)) {
      throw new Error('invalid duration unit');
    }
  }
  isShorterThan(other) {
    const otherDurationMoment = moment.duration(other.value, toMomentUnitOfTime(other.unit));
    const currentDurationMoment = moment.duration(this.value, toMomentUnitOfTime(this.unit));
    return currentDurationMoment.asSeconds() < otherDurationMoment.asSeconds();
  }
  format() {
    return `${this.value}${this.unit}`;
  }
}
exports.Duration = Duration;
const toMomentUnitOfTime = unit => {
  switch (unit) {
    case DurationUnit.Minute:
      return 'minutes';
    case DurationUnit.Hour:
      return 'hours';
    case DurationUnit.Day:
      return 'days';
    case DurationUnit.Week:
      return 'weeks';
    case DurationUnit.Month:
      return 'months';
    case DurationUnit.Quarter:
      return 'quarters';
    case DurationUnit.Year:
      return 'years';
    default:
      (0, _std.assertNever)(unit);
  }
};
exports.toMomentUnitOfTime = toMomentUnitOfTime;