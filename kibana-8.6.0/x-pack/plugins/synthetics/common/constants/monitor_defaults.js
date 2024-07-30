"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_TLS_FIELDS = exports.DEFAULT_TCP_SIMPLE_FIELDS = exports.DEFAULT_TCP_ADVANCED_FIELDS = exports.DEFAULT_NAMESPACE_STRING = exports.DEFAULT_ICMP_SIMPLE_FIELDS = exports.DEFAULT_HTTP_SIMPLE_FIELDS = exports.DEFAULT_HTTP_ADVANCED_FIELDS = exports.DEFAULT_FIELDS = exports.DEFAULT_COMMON_FIELDS = exports.DEFAULT_BROWSER_SIMPLE_FIELDS = exports.DEFAULT_BROWSER_ADVANCED_FIELDS = void 0;
var _monitor_management = require("../runtime_types/monitor_management");
var _monitor_management2 = require("./monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_NAMESPACE_STRING = 'default';
exports.DEFAULT_NAMESPACE_STRING = DEFAULT_NAMESPACE_STRING;
const DEFAULT_COMMON_FIELDS = {
  [_monitor_management2.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.HTTP,
  [_monitor_management2.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.MULTISTEP,
  [_monitor_management2.ConfigKey.ENABLED]: true,
  [_monitor_management2.ConfigKey.SCHEDULE]: {
    number: '3',
    unit: _monitor_management.ScheduleUnit.MINUTES
  },
  [_monitor_management2.ConfigKey.APM_SERVICE_NAME]: '',
  [_monitor_management2.ConfigKey.CONFIG_ID]: '',
  [_monitor_management2.ConfigKey.TAGS]: [],
  [_monitor_management2.ConfigKey.TIMEOUT]: '16',
  [_monitor_management2.ConfigKey.NAME]: '',
  [_monitor_management2.ConfigKey.LOCATIONS]: [],
  [_monitor_management2.ConfigKey.NAMESPACE]: DEFAULT_NAMESPACE_STRING,
  [_monitor_management2.ConfigKey.MONITOR_SOURCE_TYPE]: _monitor_management.SourceType.UI,
  [_monitor_management2.ConfigKey.JOURNEY_ID]: '',
  [_monitor_management2.ConfigKey.CONFIG_HASH]: '',
  [_monitor_management2.ConfigKey.MONITOR_QUERY_ID]: ''
};
exports.DEFAULT_COMMON_FIELDS = DEFAULT_COMMON_FIELDS;
const DEFAULT_BROWSER_ADVANCED_FIELDS = {
  [_monitor_management2.ConfigKey.SCREENSHOTS]: _monitor_management.ScreenshotOption.ON,
  [_monitor_management2.ConfigKey.SYNTHETICS_ARGS]: [],
  [_monitor_management2.ConfigKey.JOURNEY_FILTERS_MATCH]: '',
  [_monitor_management2.ConfigKey.JOURNEY_FILTERS_TAGS]: [],
  [_monitor_management2.ConfigKey.IGNORE_HTTPS_ERRORS]: false,
  [_monitor_management2.ConfigKey.IS_THROTTLING_ENABLED]: true,
  [_monitor_management2.ConfigKey.DOWNLOAD_SPEED]: '5',
  [_monitor_management2.ConfigKey.UPLOAD_SPEED]: '3',
  [_monitor_management2.ConfigKey.LATENCY]: '20',
  [_monitor_management2.ConfigKey.THROTTLING_CONFIG]: '5d/3u/20l'
};
exports.DEFAULT_BROWSER_ADVANCED_FIELDS = DEFAULT_BROWSER_ADVANCED_FIELDS;
const DEFAULT_BROWSER_SIMPLE_FIELDS = {
  ...DEFAULT_COMMON_FIELDS,
  [_monitor_management2.ConfigKey.PROJECT_ID]: '',
  [_monitor_management2.ConfigKey.PLAYWRIGHT_OPTIONS]: '',
  [_monitor_management2.ConfigKey.METADATA]: {
    script_source: {
      is_generated_script: false,
      file_name: ''
    },
    is_zip_url_tls_enabled: false
  },
  [_monitor_management2.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.BROWSER,
  [_monitor_management2.ConfigKey.PARAMS]: '',
  [_monitor_management2.ConfigKey.PORT]: null,
  [_monitor_management2.ConfigKey.SCHEDULE]: {
    unit: _monitor_management.ScheduleUnit.MINUTES,
    number: '10'
  },
  [_monitor_management2.ConfigKey.SOURCE_INLINE]: '',
  [_monitor_management2.ConfigKey.SOURCE_PROJECT_CONTENT]: '',
  [_monitor_management2.ConfigKey.SOURCE_ZIP_URL]: '',
  [_monitor_management2.ConfigKey.SOURCE_ZIP_USERNAME]: '',
  [_monitor_management2.ConfigKey.SOURCE_ZIP_PASSWORD]: '',
  [_monitor_management2.ConfigKey.SOURCE_ZIP_FOLDER]: '',
  [_monitor_management2.ConfigKey.SOURCE_ZIP_PROXY_URL]: '',
  [_monitor_management2.ConfigKey.TEXT_ASSERTION]: '',
  [_monitor_management2.ConfigKey.URLS]: '',
  [_monitor_management2.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.MULTISTEP,
  [_monitor_management2.ConfigKey.TIMEOUT]: null,
  // Deprecated, slated to be removed in a future version
  [_monitor_management2.ConfigKey.ZIP_URL_TLS_CERTIFICATE_AUTHORITIES]: undefined,
  [_monitor_management2.ConfigKey.ZIP_URL_TLS_CERTIFICATE]: undefined,
  [_monitor_management2.ConfigKey.ZIP_URL_TLS_KEY]: undefined,
  [_monitor_management2.ConfigKey.ZIP_URL_TLS_KEY_PASSPHRASE]: undefined,
  [_monitor_management2.ConfigKey.ZIP_URL_TLS_VERIFICATION_MODE]: undefined,
  [_monitor_management2.ConfigKey.ZIP_URL_TLS_VERSION]: undefined
};
exports.DEFAULT_BROWSER_SIMPLE_FIELDS = DEFAULT_BROWSER_SIMPLE_FIELDS;
const DEFAULT_HTTP_SIMPLE_FIELDS = {
  ...DEFAULT_COMMON_FIELDS,
  [_monitor_management2.ConfigKey.METADATA]: {
    is_tls_enabled: false
  },
  [_monitor_management2.ConfigKey.URLS]: '',
  [_monitor_management2.ConfigKey.MAX_REDIRECTS]: '0',
  [_monitor_management2.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.HTTP,
  [_monitor_management2.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.HTTP,
  [_monitor_management2.ConfigKey.PORT]: null
};
exports.DEFAULT_HTTP_SIMPLE_FIELDS = DEFAULT_HTTP_SIMPLE_FIELDS;
const DEFAULT_HTTP_ADVANCED_FIELDS = {
  [_monitor_management2.ConfigKey.PASSWORD]: '',
  [_monitor_management2.ConfigKey.PROXY_URL]: '',
  [_monitor_management2.ConfigKey.RESPONSE_BODY_CHECK_NEGATIVE]: [],
  [_monitor_management2.ConfigKey.RESPONSE_BODY_CHECK_POSITIVE]: [],
  [_monitor_management2.ConfigKey.RESPONSE_BODY_INDEX]: _monitor_management.ResponseBodyIndexPolicy.ON_ERROR,
  [_monitor_management2.ConfigKey.RESPONSE_HEADERS_CHECK]: {},
  [_monitor_management2.ConfigKey.RESPONSE_HEADERS_INDEX]: true,
  [_monitor_management2.ConfigKey.RESPONSE_STATUS_CHECK]: [],
  [_monitor_management2.ConfigKey.REQUEST_BODY_CHECK]: {
    value: '',
    type: _monitor_management.Mode.PLAINTEXT
  },
  [_monitor_management2.ConfigKey.REQUEST_HEADERS_CHECK]: {},
  [_monitor_management2.ConfigKey.REQUEST_METHOD_CHECK]: _monitor_management.HTTPMethod.GET,
  [_monitor_management2.ConfigKey.USERNAME]: ''
};
exports.DEFAULT_HTTP_ADVANCED_FIELDS = DEFAULT_HTTP_ADVANCED_FIELDS;
const DEFAULT_ICMP_SIMPLE_FIELDS = {
  ...DEFAULT_COMMON_FIELDS,
  [_monitor_management2.ConfigKey.HOSTS]: '',
  [_monitor_management2.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.ICMP,
  [_monitor_management2.ConfigKey.WAIT]: '1',
  [_monitor_management2.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.ICMP
};
exports.DEFAULT_ICMP_SIMPLE_FIELDS = DEFAULT_ICMP_SIMPLE_FIELDS;
const DEFAULT_TCP_SIMPLE_FIELDS = {
  ...DEFAULT_COMMON_FIELDS,
  [_monitor_management2.ConfigKey.METADATA]: {
    is_tls_enabled: false
  },
  [_monitor_management2.ConfigKey.HOSTS]: '',
  [_monitor_management2.ConfigKey.URLS]: '',
  [_monitor_management2.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.TCP,
  [_monitor_management2.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.TCP,
  [_monitor_management2.ConfigKey.PORT]: null
};
exports.DEFAULT_TCP_SIMPLE_FIELDS = DEFAULT_TCP_SIMPLE_FIELDS;
const DEFAULT_TCP_ADVANCED_FIELDS = {
  [_monitor_management2.ConfigKey.PROXY_URL]: '',
  [_monitor_management2.ConfigKey.PROXY_USE_LOCAL_RESOLVER]: false,
  [_monitor_management2.ConfigKey.RESPONSE_RECEIVE_CHECK]: '',
  [_monitor_management2.ConfigKey.REQUEST_SEND_CHECK]: ''
};
exports.DEFAULT_TCP_ADVANCED_FIELDS = DEFAULT_TCP_ADVANCED_FIELDS;
const DEFAULT_TLS_FIELDS = {
  [_monitor_management2.ConfigKey.TLS_CERTIFICATE_AUTHORITIES]: '',
  [_monitor_management2.ConfigKey.TLS_CERTIFICATE]: '',
  [_monitor_management2.ConfigKey.TLS_KEY]: '',
  [_monitor_management2.ConfigKey.TLS_KEY_PASSPHRASE]: '',
  [_monitor_management2.ConfigKey.TLS_VERIFICATION_MODE]: _monitor_management.VerificationMode.FULL,
  [_monitor_management2.ConfigKey.TLS_VERSION]: [_monitor_management.TLSVersion.ONE_ONE, _monitor_management.TLSVersion.ONE_TWO, _monitor_management.TLSVersion.ONE_THREE]
};
exports.DEFAULT_TLS_FIELDS = DEFAULT_TLS_FIELDS;
const DEFAULT_FIELDS = {
  [_monitor_management.DataStream.HTTP]: {
    ...DEFAULT_HTTP_SIMPLE_FIELDS,
    ...DEFAULT_HTTP_ADVANCED_FIELDS,
    ...DEFAULT_TLS_FIELDS
  },
  [_monitor_management.DataStream.TCP]: {
    ...DEFAULT_TCP_SIMPLE_FIELDS,
    ...DEFAULT_TCP_ADVANCED_FIELDS,
    ...DEFAULT_TLS_FIELDS
  },
  [_monitor_management.DataStream.ICMP]: {
    ...DEFAULT_ICMP_SIMPLE_FIELDS
  },
  [_monitor_management.DataStream.BROWSER]: {
    ...DEFAULT_BROWSER_SIMPLE_FIELDS,
    ...DEFAULT_BROWSER_ADVANCED_FIELDS,
    ...DEFAULT_TLS_FIELDS
  }
};
exports.DEFAULT_FIELDS = DEFAULT_FIELDS;