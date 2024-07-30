"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPackageToAgentPolicy = addPackageToAgentPolicy;
exports.agentPolicyService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _v = _interopRequireDefault(require("uuid/v5"));
var _jsYaml = require("js-yaml");
var _pMap = _interopRequireDefault(require("p-map"));
var _semver = require("semver");
var _constants = require("../../../spaces/common/constants");
var _constants2 = require("../constants");
var _services = require("../../common/services");
var _constants3 = require("../../common/constants");
var _errors = require("../errors");
var _agent_cm_to_yaml = require("../../common/services/agent_cm_to_yaml");
var _elastic_agent_manifest = require("./elastic_agent_manifest");
var _packages = require("./epm/packages");
var _agents = require("./agents");
var _package_policy = require("./package_policy");
var _package_policies = require("./package_policies");
var _output = require("./output");
var _agent_policy_update = require("./agent_policy_update");
var _saved_object = require("./saved_object");
var _app_context = require("./app_context");
var _agent_policies = require("./agent_policies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SAVED_OBJECT_TYPE = _constants2.AGENT_POLICY_SAVED_OBJECT_TYPE;
const KEY_EDITABLE_FOR_MANAGED_POLICIES = ['namespace'];
class AgentPolicyService {
  constructor() {
    (0, _defineProperty2.default)(this, "triggerAgentPolicyUpdatedEvent", async (soClient, esClient, action, agentPolicyId) => {
      return (0, _agent_policy_update.agentPolicyUpdateEventHandler)(soClient, esClient, action, agentPolicyId);
    });
  }
  async _update(soClient, esClient, id, agentPolicy, user, options = {
    bumpRevision: true
  }) {
    const existingAgentPolicy = await this.get(soClient, id, true);
    if (!existingAgentPolicy) {
      throw new Error('Agent policy not found');
    }
    if (existingAgentPolicy.status === _constants3.agentPolicyStatuses.Inactive && agentPolicy.status !== _constants3.agentPolicyStatuses.Active) {
      throw new Error(`Agent policy ${id} cannot be updated because it is ${existingAgentPolicy.status}`);
    }
    await (0, _agent_policies.validateOutputForPolicy)(soClient, agentPolicy, existingAgentPolicy, this.hasAPMIntegration(existingAgentPolicy));
    await soClient.update(SAVED_OBJECT_TYPE, id, {
      ...agentPolicy,
      ...(options.bumpRevision ? {
        revision: existingAgentPolicy.revision + 1
      } : {}),
      updated_at: new Date().toISOString(),
      updated_by: user ? user.username : 'system'
    });
    if (options.bumpRevision) {
      await this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', id);
    }
    return await this.get(soClient, id);
  }
  async ensurePreconfiguredAgentPolicy(soClient, esClient, config) {
    const {
      id,
      ...preconfiguredAgentPolicy
    } = (0, _lodash.omit)(config, 'package_policies');
    const newAgentPolicyDefaults = {
      namespace: 'default',
      monitoring_enabled: ['logs', 'metrics']
    };
    const newAgentPolicy = {
      ...newAgentPolicyDefaults,
      ...preconfiguredAgentPolicy,
      is_preconfigured: true
    };
    if (!id) throw new Error('Missing ID');
    return await this.ensureAgentPolicy(soClient, esClient, newAgentPolicy, id);
  }
  async ensureAgentPolicy(soClient, esClient, newAgentPolicy, id) {
    // For preconfigured policies with a specified ID
    const agentPolicy = await this.get(soClient, id, false).catch(() => null);
    if (!agentPolicy) {
      return {
        created: true,
        policy: await this.create(soClient, esClient, newAgentPolicy, {
          id
        })
      };
    }
    return {
      created: false,
      policy: agentPolicy
    };
  }
  hasAPMIntegration(agentPolicy) {
    return agentPolicy.package_policies && agentPolicy.package_policies.some(p => {
      var _p$package;
      return ((_p$package = p.package) === null || _p$package === void 0 ? void 0 : _p$package.name) === _constants3.FLEET_APM_PACKAGE;
    });
  }
  async create(soClient, esClient, agentPolicy, options) {
    var _agentPolicy$is_manag, _options$user;
    await this.requireUniqueName(soClient, agentPolicy);
    await (0, _agent_policies.validateOutputForPolicy)(soClient, agentPolicy);
    const newSo = await soClient.create(SAVED_OBJECT_TYPE, {
      ...agentPolicy,
      status: 'active',
      is_managed: (_agentPolicy$is_manag = agentPolicy.is_managed) !== null && _agentPolicy$is_manag !== void 0 ? _agentPolicy$is_manag : false,
      revision: 1,
      updated_at: new Date().toISOString(),
      updated_by: (options === null || options === void 0 ? void 0 : (_options$user = options.user) === null || _options$user === void 0 ? void 0 : _options$user.username) || 'system',
      schema_version: _constants2.FLEET_AGENT_POLICIES_SCHEMA_VERSION
    }, options);
    await this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'created', newSo.id);
    return {
      id: newSo.id,
      ...newSo.attributes
    };
  }
  async requireUniqueName(soClient, givenPolicy) {
    const results = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      searchFields: ['name'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(givenPolicy.name)
    });
    const idsWithName = results.total && results.saved_objects.map(({
      id
    }) => id);
    if (Array.isArray(idsWithName)) {
      const isEditingSelf = givenPolicy.id && idsWithName.includes(givenPolicy.id);
      if (!givenPolicy.id || !isEditingSelf) {
        const isSinglePolicy = idsWithName.length === 1;
        const existClause = isSinglePolicy ? `Agent Policy '${idsWithName[0]}' already exists` : `Agent Policies '${idsWithName.join(',')}' already exist`;
        throw new _errors.AgentPolicyNameExistsError(`${existClause} with name '${givenPolicy.name}'`);
      }
    }
  }
  async get(soClient, id, withPackagePolicies = true) {
    const agentPolicySO = await soClient.get(SAVED_OBJECT_TYPE, id);
    if (!agentPolicySO) {
      return null;
    }
    if (agentPolicySO.error) {
      throw new Error(agentPolicySO.error.message);
    }
    const agentPolicy = {
      id: agentPolicySO.id,
      ...agentPolicySO.attributes
    };
    if (withPackagePolicies) {
      agentPolicy.package_policies = (await _package_policy.packagePolicyService.findAllForAgentPolicy(soClient, id)) || [];
    }
    return agentPolicy;
  }
  async getByIDs(soClient, ids, options = {}) {
    const objects = ids.map(id => ({
      ...options,
      id,
      type: SAVED_OBJECT_TYPE
    }));
    const bulkGetResponse = await soClient.bulkGet(objects);
    const agentPolicies = await (0, _pMap.default)(bulkGetResponse.saved_objects, async agentPolicySO => {
      if (agentPolicySO.error) {
        if (options.ignoreMissing && agentPolicySO.error.statusCode === 404) {
          return null;
        } else if (agentPolicySO.error.statusCode === 404) {
          throw new _errors.AgentPolicyNotFoundError(`Agent policy ${agentPolicySO.id} not found`);
        } else {
          throw new Error(agentPolicySO.error.message);
        }
      }
      const agentPolicy = {
        id: agentPolicySO.id,
        ...agentPolicySO.attributes
      };
      if (options.withPackagePolicies) {
        const agentPolicyWithPackagePolicies = await this.get(soClient, agentPolicySO.id, options.withPackagePolicies);
        if (agentPolicyWithPackagePolicies) {
          agentPolicy.package_policies = agentPolicyWithPackagePolicies.package_policies;
        }
      }
      return agentPolicy;
    }, {
      concurrency: 50
    });
    return agentPolicies.filter(agentPolicy => agentPolicy !== null);
  }
  async list(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery,
      withPackagePolicies = false
    } = options;
    const baseFindParams = {
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage
    };
    const filter = kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined;
    let agentPoliciesSO;
    try {
      agentPoliciesSO = await soClient.find({
        ...baseFindParams,
        filter
      });
    } catch (e) {
      var _e$output, _e$message;
      const isBadRequest = ((_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.statusCode) === 400;
      const isKQLSyntaxError = (_e$message = e.message) === null || _e$message === void 0 ? void 0 : _e$message.startsWith('KQLSyntaxError');
      if (isBadRequest && !isKQLSyntaxError) {
        // fall back to simple search if the kuery is just a search term i.e not KQL
        agentPoliciesSO = await soClient.find({
          ...baseFindParams,
          search: kuery
        });
      } else {
        throw e;
      }
    }
    const agentPolicies = await (0, _pMap.default)(agentPoliciesSO.saved_objects, async agentPolicySO => {
      const agentPolicy = {
        id: agentPolicySO.id,
        ...agentPolicySO.attributes
      };
      if (withPackagePolicies) {
        const agentPolicyWithPackagePolicies = await this.get(soClient, agentPolicySO.id, withPackagePolicies);
        if (agentPolicyWithPackagePolicies) {
          agentPolicy.package_policies = agentPolicyWithPackagePolicies.package_policies;
        }
      }
      return agentPolicy;
    }, {
      concurrency: 50
    });
    return {
      items: agentPolicies,
      total: agentPoliciesSO.total,
      page,
      perPage
    };
  }
  async update(soClient, esClient, id, agentPolicy, options) {
    if (agentPolicy.name) {
      await this.requireUniqueName(soClient, {
        id,
        name: agentPolicy.name
      });
    }
    const existingAgentPolicy = await this.get(soClient, id, true);
    if (!existingAgentPolicy) {
      throw new Error('Agent policy not found');
    }
    if (existingAgentPolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
      Object.entries(agentPolicy).filter(([key]) => !KEY_EDITABLE_FOR_MANAGED_POLICIES.includes(key)).forEach(([key, val]) => {
        if (!(0, _lodash.isEqual)(existingAgentPolicy[key], val)) {
          throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot update ${key}`);
        }
      });
    }
    const {
      monitoring_enabled: monitoringEnabled
    } = agentPolicy;
    const packagesToInstall = [];
    if (!existingAgentPolicy.monitoring_enabled && monitoringEnabled !== null && monitoringEnabled !== void 0 && monitoringEnabled.length) {
      packagesToInstall.push(_constants3.FLEET_ELASTIC_AGENT_PACKAGE);
    }
    if (packagesToInstall.length > 0) {
      await (0, _packages.bulkInstallPackages)({
        savedObjectsClient: soClient,
        esClient,
        packagesToInstall,
        spaceId: (options === null || options === void 0 ? void 0 : options.spaceId) || _constants.DEFAULT_SPACE_ID
      });
    }
    return this._update(soClient, esClient, id, agentPolicy, options === null || options === void 0 ? void 0 : options.user);
  }
  async copy(soClient, esClient, id, newAgentPolicyProps, options) {
    // Copy base agent policy
    const baseAgentPolicy = await this.get(soClient, id, true);
    if (!baseAgentPolicy) {
      throw new Error('Agent policy not found');
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      namespace,
      monitoring_enabled
    } = baseAgentPolicy;
    const newAgentPolicy = await this.create(soClient, esClient, {
      namespace,
      monitoring_enabled,
      ...newAgentPolicyProps
    }, options);

    // Copy all package policies and append (copy n) to their names
    if (baseAgentPolicy.package_policies) {
      const newPackagePolicies = await (0, _pMap.default)(baseAgentPolicy.package_policies, async packagePolicy => {
        const {
          id: packagePolicyId,
          version,
          ...newPackagePolicy
        } = packagePolicy;
        const updatedPackagePolicy = {
          ...newPackagePolicy,
          name: await (0, _package_policies.incrementPackagePolicyCopyName)(soClient, packagePolicy.name)
        };
        return updatedPackagePolicy;
      });
      await _package_policy.packagePolicyService.bulkCreate(soClient, esClient, newPackagePolicies.map(newPackagePolicy => ({
        ...newPackagePolicy,
        policy_id: newAgentPolicy.id
      })), {
        ...options,
        bumpRevision: false
      });
    }

    // Get updated agent policy
    const updatedAgentPolicy = await this.get(soClient, newAgentPolicy.id, true);
    if (!updatedAgentPolicy) {
      throw new Error('Copied agent policy not found');
    }
    await this.deployPolicy(soClient, newAgentPolicy.id);
    return updatedAgentPolicy;
  }
  async bumpRevision(soClient, esClient, id, options) {
    const res = await this._update(soClient, esClient, id, {}, options === null || options === void 0 ? void 0 : options.user);
    return res;
  }

  /**
   * Remove an output from all agent policies that are using it, and replace the output by the default ones.
   * @param soClient
   * @param esClient
   * @param outputId
   */
  async removeOutputFromAll(soClient, esClient, outputId) {
    const agentPolicies = (await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'data_output_id', 'monitoring_output_id'],
      searchFields: ['data_output_id', 'monitoring_output_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(outputId),
      perPage: _constants2.SO_SEARCH_LIMIT
    })).saved_objects.map(so => ({
      id: so.id,
      ...so.attributes
    }));
    if (agentPolicies.length > 0) {
      await (0, _pMap.default)(agentPolicies, agentPolicy => this.update(soClient, esClient, agentPolicy.id, {
        data_output_id: agentPolicy.data_output_id === outputId ? null : agentPolicy.data_output_id,
        monitoring_output_id: agentPolicy.monitoring_output_id === outputId ? null : agentPolicy.monitoring_output_id
      }), {
        concurrency: 50
      });
    }
  }

  /**
   * Remove a Fleet Server from all agent policies that are using it, to use the default one instead.
   */
  async removeFleetServerHostFromAll(soClient, esClient, fleetServerHostId) {
    const agentPolicies = (await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'fleet_server_host_id'],
      searchFields: ['fleet_server_host_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(fleetServerHostId),
      perPage: _constants2.SO_SEARCH_LIMIT
    })).saved_objects.map(so => ({
      id: so.id,
      ...so.attributes
    }));
    if (agentPolicies.length > 0) {
      await (0, _pMap.default)(agentPolicies, agentPolicy => this.update(soClient, esClient, agentPolicy.id, {
        fleet_server_host_id: null
      }), {
        concurrency: 50
      });
    }
  }
  async bumpAllAgentPoliciesForOutput(soClient, esClient, outputId, options) {
    const currentPolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'data_output_id', 'monitoring_output_id'],
      searchFields: ['data_output_id', 'monitoring_output_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(outputId),
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const bumpedPolicies = currentPolicies.saved_objects.map(policy => {
      policy.attributes = {
        ...policy.attributes,
        revision: policy.attributes.revision + 1,
        updated_at: new Date().toISOString(),
        updated_by: options !== null && options !== void 0 && options.user ? options.user.username : 'system'
      };
      return policy;
    });
    const res = await soClient.bulkUpdate(bumpedPolicies);
    await (0, _pMap.default)(currentPolicies.saved_objects, policy => this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', policy.id), {
      concurrency: 50
    });
    return res;
  }
  async bumpAllAgentPolicies(soClient, esClient, options) {
    const currentPolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision'],
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const bumpedPolicies = currentPolicies.saved_objects.map(policy => {
      policy.attributes = {
        ...policy.attributes,
        revision: policy.attributes.revision + 1,
        updated_at: new Date().toISOString(),
        updated_by: options !== null && options !== void 0 && options.user ? options.user.username : 'system'
      };
      return policy;
    });
    const res = await soClient.bulkUpdate(bumpedPolicies);
    await (0, _pMap.default)(currentPolicies.saved_objects, policy => this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', policy.id), {
      concurrency: 50
    });
    return res;
  }
  async delete(soClient, esClient, id, options) {
    const agentPolicy = await this.get(soClient, id, false);
    if (!agentPolicy) {
      throw new Error('Agent policy not found');
    }
    if (agentPolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
      throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot delete hosted agent policy ${id}`);
    }
    const {
      total
    } = await (0, _agents.getAgentsByKuery)(esClient, {
      showInactive: false,
      perPage: 0,
      page: 1,
      kuery: `${_constants2.AGENTS_PREFIX}.policy_id:${id}`
    });
    if (total > 0) {
      throw new Error('Cannot delete agent policy that is assigned to agent(s)');
    }
    const packagePolicies = await _package_policy.packagePolicyService.findAllForAgentPolicy(soClient, id);
    if (packagePolicies.length) {
      const hasManagedPackagePolicies = packagePolicies.some(packagePolicy => packagePolicy.is_managed);
      if (hasManagedPackagePolicies && !(options !== null && options !== void 0 && options.force)) {
        throw new _errors.PackagePolicyRestrictionRelatedError(`Cannot delete agent policy ${id} that contains managed package policies`);
      }
      const deletedPackagePolicies = await _package_policy.packagePolicyService.delete(soClient, esClient, packagePolicies.map(p => p.id), {
        force: options === null || options === void 0 ? void 0 : options.force,
        skipUnassignFromAgentPolicies: true
      });
      try {
        await _package_policy.packagePolicyService.runDeleteExternalCallbacks(deletedPackagePolicies);
      } catch (error) {
        const logger = _app_context.appContextService.getLogger();
        logger.error(`An error occurred executing external callback: ${error}`);
        logger.error(error);
      }
    }
    if (agentPolicy.is_preconfigured && !(options !== null && options !== void 0 && options.force)) {
      await soClient.create(_constants2.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE, {
        id: String(id)
      });
    }
    await soClient.delete(SAVED_OBJECT_TYPE, id);
    await this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'deleted', id);
    if (options !== null && options !== void 0 && options.removeFleetServerDocuments) {
      await this.deleteFleetServerPoliciesForPolicyId(esClient, id);
    }
    return {
      id,
      name: agentPolicy.name
    };
  }
  async deployPolicy(soClient, agentPolicyId) {
    await this.deployPolicies(soClient, [agentPolicyId]);
  }
  async deployPolicies(soClient, agentPolicyIds) {
    // Use internal ES client so we have permissions to write to .fleet* indices
    const esClient = _app_context.appContextService.getInternalUserESClient();
    const defaultOutputId = await _output.outputService.getDefaultDataOutputId(soClient);
    if (!defaultOutputId) {
      return;
    }
    const policies = await agentPolicyService.getByIDs(soClient, agentPolicyIds);
    const policiesMap = (0, _lodash.keyBy)(policies, 'id');
    const fullPolicies = await Promise.all(agentPolicyIds.map(agentPolicyId =>
    // There are some potential performance concerns around using `getFullAgentPolicy` in this context, e.g.
    // re-fetching outputs, settings, and upgrade download source URI data for each policy. This could potentially
    // be a bottleneck in environments with several thousand agent policies being deployed here.
    agentPolicyService.getFullAgentPolicy(soClient, agentPolicyId)));
    const fleetServerPolicies = fullPolicies.reduce((acc, fullPolicy) => {
      if (!fullPolicy || !fullPolicy.revision) {
        return acc;
      }
      const policy = policiesMap[fullPolicy.id];
      if (!policy) {
        return acc;
      }
      const fleetServerPolicy = {
        '@timestamp': new Date().toISOString(),
        revision_idx: fullPolicy.revision,
        coordinator_idx: 0,
        data: fullPolicy,
        policy_id: fullPolicy.id,
        default_fleet_server: policy.is_default_fleet_server === true
      };
      if (policy.unenroll_timeout) {
        fleetServerPolicy.unenroll_timeout = policy.unenroll_timeout;
      }
      return [...acc, fleetServerPolicy];
    }, []);
    const fleetServerPoliciesBulkBody = fleetServerPolicies.flatMap(fleetServerPolicy => [{
      index: {
        _id: (0, _v.default)(`${fleetServerPolicy.policy_id}:${fleetServerPolicy.revision_idx}`, _v.default.DNS)
      }
    }, fleetServerPolicy]);
    const bulkResponse = await esClient.bulk({
      index: _constants3.AGENT_POLICY_INDEX,
      body: fleetServerPoliciesBulkBody,
      refresh: 'wait_for'
    });
    if (bulkResponse.errors) {
      const logger = _app_context.appContextService.getLogger();
      const erroredDocuments = bulkResponse.items.reduce((acc, item) => {
        const value = item.index;
        if (!value || !value.error) {
          return acc;
        }
        return [...acc, value];
      }, []);
      logger.debug(`Failed to index documents during policy deployment: ${JSON.stringify(erroredDocuments)}`);
    }
    await Promise.all(fleetServerPolicies.filter(fleetServerPolicy => {
      const policy = policiesMap[fleetServerPolicy.policy_id];
      return !policy.schema_version || (0, _semver.lt)(policy.schema_version, _constants2.FLEET_AGENT_POLICIES_SCHEMA_VERSION);
    }).map(fleetServerPolicy =>
    // There are some potential performance concerns around using `agentPolicyService.update` in this context.
    // This could potentially be a bottleneck in environments with several thousand agent policies being deployed here.
    agentPolicyService.update(soClient, esClient, fleetServerPolicy.policy_id, {
      schema_version: _constants2.FLEET_AGENT_POLICIES_SCHEMA_VERSION
    }, {
      force: true
    })));
  }
  async deleteFleetServerPoliciesForPolicyId(esClient, agentPolicyId) {
    await esClient.deleteByQuery({
      index: _constants3.AGENT_POLICY_INDEX,
      ignore_unavailable: true,
      body: {
        query: {
          term: {
            policy_id: agentPolicyId
          }
        }
      }
    });
  }
  async getLatestFleetPolicy(esClient, agentPolicyId) {
    const res = await esClient.search({
      index: _constants3.AGENT_POLICY_INDEX,
      ignore_unavailable: true,
      rest_total_hits_as_int: true,
      body: {
        query: {
          term: {
            policy_id: agentPolicyId
          }
        },
        size: 1,
        sort: [{
          revision_idx: {
            order: 'desc'
          }
        }]
      }
    });
    if (res.hits.total === 0) {
      return null;
    }
    return res.hits.hits[0]._source;
  }
  async getFullAgentConfigMap(soClient, id, options) {
    const fullAgentPolicy = await (0, _agent_policies.getFullAgentPolicy)(soClient, id, options);
    if (fullAgentPolicy) {
      const fullAgentConfigMap = {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: 'agent-node-datastreams',
          namespace: 'kube-system',
          labels: {
            'k8s-app': 'elastic-agent'
          }
        },
        data: {
          'agent.yml': fullAgentPolicy
        }
      };
      const configMapYaml = (0, _agent_cm_to_yaml.fullAgentConfigMapToYaml)(fullAgentConfigMap, _jsYaml.safeDump);
      const updateManifestVersion = _elastic_agent_manifest.elasticAgentStandaloneManifest.replace('VERSION', _app_context.appContextService.getKibanaVersion());
      const fixedAgentYML = configMapYaml.replace('agent.yml:', 'agent.yml: |-');
      return [fixedAgentYML, updateManifestVersion].join('\n');
    } else {
      return '';
    }
  }
  async getFullAgentManifest(fleetServer, enrolToken) {
    const updateManifestVersion = _elastic_agent_manifest.elasticAgentManagedManifest.replace('VERSION', _app_context.appContextService.getKibanaVersion());
    let updateManifest = updateManifestVersion;
    if (fleetServer !== '') {
      updateManifest = updateManifest.replace('https://fleet-server:8220', fleetServer);
    }
    if (enrolToken !== '') {
      updateManifest = updateManifest.replace('token-id', enrolToken);
    }
    return updateManifest;
  }
  async getFullAgentPolicy(soClient, id, options) {
    return (0, _agent_policies.getFullAgentPolicy)(soClient, id, options);
  }

  /**
   * Remove a download source from all agent policies that are using it, and replace the output by the default ones.
   * @param soClient
   * @param esClient
   * @param downloadSourceId
   */
  async removeDefaultSourceFromAll(soClient, esClient, downloadSourceId) {
    const agentPolicies = (await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'download_source_id'],
      searchFields: ['download_source_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(downloadSourceId),
      perPage: _constants2.SO_SEARCH_LIMIT
    })).saved_objects.map(so => ({
      id: so.id,
      ...so.attributes
    }));
    if (agentPolicies.length > 0) {
      await (0, _pMap.default)(agentPolicies, agentPolicy => this.update(soClient, esClient, agentPolicy.id, {
        download_source_id: agentPolicy.download_source_id === downloadSourceId ? null : agentPolicy.download_source_id
      }), {
        concurrency: 50
      });
    }
  }
  async bumpAllAgentPoliciesForDownloadSource(soClient, esClient, downloadSourceId, options) {
    const currentPolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'download_source_id'],
      searchFields: ['download_source_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(downloadSourceId),
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const bumpedPolicies = currentPolicies.saved_objects.map(policy => {
      policy.attributes = {
        ...policy.attributes,
        revision: policy.attributes.revision + 1,
        updated_at: new Date().toISOString(),
        updated_by: options !== null && options !== void 0 && options.user ? options.user.username : 'system'
      };
      return policy;
    });
    const res = await soClient.bulkUpdate(bumpedPolicies);
    await (0, _pMap.default)(currentPolicies.saved_objects, policy => this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', policy.id), {
      concurrency: 50
    });
    return res;
  }
  async bumpAllAgentPoliciesForFleetServerHosts(soClient, esClient, fleetServerHostId, options) {
    const currentPolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      fields: ['revision', 'fleet_server_host_id'],
      searchFields: ['fleet_server_host_id'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(fleetServerHostId),
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const bumpedPolicies = currentPolicies.saved_objects.map(policy => {
      policy.attributes = {
        ...policy.attributes,
        revision: policy.attributes.revision + 1,
        updated_at: new Date().toISOString(),
        updated_by: options !== null && options !== void 0 && options.user ? options.user.username : 'system'
      };
      return policy;
    });
    const res = await soClient.bulkUpdate(bumpedPolicies);
    await (0, _pMap.default)(currentPolicies.saved_objects, policy => this.triggerAgentPolicyUpdatedEvent(soClient, esClient, 'updated', policy.id), {
      concurrency: 50
    });
    return res;
  }
}
const agentPolicyService = new AgentPolicyService();
exports.agentPolicyService = agentPolicyService;
async function addPackageToAgentPolicy(soClient, esClient, packageToInstall, agentPolicy, defaultOutput, packageInfo, packagePolicyName, packagePolicyId, packagePolicyDescription, transformPackagePolicy, bumpAgentPolicyRevison = false) {
  var _agentPolicy$namespac;
  const basePackagePolicy = (0, _services.packageToPackagePolicy)(packageInfo, agentPolicy.id, (_agentPolicy$namespac = agentPolicy.namespace) !== null && _agentPolicy$namespac !== void 0 ? _agentPolicy$namespac : 'default', packagePolicyName, packagePolicyDescription);
  const newPackagePolicy = transformPackagePolicy ? transformPackagePolicy(basePackagePolicy) : basePackagePolicy;

  // If an ID is provided via preconfiguration, use that value. Otherwise fall back to
  // a UUID v5 value seeded from the agent policy's ID and the provided package policy name.
  const id = packagePolicyId ? String(packagePolicyId) : (0, _v.default)(`${agentPolicy.id}-${packagePolicyName}`, _constants3.UUID_V5_NAMESPACE);
  await _package_policy.packagePolicyService.create(soClient, esClient, newPackagePolicy, {
    id,
    bumpRevision: bumpAgentPolicyRevison,
    skipEnsureInstalled: true,
    skipUniqueNameVerification: true,
    overwrite: true,
    force: true,
    // To add package to managed policy we need the force flag
    packageInfo
  });
}