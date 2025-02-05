"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointMetadataService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../fleet/server");
var _agent_status = require("../../../../../fleet/common/services/agent_status");
var _errors = require("./errors");
var _query_builders = require("../../routes/metadata/query_builders");
var _query_strategies = require("../../routes/metadata/support/query_strategies");
var _utils = require("../../utils");
var _create_internal_readonly_so_client = require("../../utils/create_internal_readonly_so_client");
var _constants = require("../../../../common/endpoint/constants");
var _endpoint_package_policies = require("../../routes/metadata/support/endpoint_package_policies");
var _errors2 = require("../../../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isAgentPolicyWithPackagePolicies = agentPolicy => {
  return agentPolicy.package_policies ? true : false;
};
class EndpointMetadataService {
  /**
   * For internal use only by the `this.DANGEROUS_INTERNAL_SO_CLIENT`
   * @deprecated
   */

  constructor(savedObjectsStart, agentPolicyService, packagePolicyService, logger) {
    (0, _defineProperty2.default)(this, "__DANGEROUS_INTERNAL_SO_CLIENT", void 0);
    this.savedObjectsStart = savedObjectsStart;
    this.agentPolicyService = agentPolicyService;
    this.packagePolicyService = packagePolicyService;
    this.logger = logger;
  }

  /**
   * An INTERNAL Saved Object client that is effectively the system user and has all privileges and permissions and
   * can access any saved object. Used primarly to retrieve fleet data for endpoint enrichment (so that users are
   * not required to have superuser role)
   *
   * **IMPORTANT: SHOULD BE USED ONLY FOR READ-ONLY ACCESS AND WITH DISCRETION**
   *
   * @private
   */
  get DANGEROUS_INTERNAL_SO_CLIENT() {
    // The INTERNAL SO client must be created during the first time its used. This is because creating it during
    // instance initialization (in `constructor(){}`) causes the SO Client to be invalid (perhaps because this
    // instantiation is happening during the plugin's the start phase)
    if (!this.__DANGEROUS_INTERNAL_SO_CLIENT) {
      this.__DANGEROUS_INTERNAL_SO_CLIENT = (0, _create_internal_readonly_so_client.createInternalReadonlySoClient)(this.savedObjectsStart);
    }
    return this.__DANGEROUS_INTERNAL_SO_CLIENT;
  }

  /**
   * Retrieve a single endpoint host metadata. Note that the return endpoint document, if found,
   * could be associated with a Fleet Agent that is no longer active. If wanting to ensure the
   * endpoint is associated with an active Fleet Agent, then use `getEnrichedHostMetadata()` instead
   *
   * @param esClient Elasticsearch Client (usually scoped to the user's context)
   * @param endpointId the endpoint id (from `agent.id`)
   *
   * @throws
   */
  async getHostMetadata(esClient, endpointId) {
    const query = (0, _query_builders.getESQueryHostMetadataByID)(endpointId);
    const queryResult = await esClient.search(query).catch(_utils.catchAndWrapError);
    const endpointMetadata = (0, _query_strategies.queryResponseToHostResult)(queryResult).result;
    if (endpointMetadata) {
      return endpointMetadata;
    }
    throw new _errors.EndpointHostNotFoundError(`Endpoint with id ${endpointId} not found`);
  }

  /**
   * Find a  list of Endpoint Host Metadata document associated with a given list of Fleet Agent Ids
   * @param esClient
   * @param fleetAgentIds
   */
  async findHostMetadataForFleetAgents(esClient, fleetAgentIds) {
    const query = (0, _query_builders.getESQueryHostMetadataByFleetAgentIds)(fleetAgentIds);

    // @ts-expect-error `size` not defined as top level property when using `typesWithBodyKey`
    query.size = fleetAgentIds.length;
    const searchResult = await esClient.search(query, {
      ignore: [404]
    }).catch(_utils.catchAndWrapError);
    return (0, _query_strategies.queryResponseToHostListResult)(searchResult).resultList;
  }

  /**
   * Retrieve a single endpoint host metadata along with fleet information
   *
   * @param esClient Elasticsearch Client (usually scoped to the user's context)
   * @param fleetServices
   * @param endpointId the endpoint id (from `agent.id`)
   *
   * @throws
   */
  async getEnrichedHostMetadata(esClient, fleetServices, endpointId) {
    const endpointMetadata = await this.getHostMetadata(esClient, endpointId);
    let fleetAgentId = endpointMetadata.elastic.agent.id;
    let fleetAgent;

    // Get Fleet agent
    try {
      if (!fleetAgentId) {
        var _this$logger;
        fleetAgentId = endpointMetadata.agent.id;
        (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.warn(`Missing elastic agent id, using host id instead ${fleetAgentId}`);
      }
      fleetAgent = await this.getFleetAgent(fleetServices.agent, fleetAgentId);
    } catch (error) {
      if (error instanceof _errors.FleetAgentNotFoundError) {
        var _this$logger2;
        (_this$logger2 = this.logger) === null || _this$logger2 === void 0 ? void 0 : _this$logger2.warn(`agent with id ${fleetAgentId} not found`);
      } else {
        throw error;
      }
    }

    // If the agent is not longer active, then that means that the Agent/Endpoint have been un-enrolled from the host
    if (fleetAgent && !fleetAgent.active) {
      throw new _errors.EndpointHostUnEnrolledError(`Endpoint with id ${endpointId} (Fleet agent id ${fleetAgentId}) is unenrolled`);
    }
    return this.enrichHostMetadata(fleetServices, endpointMetadata, fleetAgent);
  }

  /**
   * Enriches a host metadata document with data from fleet
   * @param fleetServices
   * @param endpointMetadata
   * @param _fleetAgent
   * @param _fleetAgentPolicy
   * @param _endpointPackagePolicy
   * @private
   */
  // eslint-disable-next-line complexity
  async enrichHostMetadata(fleetServices, endpointMetadata,
  /**
   * If undefined, it will be retrieved from Fleet using the ID in the endpointMetadata.
   * If passing in an `Agent` record that was retrieved from the Endpoint Unified transform index,
   * ensure that its `.status` property is properly set to the calculated value done by
   * fleet `getAgentStatus()` method.
   */
  _fleetAgent, /** If undefined, it will be retrieved from Fleet using data from the endpointMetadata  */
  _fleetAgentPolicy, /** If undefined, it will be retrieved from Fleet using the ID in the endpointMetadata */
  _endpointPackagePolicy) {
    var _fleetAgent$policy_re, _fleetAgent2, _fleetAgent$policy_id2, _fleetAgent3, _fleetAgentPolicy$rev, _fleetAgentPolicy2, _fleetAgentPolicy$id, _fleetAgentPolicy3, _endpointPackagePolic, _endpointPackagePolic2, _endpointPackagePolic3, _endpointPackagePolic4;
    let fleetAgentId = endpointMetadata.elastic.agent.id;
    // casting below is done only to remove `immutable<>` from the object if they are defined as such
    let fleetAgent = _fleetAgent;
    let fleetAgentPolicy = _fleetAgentPolicy;
    let endpointPackagePolicy = _endpointPackagePolicy;
    if (!fleetAgent) {
      try {
        if (!fleetAgentId) {
          var _this$logger3;
          fleetAgentId = endpointMetadata.agent.id;
          (_this$logger3 = this.logger) === null || _this$logger3 === void 0 ? void 0 : _this$logger3.warn(new _errors2.EndpointError(`Missing elastic fleet agent id on Endpoint Metadata doc - using Endpoint agent.id instead: ${fleetAgentId}`));
        }
        fleetAgent = await this.getFleetAgent(fleetServices.agent, fleetAgentId);
      } catch (error) {
        if (error instanceof _errors.FleetAgentNotFoundError) {
          var _this$logger4;
          (_this$logger4 = this.logger) === null || _this$logger4 === void 0 ? void 0 : _this$logger4.warn(`agent with id ${fleetAgentId} not found`);
        } else {
          throw error;
        }
      }
    }
    if (!fleetAgentPolicy && fleetAgent) {
      try {
        var _fleetAgent$policy_id;
        fleetAgentPolicy = await this.getFleetAgentPolicy((_fleetAgent$policy_id = fleetAgent.policy_id) !== null && _fleetAgent$policy_id !== void 0 ? _fleetAgent$policy_id : '');
      } catch (error) {
        var _this$logger5;
        (_this$logger5 = this.logger) === null || _this$logger5 === void 0 ? void 0 : _this$logger5.error(error);
      }
    }

    // The fleetAgentPolicy might have the endpoint policy in the `package_policies`, lets check that first
    if (!endpointPackagePolicy && fleetAgentPolicy && isAgentPolicyWithPackagePolicies(fleetAgentPolicy)) {
      endpointPackagePolicy = fleetAgentPolicy.package_policies.find(policy => {
        var _policy$package;
        return ((_policy$package = policy.package) === null || _policy$package === void 0 ? void 0 : _policy$package.name) === 'endpoint';
      });
    }

    // if we still don't have an endpoint package policy, try retrieving it from fleet
    if (!endpointPackagePolicy) {
      try {
        endpointPackagePolicy = await this.getFleetEndpointPackagePolicy(endpointMetadata.Endpoint.policy.applied.id);
      } catch (error) {
        var _this$logger6;
        (_this$logger6 = this.logger) === null || _this$logger6 === void 0 ? void 0 : _this$logger6.error(error);
      }
    }
    return {
      metadata: endpointMetadata,
      host_status: fleetAgent ?
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (0, _utils.fleetAgentStatusToEndpointHostStatus)(fleetAgent.status) : _utils.DEFAULT_ENDPOINT_HOST_STATUS,
      policy_info: {
        agent: {
          applied: {
            revision: (_fleetAgent$policy_re = (_fleetAgent2 = fleetAgent) === null || _fleetAgent2 === void 0 ? void 0 : _fleetAgent2.policy_revision) !== null && _fleetAgent$policy_re !== void 0 ? _fleetAgent$policy_re : 0,
            id: (_fleetAgent$policy_id2 = (_fleetAgent3 = fleetAgent) === null || _fleetAgent3 === void 0 ? void 0 : _fleetAgent3.policy_id) !== null && _fleetAgent$policy_id2 !== void 0 ? _fleetAgent$policy_id2 : ''
          },
          configured: {
            revision: (_fleetAgentPolicy$rev = (_fleetAgentPolicy2 = fleetAgentPolicy) === null || _fleetAgentPolicy2 === void 0 ? void 0 : _fleetAgentPolicy2.revision) !== null && _fleetAgentPolicy$rev !== void 0 ? _fleetAgentPolicy$rev : 0,
            id: (_fleetAgentPolicy$id = (_fleetAgentPolicy3 = fleetAgentPolicy) === null || _fleetAgentPolicy3 === void 0 ? void 0 : _fleetAgentPolicy3.id) !== null && _fleetAgentPolicy$id !== void 0 ? _fleetAgentPolicy$id : ''
          }
        },
        endpoint: {
          revision: (_endpointPackagePolic = (_endpointPackagePolic2 = endpointPackagePolicy) === null || _endpointPackagePolic2 === void 0 ? void 0 : _endpointPackagePolic2.revision) !== null && _endpointPackagePolic !== void 0 ? _endpointPackagePolic : 0,
          id: (_endpointPackagePolic3 = (_endpointPackagePolic4 = endpointPackagePolicy) === null || _endpointPackagePolic4 === void 0 ? void 0 : _endpointPackagePolic4.id) !== null && _endpointPackagePolic3 !== void 0 ? _endpointPackagePolic3 : ''
        }
      }
    };
  }

  /**
   * Retrieve a single Fleet Agent data
   *
   * @param fleetAgentService
   * @param agentId The elastic agent id (`from `elastic.agent.id`)
   */
  async getFleetAgent(fleetAgentService, agentId) {
    try {
      return await fleetAgentService.getAgent(agentId);
    } catch (error) {
      if (error instanceof _server.AgentNotFoundError) {
        throw new _errors.FleetAgentNotFoundError(`agent with id ${agentId} not found`, error);
      }
      throw new _errors2.EndpointError(error.message, error);
    }
  }

  /**
   * Retrieve a specific Fleet Agent Policy
   *
   * @param agentPolicyId
   *
   * @throws
   */
  async getFleetAgentPolicy(agentPolicyId) {
    const agentPolicy = await this.agentPolicyService.get(this.DANGEROUS_INTERNAL_SO_CLIENT, agentPolicyId, true).catch(_utils.catchAndWrapError);
    if (agentPolicy) {
      return agentPolicy;
    }
    throw new _errors.FleetAgentPolicyNotFoundError(`Fleet agent policy with id ${agentPolicyId} not found`);
  }

  /**
   * Retrieve an endpoint policy from fleet
   * @param endpointPolicyId
   * @throws
   */
  async getFleetEndpointPackagePolicy(endpointPolicyId) {
    const endpointPackagePolicy = await this.packagePolicyService.get(this.DANGEROUS_INTERNAL_SO_CLIENT, endpointPolicyId).catch(_utils.catchAndWrapError);
    if (!endpointPackagePolicy) {
      throw new _errors.FleetEndpointPackagePolicyNotFoundError(`Fleet endpoint package policy with id ${endpointPolicyId} not found`);
    }
    return endpointPackagePolicy;
  }

  /**
   * Returns whether the united metadata index exists
   *
   * @param esClient
   *
   * @throws
   */
  async doesUnitedIndexExist(esClient) {
    try {
      await esClient.search({
        index: _constants.METADATA_UNITED_INDEX,
        size: 1
      });
      return true;
    } catch (error) {
      var _error$meta$body$erro, _error$meta, _error$meta$body, _error$meta$body$erro2;
      const errorType = (_error$meta$body$erro = error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro2 = _error$meta$body.error) === null || _error$meta$body$erro2 === void 0 ? void 0 : _error$meta$body$erro2.type) !== null && _error$meta$body$erro !== void 0 ? _error$meta$body$erro : '';
      // only index not found is expected
      if (errorType !== 'index_not_found_exception') {
        var _this$logger7;
        const err = (0, _utils.wrapErrorIfNeeded)(error);
        (_this$logger7 = this.logger) === null || _this$logger7 === void 0 ? void 0 : _this$logger7.error(err);
        throw err;
      }
    }
    return false;
  }

  /**
   * Retrieve list of host metadata. Only supports new united index.
   *
   * @param esClient
   * @param queryOptions
   *
   * @throws
   */
  async getHostMetadataList(esClient, fleetServices, queryOptions) {
    var _unitedMetadataQueryR, _await$this$agentPoli;
    const endpointPolicies = await this.getAllEndpointPackagePolicies();
    const endpointPolicyIds = endpointPolicies.map(policy => policy.policy_id);
    const unitedIndexQuery = await (0, _query_builders.buildUnitedIndexQuery)(queryOptions, endpointPolicyIds);
    let unitedMetadataQueryResponse;
    try {
      unitedMetadataQueryResponse = await esClient.search(unitedIndexQuery);
    } catch (error) {
      var _this$logger8;
      const err = (0, _utils.wrapErrorIfNeeded)(error);
      (_this$logger8 = this.logger) === null || _this$logger8 === void 0 ? void 0 : _this$logger8.error(err);
      throw err;
    }
    const {
      hits: docs,
      total: docsCount
    } = ((_unitedMetadataQueryR = unitedMetadataQueryResponse) === null || _unitedMetadataQueryR === void 0 ? void 0 : _unitedMetadataQueryR.hits) || {};
    const agentPolicyIds = docs.map(doc => {
      var _doc$_source$united$a, _doc$_source, _doc$_source$united, _doc$_source$united$a2;
      return (_doc$_source$united$a = (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : (_doc$_source$united = _doc$_source.united) === null || _doc$_source$united === void 0 ? void 0 : (_doc$_source$united$a2 = _doc$_source$united.agent) === null || _doc$_source$united$a2 === void 0 ? void 0 : _doc$_source$united$a2.policy_id) !== null && _doc$_source$united$a !== void 0 ? _doc$_source$united$a : '';
    });
    const agentPolicies = (_await$this$agentPoli = await this.agentPolicyService.getByIds(this.DANGEROUS_INTERNAL_SO_CLIENT, agentPolicyIds).catch(_utils.catchAndWrapError)) !== null && _await$this$agentPoli !== void 0 ? _await$this$agentPoli : [];
    const agentPoliciesMap = agentPolicies.reduce((acc, agentPolicy) => ({
      ...acc,
      [agentPolicy.id]: {
        ...agentPolicy
      }
    }), {});
    const endpointPoliciesMap = endpointPolicies.reduce((acc, packagePolicy) => ({
      ...acc,
      [packagePolicy.policy_id]: packagePolicy
    }), {});
    const hosts = [];
    for (const doc of docs) {
      var _doc$_source$united2, _doc$_source2;
      const {
        endpoint: metadata,
        agent: _agent
      } = (_doc$_source$united2 = doc === null || doc === void 0 ? void 0 : (_doc$_source2 = doc._source) === null || _doc$_source2 === void 0 ? void 0 : _doc$_source2.united) !== null && _doc$_source$united2 !== void 0 ? _doc$_source$united2 : {};
      if (metadata && _agent) {
        // `_agent: Agent` here is the record stored in the unified index, whose `status` **IS NOT** the
        // calculated status returned by the normal fleet API/Service. So lets calculated it before
        // passing this on to other methods that expect an `Agent` type
        const agent = {
          ..._agent,
          // Casting below necessary to remove `Immutable<>` from the type
          status: (0, _agent_status.getAgentStatus)(_agent)
        };

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const agentPolicy = agentPoliciesMap[agent.policy_id];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const endpointPolicy = endpointPoliciesMap[agent.policy_id];
        hosts.push(await this.enrichHostMetadata(fleetServices, metadata, agent, agentPolicy, endpointPolicy));
      }
    }
    return {
      data: hosts,
      total: docsCount.value
    };
  }
  async getAllEndpointPackagePolicies() {
    return (0, _endpoint_package_policies.getAllEndpointPackagePolicies)(this.packagePolicyService, this.DANGEROUS_INTERNAL_SO_CLIENT);
  }
}
exports.EndpointMetadataService = EndpointMetadataService;