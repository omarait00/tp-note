"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareTimeKeys = compareTimeKeys;
exports.timeKeyRT = exports.timeKeyIsBetween = exports.pickTimeKey = exports.minimalTimeKeyRT = exports.isTimeKey = exports.isSameTimeKey = exports.getPreviousTimeKey = exports.getNextTimeKey = exports.getIndexAtTimeKey = exports.compareToTimeKey = void 0;
var _d3Array = require("d3-array");
var rt = _interopRequireWildcard(require("io-ts"));
var _lodash = require("lodash");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const minimalTimeKeyRT = rt.type({
  time: rt.number,
  tiebreaker: rt.number
});
exports.minimalTimeKeyRT = minimalTimeKeyRT;
const timeKeyRT = rt.intersection([minimalTimeKeyRT, rt.partial({
  gid: rt.string,
  fromAutoReload: rt.boolean
})]);
exports.timeKeyRT = timeKeyRT;
const isTimeKey = value => value && typeof value === 'object' && typeof value.time === 'number' && typeof value.tiebreaker === 'number';
exports.isTimeKey = isTimeKey;
const pickTimeKey = value => (0, _lodash.pick)(value, ['time', 'tiebreaker']);
exports.pickTimeKey = pickTimeKey;
function compareTimeKeys(firstKey, secondKey, compareValues = _d3Array.ascending) {
  const timeComparison = compareValues(firstKey.time, secondKey.time);
  if (timeComparison === 0) {
    const tiebreakerComparison = compareValues(firstKey.tiebreaker, secondKey.tiebreaker);
    if (tiebreakerComparison === 0 && typeof firstKey.gid !== 'undefined' && typeof secondKey.gid !== 'undefined') {
      return compareValues(firstKey.gid, secondKey.gid);
    }
    return tiebreakerComparison;
  }
  return timeComparison;
}
const compareToTimeKey = (keyAccessor, compareValues) => (value, key) => compareTimeKeys(keyAccessor(value), key, compareValues);
exports.compareToTimeKey = compareToTimeKey;
const getIndexAtTimeKey = (keyAccessor, compareValues) => {
  const comparator = compareToTimeKey(keyAccessor, compareValues);
  const collectionBisector = (0, _d3Array.bisector)(comparator);
  return (collection, key) => {
    const index = collectionBisector.left(collection, key);
    if (index >= collection.length) {
      return null;
    }
    if (comparator(collection[index], key) !== 0) {
      return null;
    }
    return index;
  };
};
exports.getIndexAtTimeKey = getIndexAtTimeKey;
const timeKeyIsBetween = (min, max, operand) => compareTimeKeys(min, operand) <= 0 && compareTimeKeys(max, operand) >= 0;
exports.timeKeyIsBetween = timeKeyIsBetween;
const getPreviousTimeKey = timeKey => ({
  ...timeKey,
  time: timeKey.time,
  tiebreaker: timeKey.tiebreaker - 1
});
exports.getPreviousTimeKey = getPreviousTimeKey;
const getNextTimeKey = timeKey => ({
  ...timeKey,
  time: timeKey.time,
  tiebreaker: timeKey.tiebreaker + 1
});
exports.getNextTimeKey = getNextTimeKey;
const isSameTimeKey = (firstKey, secondKey) => firstKey === secondKey || firstKey != null && secondKey != null && compareTimeKeys(firstKey, secondKey) === 0;
exports.isSameTimeKey = isSameTimeKey;