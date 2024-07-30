"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_URLS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let API_URLS;
exports.API_URLS = API_URLS;
(function (API_URLS) {
  API_URLS["DYNAMIC_SETTINGS"] = "/internal/uptime/dynamic_settings";
  API_URLS["INDEX_STATUS"] = "/internal/uptime/index_status";
  API_URLS["MONITOR_LIST"] = "/internal/uptime/monitor/list";
  API_URLS["MONITOR_LOCATIONS"] = "/internal/uptime/monitor/locations";
  API_URLS["MONITOR_DURATION"] = "/internal/uptime/monitor/duration";
  API_URLS["MONITOR_DETAILS"] = "/internal/uptime/monitor/details";
  API_URLS["MONITOR_STATUS"] = "/internal/uptime/monitor/status";
  API_URLS["NETWORK_EVENTS"] = "/internal/uptime/network_events";
  API_URLS["PINGS"] = "/internal/uptime/pings";
  API_URLS["PING_HISTOGRAM"] = "/internal/uptime/ping/histogram";
  API_URLS["SNAPSHOT_COUNT"] = "/internal/uptime/snapshot/count";
  API_URLS["SYNTHETICS_SUCCESSFUL_CHECK"] = "/internal/uptime/synthetics/check/success";
  API_URLS["JOURNEY"] = "/internal/uptime/journey/{checkGroup}";
  API_URLS["JOURNEY_FAILED_STEPS"] = "/internal/uptime/journeys/failed_steps";
  API_URLS["JOURNEY_SCREENSHOT"] = "/internal/uptime/journey/screenshot/{checkGroup}/{stepIndex}";
  API_URLS["JOURNEY_SCREENSHOT_BLOCKS"] = "/internal/uptime/journey/screenshot/block";
  API_URLS["LOG_PAGE_VIEW"] = "/internal/uptime/log_page_view";
  API_URLS["ML_MODULE_JOBS"] = "/api/ml/modules/jobs_exist/";
  API_URLS["ML_SETUP_MODULE"] = "/api/ml/modules/setup/";
  API_URLS["ML_DELETE_JOB"] = "/api/ml/jobs/delete_jobs";
  API_URLS["ML_CAPABILITIES"] = "/api/ml/ml_capabilities";
  API_URLS["ML_ANOMALIES_RESULT"] = "/api/ml/results/anomalies_table_data";
  API_URLS["RULE_CONNECTORS"] = "/api/actions/connectors";
  API_URLS["CREATE_RULE"] = "/api/alerting/rule";
  API_URLS["DELETE_RULE"] = "/api/alerting/rule/";
  API_URLS["RULES_FIND"] = "/api/alerting/rules/_find";
  API_URLS["CONNECTOR_TYPES"] = "/api/actions/connector_types";
  API_URLS["INDEX_TEMPLATES"] = "/internal/uptime/service/index_templates";
  API_URLS["SERVICE_LOCATIONS"] = "/internal/uptime/service/locations";
  API_URLS["SYNTHETICS_MONITORS"] = "/internal/uptime/service/monitors";
  API_URLS["SYNTHETICS_ENABLEMENT"] = "/internal/uptime/service/enablement";
  API_URLS["RUN_ONCE_MONITOR"] = "/internal/uptime/service/monitors/run_once";
  API_URLS["TRIGGER_MONITOR"] = "/internal/uptime/service/monitors/trigger";
  API_URLS["SERVICE_ALLOWED"] = "/internal/uptime/service/allowed";
  API_URLS["SYNTHETICS_APIKEY"] = "/internal/uptime/service/api_key";
  API_URLS["SYNTHETICS_HAS_ZIP_URL_MONITORS"] = "/internal/uptime/fleet/has_zip_url_monitors";
  API_URLS["SYNTHETICS_MONITORS_PROJECT"] = "/api/synthetics/project/{projectName}/monitors";
  API_URLS["SYNTHETICS_MONITORS_PROJECT_UPDATE"] = "/api/synthetics/project/{projectName}/monitors/_bulk_update";
  API_URLS["SYNTHETICS_MONITORS_PROJECT_DELETE"] = "/api/synthetics/project/{projectName}/monitors/_bulk_delete";
  API_URLS["SYNTHETICS_MONITORS_PROJECT_LEGACY"] = "/api/synthetics/service/project/monitors";
})(API_URLS || (exports.API_URLS = API_URLS = {}));