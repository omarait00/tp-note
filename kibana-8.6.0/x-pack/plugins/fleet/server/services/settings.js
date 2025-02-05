"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultSettings = createDefaultSettings;
exports.getSettings = getSettings;
exports.saveSettings = saveSettings;
exports.settingsSetup = settingsSetup;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _services = require("../../common/services");
var _constants = require("../../common/constants");
var _app_context = require("./app_context");
var _fleet_server_host = require("./fleet_server_host");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getSettings(soClient) {
  const res = await soClient.find({
    type: _constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE
  });
  if (res.total === 0) {
    throw _boom.default.notFound('Global settings not found');
  }
  const settingsSo = res.saved_objects[0];
  const fleetServerHosts = await (0, _fleet_server_host.listFleetServerHosts)(soClient);
  return {
    id: settingsSo.id,
    ...settingsSo.attributes,
    fleet_server_hosts: fleetServerHosts.items.flatMap(item => item.host_urls),
    preconfigured_fields: getConfigFleetServerHosts() ? ['fleet_server_hosts'] : []
  };
}
async function settingsSetup(soClient) {
  try {
    await getSettings(soClient);
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      const defaultSettings = createDefaultSettings();
      return saveSettings(soClient, defaultSettings);
    }
    throw e;
  }
}
async function saveSettings(soClient, newData) {
  const data = {
    ...newData
  };
  if (data.fleet_server_hosts) {
    data.fleet_server_hosts = data.fleet_server_hosts.map(_services.normalizeHostsForAgents);
  }
  try {
    const settings = await getSettings(soClient);
    const res = await soClient.update(_constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE, settings.id, data);
    return {
      id: settings.id,
      ...res.attributes
    };
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      const defaultSettings = createDefaultSettings();
      const res = await soClient.create(_constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE, {
        ...defaultSettings,
        ...data
      }, {
        id: _constants.GLOBAL_SETTINGS_ID,
        overwrite: true
      });
      return {
        id: res.id,
        ...res.attributes
      };
    }
    throw e;
  }
}
function getConfigFleetServerHosts() {
  var _config$agents, _config$agents$fleet_, _config$agents2, _config$agents2$fleet;
  const config = _app_context.appContextService.getConfig();
  return config !== null && config !== void 0 && (_config$agents = config.agents) !== null && _config$agents !== void 0 && (_config$agents$fleet_ = _config$agents.fleet_server) !== null && _config$agents$fleet_ !== void 0 && _config$agents$fleet_.hosts && config.agents.fleet_server.hosts.length > 0 ? config === null || config === void 0 ? void 0 : (_config$agents2 = config.agents) === null || _config$agents2 === void 0 ? void 0 : (_config$agents2$fleet = _config$agents2.fleet_server) === null || _config$agents2$fleet === void 0 ? void 0 : _config$agents2$fleet.hosts : undefined;
}
function createDefaultSettings() {
  return {
    prerelease_integrations_enabled: false
  };
}