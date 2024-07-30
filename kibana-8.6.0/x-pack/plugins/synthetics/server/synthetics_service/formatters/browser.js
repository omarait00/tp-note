"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browserFormatters = void 0;
var _common = require("./common");
var _monitor_management = require("../../../common/runtime_types/monitor_management");
var _monitor_defaults = require("../../../common/constants/monitor_defaults");
var _tls = require("./tls");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const throttlingFormatter = fields => {
  if (!fields[_monitor_management.ConfigKey.IS_THROTTLING_ENABLED]) return false;
  return {
    download: parseInt(fields[_monitor_management.ConfigKey.DOWNLOAD_SPEED] || _monitor_defaults.DEFAULT_BROWSER_ADVANCED_FIELDS[_monitor_management.ConfigKey.DOWNLOAD_SPEED], 10),
    upload: parseInt(fields[_monitor_management.ConfigKey.UPLOAD_SPEED] || _monitor_defaults.DEFAULT_BROWSER_ADVANCED_FIELDS[_monitor_management.ConfigKey.UPLOAD_SPEED], 10),
    latency: parseInt(fields[_monitor_management.ConfigKey.LATENCY] || _monitor_defaults.DEFAULT_BROWSER_ADVANCED_FIELDS[_monitor_management.ConfigKey.LATENCY], 10)
  };
};
const browserFormatters = {
  [_monitor_management.ConfigKey.METADATA]: fields => (0, _common.objectFormatter)(fields[_monitor_management.ConfigKey.METADATA]),
  [_monitor_management.ConfigKey.URLS]: null,
  [_monitor_management.ConfigKey.PORT]: null,
  [_monitor_management.ConfigKey.ZIP_URL_TLS_VERSION]: fields => (0, _common.arrayFormatter)(fields[_monitor_management.ConfigKey.ZIP_URL_TLS_VERSION]),
  [_monitor_management.ConfigKey.SOURCE_ZIP_URL]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_USERNAME]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_PASSWORD]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_FOLDER]: null,
  [_monitor_management.ConfigKey.SOURCE_ZIP_PROXY_URL]: null,
  [_monitor_management.ConfigKey.SOURCE_PROJECT_CONTENT]: null,
  [_monitor_management.ConfigKey.SOURCE_INLINE]: null,
  [_monitor_management.ConfigKey.PARAMS]: fields => (0, _common.stringToObjectFormatter)(fields[_monitor_management.ConfigKey.PARAMS] || ''),
  [_monitor_management.ConfigKey.SCREENSHOTS]: null,
  [_monitor_management.ConfigKey.SYNTHETICS_ARGS]: fields => (0, _common.arrayFormatter)(fields[_monitor_management.ConfigKey.SYNTHETICS_ARGS]),
  [_monitor_management.ConfigKey.ZIP_URL_TLS_CERTIFICATE_AUTHORITIES]: null,
  [_monitor_management.ConfigKey.ZIP_URL_TLS_CERTIFICATE]: null,
  [_monitor_management.ConfigKey.ZIP_URL_TLS_KEY]: null,
  [_monitor_management.ConfigKey.ZIP_URL_TLS_KEY_PASSPHRASE]: null,
  [_monitor_management.ConfigKey.ZIP_URL_TLS_VERIFICATION_MODE]: null,
  [_monitor_management.ConfigKey.IS_THROTTLING_ENABLED]: null,
  [_monitor_management.ConfigKey.THROTTLING_CONFIG]: fields => throttlingFormatter(fields),
  [_monitor_management.ConfigKey.DOWNLOAD_SPEED]: null,
  [_monitor_management.ConfigKey.UPLOAD_SPEED]: null,
  [_monitor_management.ConfigKey.LATENCY]: null,
  [_monitor_management.ConfigKey.JOURNEY_FILTERS_MATCH]: null,
  [_monitor_management.ConfigKey.JOURNEY_FILTERS_TAGS]: fields => (0, _common.arrayFormatter)(fields[_monitor_management.ConfigKey.JOURNEY_FILTERS_TAGS]),
  [_monitor_management.ConfigKey.IGNORE_HTTPS_ERRORS]: null,
  [_monitor_management.ConfigKey.PLAYWRIGHT_OPTIONS]: fields => (0, _common.stringToObjectFormatter)(fields[_monitor_management.ConfigKey.PLAYWRIGHT_OPTIONS] || ''),
  [_monitor_management.ConfigKey.TEXT_ASSERTION]: null,
  ..._common.commonFormatters,
  ..._tls.tlsFormatters
};
exports.browserFormatters = browserFormatters;