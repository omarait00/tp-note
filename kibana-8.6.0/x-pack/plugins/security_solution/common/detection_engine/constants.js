"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RULE_PREVIEW_INVOCATION_COUNT = exports.RULE_PREVIEW_INTERVAL = exports.RULE_PREVIEW_FROM = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let RULE_PREVIEW_INVOCATION_COUNT;
exports.RULE_PREVIEW_INVOCATION_COUNT = RULE_PREVIEW_INVOCATION_COUNT;
(function (RULE_PREVIEW_INVOCATION_COUNT) {
  RULE_PREVIEW_INVOCATION_COUNT[RULE_PREVIEW_INVOCATION_COUNT["HOUR"] = 12] = "HOUR";
  RULE_PREVIEW_INVOCATION_COUNT[RULE_PREVIEW_INVOCATION_COUNT["DAY"] = 24] = "DAY";
  RULE_PREVIEW_INVOCATION_COUNT[RULE_PREVIEW_INVOCATION_COUNT["WEEK"] = 168] = "WEEK";
  RULE_PREVIEW_INVOCATION_COUNT[RULE_PREVIEW_INVOCATION_COUNT["MONTH"] = 30] = "MONTH";
})(RULE_PREVIEW_INVOCATION_COUNT || (exports.RULE_PREVIEW_INVOCATION_COUNT = RULE_PREVIEW_INVOCATION_COUNT = {}));
let RULE_PREVIEW_INTERVAL;
exports.RULE_PREVIEW_INTERVAL = RULE_PREVIEW_INTERVAL;
(function (RULE_PREVIEW_INTERVAL) {
  RULE_PREVIEW_INTERVAL["HOUR"] = "5m";
  RULE_PREVIEW_INTERVAL["DAY"] = "1h";
  RULE_PREVIEW_INTERVAL["WEEK"] = "1h";
  RULE_PREVIEW_INTERVAL["MONTH"] = "1d";
})(RULE_PREVIEW_INTERVAL || (exports.RULE_PREVIEW_INTERVAL = RULE_PREVIEW_INTERVAL = {}));
let RULE_PREVIEW_FROM;
exports.RULE_PREVIEW_FROM = RULE_PREVIEW_FROM;
(function (RULE_PREVIEW_FROM) {
  RULE_PREVIEW_FROM["HOUR"] = "now-6m";
  RULE_PREVIEW_FROM["DAY"] = "now-65m";
  RULE_PREVIEW_FROM["WEEK"] = "now-65m";
  RULE_PREVIEW_FROM["MONTH"] = "now-25h";
})(RULE_PREVIEW_FROM || (exports.RULE_PREVIEW_FROM = RULE_PREVIEW_FROM = {}));