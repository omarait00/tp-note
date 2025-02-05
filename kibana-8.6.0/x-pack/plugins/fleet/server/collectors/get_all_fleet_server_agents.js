"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllFleetServerAgents = void 0;
var _common = require("../../common");
var _agents = require("../services/agents");
var _constants = require("../constants");
var _package_policy = require("../services/package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAllFleetServerAgents = async (soClient, esClient) => {
  var _packagePolicyData;
  let packagePolicyData;
  try {
    packagePolicyData = await _package_policy.packagePolicyService.list(soClient, {
      perPage: _common.SO_SEARCH_LIMIT,
      kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: fleet_server`
    });
  } catch (error) {
    throw new Error(error.message);
  }
  const agentPoliciesIds = (_packagePolicyData = packagePolicyData) === null || _packagePolicyData === void 0 ? void 0 : _packagePolicyData.items.map(item => item.policy_id);
  if (agentPoliciesIds.length === 0) {
    return [];
  }
  let agentsResponse;
  try {
    agentsResponse = await (0, _agents.getAgentsByKuery)(esClient, {
      showInactive: false,
      perPage: _common.SO_SEARCH_LIMIT,
      kuery: `${_constants.AGENTS_PREFIX}.policy_id:${agentPoliciesIds.map(id => `"${id}"`).join(' or ')}`
    });
  } catch (error) {
    throw new Error(error.message);
  }
  const {
    agents: fleetServerAgents
  } = agentsResponse;
  if (fleetServerAgents.length === 0) {
    return [];
  }
  return fleetServerAgents;
};
exports.getAllFleetServerAgents = getAllFleetServerAgents;