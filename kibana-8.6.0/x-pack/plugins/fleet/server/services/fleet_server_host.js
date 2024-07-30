"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkGetFleetServerHosts = bulkGetFleetServerHosts;
exports.createFleetServerHost = createFleetServerHost;
exports.deleteFleetServerHost = deleteFleetServerHost;
exports.getDefaultFleetServerHost = getDefaultFleetServerHost;
exports.getFleetServerHost = getFleetServerHost;
exports.getFleetServerHostsForAgentPolicy = getFleetServerHostsForAgentPolicy;
exports.listFleetServerHosts = listFleetServerHosts;
exports.migrateSettingsToFleetServerHost = migrateSettingsToFleetServerHost;
exports.updateFleetServerHost = updateFleetServerHost;
var _services = require("../../common/services");
var _constants = require("../constants");
var _errors = require("../errors");
var _agent_policy = require("./agent_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function createFleetServerHost(soClient, data, options) {
  if (data.is_default) {
    const defaultItem = await getDefaultFleetServerHost(soClient);
    if (defaultItem) {
      await updateFleetServerHost(soClient, defaultItem.id, {
        is_default: false
      }, {
        fromPreconfiguration: options === null || options === void 0 ? void 0 : options.fromPreconfiguration
      });
    }
  }
  if (data.host_urls) {
    data.host_urls = data.host_urls.map(_services.normalizeHostsForAgents);
  }
  const res = await soClient.create(_constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE, data, {
    id: options === null || options === void 0 ? void 0 : options.id,
    overwrite: options === null || options === void 0 ? void 0 : options.overwrite
  });
  return {
    id: res.id,
    ...res.attributes
  };
}
async function getFleetServerHost(soClient, id) {
  const res = await soClient.get(_constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE, id);
  return {
    id: res.id,
    ...res.attributes
  };
}
async function listFleetServerHosts(soClient) {
  const res = await soClient.find({
    type: _constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE,
    perPage: _constants.SO_SEARCH_LIMIT
  });
  return {
    items: res.saved_objects.map(so => ({
      id: so.id,
      ...so.attributes
    })),
    total: res.total,
    page: res.page,
    perPage: res.per_page
  };
}
async function deleteFleetServerHost(soClient, esClient, id, options) {
  const fleetServerHost = await getFleetServerHost(soClient, id);
  if (fleetServerHost.is_preconfigured && !(options !== null && options !== void 0 && options.fromPreconfiguration)) {
    throw new _errors.FleetServerHostUnauthorizedError(`Cannot delete ${id} preconfigured fleet server host`);
  }
  if (fleetServerHost.is_default) {
    throw new _errors.FleetServerHostUnauthorizedError(`Default Fleet Server hosts ${id} cannot be deleted.`);
  }
  await _agent_policy.agentPolicyService.removeFleetServerHostFromAll(soClient, esClient, id);
  return await soClient.delete(_constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE, id);
}
async function updateFleetServerHost(soClient, id, data, options) {
  const originalItem = await getFleetServerHost(soClient, id);
  if (data.is_preconfigured && !(options !== null && options !== void 0 && options.fromPreconfiguration)) {
    throw new _errors.FleetServerHostUnauthorizedError(`Cannot update ${id} preconfigured fleet server host`);
  }
  if (data.is_default) {
    const defaultItem = await getDefaultFleetServerHost(soClient);
    if (defaultItem && defaultItem.id !== id) {
      await updateFleetServerHost(soClient, defaultItem.id, {
        is_default: false
      }, {
        fromPreconfiguration: options === null || options === void 0 ? void 0 : options.fromPreconfiguration
      });
    }
  }
  if (data.host_urls) {
    data.host_urls = data.host_urls.map(_services.normalizeHostsForAgents);
  }
  await soClient.update(_constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE, id, data);
  return {
    ...originalItem,
    ...data
  };
}
async function bulkGetFleetServerHosts(soClient, ids, {
  ignoreNotFound = false
} = {
  ignoreNotFound: true
}) {
  if (ids.length === 0) {
    return [];
  }
  const res = await soClient.bulkGet(ids.map(id => ({
    id,
    type: _constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE
  })));
  return res.saved_objects.map(so => {
    if (so.error) {
      if (!ignoreNotFound || so.error.statusCode !== 404) {
        throw so.error;
      }
      return undefined;
    }
    return {
      id: so.id,
      ...so.attributes
    };
  }).filter(fleetServerHostOrUndefined => typeof fleetServerHostOrUndefined !== 'undefined');
}
async function getFleetServerHostsForAgentPolicy(soClient, agentPolicy) {
  if (agentPolicy.fleet_server_host_id) {
    return getFleetServerHost(soClient, agentPolicy.fleet_server_host_id);
  }
  const defaultFleetServerHost = await getDefaultFleetServerHost(soClient);
  if (!defaultFleetServerHost) {
    throw new Error('Default Fleet Server host is not setup');
  }
  return defaultFleetServerHost;
}

/**
 * Get the default Fleet server policy hosts or throw if it does not exists
 */
async function getDefaultFleetServerHost(soClient) {
  const res = await soClient.find({
    type: _constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE,
    filter: `${_constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE}.attributes.is_default:true`
  });
  if (res.saved_objects.length === 0) {
    return null;
  }
  return {
    id: res.saved_objects[0].id,
    ...res.saved_objects[0].attributes
  };
}

/**
 * Migrate Global setting fleet server hosts to their own saved object
 */
async function migrateSettingsToFleetServerHost(soClient) {
  const defaultFleetServerHost = await getDefaultFleetServerHost(soClient);
  if (defaultFleetServerHost) {
    return;
  }
  const res = await soClient.find({
    type: _constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE
  });
  const oldSettings = res.saved_objects[0];
  if (!oldSettings || !oldSettings.attributes.fleet_server_hosts || oldSettings.attributes.fleet_server_hosts.length === 0) {
    return;
  }

  // Migrate
  await createFleetServerHost(soClient, {
    name: 'Default',
    host_urls: oldSettings.attributes.fleet_server_hosts,
    is_default: true,
    is_preconfigured: false
  }, {
    id: _constants.DEFAULT_FLEET_SERVER_HOST_ID,
    overwrite: true
  });
}