"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNNAMED_LOCATION = exports.TEST_RUN_DETAILS_ROUTE = exports.SYNTHETIC_CHECK_STEPS_ROUTE = exports.SYNTHETICS_SETTINGS_ROUTE = exports.SYNTHETICS_INDEX_PATTERN = exports.STEP_DETAIL_ROUTE = exports.STATUS = exports.SHORT_TS_LOCALE = exports.SHORT_TIMESPAN_LOCALE = exports.SETTINGS_ROUTE = exports.OVERVIEW_ROUTE = exports.MONITOR_TYPES = exports.MONITOR_ROUTE = exports.MONITOR_MANAGEMENT_ROUTE = exports.MONITOR_HISTORY_ROUTE = exports.MONITOR_ERRORS_ROUTE = exports.MONITOR_EDIT_ROUTE = exports.MONITOR_ADD_ROUTE = exports.MONITORS_ROUTE = exports.ML_MODULE_ID = exports.ML_JOB_ID = exports.MAPPING_ERROR_ROUTE = exports.KQL_SYNTAX_LOCAL_STORAGE = exports.GETTING_STARTED_ROUTE = exports.FILTER_FIELDS = exports.ERROR_DETAILS_ROUTE = exports.CERT_STATUS = exports.CERTIFICATES_ROUTE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MONITOR_ROUTE = '/monitor/:monitorId?';
exports.MONITOR_ROUTE = MONITOR_ROUTE;
const MONITOR_HISTORY_ROUTE = '/monitor/:monitorId/history';
exports.MONITOR_HISTORY_ROUTE = MONITOR_HISTORY_ROUTE;
const MONITOR_ERRORS_ROUTE = '/monitor/:monitorId/errors';
exports.MONITOR_ERRORS_ROUTE = MONITOR_ERRORS_ROUTE;
const MONITOR_ADD_ROUTE = '/add-monitor';
exports.MONITOR_ADD_ROUTE = MONITOR_ADD_ROUTE;
const MONITOR_EDIT_ROUTE = '/edit-monitor/:monitorId';
exports.MONITOR_EDIT_ROUTE = MONITOR_EDIT_ROUTE;
const MONITOR_MANAGEMENT_ROUTE = '/manage-monitors';
exports.MONITOR_MANAGEMENT_ROUTE = MONITOR_MANAGEMENT_ROUTE;
const OVERVIEW_ROUTE = '/';
exports.OVERVIEW_ROUTE = OVERVIEW_ROUTE;
const MONITORS_ROUTE = '/monitors';
exports.MONITORS_ROUTE = MONITORS_ROUTE;
const GETTING_STARTED_ROUTE = '/monitors/getting-started';
exports.GETTING_STARTED_ROUTE = GETTING_STARTED_ROUTE;
const SETTINGS_ROUTE = '/settings';
exports.SETTINGS_ROUTE = SETTINGS_ROUTE;
const SYNTHETICS_SETTINGS_ROUTE = '/settings/:tabId';
exports.SYNTHETICS_SETTINGS_ROUTE = SYNTHETICS_SETTINGS_ROUTE;
const CERTIFICATES_ROUTE = '/certificates';
exports.CERTIFICATES_ROUTE = CERTIFICATES_ROUTE;
const STEP_DETAIL_ROUTE = '/journey/:checkGroupId/step/:stepIndex';
exports.STEP_DETAIL_ROUTE = STEP_DETAIL_ROUTE;
const SYNTHETIC_CHECK_STEPS_ROUTE = '/journey/:checkGroupId/steps';
exports.SYNTHETIC_CHECK_STEPS_ROUTE = SYNTHETIC_CHECK_STEPS_ROUTE;
const TEST_RUN_DETAILS_ROUTE = '/monitor/:monitorId/test-run/:checkGroupId';
exports.TEST_RUN_DETAILS_ROUTE = TEST_RUN_DETAILS_ROUTE;
const MAPPING_ERROR_ROUTE = '/mapping-error';
exports.MAPPING_ERROR_ROUTE = MAPPING_ERROR_ROUTE;
const ERROR_DETAILS_ROUTE = '/error-details/:errorStateId';
exports.ERROR_DETAILS_ROUTE = ERROR_DETAILS_ROUTE;
let STATUS;
exports.STATUS = STATUS;
(function (STATUS) {
  STATUS["UP"] = "up";
  STATUS["DOWN"] = "down";
  STATUS["COMPLETE"] = "complete";
  STATUS["FAILED"] = "failed";
  STATUS["SKIPPED"] = "skipped";
})(STATUS || (exports.STATUS = STATUS = {}));
let MONITOR_TYPES;
exports.MONITOR_TYPES = MONITOR_TYPES;
(function (MONITOR_TYPES) {
  MONITOR_TYPES["HTTP"] = "http";
  MONITOR_TYPES["TCP"] = "tcp";
  MONITOR_TYPES["ICMP"] = "icmp";
  MONITOR_TYPES["BROWSER"] = "browser";
})(MONITOR_TYPES || (exports.MONITOR_TYPES = MONITOR_TYPES = {}));
const ML_JOB_ID = 'high_latency_by_geo';
exports.ML_JOB_ID = ML_JOB_ID;
const ML_MODULE_ID = 'uptime_heartbeat';
exports.ML_MODULE_ID = ML_MODULE_ID;
const UNNAMED_LOCATION = 'Unnamed-location';
exports.UNNAMED_LOCATION = UNNAMED_LOCATION;
const SHORT_TS_LOCALE = 'en-short-locale';
exports.SHORT_TS_LOCALE = SHORT_TS_LOCALE;
const SHORT_TIMESPAN_LOCALE = {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    ss: '%ss',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dd',
    dd: '%dd',
    M: '%d Mon',
    MM: '%d Mon',
    y: '%d Yr',
    yy: '%d Yr'
  }
};
exports.SHORT_TIMESPAN_LOCALE = SHORT_TIMESPAN_LOCALE;
let CERT_STATUS;
exports.CERT_STATUS = CERT_STATUS;
(function (CERT_STATUS) {
  CERT_STATUS["OK"] = "OK";
  CERT_STATUS["EXPIRING_SOON"] = "EXPIRING_SOON";
  CERT_STATUS["EXPIRED"] = "EXPIRED";
  CERT_STATUS["TOO_OLD"] = "TOO_OLD";
})(CERT_STATUS || (exports.CERT_STATUS = CERT_STATUS = {}));
const KQL_SYNTAX_LOCAL_STORAGE = 'xpack.uptime.kql.syntax';
exports.KQL_SYNTAX_LOCAL_STORAGE = KQL_SYNTAX_LOCAL_STORAGE;
const FILTER_FIELDS = {
  TAGS: 'tags',
  PORT: 'url.port',
  LOCATION: 'observer.geo.name',
  TYPE: 'monitor.type'
};
exports.FILTER_FIELDS = FILTER_FIELDS;
const SYNTHETICS_INDEX_PATTERN = 'synthetics-*';
exports.SYNTHETICS_INDEX_PATTERN = SYNTHETICS_INDEX_PATTERN;