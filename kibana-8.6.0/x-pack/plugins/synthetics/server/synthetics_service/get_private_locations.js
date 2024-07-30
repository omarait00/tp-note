"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrivateLocations = getPrivateLocations;
var _private_locations = require("../legacy_uptime/lib/saved_objects/private_locations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getPrivateLocations(syntheticsMonitorClient, savedObjectsClient) {
  var _privateLocations$map;
  const privateLocations = await (0, _private_locations.getSyntheticsPrivateLocations)(savedObjectsClient);
  const agentPolicies = await syntheticsMonitorClient.privateLocationAPI.getAgentPolicies();
  const privateLocs = (_privateLocations$map = privateLocations === null || privateLocations === void 0 ? void 0 : privateLocations.map(loc => ({
    isServiceManaged: false,
    isInvalid: agentPolicies.find(policy => policy.id === loc.agentPolicyId) === undefined,
    ...loc
  }))) !== null && _privateLocations$map !== void 0 ? _privateLocations$map : [];
  return privateLocs;
}