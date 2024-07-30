"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enrichHostMetadata = enrichHostMetadata;
exports.getLogger = void 0;
exports.getMetadataListRequestHandler = getMetadataListRequestHandler;
exports.getMetadataRequestHandler = void 0;
exports.getMetadataTransformStatsHandler = getMetadataTransformStatsHandler;
exports.mapToHostResultList = mapToHostResultList;
var _server = require("../../../../../fleet/server");
var _error_handler = require("../error_handler");
var _types = require("../../../../common/endpoint/types");
var _query_builders = require("./query_builders");
var _unenroll = require("./support/unenroll");
var _agent_status = require("./support/agent_status");
var _utils = require("../../utils");
var _query_strategies = require("./support/query_strategies");
var _constants = require("../../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLogger = endpointAppContext => {
  return endpointAppContext.logFactory.get('metadata');
};
exports.getLogger = getLogger;
function getMetadataListRequestHandler(endpointAppContext, logger) {
  return async (context, request, response) => {
    const endpointMetadataService = endpointAppContext.service.getEndpointMetadataService();
    const fleetServices = endpointAppContext.service.getInternalFleetServices();
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    let doesUnitedIndexExist = false;
    let didUnitedIndexError = false;
    let body = {
      data: [],
      total: 0,
      page: 0,
      pageSize: 0
    };
    try {
      doesUnitedIndexExist = await endpointMetadataService.doesUnitedIndexExist(esClient);
    } catch (error) {
      // for better UX, try legacy query instead of immediately failing on united index error
      didUnitedIndexError = true;
    }

    // If no unified Index present, then perform a search using the legacy approach
    if (!doesUnitedIndexExist || didUnitedIndexError) {
      const endpointPolicies = await endpointMetadataService.getAllEndpointPackagePolicies();
      const legacyResponse = await legacyListMetadataQuery(context, endpointAppContext, fleetServices, logger, endpointPolicies, request.query);
      body = {
        data: legacyResponse.hosts,
        total: legacyResponse.total,
        page: request.query.page || _constants.ENDPOINT_DEFAULT_PAGE,
        pageSize: request.query.pageSize || _constants.ENDPOINT_DEFAULT_PAGE_SIZE
      };
      return response.ok({
        body
      });
    }

    // Unified index is installed and being used - perform search using new approach
    try {
      const {
        data,
        total
      } = await endpointMetadataService.getHostMetadataList(esClient, fleetServices, request.query);
      body = {
        data,
        total,
        page: request.query.page || _constants.ENDPOINT_DEFAULT_PAGE,
        pageSize: request.query.pageSize || _constants.ENDPOINT_DEFAULT_PAGE_SIZE
      };
    } catch (error) {
      return (0, _error_handler.errorHandler)(logger, response, error);
    }
    return response.ok({
      body
    });
  };
}
const getMetadataRequestHandler = function (endpointAppContext, logger) {
  return async (context, request, response) => {
    const endpointMetadataService = endpointAppContext.service.getEndpointMetadataService();
    try {
      const esClient = (await context.core).elasticsearch.client;
      return response.ok({
        body: await endpointMetadataService.getEnrichedHostMetadata(esClient.asInternalUser, endpointAppContext.service.getInternalFleetServices(), request.params.id)
      });
    } catch (error) {
      return (0, _error_handler.errorHandler)(logger, response, error);
    }
  };
};
exports.getMetadataRequestHandler = getMetadataRequestHandler;
function getMetadataTransformStatsHandler(logger) {
  return async (context, _, response) => {
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    try {
      const transformStats = await esClient.transform.getTransformStats({
        transform_id: _constants.METADATA_TRANSFORMS_PATTERN,
        allow_no_match: true
      });
      return response.ok({
        body: transformStats
      });
    } catch (error) {
      return (0, _error_handler.errorHandler)(logger, response, error);
    }
  };
}
async function mapToHostResultList(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
queryParams, hostListQueryResult, metadataRequestContext) {
  var _hostListQueryResult$, _hostListQueryResult$2;
  const totalNumberOfHosts = hostListQueryResult.resultLength;
  if (((_hostListQueryResult$ = (_hostListQueryResult$2 = hostListQueryResult.resultList) === null || _hostListQueryResult$2 === void 0 ? void 0 : _hostListQueryResult$2.length) !== null && _hostListQueryResult$ !== void 0 ? _hostListQueryResult$ : 0) > 0) {
    return {
      request_page_size: queryParams.size,
      request_page_index: queryParams.from,
      hosts: await Promise.all(hostListQueryResult.resultList.map(async entry => enrichHostMetadata(entry, metadataRequestContext))),
      total: totalNumberOfHosts
    };
  } else {
    return {
      request_page_size: queryParams.size,
      request_page_index: queryParams.from,
      total: totalNumberOfHosts,
      hosts: []
    };
  }
}
async function enrichHostMetadata(hostMetadata, metadataRequestContext) {
  var _hostMetadata$elastic, _hostMetadata$elastic2, _metadataRequestConte, _metadataRequestConte2, _metadataRequestConte3;
  let hostStatus = _types.HostStatus.UNHEALTHY;
  let elasticAgentId = hostMetadata === null || hostMetadata === void 0 ? void 0 : (_hostMetadata$elastic = hostMetadata.elastic) === null || _hostMetadata$elastic === void 0 ? void 0 : (_hostMetadata$elastic2 = _hostMetadata$elastic.agent) === null || _hostMetadata$elastic2 === void 0 ? void 0 : _hostMetadata$elastic2.id;
  const log = metadataRequestContext.logger;
  const coreContext = await ((_metadataRequestConte = metadataRequestContext.requestHandlerContext) === null || _metadataRequestConte === void 0 ? void 0 : _metadataRequestConte.core);
  try {
    if (!metadataRequestContext.esClient && !(coreContext !== null && coreContext !== void 0 && coreContext.elasticsearch.client)) {
      throw new Error('esClient not found');
    }
    if (!metadataRequestContext.savedObjectsClient && !(coreContext !== null && coreContext !== void 0 && coreContext.savedObjects)) {
      throw new Error('esSavedObjectClient not found');
    }
  } catch (e) {
    log.error(e);
    throw e;
  }
  const esSavedObjectClient = (_metadataRequestConte2 = metadataRequestContext === null || metadataRequestContext === void 0 ? void 0 : metadataRequestContext.savedObjectsClient) !== null && _metadataRequestConte2 !== void 0 ? _metadataRequestConte2 : coreContext === null || coreContext === void 0 ? void 0 : coreContext.savedObjects.client;
  const fleetContext = await ((_metadataRequestConte3 = metadataRequestContext.requestHandlerContext) === null || _metadataRequestConte3 === void 0 ? void 0 : _metadataRequestConte3.fleet);
  try {
    /**
     * Get agent status by elastic agent id if available or use the endpoint-agent id.
     */

    if (!elasticAgentId) {
      elasticAgentId = hostMetadata.agent.id;
      log.warn(`Missing elastic agent id, using host id instead ${elasticAgentId}`);
    }
    const status = await (fleetContext === null || fleetContext === void 0 ? void 0 : fleetContext.agentClient.asCurrentUser.getAgentStatusById(elasticAgentId));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hostStatus = (0, _utils.fleetAgentStatusToEndpointHostStatus)(status);
  } catch (e) {
    if (e instanceof _server.AgentNotFoundError) {
      log.warn(`agent with id ${elasticAgentId} not found`);
    } else {
      log.error(e);
      throw e;
    }
  }
  let policyInfo;
  try {
    var _metadataRequestConte4;
    const agent = await (fleetContext === null || fleetContext === void 0 ? void 0 : fleetContext.agentClient.asCurrentUser.getAgent(elasticAgentId));
    const agentPolicy = await ((_metadataRequestConte4 = metadataRequestContext.endpointAppContextService.getAgentPolicyService()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ) === null || _metadataRequestConte4 === void 0 ? void 0 : _metadataRequestConte4.get(esSavedObjectClient, agent === null || agent === void 0 ? void 0 : agent.policy_id, true));
    const endpointPolicy = ((agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.package_policies) || []).find(policy => {
      var _policy$package;
      return ((_policy$package = policy.package) === null || _policy$package === void 0 ? void 0 : _policy$package.name) === 'endpoint';
    });
    policyInfo = {
      agent: {
        applied: {
          revision: (agent === null || agent === void 0 ? void 0 : agent.policy_revision) || 0,
          id: (agent === null || agent === void 0 ? void 0 : agent.policy_id) || ''
        },
        configured: {
          revision: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.revision) || 0,
          id: (agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.id) || ''
        }
      },
      endpoint: {
        revision: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.revision) || 0,
        id: (endpointPolicy === null || endpointPolicy === void 0 ? void 0 : endpointPolicy.id) || ''
      }
    };
  } catch (e) {
    // this is a non-vital enrichment of expected policy revisions.
    // if we fail just fetching these, the rest of the endpoint
    // data should still be returned. log the error and move on
    log.error(e);
  }
  return {
    metadata: hostMetadata,
    host_status: hostStatus,
    policy_info: policyInfo
  };
}
async function legacyListMetadataQuery(context, endpointAppContext, fleetServices, logger, endpointPolicies, queryOptions) {
  const fleetAgentClient = fleetServices.agent;
  const coreContext = await context.core;
  const metadataRequestContext = {
    esClient: coreContext.elasticsearch.client,
    endpointAppContextService: endpointAppContext.service,
    logger,
    requestHandlerContext: context,
    savedObjectsClient: coreContext.savedObjects.client
  };
  const endpointPolicyIds = endpointPolicies.map(policy => policy.policy_id);
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const unenrolledAgentIds = await (0, _unenroll.findAllUnenrolledAgentIds)(fleetAgentClient, endpointPolicyIds);
  const statusAgentIds = await (0, _agent_status.findAgentIdsByStatus)(fleetAgentClient, (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.hostStatuses) || []);
  const queryParams = await (0, _query_builders.kibanaRequestToMetadataListESQuery)({
    page: (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.page) || _constants.ENDPOINT_DEFAULT_PAGE,
    pageSize: (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.pageSize) || _constants.ENDPOINT_DEFAULT_PAGE_SIZE,
    kuery: (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.kuery) || '',
    unenrolledAgentIds,
    statusAgentIds
  });
  const result = await esClient.search(queryParams);
  const hostListQueryResult = (0, _query_strategies.queryResponseToHostListResult)(result);
  return mapToHostResultList(queryParams, hostListQueryResult, metadataRequestContext);
}