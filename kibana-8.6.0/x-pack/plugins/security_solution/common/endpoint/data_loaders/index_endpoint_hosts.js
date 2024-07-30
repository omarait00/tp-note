"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIndexedEndpointHosts = void 0;
exports.indexEndpointHostDocs = indexEndpointHostDocs;
var _lodash = require("lodash");
var _uuid = _interopRequireDefault(require("uuid"));
var _generate_data = require("../generate_data");
var _index_fleet_agent = require("./index_fleet_agent");
var _index_endpoint_fleet_actions = require("./index_endpoint_fleet_actions");
var _index_fleet_endpoint_policy = require("./index_fleet_endpoint_policy");
var _constants = require("../constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Indexes the requested number of documents for the endpoint host metadata currently being output by the generator.
 * Endpoint Host metadata documents are added to an index that is set as "append only", thus one Endpoint host could
 * have multiple documents in that index.
 *
 *
 *
 * @param numDocs
 * @param client
 * @param kbnClient
 * @param realPolicies
 * @param epmEndpointPackage
 * @param metadataIndex
 * @param policyResponseIndex
 * @param enrollFleet
 * @param generator
 */
async function indexEndpointHostDocs({
  numDocs,
  client,
  kbnClient,
  realPolicies,
  epmEndpointPackage,
  metadataIndex,
  policyResponseIndex,
  enrollFleet,
  generator
}) {
  const timeBetweenDocs = 6 * 3600 * 1000; // 6 hours between metadata documents
  const timestamp = new Date().getTime();
  const kibanaVersion = await fetchKibanaVersion(kbnClient);
  const response = {
    hosts: [],
    agents: [],
    policyResponses: [],
    metadataIndex,
    policyResponseIndex,
    fleetAgentsIndex: '',
    endpointActionResponses: [],
    endpointActionResponsesIndex: '',
    endpointActions: [],
    endpointActionsIndex: '',
    actionResponses: [],
    responsesIndex: '',
    actions: [],
    actionsIndex: '',
    integrationPolicies: [],
    agentPolicies: []
  };
  let hostMetadata;
  let wasAgentEnrolled = false;
  let enrolledAgent;
  for (let j = 0; j < numDocs; j++) {
    generator.updateHostData();
    generator.updateHostPolicyData();
    hostMetadata = generator.generateHostMetadata(timestamp - timeBetweenDocs * (numDocs - j - 1), _generate_data.EndpointDocGenerator.createDataStreamFromIndex(metadataIndex));
    if (enrollFleet) {
      var _enrolledAgent$id, _enrolledAgent, _enrolledAgent$id2, _enrolledAgent2;
      const {
        id: appliedPolicyId,
        name: appliedPolicyName
      } = hostMetadata.Endpoint.policy.applied;
      const uniqueAppliedPolicyName = `${appliedPolicyName}-${_uuid.default.v4()}`;

      // If we don't yet have a "real" policy record, then create it now in ingest (package config)
      if (!realPolicies[appliedPolicyId]) {
        const createdPolicies = await (0, _index_fleet_endpoint_policy.indexFleetEndpointPolicy)(kbnClient, uniqueAppliedPolicyName, epmEndpointPackage.version);
        (0, _utils.mergeAndAppendArrays)(response, createdPolicies);

        // eslint-disable-next-line require-atomic-updates
        realPolicies[appliedPolicyId] = createdPolicies.integrationPolicies[0];
      }

      // If we did not yet enroll an agent for this Host, do it now that we have good policy id
      if (!wasAgentEnrolled) {
        wasAgentEnrolled = true;
        const indexedAgentResponse = await (0, _index_fleet_agent.indexFleetAgentForHost)(client, kbnClient, hostMetadata, realPolicies[appliedPolicyId].policy_id, kibanaVersion);
        enrolledAgent = indexedAgentResponse.agents[0];
        (0, _utils.mergeAndAppendArrays)(response, indexedAgentResponse);
      }
      // Update the Host metadata record with the ID of the "real" policy along with the enrolled agent id
      hostMetadata = {
        ...hostMetadata,
        agent: {
          ...hostMetadata.agent,
          id: (_enrolledAgent$id = (_enrolledAgent = enrolledAgent) === null || _enrolledAgent === void 0 ? void 0 : _enrolledAgent.id) !== null && _enrolledAgent$id !== void 0 ? _enrolledAgent$id : hostMetadata.agent.id
        },
        elastic: {
          ...hostMetadata.elastic,
          agent: {
            ...hostMetadata.elastic.agent,
            id: (_enrolledAgent$id2 = (_enrolledAgent2 = enrolledAgent) === null || _enrolledAgent2 === void 0 ? void 0 : _enrolledAgent2.id) !== null && _enrolledAgent$id2 !== void 0 ? _enrolledAgent$id2 : hostMetadata.elastic.agent.id
          }
        },
        Endpoint: {
          ...hostMetadata.Endpoint,
          policy: {
            ...hostMetadata.Endpoint.policy,
            applied: {
              ...hostMetadata.Endpoint.policy.applied,
              id: realPolicies[appliedPolicyId].id
            }
          }
        }
      };

      // Create some fleet endpoint actions and .logs-endpoint actions for this Host
      await (0, _index_endpoint_fleet_actions.indexEndpointAndFleetActionsForHost)(client, hostMetadata, undefined);
    }
    await client.index({
      index: metadataIndex,
      body: hostMetadata,
      op_type: 'create',
      refresh: 'wait_for'
    }).catch(_utils.wrapErrorAndRejectPromise);
    const hostPolicyResponse = generator.generatePolicyResponse({
      ts: timestamp - timeBetweenDocs * (numDocs - j - 1),
      policyDataStream: _generate_data.EndpointDocGenerator.createDataStreamFromIndex(policyResponseIndex)
    });
    await client.index({
      index: policyResponseIndex,
      body: hostPolicyResponse,
      op_type: 'create',
      refresh: 'wait_for'
    }).catch(_utils.wrapErrorAndRejectPromise);

    // Clone the hostMetadata and policyResponse document to ensure that no shared state
    // (as a result of using the generator) is returned across docs.
    response.hosts.push((0, _lodash.cloneDeep)(hostMetadata));
    response.policyResponses.push((0, _lodash.cloneDeep)(hostPolicyResponse));
  }
  return response;
}
const fetchKibanaVersion = async kbnClient => {
  const version = (await kbnClient.request({
    path: '/api/status',
    method: 'GET'
  })).data.version.number;
  if (!version) {
    throw new _utils.EndpointDataLoadingError('failed to get kibana version via `/api/status` api');
  }
  return version;
};
const deleteIndexedEndpointHosts = async (esClient, kbnClient, indexedData) => {
  const response = {
    hosts: undefined,
    policyResponses: undefined,
    agents: undefined,
    responses: undefined,
    actions: undefined,
    endpointActionRequests: undefined,
    endpointActionResponses: undefined,
    integrationPolicies: undefined,
    agentPolicies: undefined
  };
  if (indexedData.hosts.length) {
    const body = {
      query: {
        bool: {
          filter: [{
            terms: {
              'agent.id': indexedData.hosts.map(host => host.agent.id)
            }
          }]
        }
      }
    };
    response.hosts = await esClient.deleteByQuery({
      index: indexedData.metadataIndex,
      wait_for_completion: true,
      body
    }).catch(_utils.wrapErrorAndRejectPromise);

    // Delete from the transform destination index
    await esClient.deleteByQuery({
      index: _constants.metadataCurrentIndexPattern,
      wait_for_completion: true,
      body
    }).catch(_utils.wrapErrorAndRejectPromise);
  }
  if (indexedData.policyResponses.length) {
    response.policyResponses = await esClient.deleteByQuery({
      index: indexedData.policyResponseIndex,
      wait_for_completion: true,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                'agent.id': indexedData.policyResponses.map(policyResponse => policyResponse.agent.id)
              }
            }]
          }
        }
      }
    }).catch(_utils.wrapErrorAndRejectPromise);
  }
  (0, _utils.mergeAndAppendArrays)(response, await (0, _index_fleet_agent.deleteIndexedFleetAgents)(esClient, indexedData));
  (0, _utils.mergeAndAppendArrays)(response, await (0, _index_endpoint_fleet_actions.deleteIndexedEndpointAndFleetActions)(esClient, indexedData));
  (0, _utils.mergeAndAppendArrays)(response, await (0, _index_fleet_endpoint_policy.deleteIndexedFleetEndpointPolicies)(kbnClient, indexedData));
  return response;
};
exports.deleteIndexedEndpointHosts = deleteIndexedEndpointHosts;