"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAuto = void 0;
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const d = _moment.default.duration;
const roundingRules = [[d(500, 'ms'), d(100, 'ms')], [d(5, 'second'), d(1, 'second')], [d(7.5, 'second'), d(5, 'second')], [d(15, 'second'), d(10, 'second')], [d(45, 'second'), d(30, 'second')], [d(3, 'minute'), d(1, 'minute')], [d(9, 'minute'), d(5, 'minute')], [d(20, 'minute'), d(10, 'minute')], [d(45, 'minute'), d(30, 'minute')], [d(2, 'hour'), d(1, 'hour')], [d(6, 'hour'), d(3, 'hour')], [d(24, 'hour'), d(12, 'hour')], [d(1, 'week'), d(1, 'd')], [d(3, 'week'), d(1, 'week')], [d(1, 'year'), d(1, 'month')], [Infinity, d(1, 'year')]];
const revRoundingRules = roundingRules.slice(0).reverse();
function find(rules, check, last) {
  function pick(buckets, duration) {
    const target = duration / buckets;
    let lastResp = null;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const resp = check(rule[0], rule[1], target);
      if (resp == null) {
        if (!last) continue;
        if (lastResp) return lastResp;
        break;
      }
      if (!last) return resp;
      lastResp = resp;
    }

    // fallback to just a number of milliseconds, ensure ms is >= 1
    const ms = Math.max(Math.floor(target), 1);
    return _moment.default.duration(ms, 'ms');
  }
  return (buckets, duration) => {
    const interval = pick(buckets, duration);
    if (interval) return _moment.default.duration(interval._data);
  };
}
const calculateAuto = {
  near: find(revRoundingRules, function near(bound, interval, target) {
    if (bound > target) return interval;
  }, true),
  lessThan: find(revRoundingRules, function lessThan(_bound, interval, target) {
    if (interval < target) return interval;
  }),
  atLeast: find(revRoundingRules, function atLeast(_bound, interval, target) {
    if (interval <= target) return interval;
  })
};
exports.calculateAuto = calculateAuto;