"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.secretKeys = exports.ConfigKey = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// values must match keys in the integration package
let ConfigKey;
exports.ConfigKey = ConfigKey;
(function (ConfigKey) {
  ConfigKey["APM_SERVICE_NAME"] = "service.name";
  ConfigKey["CUSTOM_HEARTBEAT_ID"] = "custom_heartbeat_id";
  ConfigKey["CONFIG_ID"] = "config_id";
  ConfigKey["CONFIG_HASH"] = "hash";
  ConfigKey["ENABLED"] = "enabled";
  ConfigKey["FORM_MONITOR_TYPE"] = "form_monitor_type";
  ConfigKey["HOSTS"] = "hosts";
  ConfigKey["IGNORE_HTTPS_ERRORS"] = "ignore_https_errors";
  ConfigKey["MONITOR_SOURCE_TYPE"] = "origin";
  ConfigKey["JOURNEY_FILTERS_MATCH"] = "filter_journeys.match";
  ConfigKey["JOURNEY_FILTERS_TAGS"] = "filter_journeys.tags";
  ConfigKey["JOURNEY_ID"] = "journey_id";
  ConfigKey["MAX_REDIRECTS"] = "max_redirects";
  ConfigKey["METADATA"] = "__ui";
  ConfigKey["MONITOR_TYPE"] = "type";
  ConfigKey["NAME"] = "name";
  ConfigKey["NAMESPACE"] = "namespace";
  ConfigKey["LOCATIONS"] = "locations";
  ConfigKey["PARAMS"] = "params";
  ConfigKey["PASSWORD"] = "password";
  ConfigKey["PLAYWRIGHT_OPTIONS"] = "playwright_options";
  ConfigKey["ORIGINAL_SPACE"] = "original_space";
  ConfigKey["PORT"] = "url.port";
  ConfigKey["PROXY_URL"] = "proxy_url";
  ConfigKey["PROXY_USE_LOCAL_RESOLVER"] = "proxy_use_local_resolver";
  ConfigKey["RESPONSE_BODY_CHECK_NEGATIVE"] = "check.response.body.negative";
  ConfigKey["RESPONSE_BODY_CHECK_POSITIVE"] = "check.response.body.positive";
  ConfigKey["RESPONSE_BODY_INDEX"] = "response.include_body";
  ConfigKey["RESPONSE_HEADERS_CHECK"] = "check.response.headers";
  ConfigKey["RESPONSE_HEADERS_INDEX"] = "response.include_headers";
  ConfigKey["RESPONSE_RECEIVE_CHECK"] = "check.receive";
  ConfigKey["RESPONSE_STATUS_CHECK"] = "check.response.status";
  ConfigKey["REQUEST_BODY_CHECK"] = "check.request.body";
  ConfigKey["REQUEST_HEADERS_CHECK"] = "check.request.headers";
  ConfigKey["REQUEST_METHOD_CHECK"] = "check.request.method";
  ConfigKey["REQUEST_SEND_CHECK"] = "check.send";
  ConfigKey["REVISION"] = "revision";
  ConfigKey["SCHEDULE"] = "schedule";
  ConfigKey["SCREENSHOTS"] = "screenshots";
  ConfigKey["SOURCE_PROJECT_CONTENT"] = "source.project.content";
  ConfigKey["SOURCE_INLINE"] = "source.inline.script";
  ConfigKey["SOURCE_ZIP_URL"] = "source.zip_url.url";
  ConfigKey["SOURCE_ZIP_USERNAME"] = "source.zip_url.username";
  ConfigKey["SOURCE_ZIP_PASSWORD"] = "source.zip_url.password";
  ConfigKey["SOURCE_ZIP_FOLDER"] = "source.zip_url.folder";
  ConfigKey["SOURCE_ZIP_PROXY_URL"] = "source.zip_url.proxy_url";
  ConfigKey["PROJECT_ID"] = "project_id";
  ConfigKey["SYNTHETICS_ARGS"] = "synthetics_args";
  ConfigKey["TEXT_ASSERTION"] = "playwright_text_assertion";
  ConfigKey["TLS_CERTIFICATE_AUTHORITIES"] = "ssl.certificate_authorities";
  ConfigKey["TLS_CERTIFICATE"] = "ssl.certificate";
  ConfigKey["TLS_KEY"] = "ssl.key";
  ConfigKey["TLS_KEY_PASSPHRASE"] = "ssl.key_passphrase";
  ConfigKey["TLS_VERIFICATION_MODE"] = "ssl.verification_mode";
  ConfigKey["TLS_VERSION"] = "ssl.supported_protocols";
  ConfigKey["TAGS"] = "tags";
  ConfigKey["TIMEOUT"] = "timeout";
  ConfigKey["THROTTLING_CONFIG"] = "throttling.config";
  ConfigKey["IS_THROTTLING_ENABLED"] = "throttling.is_enabled";
  ConfigKey["DOWNLOAD_SPEED"] = "throttling.download_speed";
  ConfigKey["UPLOAD_SPEED"] = "throttling.upload_speed";
  ConfigKey["LATENCY"] = "throttling.latency";
  ConfigKey["URLS"] = "urls";
  ConfigKey["USERNAME"] = "username";
  ConfigKey["WAIT"] = "wait";
  ConfigKey["ZIP_URL_TLS_CERTIFICATE_AUTHORITIES"] = "source.zip_url.ssl.certificate_authorities";
  ConfigKey["ZIP_URL_TLS_CERTIFICATE"] = "source.zip_url.ssl.certificate";
  ConfigKey["ZIP_URL_TLS_KEY"] = "source.zip_url.ssl.key";
  ConfigKey["ZIP_URL_TLS_KEY_PASSPHRASE"] = "source.zip_url.ssl.key_passphrase";
  ConfigKey["ZIP_URL_TLS_VERIFICATION_MODE"] = "source.zip_url.ssl.verification_mode";
  ConfigKey["ZIP_URL_TLS_VERSION"] = "source.zip_url.ssl.supported_protocols";
  ConfigKey["MONITOR_QUERY_ID"] = "id";
})(ConfigKey || (exports.ConfigKey = ConfigKey = {}));
const secretKeys = [ConfigKey.PARAMS, ConfigKey.PASSWORD, ConfigKey.REQUEST_BODY_CHECK, ConfigKey.REQUEST_HEADERS_CHECK, ConfigKey.REQUEST_SEND_CHECK, ConfigKey.RESPONSE_BODY_CHECK_NEGATIVE, ConfigKey.RESPONSE_BODY_CHECK_POSITIVE, ConfigKey.RESPONSE_HEADERS_CHECK, ConfigKey.RESPONSE_RECEIVE_CHECK, ConfigKey.SOURCE_INLINE, ConfigKey.SOURCE_PROJECT_CONTENT, ConfigKey.SOURCE_ZIP_USERNAME, ConfigKey.SOURCE_ZIP_PASSWORD, ConfigKey.SYNTHETICS_ARGS, ConfigKey.TLS_KEY, ConfigKey.TLS_KEY_PASSPHRASE, ConfigKey.USERNAME, ConfigKey.ZIP_URL_TLS_KEY, ConfigKey.ZIP_URL_TLS_KEY_PASSPHRASE];
exports.secretKeys = secretKeys;