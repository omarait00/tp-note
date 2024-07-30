"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUserRiskScore = exports.SEVERITY_UI_SORT_ORDER = exports.RiskSeverity = exports.RiskScoreFields = exports.EMPTY_SEVERITY_COUNT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let RiskScoreFields;
exports.RiskScoreFields = RiskScoreFields;
(function (RiskScoreFields) {
  RiskScoreFields["timestamp"] = "@timestamp";
  RiskScoreFields["hostName"] = "host.name";
  RiskScoreFields["hostRiskScore"] = "host.risk.calculated_score_norm";
  RiskScoreFields["hostRisk"] = "host.risk.calculated_level";
  RiskScoreFields["userName"] = "user.name";
  RiskScoreFields["userRiskScore"] = "user.risk.calculated_score_norm";
  RiskScoreFields["userRisk"] = "user.risk.calculated_level";
  RiskScoreFields["alertsCount"] = "alertsCount";
})(RiskScoreFields || (exports.RiskScoreFields = RiskScoreFields = {}));
let RiskSeverity;
exports.RiskSeverity = RiskSeverity;
(function (RiskSeverity) {
  RiskSeverity["unknown"] = "Unknown";
  RiskSeverity["low"] = "Low";
  RiskSeverity["moderate"] = "Moderate";
  RiskSeverity["high"] = "High";
  RiskSeverity["critical"] = "Critical";
})(RiskSeverity || (exports.RiskSeverity = RiskSeverity = {}));
const isUserRiskScore = risk => 'user' in risk;
exports.isUserRiskScore = isUserRiskScore;
const EMPTY_SEVERITY_COUNT = {
  [RiskSeverity.critical]: 0,
  [RiskSeverity.high]: 0,
  [RiskSeverity.low]: 0,
  [RiskSeverity.moderate]: 0,
  [RiskSeverity.unknown]: 0
};
exports.EMPTY_SEVERITY_COUNT = EMPTY_SEVERITY_COUNT;
const SEVERITY_UI_SORT_ORDER = [RiskSeverity.unknown, RiskSeverity.low, RiskSeverity.moderate, RiskSeverity.high, RiskSeverity.critical];
exports.SEVERITY_UI_SORT_ORDER = SEVERITY_UI_SORT_ORDER;