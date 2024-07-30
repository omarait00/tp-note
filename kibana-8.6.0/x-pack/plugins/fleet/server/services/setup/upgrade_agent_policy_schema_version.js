"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradeAgentPolicySchemaVersion = upgradeAgentPolicySchemaVersion;
var _constants = require("../../constants");
var _agent_policy = require("../agent_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getOutdatedAgentPoliciesBatch(soClient) {
  return _agent_policy.agentPolicyService.list(soClient, {
    perPage: _constants.SO_SEARCH_LIMIT,
    kuery: `NOT ${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.schema_version:${_constants.FLEET_AGENT_POLICIES_SCHEMA_VERSION}`
  });
}

// used to migrate ingest-agent-policies SOs to .fleet-policies
// fetch SOs from ingest-agent-policies with outdated schema_version
// deploy outdated policies to .fleet-policies index
// bump oudated SOs schema_version
async function upgradeAgentPolicySchemaVersion(soClient) {
  let outdatedAgentPolicies = await getOutdatedAgentPoliciesBatch(soClient);
  while (outdatedAgentPolicies.total > 0) {
    const outdatedAgentPolicyIds = outdatedAgentPolicies.items.map(outdatedAgentPolicy => outdatedAgentPolicy.id);
    await _agent_policy.agentPolicyService.deployPolicies(soClient, outdatedAgentPolicyIds);
    outdatedAgentPolicies = await getOutdatedAgentPoliciesBatch(soClient);
  }
}