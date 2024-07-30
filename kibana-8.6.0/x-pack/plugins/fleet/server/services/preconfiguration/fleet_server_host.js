"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanPreconfiguredFleetServerHosts = cleanPreconfiguredFleetServerHosts;
exports.createCloudFleetServerHostIfNeeded = createCloudFleetServerHostIfNeeded;
exports.createOrUpdatePreconfiguredFleetServerHosts = createOrUpdatePreconfiguredFleetServerHosts;
exports.ensurePreconfiguredFleetServerHosts = ensurePreconfiguredFleetServerHosts;
exports.getCloudFleetServersHosts = getCloudFleetServersHosts;
exports.getPreconfiguredFleetServerHostFromConfig = getPreconfiguredFleetServerHostFromConfig;
var _lodash = require("lodash");
var _services = require("../../../common/services");
var _constants = require("../../constants");
var _app_context = require("../app_context");
var _fleet_server_host = require("../fleet_server_host");
var _agent_policy = require("../agent_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getCloudFleetServersHosts() {
  const cloudSetup = _app_context.appContextService.getCloud();
  if (cloudSetup && cloudSetup.isCloudEnabled && cloudSetup.cloudId && cloudSetup.deploymentId) {
    const res = (0, _services.decodeCloudId)(cloudSetup.cloudId);
    if (!res) {
      return;
    }

    // Fleet Server url are formed like this `https://<deploymentId>.fleet.<host>
    return [`https://${cloudSetup.deploymentId}.fleet.${res.host}${res.defaultPort !== '443' ? `:${res.defaultPort}` : ''}`];
  }
}
function getPreconfiguredFleetServerHostFromConfig(config) {
  const {
    fleetServerHosts: fleetServerHostsFromConfig
  } = config;
  const legacyFleetServerHostsConfig = getConfigFleetServerHosts(config);
  const fleetServerHosts = (fleetServerHostsFromConfig || []).concat([...(legacyFleetServerHostsConfig ? [{
    name: 'Default',
    is_default: true,
    id: _constants.DEFAULT_FLEET_SERVER_HOST_ID,
    host_urls: legacyFleetServerHostsConfig
  }] : [])]);
  if (fleetServerHosts.filter(fleetServerHost => fleetServerHost.is_default).length > 1) {
    throw new Error('Only one default Fleet Server host is allowed');
  }
  return fleetServerHosts;
}
async function ensurePreconfiguredFleetServerHosts(soClient, esClient, preconfiguredFleetServerHosts) {
  await createOrUpdatePreconfiguredFleetServerHosts(soClient, esClient, preconfiguredFleetServerHosts);
  await createCloudFleetServerHostIfNeeded(soClient);
  await cleanPreconfiguredFleetServerHosts(soClient, esClient, preconfiguredFleetServerHosts);
}
async function createOrUpdatePreconfiguredFleetServerHosts(soClient, esClient, preconfiguredFleetServerHosts) {
  const existingFleetServerHosts = await (0, _fleet_server_host.bulkGetFleetServerHosts)(soClient, preconfiguredFleetServerHosts.map(({
    id
  }) => id), {
    ignoreNotFound: true
  });
  await Promise.all(preconfiguredFleetServerHosts.map(async preconfiguredFleetServerHost => {
    const existingHost = existingFleetServerHosts.find(fleetServerHost => fleetServerHost.id === preconfiguredFleetServerHost.id);
    const {
      id,
      ...data
    } = preconfiguredFleetServerHost;
    const isCreate = !existingHost;
    const isUpdateWithNewData = existingHost && (!existingHost.is_preconfigured || existingHost.is_default !== preconfiguredFleetServerHost.is_default || existingHost.name !== preconfiguredFleetServerHost.name || !(0, _lodash.isEqual)(existingHost.host_urls.map(_services.normalizeHostsForAgents), preconfiguredFleetServerHost.host_urls.map(_services.normalizeHostsForAgents)));
    if (isCreate) {
      await (0, _fleet_server_host.createFleetServerHost)(soClient, {
        ...data,
        is_preconfigured: true
      }, {
        id,
        overwrite: true,
        fromPreconfiguration: true
      });
    } else if (isUpdateWithNewData) {
      await (0, _fleet_server_host.updateFleetServerHost)(soClient, id, {
        ...data,
        is_preconfigured: true
      }, {
        fromPreconfiguration: true
      });
      if (data.is_default) {
        await _agent_policy.agentPolicyService.bumpAllAgentPolicies(soClient, esClient);
      } else {
        await _agent_policy.agentPolicyService.bumpAllAgentPoliciesForFleetServerHosts(soClient, esClient, id);
      }
    }
  }));
}
async function createCloudFleetServerHostIfNeeded(soClient) {
  const cloudServerHosts = getCloudFleetServersHosts();
  if (!cloudServerHosts || cloudServerHosts.length === 0) {
    return;
  }
  const defaultFleetServerHost = await (0, _fleet_server_host.getDefaultFleetServerHost)(soClient);
  if (!defaultFleetServerHost) {
    await (0, _fleet_server_host.createFleetServerHost)(soClient, {
      name: 'Default',
      is_default: true,
      host_urls: cloudServerHosts,
      is_preconfigured: false
    }, {
      id: _constants.DEFAULT_FLEET_SERVER_HOST_ID,
      overwrite: true,
      fromPreconfiguration: true
    });
  }
}
async function cleanPreconfiguredFleetServerHosts(soClient, esClient, preconfiguredFleetServerHosts) {
  const existingFleetServerHosts = await (0, _fleet_server_host.listFleetServerHosts)(soClient);
  const existingPreconfiguredHosts = existingFleetServerHosts.items.filter(o => o.is_preconfigured === true);
  for (const existingFleetServerHost of existingPreconfiguredHosts) {
    const hasBeenDelete = !preconfiguredFleetServerHosts.find(({
      id
    }) => existingFleetServerHost.id === id);
    if (!hasBeenDelete) {
      continue;
    }
    if (existingFleetServerHost.is_default) {
      await (0, _fleet_server_host.updateFleetServerHost)(soClient, existingFleetServerHost.id, {
        is_preconfigured: false
      }, {
        fromPreconfiguration: true
      });
    } else {
      await (0, _fleet_server_host.deleteFleetServerHost)(soClient, esClient, existingFleetServerHost.id, {
        fromPreconfiguration: true
      });
    }
  }
}
function getConfigFleetServerHosts(config) {
  var _config$agents, _config$agents$fleet_, _config$agents2, _config$agents2$fleet;
  return config !== null && config !== void 0 && (_config$agents = config.agents) !== null && _config$agents !== void 0 && (_config$agents$fleet_ = _config$agents.fleet_server) !== null && _config$agents$fleet_ !== void 0 && _config$agents$fleet_.hosts && config.agents.fleet_server.hosts.length > 0 ? config === null || config === void 0 ? void 0 : (_config$agents2 = config.agents) === null || _config$agents2 === void 0 ? void 0 : (_config$agents2$fleet = _config$agents2.fleet_server) === null || _config$agents2$fleet === void 0 ? void 0 : _config$agents2$fleet.hosts : undefined;
}