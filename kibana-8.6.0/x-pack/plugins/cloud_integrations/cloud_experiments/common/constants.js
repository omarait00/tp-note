"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METRIC_NAMES = exports.FEATURE_FLAG_NAMES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/**
 * List of feature flag names used in Kibana.
 *
 * Feel free to add/remove entries if needed.
 *
 * As a convention, the key and the value have the same string.
 *
 * @remarks Kept centralized in this place to serve as a repository
 * to help devs understand if there is someone else already using it.
 */
let FEATURE_FLAG_NAMES;
/**
 * List of LaunchDarkly metric names used in Kibana.
 *
 * Feel free to add/remove entries if needed.
 *
 * As a convention, the key and the value have the same string.
 *
 * @remarks Kept centralized in this place to serve as a repository
 * to help devs understand if there is someone else already using it.
 */
exports.FEATURE_FLAG_NAMES = FEATURE_FLAG_NAMES;
(function (FEATURE_FLAG_NAMES) {
  FEATURE_FLAG_NAMES["security-solutions.add-integrations-url"] = "security-solutions.add-integrations-url";
})(FEATURE_FLAG_NAMES || (exports.FEATURE_FLAG_NAMES = FEATURE_FLAG_NAMES = {}));
let METRIC_NAMES;
exports.METRIC_NAMES = METRIC_NAMES;
(function (METRIC_NAMES) {})(METRIC_NAMES || (exports.METRIC_NAMES = METRIC_NAMES = {}));