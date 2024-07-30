"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsAppStreamingApiRoutes = exports.syntheticsAppRestApiRoutes = void 0;
var _settings = require("./settings/settings");
var _get_api_key = require("./monitor_cruds/get_api_key");
var _get_service_locations = require("./synthetics_service/get_service_locations");
var _delete_monitor = require("./monitor_cruds/delete_monitor");
var _enablement = require("./synthetics_service/enablement");
var _get_monitor = require("./monitor_cruds/get_monitor");
var _delete_monitor_project = require("./monitor_cruds/delete_monitor_project");
var _get_monitor_project = require("./monitor_cruds/get_monitor_project");
var _run_once_monitor = require("./synthetics_service/run_once_monitor");
var _get_service_allowed = require("./synthetics_service/get_service_allowed");
var _test_now_monitor = require("./synthetics_service/test_now_monitor");
var _install_index_templates = require("./synthetics_service/install_index_templates");
var _edit_monitor = require("./monitor_cruds/edit_monitor");
var _add_monitor = require("./monitor_cruds/add_monitor");
var _add_monitor_project = require("./monitor_cruds/add_monitor_project");
var _add_monitor_project_legacy = require("./monitor_cruds/add_monitor_project_legacy");
var _pings = require("./pings");
var _current_status = require("./status/current_status");
var _get_has_zip_url_monitors = require("./fleet/get_has_zip_url_monitors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const syntheticsAppRestApiRoutes = [_add_monitor.addSyntheticsMonitorRoute, _add_monitor_project.addSyntheticsProjectMonitorRoute, _enablement.getSyntheticsEnablementRoute, _delete_monitor.deleteSyntheticsMonitorRoute, _delete_monitor_project.deleteSyntheticsMonitorProjectRoute, _enablement.disableSyntheticsRoute, _edit_monitor.editSyntheticsMonitorRoute, _enablement.enableSyntheticsRoute, _get_service_locations.getServiceLocationsRoute, _get_monitor.getSyntheticsMonitorRoute, _get_monitor_project.getSyntheticsProjectMonitorsRoute, _get_monitor.getAllSyntheticsMonitorRoute, _get_monitor.getSyntheticsMonitorOverviewRoute, _install_index_templates.installIndexTemplatesRoute, _run_once_monitor.runOnceSyntheticsMonitorRoute, _test_now_monitor.testNowMonitorRoute, _get_service_allowed.getServiceAllowedRoute, _get_api_key.getAPIKeySyntheticsRoute, _pings.syntheticsGetPingsRoute, _pings.syntheticsGetPingStatusesRoute, _get_has_zip_url_monitors.getHasZipUrlMonitorRoute, _current_status.createGetCurrentStatusRoute, _settings.getIndexSizesRoute];
exports.syntheticsAppRestApiRoutes = syntheticsAppRestApiRoutes;
const syntheticsAppStreamingApiRoutes = [_add_monitor_project_legacy.addSyntheticsProjectMonitorRouteLegacy];
exports.syntheticsAppStreamingApiRoutes = syntheticsAppStreamingApiRoutes;