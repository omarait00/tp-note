"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildThresholdSignalHistory = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _field_names = require("../../../../../common/field_maps/field_names");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTerms = alert => {
  if ((0, _utils.isWrappedDetectionAlert)(alert)) {
    const parameters = alert._source[_ruleDataUtils.ALERT_RULE_PARAMETERS];
    return parameters.threshold.field.map(field => ({
      field,
      value: alert._source[field]
    }));
  } else if ((0, _utils.isWrappedSignalHit)(alert)) {
    var _alert$_source$signal, _alert$_source$signal2, _alert$_source$signal3;
    return (_alert$_source$signal = (_alert$_source$signal2 = alert._source.signal) === null || _alert$_source$signal2 === void 0 ? void 0 : (_alert$_source$signal3 = _alert$_source$signal2.threshold_result) === null || _alert$_source$signal3 === void 0 ? void 0 : _alert$_source$signal3.terms) !== null && _alert$_source$signal !== void 0 ? _alert$_source$signal : [];
  } else {
    // We shouldn't be here
    return [];
  }
};
const getOriginalTime = alert => {
  if ((0, _utils.isWrappedDetectionAlert)(alert)) {
    const originalTime = alert._source[_field_names.ALERT_ORIGINAL_TIME];
    return originalTime != null ? new Date(originalTime).getTime() : undefined;
  } else if ((0, _utils.isWrappedSignalHit)(alert)) {
    var _alert$_source$signal4;
    const originalTime = (_alert$_source$signal4 = alert._source.signal) === null || _alert$_source$signal4 === void 0 ? void 0 : _alert$_source$signal4.original_time;
    return originalTime != null ? new Date(originalTime).getTime() : undefined;
  } else {
    // We shouldn't be here
    return undefined;
  }
};
const buildThresholdSignalHistory = ({
  alerts
}) => {
  const signalHistory = alerts.reduce((acc, alert) => {
    if (!alert._source) {
      return acc;
    }
    const terms = getTerms(alert);
    const hash = (0, _utils.getThresholdTermsHash)(terms);
    const existing = acc[hash];
    const originalTime = getOriginalTime(alert);
    if (existing != null) {
      if (originalTime && originalTime > existing.lastSignalTimestamp) {
        acc[hash].lastSignalTimestamp = originalTime;
      }
    } else if (originalTime) {
      acc[hash] = {
        terms,
        lastSignalTimestamp: originalTime
      };
    }
    return acc;
  }, {});
  return signalHistory;
};
exports.buildThresholdSignalHistory = buildThresholdSignalHistory;