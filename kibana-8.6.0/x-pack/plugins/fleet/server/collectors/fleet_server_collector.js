"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFleetServerUsage = exports.getFleetServerConfig = void 0;
var _constants = require("../constants");
var _services = require("../services");
var _agents = require("../services/agents");
var _fleet_server_host = require("../services/fleet_server_host");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_USAGE = {
  total_all_statuses: 0,
  total_enrolled: 0,
  healthy: 0,
  unhealthy: 0,
  offline: 0,
  updating: 0,
  num_host_urls: 0
};
const getFleetServerUsage = async (soClient, esClient) => {
  if (!soClient || !esClient) {
    return DEFAULT_USAGE;
  }
  const fleetServerHosts = await (0, _fleet_server_host.listFleetServerHosts)(soClient);
  const numHostsUrls = fleetServerHosts.items.flatMap(host => host.host_urls).length;

  // Find all policies with Fleet server than query agent status
  let hasMore = true;
  const policyIds = new Set();
  let page = 1;
  while (hasMore) {
    const res = await _services.packagePolicyService.list(soClient, {
      page: page++,
      perPage: 20,
      kuery: 'ingest-package-policies.package.name:fleet_server'
    });
    for (const item of res.items) {
      policyIds.add(item.policy_id);
    }
    if (res.items.length === 0) {
      hasMore = false;
    }
  }
  if (policyIds.size === 0) {
    return DEFAULT_USAGE;
  }
  const {
    total,
    inactive,
    online,
    error,
    updating,
    offline
  } = await (0, _agents.getAgentStatusForAgentPolicy)(esClient, undefined, Array.from(policyIds).map(policyId => `(policy_id:"${policyId}")`).join(' or '));
  return {
    total_enrolled: total,
    healthy: online,
    unhealthy: error,
    offline,
    updating,
    total_all_statuses: total + inactive,
    num_host_urls: numHostsUrls
  };
};
exports.getFleetServerUsage = getFleetServerUsage;
const getFleetServerConfig = async soClient => {
  const res = await _services.packagePolicyService.list(soClient, {
    page: 1,
    perPage: _constants.SO_SEARCH_LIMIT,
    kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:fleet_server`
  });
  const getInputConfig = item => {
    var _item$inputs$;
    const config = ((_item$inputs$ = item.inputs[0]) !== null && _item$inputs$ !== void 0 ? _item$inputs$ : {}).compiled_input;
    if (config !== null && config !== void 0 && config.server) {
      // whitelist only server limits, timeouts and runtime, sometimes fields are coming in "server.limits" format instead of nested object
      const newConfig = Object.keys(config).filter(key => key.startsWith('server')).reduce((acc, curr) => {
        if (curr === 'server') {
          acc.server = {};
          Object.keys(config.server).filter(key => key.startsWith('limits') || key.startsWith('timeouts') || key.startsWith('runtime')).forEach(serverKey => {
            acc.server[serverKey] = config.server[serverKey];
            return acc;
          });
        } else {
          acc[curr] = config[curr];
        }
        return acc;
      }, {});
      return newConfig;
    } else {
      return {};
    }
  };
  const policies = res.items.map(item => ({
    input_config: getInputConfig(item)
  }));
  return {
    policies
  };
};
exports.getFleetServerConfig = getFleetServerConfig;