"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_CHANNELS = exports.REPORT_INTERVAL_MS = exports.REPORT_INTERVAL_BUFFER_MS = exports.PAYLOAD_CONTENT_ENCODING = exports.PATH_TO_ADVANCED_SETTINGS = exports.OPT_IN_POLL_INTERVAL_MS = exports.LOCALSTORAGE_KEY = exports.ENDPOINT_VERSION = exports.ENDPOINT_STAGING = exports.ENDPOINT_PROD = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The amount of time, in milliseconds, to wait between reports when enabled.
 * Currently, 24 hours.
 */
const REPORT_INTERVAL_MS = 86400000;

/**
 * The buffer time, in milliseconds, to consider the {@link REPORT_INTERVAL_MS} as expired.
 * Currently, 2 minutes.
 */
exports.REPORT_INTERVAL_MS = REPORT_INTERVAL_MS;
const REPORT_INTERVAL_BUFFER_MS = 120000;

/**
 * How often we poll for the opt-in status.
 * Currently, 10 seconds.
 */
exports.REPORT_INTERVAL_BUFFER_MS = REPORT_INTERVAL_BUFFER_MS;
const OPT_IN_POLL_INTERVAL_MS = 10000;

/**
 * Key for the localStorage service
 */
exports.OPT_IN_POLL_INTERVAL_MS = OPT_IN_POLL_INTERVAL_MS;
const LOCALSTORAGE_KEY = 'telemetry.data';

/**
 * Link to Advanced Settings.
 */
exports.LOCALSTORAGE_KEY = LOCALSTORAGE_KEY;
const PATH_TO_ADVANCED_SETTINGS = '/app/management/kibana/settings';

/**
 * The telemetry payload content encryption encoding
 */
exports.PATH_TO_ADVANCED_SETTINGS = PATH_TO_ADVANCED_SETTINGS;
const PAYLOAD_CONTENT_ENCODING = 'aes256gcm';

/**
 * The endpoint version when hitting the remote telemetry service
 */
exports.PAYLOAD_CONTENT_ENCODING = PAYLOAD_CONTENT_ENCODING;
const ENDPOINT_VERSION = 'v2';

/**
 * The staging telemetry endpoint for the remote telemetry service.
 */
exports.ENDPOINT_VERSION = ENDPOINT_VERSION;
const ENDPOINT_STAGING = 'https://telemetry-staging.elastic.co/';

/**
 * The production telemetry endpoint for the remote telemetry service.
 */
exports.ENDPOINT_STAGING = ENDPOINT_STAGING;
const ENDPOINT_PROD = 'https://telemetry.elastic.co/';

/**
 * The telemetry channels for the remote telemetry service.
 */
exports.ENDPOINT_PROD = ENDPOINT_PROD;
const TELEMETRY_CHANNELS = {
  SNAPSHOT_CHANNEL: 'xpack',
  OPT_IN_STATUS_CHANNEL: 'opt_in_status'
};
exports.TELEMETRY_CHANNELS = TELEMETRY_CHANNELS;