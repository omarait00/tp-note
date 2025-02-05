"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentVersionsMap = agentVersionsMap;
exports.getAgentPolicySummary = getAgentPolicySummary;
exports.getESQueryPolicyResponseByAgentID = void 0;
exports.getPolicyResponseByAgentId = getPolicyResponseByAgentId;
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getESQueryPolicyResponseByAgentID = (agentID, index) => {
  return {
    body: {
      query: {
        bool: {
          filter: {
            term: {
              'agent.id': agentID
            }
          },
          must_not: {
            term: {
              'Endpoint.policy.applied.id': _.INITIAL_POLICY_ID
            }
          }
        }
      },
      sort: [{
        'event.created': {
          order: 'desc'
        }
      }],
      size: 1
    },
    index
  };
};
exports.getESQueryPolicyResponseByAgentID = getESQueryPolicyResponseByAgentID;
async function getPolicyResponseByAgentId(index, agentID, dataClient) {
  const query = getESQueryPolicyResponseByAgentID(agentID, index);
  const response = await dataClient.asInternalUser.search(query);
  if (response.hits.hits.length > 0 && response.hits.hits[0]._source != null) {
    return {
      policy_response: response.hits.hits[0]._source
    };
  }
  return undefined;
}
const transformAgentVersionMap = versionMap => {
  const data = {};
  versionMap.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};
async function getAgentPolicySummary(endpointAppContext, request, packageName, policyId, pageSize = 1000) {
  const agentQuery = `packages:"${packageName}"`;
  if (policyId) {
    return transformAgentVersionMap(await agentVersionsMap(endpointAppContext, request, `${agentQuery} AND policy_id:${policyId}`, pageSize));
  }
  return transformAgentVersionMap(await agentVersionsMap(endpointAppContext, request, agentQuery, pageSize));
}
async function agentVersionsMap(endpointAppContext, request, kqlQuery, pageSize = 1000) {
  const searchOptions = pageNum => {
    return {
      page: pageNum,
      perPage: pageSize,
      showInactive: false,
      kuery: kqlQuery
    };
  };
  let page = 1;
  const result = new Map();
  let hasMore = true;
  while (hasMore) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const queryResult = await endpointAppContext.service.getAgentService().asScoped(request).listAgents(searchOptions(page++));
    queryResult.agents.forEach(agent => {
      var _agent$local_metadata, _agent$local_metadata2, _agent$local_metadata3;
      const agentVersion = (_agent$local_metadata = agent.local_metadata) === null || _agent$local_metadata === void 0 ? void 0 : (_agent$local_metadata2 = _agent$local_metadata.elastic) === null || _agent$local_metadata2 === void 0 ? void 0 : (_agent$local_metadata3 = _agent$local_metadata2.agent) === null || _agent$local_metadata3 === void 0 ? void 0 : _agent$local_metadata3.version;
      if (result.has(agentVersion)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result.set(agentVersion, result.get(agentVersion) + 1);
      } else {
        result.set(agentVersion, 1);
      }
    });
    hasMore = queryResult.agents.length > 0;
  }
  return result;
}