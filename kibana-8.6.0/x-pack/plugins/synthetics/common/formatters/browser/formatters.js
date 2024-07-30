"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browserFormatters = void 0;
var _monitor_management = require("../../runtime_types/monitor_management");
var _formatters = require("../common/formatters");
var _formatters2 = require("../tls/formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const throttlingFormatter = fields => {
  if (!fields[_monitor_management.ConfigKey.IS_THROTTLING_ENABLED]) return 'false';
  const getThrottlingValue = (v, suffix) => v !== '' && v !== undefined ? `${v}${suffix}` : null;
  return [getThrottlingValue(fields[_monitor_management.ConfigKey.DOWNLOAD_SPEED], 'd'), getThrottlingValue(fields[_monitor_management.ConfigKey.UPLOAD_SPEED], 'u'), getThrottlingValue(fields[_monitor_management.ConfigKey.LATENCY], 'l')].filter(v => v !== null).join('/');
};
const browserFormatters = {
  [_monitor_management.ConfigKey.METADATA]: fields => (0, _formatters.objectToJsonFormatter)(fields[_monitor_management.ConfigKey.METADATA]),
  [_monitor_management.ConfigKey.URLS]: null,
  [_monitor_management.ConfigKey.PORT]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_URL]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_USERNAME]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_PASSWORD]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_FOLDER]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_PROXY_URL]: null,
  [_monitor_management.ConfigKey.SOURCE_PROJECT_CONTENT]: null,
  [_monitor_management.ConfigKey.SOURCE_INLINE]: fields => (0, _formatters.stringToJsonFormatter)(fields[_monitor_management.ConfigKey.SOURCE_INLINE]),
  [_monitor_management.ConfigKey.PARAMS]: null,
  [_monitor_management.ConfigKey.SCREENSHOTS]: null,
  [_monitor_management.ConfigKey.IS_THROTTLING_ENABLED]: null,
  [_monitor_management.ConfigKey.DOWNLOAD_SPEED]: null,
  [_monitor_management.ConfigKey.UPLOAD_SPEED]: null,
  [_monitor_management.ConfigKey.LATENCY]: null,
  [_monitor_management.ConfigKey.SYNTHETICS_ARGS]: fields => (0, _formatters.arrayToJsonFormatter)(fields[_monitor_management.ConfigKey.SYNTHETICS_ARGS]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_CERTIFICATE_AUTHORITIES]: fields => (0, _formatters2.tlsValueToYamlFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_CERTIFICATE_AUTHORITIES]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_CERTIFICATE]: fields => (0, _formatters2.tlsValueToYamlFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_CERTIFICATE]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_KEY]: fields => (0, _formatters2.tlsValueToYamlFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_KEY]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_KEY_PASSPHRASE]: fields => (0, _formatters2.tlsValueToStringFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_KEY_PASSPHRASE]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_VERIFICATION_MODE]: fields => (0, _formatters2.tlsValueToStringFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_VERIFICATION_MODE]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_VERSION]: fields => (0, _formatters2.tlsArrayToYamlFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_VERSION]),
  [_monitor_management.ConfigKey.JOURNEY_FILTERS_MATCH]: fields => (0, _formatters.stringToJsonFormatter)(fields[_monitor_management.ConfigKey.JOURNEY_FILTERS_MATCH]),
  [_monitor_management.ConfigKey.JOURNEY_FILTERS_TAGS]: fields => (0, _formatters.arrayToJsonFormatter)(fields[_monitor_management.ConfigKey.JOURNEY_FILTERS_TAGS]),
  [_monitor_management.ConfigKey.THROTTLING_CONFIG]: throttlingFormatter,
  [_monitor_management.ConfigKey.IGNORE_HTTPS_ERRORS]: null,
  [_monitor_management.ConfigKey.PLAYWRIGHT_OPTIONS]: null,
  [_monitor_management.ConfigKey.TEXT_ASSERTION]: null,
  ..._formatters.commonFormatters,
  ..._formatters2.tlsFormatters
};
exports.browserFormatters = browserFormatters;