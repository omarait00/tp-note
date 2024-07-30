"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIndexedHostsAndAlerts = void 0;
exports.indexHostsAndAlerts = indexHostsAndAlerts;
var _seedrandom = _interopRequireDefault(require("seedrandom"));
var _common = require("../../../fleet/common");
var _generate_data = require("./generate_data");
var _index_endpoint_hosts = require("./data_loaders/index_endpoint_hosts");
var _index_fleet_server = require("./data_loaders/index_fleet_server");
var _index_alerts = require("./data_loaders/index_alerts");
var _setup_fleet_for_endpoint = require("./data_loaders/setup_fleet_for_endpoint");
var _utils = require("./data_loaders/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Indexes Endpoint Hosts (with optional Fleet counterparts) along with alerts
 *
 * @param client
 * @param kbnClient
 * @param seed
 * @param numHosts
 * @param numDocs
 * @param metadataIndex
 * @param policyResponseIndex
 * @param eventIndex
 * @param alertIndex
 * @param alertsPerHost
 * @param fleet
 * @param options
 * @param DocGenerator
 */
async function indexHostsAndAlerts(client, kbnClient, seed, numHosts, numDocs, metadataIndex, policyResponseIndex, eventIndex, alertIndex, alertsPerHost, fleet, options = {}, DocGenerator = _generate_data.EndpointDocGenerator) {
  const random = (0, _seedrandom.default)(seed);
  const epmEndpointPackage = await getEndpointPackageInfo(kbnClient);
  const response = {
    hosts: [],
    policyResponses: [],
    agents: [],
    fleetAgentsIndex: '',
    metadataIndex,
    policyResponseIndex,
    actionResponses: [],
    responsesIndex: '',
    actions: [],
    actionsIndex: '',
    endpointActions: [],
    endpointActionsIndex: '',
    endpointActionResponses: [],
    endpointActionResponsesIndex: '',
    integrationPolicies: [],
    agentPolicies: []
  };

  // Ensure fleet is setup and endpoint package installed
  await (0, _setup_fleet_for_endpoint.setupFleetForEndpoint)(kbnClient);

  // If `fleet` integration is true, then ensure a (fake) fleet-server is connected
  if (fleet) {
    await (0, _index_fleet_server.enableFleetServerIfNecessary)(client);
  }

  // Keep a map of host applied policy ids (fake) to real ingest package configs (policy record)
  const realPolicies = {};
  for (let i = 0; i < numHosts; i++) {
    const generator = new DocGenerator(random);
    const indexedHosts = await (0, _index_endpoint_hosts.indexEndpointHostDocs)({
      numDocs,
      client,
      kbnClient,
      realPolicies,
      epmEndpointPackage,
      metadataIndex,
      policyResponseIndex,
      enrollFleet: fleet,
      generator
    });
    (0, _utils.mergeAndAppendArrays)(response, indexedHosts);
    await (0, _index_alerts.indexAlerts)({
      client,
      eventIndex,
      alertIndex,
      generator,
      numAlerts: alertsPerHost,
      options
    });
  }
  return response;
}
const getEndpointPackageInfo = async kbnClient => {
  const endpointPackage = (await kbnClient.request({
    path: `${_common.EPM_API_ROUTES.LIST_PATTERN}?category=security`,
    method: 'GET'
  })).data.items.find(epmPackage => epmPackage.name === 'endpoint');
  if (!endpointPackage) {
    throw new Error('EPM Endpoint package was not found!');
  }
  return endpointPackage;
};
const deleteIndexedHostsAndAlerts = async (esClient, kbnClient, indexedData) => {
  return {
    ...(await (0, _index_endpoint_hosts.deleteIndexedEndpointHosts)(esClient, kbnClient, indexedData))
  };
};
exports.deleteIndexedHostsAndAlerts = deleteIndexedHostsAndAlerts;