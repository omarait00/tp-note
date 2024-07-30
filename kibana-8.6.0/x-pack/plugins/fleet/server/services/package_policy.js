"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackagePolicyServiceImpl = exports.DATA_STREAM_ALLOWED_INDEX_PRIVILEGES = void 0;
exports._applyIndexPrivileges = _applyIndexPrivileges;
exports._compilePackagePolicyInputs = _compilePackagePolicyInputs;
exports.packagePolicyService = void 0;
exports.preconfigurePackageInputs = preconfigurePackageInputs;
exports.updatePackageInputs = updatePackageInputs;
exports.updatePackagePolicyVersion = updatePackagePolicyVersion;
var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _lt = _interopRequireDefault(require("semver/functions/lt"));
var _std = require("@kbn/std");
var _uuid = _interopRequireDefault(require("uuid"));
var _jsYaml = require("js-yaml");
var _constants = require("../../../spaces/common/constants");
var _pMap = _interopRequireDefault(require("p-map"));
var _services = require("../../common/services");
var _constants2 = require("../../common/constants");
var _constants3 = require("../constants");
var _errors = require("../errors");
var _types = require("../types");
var _security = require("../routes/security");
var _agent_policies = require("./agent_policies");
var _agent_policy = require("./agent_policy");
var _packages = require("./epm/packages");
var _assets = require("./epm/packages/assets");
var _agent = require("./epm/agent/agent");
var _saved_object = require("./saved_object");
var _ = require(".");
var _cleanup = require("./epm/packages/cleanup");
var _upgrade_sender = require("./upgrade_sender");
var _package_policies = require("./package_policies");
var _update = require("./epm/packages/update");
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
const SAVED_OBJECT_TYPE = _constants3.PACKAGE_POLICY_SAVED_OBJECT_TYPE;
const DATA_STREAM_ALLOWED_INDEX_PRIVILEGES = new Set(['auto_configure', 'create_doc', 'maintenance', 'monitor', 'read', 'read_cross_cluster']);
exports.DATA_STREAM_ALLOWED_INDEX_PRIVILEGES = DATA_STREAM_ALLOWED_INDEX_PRIVILEGES;
class PackagePolicyClientImpl {
  async create(soClient, esClient, packagePolicy, options) {
    var _packagePolicy$packag, _packagePolicy$packag2, _options$user$usernam, _options$user, _options$user$usernam2, _options$user2, _options$bumpRevision;
    const agentPolicy = await _agent_policy.agentPolicyService.get(soClient, packagePolicy.policy_id, true);
    if (agentPolicy && ((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) === _constants2.FLEET_APM_PACKAGE) {
      const dataOutput = await (0, _agent_policies.getDataOutputForAgentPolicy)(soClient, agentPolicy);
      if (dataOutput.type === _constants2.outputType.Logstash) {
        throw new _errors.FleetError('You cannot add APM to a policy using a logstash output');
      }
    }
    await validateIsNotHostedPolicy(soClient, packagePolicy.policy_id, options === null || options === void 0 ? void 0 : options.force);

    // trailing whitespace causes issues creating API keys
    packagePolicy.name = packagePolicy.name.trim();
    if (!(options !== null && options !== void 0 && options.skipUniqueNameVerification)) {
      const existingPoliciesWithName = await this.list(soClient, {
        perPage: 1,
        kuery: `${_constants3.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name: "${packagePolicy.name}"`
      });

      // Check that the name does not exist already
      if (existingPoliciesWithName.items.length > 0) {
        throw new _errors.FleetError(`An integration policy with the name ${packagePolicy.name} already exists. Please rename it or choose a different name.`);
      }
    }
    let elasticsearch;
    // Add ids to stream
    const packagePolicyId = (options === null || options === void 0 ? void 0 : options.id) || _uuid.default.v4();
    let inputs = packagePolicy.inputs.map(input => assignStreamIdToInput(packagePolicyId, input));

    // Make sure the associated package is installed
    if ((_packagePolicy$packag2 = packagePolicy.package) !== null && _packagePolicy$packag2 !== void 0 && _packagePolicy$packag2.name) {
      var _options$packageInfo;
      if (!(options !== null && options !== void 0 && options.skipEnsureInstalled)) {
        await (0, _packages.ensureInstalledPackage)({
          esClient,
          spaceId: (options === null || options === void 0 ? void 0 : options.spaceId) || _constants.DEFAULT_SPACE_ID,
          savedObjectsClient: soClient,
          pkgName: packagePolicy.package.name,
          pkgVersion: packagePolicy.package.version,
          force: options === null || options === void 0 ? void 0 : options.force
        });
      }

      // Handle component template/mappings updates for experimental features, e.g. synthetic source
      await (0, _package_policies.handleExperimentalDatastreamFeatureOptIn)({
        soClient,
        esClient,
        packagePolicy
      });
      const pkgInfo = (_options$packageInfo = options === null || options === void 0 ? void 0 : options.packageInfo) !== null && _options$packageInfo !== void 0 ? _options$packageInfo : await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: packagePolicy.package.version,
        prerelease: true
      });

      // Check if it is a limited package, and if so, check that the corresponding agent policy does not
      // already contain a package policy for this package
      if ((0, _services.isPackageLimited)(pkgInfo)) {
        if (agentPolicy && (0, _services.doesAgentPolicyAlreadyIncludePackage)(agentPolicy, pkgInfo.name)) {
          throw new _errors.FleetError(`Unable to create integration policy. Integration '${pkgInfo.name}' already exists on this agent policy.`);
        }
      }
      validatePackagePolicyOrThrow(packagePolicy, pkgInfo);
      inputs = await _compilePackagePolicyInputs(pkgInfo, packagePolicy.vars || {}, inputs);
      elasticsearch = pkgInfo.elasticsearch;
    }
    const isoDate = new Date().toISOString();
    const newSo = await soClient.create(SAVED_OBJECT_TYPE, {
      ...packagePolicy,
      inputs,
      elasticsearch,
      revision: 1,
      created_at: isoDate,
      created_by: (_options$user$usernam = options === null || options === void 0 ? void 0 : (_options$user = options.user) === null || _options$user === void 0 ? void 0 : _options$user.username) !== null && _options$user$usernam !== void 0 ? _options$user$usernam : 'system',
      updated_at: isoDate,
      updated_by: (_options$user$usernam2 = options === null || options === void 0 ? void 0 : (_options$user2 = options.user) === null || _options$user2 === void 0 ? void 0 : _options$user2.username) !== null && _options$user$usernam2 !== void 0 ? _options$user$usernam2 : 'system'
    }, {
      ...options,
      id: packagePolicyId
    });
    if ((_options$bumpRevision = options === null || options === void 0 ? void 0 : options.bumpRevision) !== null && _options$bumpRevision !== void 0 ? _options$bumpRevision : true) {
      await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, packagePolicy.policy_id, {
        user: options === null || options === void 0 ? void 0 : options.user
      });
    }
    return {
      id: newSo.id,
      version: newSo.version,
      ...newSo.attributes
    };
  }
  async bulkCreate(soClient, esClient, packagePolicies, options) {
    var _options$bumpRevision2;
    const agentPolicyIds = new Set(packagePolicies.map(pkgPolicy => pkgPolicy.policy_id));
    for (const agentPolicyId of agentPolicyIds) {
      await validateIsNotHostedPolicy(soClient, agentPolicyId, options === null || options === void 0 ? void 0 : options.force);
    }
    const packageInfos = await getPackageInfoForPackagePolicies(packagePolicies, soClient);
    const isoDate = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      saved_objects
    } = await soClient.bulkCreate(await (0, _pMap.default)(packagePolicies, async packagePolicy => {
      var _packagePolicy$id, _options$user$usernam3, _options$user3, _options$user$usernam4, _options$user4;
      const packagePolicyId = (_packagePolicy$id = packagePolicy.id) !== null && _packagePolicy$id !== void 0 ? _packagePolicy$id : _uuid.default.v4();
      const agentPolicyId = packagePolicy.policy_id;
      let inputs = packagePolicy.inputs.map(input => assignStreamIdToInput(packagePolicyId, input));
      const {
        id,
        ...pkgPolicyWithoutId
      } = packagePolicy;
      let elasticsearch;
      if (packagePolicy.package) {
        const pkgInfo = packageInfos.get(`${packagePolicy.package.name}-${packagePolicy.package.version}`);
        inputs = pkgInfo ? await _compilePackagePolicyInputs(pkgInfo, packagePolicy.vars || {}, inputs) : inputs;
        elasticsearch = pkgInfo === null || pkgInfo === void 0 ? void 0 : pkgInfo.elasticsearch;
      }
      return {
        type: SAVED_OBJECT_TYPE,
        id: packagePolicyId,
        attributes: {
          ...pkgPolicyWithoutId,
          inputs,
          elasticsearch,
          policy_id: agentPolicyId,
          revision: 1,
          created_at: isoDate,
          created_by: (_options$user$usernam3 = options === null || options === void 0 ? void 0 : (_options$user3 = options.user) === null || _options$user3 === void 0 ? void 0 : _options$user3.username) !== null && _options$user$usernam3 !== void 0 ? _options$user$usernam3 : 'system',
          updated_at: isoDate,
          updated_by: (_options$user$usernam4 = options === null || options === void 0 ? void 0 : (_options$user4 = options.user) === null || _options$user4 === void 0 ? void 0 : _options$user4.username) !== null && _options$user$usernam4 !== void 0 ? _options$user$usernam4 : 'system'
        }
      };
    }));

    // Filter out invalid SOs
    const newSos = saved_objects.filter(so => !so.error && so.attributes);

    // Assign it to the given agent policy

    if ((_options$bumpRevision2 = options === null || options === void 0 ? void 0 : options.bumpRevision) !== null && _options$bumpRevision2 !== void 0 ? _options$bumpRevision2 : true) {
      for (const agentPolicyIdT of agentPolicyIds) {
        await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, agentPolicyIdT, {
          user: options === null || options === void 0 ? void 0 : options.user
        });
      }
    }
    return newSos.map(newSo => ({
      id: newSo.id,
      version: newSo.version,
      ...newSo.attributes
    }));
  }
  async get(soClient, id) {
    var _packagePolicySO$attr;
    const packagePolicySO = await soClient.get(SAVED_OBJECT_TYPE, id);
    if (!packagePolicySO) {
      return null;
    }
    if (packagePolicySO.error) {
      throw new Error(packagePolicySO.error.message);
    }
    let experimentalFeatures;
    if ((_packagePolicySO$attr = packagePolicySO.attributes.package) !== null && _packagePolicySO$attr !== void 0 && _packagePolicySO$attr.name) {
      var _packagePolicySO$attr2;
      const installation = await soClient.get(_constants2.PACKAGES_SAVED_OBJECT_TYPE, (_packagePolicySO$attr2 = packagePolicySO.attributes.package) === null || _packagePolicySO$attr2 === void 0 ? void 0 : _packagePolicySO$attr2.name);
      if (installation && !installation.error) {
        var _installation$attribu;
        experimentalFeatures = (_installation$attribu = installation.attributes) === null || _installation$attribu === void 0 ? void 0 : _installation$attribu.experimental_data_stream_features;
      }
    }
    const response = {
      id: packagePolicySO.id,
      version: packagePolicySO.version,
      ...packagePolicySO.attributes
    };

    // If possible, return the experimental features map for the package policy's `package` field
    if (experimentalFeatures && response.package) {
      response.package.experimental_data_stream_features = experimentalFeatures;
    }
    return response;
  }
  async findAllForAgentPolicy(soClient, agentPolicyId) {
    const packagePolicySO = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      filter: `${SAVED_OBJECT_TYPE}.attributes.policy_id:${(0, _saved_object.escapeSearchQueryPhrase)(agentPolicyId)}`,
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    if (!packagePolicySO) {
      return [];
    }
    return packagePolicySO.saved_objects.map(so => ({
      id: so.id,
      version: so.version,
      ...so.attributes
    }));
  }
  async getByIDs(soClient, ids, options = {}) {
    const packagePolicySO = await soClient.bulkGet(ids.map(id => ({
      id,
      type: SAVED_OBJECT_TYPE
    })));
    if (!packagePolicySO) {
      return null;
    }
    return packagePolicySO.saved_objects.map(so => {
      if (so.error) {
        if (options.ignoreMissing && so.error.statusCode === 404) {
          return null;
        } else if (so.error.statusCode === 404) {
          throw new _errors.PackagePolicyNotFoundError(`Package policy ${so.id} not found`);
        } else {
          throw new Error(so.error.message);
        }
      }
      return {
        id: so.id,
        version: so.version,
        ...so.attributes
      };
    }).filter(packagePolicy => packagePolicy !== null);
  }
  async list(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery
    } = options;
    const packagePolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage,
      filter: kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined
    });
    return {
      items: packagePolicies === null || packagePolicies === void 0 ? void 0 : packagePolicies.saved_objects.map(packagePolicySO => ({
        id: packagePolicySO.id,
        version: packagePolicySO.version,
        ...packagePolicySO.attributes
      })),
      total: packagePolicies === null || packagePolicies === void 0 ? void 0 : packagePolicies.total,
      page,
      perPage
    };
  }
  async listIds(soClient, options) {
    const {
      page = 1,
      perPage = 20,
      sortField = 'updated_at',
      sortOrder = 'desc',
      kuery
    } = options;
    const packagePolicies = await soClient.find({
      type: SAVED_OBJECT_TYPE,
      sortField,
      sortOrder,
      page,
      perPage,
      fields: [],
      filter: kuery ? (0, _saved_object.normalizeKuery)(SAVED_OBJECT_TYPE, kuery) : undefined
    });
    return {
      items: packagePolicies.saved_objects.map(packagePolicySO => packagePolicySO.id),
      total: packagePolicies.total,
      page,
      perPage
    };
  }
  async update(soClient, esClient, id, packagePolicyUpdate, options, currentVersion) {
    var _packagePolicy$packag3, _options$user$usernam5, _options$user5;
    const packagePolicy = {
      ...packagePolicyUpdate,
      name: packagePolicyUpdate.name.trim()
    };
    const oldPackagePolicy = await this.get(soClient, id);
    const {
      version,
      ...restOfPackagePolicy
    } = packagePolicy;
    if (packagePolicyUpdate.is_managed && !(options !== null && options !== void 0 && options.force)) {
      throw new _errors.PackagePolicyRestrictionRelatedError(`Cannot update package policy ${id}`);
    }
    if (!oldPackagePolicy) {
      throw new Error('Package policy not found');
    }
    if (!(options !== null && options !== void 0 && options.skipUniqueNameVerification)) {
      // Check that the name does not exist already but exclude the current package policy
      const existingPoliciesWithName = await this.list(soClient, {
        perPage: _constants2.SO_SEARCH_LIMIT,
        kuery: `${_constants3.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name:"${packagePolicy.name}"`
      });
      const filtered = ((existingPoliciesWithName === null || existingPoliciesWithName === void 0 ? void 0 : existingPoliciesWithName.items) || []).filter(p => p.id !== id);
      if (filtered.length > 0) {
        throw new _errors.FleetError(`An integration policy with the name ${packagePolicy.name} already exists. Please rename it or choose a different name.`);
      }
    }
    let inputs = restOfPackagePolicy.inputs.map(input => assignStreamIdToInput(oldPackagePolicy.id, input));
    inputs = enforceFrozenInputs(oldPackagePolicy.inputs, inputs, options === null || options === void 0 ? void 0 : options.force);
    let elasticsearch;
    if ((_packagePolicy$packag3 = packagePolicy.package) !== null && _packagePolicy$packag3 !== void 0 && _packagePolicy$packag3.name) {
      const pkgInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: packagePolicy.package.version,
        prerelease: true
      });
      validatePackagePolicyOrThrow(packagePolicy, pkgInfo);
      inputs = await _compilePackagePolicyInputs(pkgInfo, packagePolicy.vars || {}, inputs);
      elasticsearch = pkgInfo.elasticsearch;
    }

    // Handle component template/mappings updates for experimental features, e.g. synthetic source
    await (0, _package_policies.handleExperimentalDatastreamFeatureOptIn)({
      soClient,
      esClient,
      packagePolicy
    });
    await soClient.update(SAVED_OBJECT_TYPE, id, {
      ...restOfPackagePolicy,
      inputs,
      elasticsearch,
      revision: oldPackagePolicy.revision + 1,
      updated_at: new Date().toISOString(),
      updated_by: (_options$user$usernam5 = options === null || options === void 0 ? void 0 : (_options$user5 = options.user) === null || _options$user5 === void 0 ? void 0 : _options$user5.username) !== null && _options$user$usernam5 !== void 0 ? _options$user$usernam5 : 'system'
    }, {
      version
    });

    // Bump revision of associated agent policy
    await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, packagePolicy.policy_id, {
      user: options === null || options === void 0 ? void 0 : options.user
    });
    const newPolicy = await this.get(soClient, id);
    await updatePackagePolicyVersion(packagePolicyUpdate, soClient, currentVersion);
    return newPolicy;
  }
  async bulkUpdate(soClient, esClient, packagePolicyUpdates, options, currentVersion) {
    const oldPackagePolicies = await this.getByIDs(soClient, packagePolicyUpdates.map(p => p.id));
    if (!oldPackagePolicies || oldPackagePolicies.length === 0) {
      throw new Error('Package policy not found');
    }
    const packageInfos = await getPackageInfoForPackagePolicies(packagePolicyUpdates, soClient);
    await soClient.bulkUpdate(await (0, _pMap.default)(packagePolicyUpdates, async packagePolicyUpdate => {
      var _packagePolicy$packag4, _options$user$usernam6, _options$user6;
      const id = packagePolicyUpdate.id;
      const packagePolicy = {
        ...packagePolicyUpdate,
        name: packagePolicyUpdate.name.trim()
      };
      const oldPackagePolicy = oldPackagePolicies.find(p => p.id === id);
      if (!oldPackagePolicy) {
        throw new Error('Package policy not found');
      }

      // id and version are not part of the saved object attributes
      const {
        version,
        id: _id,
        ...restOfPackagePolicy
      } = packagePolicy;
      if (packagePolicyUpdate.is_managed && !(options !== null && options !== void 0 && options.force)) {
        throw new _errors.PackagePolicyRestrictionRelatedError(`Cannot update package policy ${id}`);
      }
      let inputs = restOfPackagePolicy.inputs.map(input => assignStreamIdToInput(oldPackagePolicy.id, input));
      inputs = enforceFrozenInputs(oldPackagePolicy.inputs, inputs, options === null || options === void 0 ? void 0 : options.force);
      let elasticsearch;
      if ((_packagePolicy$packag4 = packagePolicy.package) !== null && _packagePolicy$packag4 !== void 0 && _packagePolicy$packag4.name) {
        const pkgInfo = packageInfos.get(`${packagePolicy.package.name}-${packagePolicy.package.version}`);
        if (pkgInfo) {
          validatePackagePolicyOrThrow(packagePolicy, pkgInfo);
          inputs = await _compilePackagePolicyInputs(pkgInfo, packagePolicy.vars || {}, inputs);
          elasticsearch = pkgInfo.elasticsearch;
        }
      }

      // Handle component template/mappings updates for experimental features, e.g. synthetic source
      await (0, _package_policies.handleExperimentalDatastreamFeatureOptIn)({
        soClient,
        esClient,
        packagePolicy
      });
      return {
        type: SAVED_OBJECT_TYPE,
        id,
        attributes: {
          ...restOfPackagePolicy,
          inputs,
          elasticsearch,
          revision: oldPackagePolicy.revision + 1,
          updated_at: new Date().toISOString(),
          updated_by: (_options$user$usernam6 = options === null || options === void 0 ? void 0 : (_options$user6 = options.user) === null || _options$user6 === void 0 ? void 0 : _options$user6.username) !== null && _options$user$usernam6 !== void 0 ? _options$user$usernam6 : 'system'
        },
        version
      };
    }));
    const agentPolicyIds = new Set(packagePolicyUpdates.map(p => p.policy_id));
    await (0, _pMap.default)(agentPolicyIds, async agentPolicyId => {
      // Bump revision of associated agent policy
      await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, agentPolicyId, {
        user: options === null || options === void 0 ? void 0 : options.user
      });
    });
    const newPolicies = await this.getByIDs(soClient, packagePolicyUpdates.map(p => p.id));
    await (0, _pMap.default)(packagePolicyUpdates, async packagePolicy => await updatePackagePolicyVersion(packagePolicy, soClient, currentVersion), {
      concurrency: 50
    });
    return newPolicies;
  }
  async delete(soClient, esClient, ids, options) {
    const result = [];
    const packagePolicies = await this.getByIDs(soClient, ids, {
      ignoreMissing: true
    });
    if (!packagePolicies) {
      return [];
    }
    const uniqueAgentPolicyIds = [...new Set(packagePolicies.map(packagePolicy => packagePolicy.policy_id))];
    const hostedAgentPolicies = [];
    for (const agentPolicyId of uniqueAgentPolicyIds) {
      try {
        await validateIsNotHostedPolicy(soClient, agentPolicyId, options === null || options === void 0 ? void 0 : options.force, 'Cannot remove integrations of hosted agent policy');
      } catch (e) {
        hostedAgentPolicies.push(agentPolicyId);
      }
    }
    const idsToDelete = [];
    ids.forEach(id => {
      try {
        const packagePolicy = packagePolicies.find(p => p.id === id);
        if (!packagePolicy) {
          throw new _errors.PackagePolicyNotFoundError(`Saved object [ingest-package-policies/${id}] not found`);
        }
        if (packagePolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
          throw new _errors.PackagePolicyRestrictionRelatedError(`Cannot delete package policy ${id}`);
        }
        if (hostedAgentPolicies.includes(packagePolicy.policy_id)) {
          throw new _errors.HostedAgentPolicyRestrictionRelatedError('Cannot remove integrations of hosted agent policy');
        }
        idsToDelete.push(id);
      } catch (error) {
        result.push({
          id,
          success: false,
          ...(0, _errors.fleetErrorToResponseOptions)(error)
        });
      }
    });
    const {
      statuses
    } = await soClient.bulkDelete(idsToDelete.map(id => ({
      id,
      type: SAVED_OBJECT_TYPE
    })));
    statuses.forEach(({
      id,
      success,
      error
    }) => {
      const packagePolicy = packagePolicies.find(p => p.id === id);
      if (success && packagePolicy) {
        var _packagePolicy$packag5, _packagePolicy$packag6, _packagePolicy$packag7;
        result.push({
          id,
          name: packagePolicy.name,
          success: true,
          package: {
            name: ((_packagePolicy$packag5 = packagePolicy.package) === null || _packagePolicy$packag5 === void 0 ? void 0 : _packagePolicy$packag5.name) || '',
            title: ((_packagePolicy$packag6 = packagePolicy.package) === null || _packagePolicy$packag6 === void 0 ? void 0 : _packagePolicy$packag6.title) || '',
            version: ((_packagePolicy$packag7 = packagePolicy.package) === null || _packagePolicy$packag7 === void 0 ? void 0 : _packagePolicy$packag7.version) || ''
          },
          policy_id: packagePolicy.policy_id
        });
      } else if (!success && error) {
        result.push({
          id,
          success: false,
          statusCode: error.statusCode,
          body: {
            message: error.message
          }
        });
      }
    });
    if (!(options !== null && options !== void 0 && options.skipUnassignFromAgentPolicies)) {
      const uniquePolicyIdsR = [...new Set(result.filter(r => r.success && r.policy_id).map(r => r.policy_id))];
      const agentPolicies = await _agent_policy.agentPolicyService.getByIDs(soClient, uniquePolicyIdsR);
      for (const policyId of uniquePolicyIdsR) {
        const agentPolicy = agentPolicies.find(p => p.id === policyId);
        if (agentPolicy) {
          await _agent_policy.agentPolicyService.bumpRevision(soClient, esClient, policyId, {
            user: options === null || options === void 0 ? void 0 : options.user
          });
        }
      }
    }
    return result;
  }

  // TODO should move out, public only for unit tests
  async getUpgradePackagePolicyInfo(soClient, id, packagePolicy, pkgVersion) {
    if (!packagePolicy) {
      var _await$this$get;
      packagePolicy = (_await$this$get = await this.get(soClient, id)) !== null && _await$this$get !== void 0 ? _await$this$get : undefined;
    }
    let experimentalDataStreamFeatures = [];
    if (!pkgVersion && packagePolicy) {
      var _installedPackage$exp;
      const installedPackage = await (0, _packages.getInstallation)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name
      });
      if (!installedPackage) {
        throw new _errors.FleetError(_i18n.i18n.translate('xpack.fleet.packagePolicy.packageNotInstalledError', {
          defaultMessage: 'Package {name} is not installed',
          values: {
            name: packagePolicy.package.name
          }
        }));
      }
      pkgVersion = installedPackage.version;
      experimentalDataStreamFeatures = (_installedPackage$exp = installedPackage.experimental_data_stream_features) !== null && _installedPackage$exp !== void 0 ? _installedPackage$exp : [];
    }
    let packageInfo;
    if (packagePolicy) {
      var _pkgVersion;
      packageInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: packagePolicy.package.name,
        pkgVersion: (_pkgVersion = pkgVersion) !== null && _pkgVersion !== void 0 ? _pkgVersion : '',
        prerelease: !!pkgVersion // using prerelease only if version is specified
      });
    }

    this.validateUpgradePackagePolicy(id, packageInfo, packagePolicy);
    return {
      packagePolicy: packagePolicy,
      packageInfo: packageInfo,
      experimentalDataStreamFeatures
    };
  }
  validateUpgradePackagePolicy(id, packageInfo, packagePolicy) {
    var _packagePolicy$packag8, _packageInfo$version;
    if (!packagePolicy) {
      throw new _errors.FleetError(_i18n.i18n.translate('xpack.fleet.packagePolicy.policyNotFoundError', {
        defaultMessage: 'Package policy with id {id} not found',
        values: {
          id
        }
      }));
    }
    if (!((_packagePolicy$packag8 = packagePolicy.package) !== null && _packagePolicy$packag8 !== void 0 && _packagePolicy$packag8.name)) {
      throw new _errors.FleetError(_i18n.i18n.translate('xpack.fleet.packagePolicy.packageNotFoundError', {
        defaultMessage: 'Package policy with id {id} has no named package',
        values: {
          id
        }
      }));
    }
    const isInstalledVersionLessThanPolicyVersion = (0, _lt.default)((_packageInfo$version = packageInfo === null || packageInfo === void 0 ? void 0 : packageInfo.version) !== null && _packageInfo$version !== void 0 ? _packageInfo$version : '', packagePolicy.package.version);
    if (isInstalledVersionLessThanPolicyVersion) {
      throw new _errors.PackagePolicyIneligibleForUpgradeError(_i18n.i18n.translate('xpack.fleet.packagePolicy.ineligibleForUpgradeError', {
        defaultMessage: "Package policy {id}'s package version {version} of package {name} is newer than the installed package version. Please install the latest version of {name}.",
        values: {
          id: packagePolicy.id,
          name: packagePolicy.package.name,
          version: packagePolicy.package.version
        }
      }));
    }
  }
  async upgrade(soClient, esClient, ids, options, packagePolicy, pkgVersion) {
    const result = [];
    for (const id of ids) {
      try {
        const {
          packagePolicy: currentPackagePolicy,
          packageInfo,
          experimentalDataStreamFeatures
        } = await this.getUpgradePackagePolicyInfo(soClient, id, packagePolicy, pkgVersion);
        if (currentPackagePolicy.is_managed && !(options !== null && options !== void 0 && options.force)) {
          throw new _errors.PackagePolicyRestrictionRelatedError(`Cannot upgrade package policy ${id}`);
        }
        await this.doUpgrade(soClient, esClient, id, currentPackagePolicy, result, packageInfo, experimentalDataStreamFeatures, options);
      } catch (error) {
        result.push({
          id,
          success: false,
          ...(0, _errors.fleetErrorToResponseOptions)(error)
        });
      }
    }
    return result;
  }
  async doUpgrade(soClient, esClient, id, packagePolicy, result, packageInfo, experimentalDataStreamFeatures, options) {
    const updatePackagePolicy = updatePackageInputs({
      ...(0, _lodash.omit)(packagePolicy, 'id'),
      inputs: packagePolicy.inputs,
      package: {
        ...packagePolicy.package,
        version: packageInfo.version
      }
    }, packageInfo, (0, _services.packageToPackagePolicyInputs)(packageInfo));
    updatePackagePolicy.inputs = await _compilePackagePolicyInputs(packageInfo, updatePackagePolicy.vars || {}, updatePackagePolicy.inputs);
    updatePackagePolicy.elasticsearch = packageInfo.elasticsearch;
    const updateOptions = {
      skipUniqueNameVerification: true,
      ...options
    };
    await this.update(soClient, esClient, id, updatePackagePolicy, updateOptions, packagePolicy.package.version);

    // Persist any experimental feature opt-ins that come through the upgrade process to the Installation SO
    await (0, _update.updateDatastreamExperimentalFeatures)(soClient, packagePolicy.package.name, experimentalDataStreamFeatures);
    result.push({
      id,
      name: packagePolicy.name,
      success: true
    });
  }
  async getUpgradeDryRunDiff(soClient, id, packagePolicy, pkgVersion) {
    try {
      let packageInfo;
      let experimentalDataStreamFeatures;
      ({
        packagePolicy,
        packageInfo,
        experimentalDataStreamFeatures
      } = await this.getUpgradePackagePolicyInfo(soClient, id, packagePolicy, pkgVersion));

      // Ensure the experimental features from the Installation saved object come through on the package policy
      // during an upgrade dry run
      if (packagePolicy.package) {
        packagePolicy.package.experimental_data_stream_features = experimentalDataStreamFeatures;
      }
      return this.calculateDiff(soClient, packagePolicy, packageInfo);
    } catch (error) {
      return {
        hasErrors: true,
        ...(0, _errors.fleetErrorToResponseOptions)(error)
      };
    }
  }
  async calculateDiff(soClient, packagePolicy, packageInfo) {
    var _packagePolicy$packag9;
    const updatedPackagePolicy = updatePackageInputs({
      ...(0, _lodash.omit)(packagePolicy, 'id'),
      inputs: packagePolicy.inputs,
      package: {
        ...packagePolicy.package,
        version: packageInfo.version,
        experimental_data_stream_features: (_packagePolicy$packag9 = packagePolicy.package) === null || _packagePolicy$packag9 === void 0 ? void 0 : _packagePolicy$packag9.experimental_data_stream_features
      }
    }, packageInfo, (0, _services.packageToPackagePolicyInputs)(packageInfo), true);
    updatedPackagePolicy.inputs = await _compilePackagePolicyInputs(packageInfo, updatedPackagePolicy.vars || {}, updatedPackagePolicy.inputs);
    updatedPackagePolicy.elasticsearch = packageInfo.elasticsearch;
    const hasErrors = ('errors' in updatedPackagePolicy);
    this.sendUpgradeTelemetry(packagePolicy.package, packageInfo.version, hasErrors, updatedPackagePolicy.errors);
    return {
      name: updatedPackagePolicy.name,
      diff: [packagePolicy, updatedPackagePolicy],
      // TODO: Currently only returns the agent inputs for current package policy, not the upgraded one
      // as we only show this version in the UI
      agent_diff: [(0, _agent_policies.storedPackagePolicyToAgentInputs)(packagePolicy, packageInfo)],
      hasErrors
    };
  }
  sendUpgradeTelemetry(packagePolicyPackage, latestVersion, hasErrors, errors) {
    if (packagePolicyPackage.version !== latestVersion) {
      const upgradeTelemetry = {
        packageName: packagePolicyPackage.name,
        currentVersion: packagePolicyPackage.version,
        newVersion: latestVersion,
        status: hasErrors ? 'failure' : 'success',
        error: hasErrors ? errors : undefined,
        dryRun: true,
        eventType: 'package-policy-upgrade'
      };
      (0, _upgrade_sender.sendTelemetryEvents)(_.appContextService.getLogger(), _.appContextService.getTelemetryEventsSender(), upgradeTelemetry);
      _.appContextService.getLogger().info(`Package policy upgrade dry run ${hasErrors ? 'resulted in errors' : 'ran successfully'}`);
      _.appContextService.getLogger().debug(JSON.stringify(upgradeTelemetry));
    }
  }
  async enrichPolicyWithDefaultsFromPackage(soClient, newPolicy) {
    let newPackagePolicy = newPolicy;
    if (newPolicy.package) {
      const newPP = await this.buildPackagePolicyFromPackageWithVersion(soClient, newPolicy.package.name, newPolicy.package.version);
      if (newPP) {
        var _newPolicy$namespace, _newPolicy$descriptio, _newPolicy$enabled, _newPolicy$package, _newPolicy$policy_id, _newPolicy$inputs$;
        const inputs = newPolicy.inputs.map(input => {
          var _defaultInput$streams;
          const defaultInput = newPP.inputs.find(i => i.type === input.type && (!input.policy_template || input.policy_template === i.policy_template));
          return {
            ...defaultInput,
            enabled: input.enabled,
            type: input.type,
            // to propagate "enabled: false" to streams
            streams: defaultInput === null || defaultInput === void 0 ? void 0 : (_defaultInput$streams = defaultInput.streams) === null || _defaultInput$streams === void 0 ? void 0 : _defaultInput$streams.map(stream => ({
              ...stream,
              enabled: input.enabled
            }))
          };
        });
        let agentPolicyId;
        // fallback to first agent policy id in case no policy_id is specified, BWC with 8.0
        if (!newPolicy.policy_id) {
          const {
            items: agentPolicies
          } = await _agent_policy.agentPolicyService.list(soClient, {
            perPage: 1
          });
          if (agentPolicies.length > 0) {
            agentPolicyId = agentPolicies[0].id;
          }
        }
        newPackagePolicy = {
          ...newPP,
          name: newPolicy.name,
          namespace: (_newPolicy$namespace = newPolicy.namespace) !== null && _newPolicy$namespace !== void 0 ? _newPolicy$namespace : 'default',
          description: (_newPolicy$descriptio = newPolicy.description) !== null && _newPolicy$descriptio !== void 0 ? _newPolicy$descriptio : '',
          enabled: (_newPolicy$enabled = newPolicy.enabled) !== null && _newPolicy$enabled !== void 0 ? _newPolicy$enabled : true,
          package: {
            ...newPP.package,
            experimental_data_stream_features: (_newPolicy$package = newPolicy.package) === null || _newPolicy$package === void 0 ? void 0 : _newPolicy$package.experimental_data_stream_features
          },
          policy_id: (_newPolicy$policy_id = newPolicy.policy_id) !== null && _newPolicy$policy_id !== void 0 ? _newPolicy$policy_id : agentPolicyId,
          inputs: (_newPolicy$inputs$ = newPolicy.inputs[0]) !== null && _newPolicy$inputs$ !== void 0 && _newPolicy$inputs$.streams ? newPolicy.inputs : inputs,
          vars: newPolicy.vars || newPP.vars
        };
      }
    }
    return newPackagePolicy;
  }
  async buildPackagePolicyFromPackageWithVersion(soClient, pkgName, pkgVersion) {
    const packageInfo = await (0, _packages.getPackageInfo)({
      savedObjectsClient: soClient,
      pkgName,
      pkgVersion,
      skipArchive: true,
      prerelease: true
    });
    if (packageInfo) {
      return (0, _services.packageToPackagePolicy)(packageInfo, '');
    }
  }
  async buildPackagePolicyFromPackage(soClient, pkgName, logger) {
    const pkgInstall = await (0, _packages.getInstallation)({
      savedObjectsClient: soClient,
      pkgName,
      logger
    });
    if (pkgInstall) {
      const packageInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: pkgInstall.name,
        pkgVersion: pkgInstall.version,
        prerelease: true
      });
      if (packageInfo) {
        return (0, _services.packageToPackagePolicy)(packageInfo, '');
      }
    }
  }
  async runExternalCallbacks(externalCallbackType, packagePolicy, context, request) {
    if (externalCallbackType === 'postPackagePolicyDelete') {
      return await this.runDeleteExternalCallbacks(packagePolicy);
    } else {
      if (!Array.isArray(packagePolicy)) {
        let newData = packagePolicy;
        const externalCallbacks = _.appContextService.getExternalCallbacks(externalCallbackType);
        if (externalCallbacks && externalCallbacks.size > 0) {
          let updatedNewData = newData;
          for (const callback of externalCallbacks) {
            let result;
            if (externalCallbackType === 'packagePolicyPostCreate') {
              result = await callback(updatedNewData, context, request);
              updatedNewData = _types.PackagePolicySchema.validate(result);
            } else {
              result = await callback(updatedNewData, context, request);
            }
            if (externalCallbackType === 'packagePolicyCreate') {
              updatedNewData = _types.NewPackagePolicySchema.validate(result);
            } else if (externalCallbackType === 'packagePolicyUpdate') {
              updatedNewData = _types.UpdatePackagePolicySchema.validate(result);
            }
          }
          newData = updatedNewData;
        }
        return newData;
      }
    }
  }
  async runDeleteExternalCallbacks(deletedPackagePolicies) {
    const externalCallbacks = _.appContextService.getExternalCallbacks('postPackagePolicyDelete');
    const errorsThrown = [];
    if (externalCallbacks && externalCallbacks.size > 0) {
      for (const callback of externalCallbacks) {
        // Failures from an external callback should not prevent other external callbacks from being
        // executed. Errors (if any) will be collected and `throw`n after processing the entire set
        try {
          await callback(deletedPackagePolicies);
        } catch (error) {
          errorsThrown.push(error);
        }
      }
      if (errorsThrown.length > 0) {
        throw new _errors.FleetError(`${errorsThrown.length} encountered while executing package delete external callbacks`, errorsThrown);
      }
    }
  }
}
class PackagePolicyServiceImpl extends PackagePolicyClientImpl {
  asScoped(request) {
    const preflightCheck = async fleetAuthzConfig => {
      const authz = await (0, _security.getAuthzFromRequest)(request);
      if (!(0, _security.hasRequiredFleetAuthzPrivilege)(authz, fleetAuthzConfig)) {
        throw new _errors.FleetUnauthorizedError('Not authorized to this action on integration policies');
      }
    };
    return new PackagePolicyClientWithAuthz(preflightCheck);
  }
  get asInternalUser() {
    return new PackagePolicyClientWithAuthz();
  }
}
exports.PackagePolicyServiceImpl = PackagePolicyServiceImpl;
var _runPreflight = /*#__PURE__*/new WeakMap();
class PackagePolicyClientWithAuthz extends PackagePolicyClientImpl {
  constructor(preflightCheck) {
    super();
    _classPrivateFieldInitSpec(this, _runPreflight, {
      writable: true,
      value: async fleetAuthzConfig => {
        if (this.preflightCheck) {
          return await this.preflightCheck(fleetAuthzConfig);
        }
      }
    });
    this.preflightCheck = preflightCheck;
  }
  async create(soClient, esClient, packagePolicy, options) {
    await (0, _classPrivateFieldGet2.default)(this, _runPreflight).call(this, {
      fleetAuthz: {
        integrations: {
          writeIntegrationPolicies: true
        }
      }
    });
    return super.create(soClient, esClient, packagePolicy, options);
  }
}
function validatePackagePolicyOrThrow(packagePolicy, pkgInfo) {
  const validationResults = (0, _services.validatePackagePolicy)(packagePolicy, pkgInfo, _jsYaml.safeLoad);
  if ((0, _services.validationHasErrors)(validationResults)) {
    const responseFormattedValidationErrors = Object.entries((0, _std.getFlattenedObject)(validationResults)).map(([key, value]) => ({
      key,
      message: value
    })).filter(({
      message
    }) => !!message);
    if (responseFormattedValidationErrors.length) {
      throw new _errors.PackagePolicyValidationError(_i18n.i18n.translate('xpack.fleet.packagePolicyInvalidError', {
        defaultMessage: 'Package policy is invalid: {errors}',
        values: {
          errors: responseFormattedValidationErrors.map(({
            key,
            message
          }) => `${key}: ${message}`).join('\n')
        }
      }));
    }
  }
}
function assignStreamIdToInput(packagePolicyId, input) {
  return {
    ...input,
    streams: input.streams.map(stream => {
      return {
        ...stream,
        id: `${input.type}-${stream.data_stream.dataset}-${packagePolicyId}`
      };
    })
  };
}
async function _compilePackagePolicyInputs(pkgInfo, vars, inputs) {
  const inputsPromises = inputs.map(async input => {
    const compiledInput = await _compilePackagePolicyInput(pkgInfo, vars, input);
    const compiledStreams = await _compilePackageStreams(pkgInfo, vars, input);
    return {
      ...input,
      compiled_input: compiledInput,
      streams: compiledStreams
    };
  });
  return Promise.all(inputsPromises);
}
async function _compilePackagePolicyInput(pkgInfo, vars, input) {
  var _pkgInfo$policy_templ, _pkgInfo$policy_templ2;
  const packagePolicyTemplate = input.policy_template ? (_pkgInfo$policy_templ = pkgInfo.policy_templates) === null || _pkgInfo$policy_templ === void 0 ? void 0 : _pkgInfo$policy_templ.find(policyTemplate => policyTemplate.name === input.policy_template) : (_pkgInfo$policy_templ2 = pkgInfo.policy_templates) === null || _pkgInfo$policy_templ2 === void 0 ? void 0 : _pkgInfo$policy_templ2[0];
  if (!input.enabled || !packagePolicyTemplate) {
    return undefined;
  }
  const packageInputs = (0, _services.getNormalizedInputs)(packagePolicyTemplate);
  if (!packageInputs.length) {
    return undefined;
  }
  const packageInput = packageInputs.find(pkgInput => pkgInput.type === input.type);
  if (!packageInput) {
    throw new Error(`Input template not found, unable to find input type ${input.type}`);
  }
  if (!packageInput.template_path) {
    return undefined;
  }
  const [pkgInputTemplate] = await (0, _assets.getAssetsData)(pkgInfo, path => path.endsWith(`/agent/input/${packageInput.template_path}`));
  if (!pkgInputTemplate || !pkgInputTemplate.buffer) {
    throw new Error(`Unable to load input template at /agent/input/${packageInput.template_path}`);
  }
  return (0, _agent.compileTemplate)(
  // Populate template variables from package- and input-level vars
  Object.assign({}, vars, input.vars), pkgInputTemplate.buffer.toString());
}
async function _compilePackageStreams(pkgInfo, vars, input) {
  const streamsPromises = input.streams.map(stream => _compilePackageStream(pkgInfo, vars, input, stream));
  return await Promise.all(streamsPromises);
}

// temporary export to enable testing pending refactor https://github.com/elastic/kibana/issues/112386
function _applyIndexPrivileges(packageDataStream, stream) {
  var _packageDataStream$el, _packageDataStream$el2;
  const streamOut = {
    ...stream
  };
  const indexPrivileges = packageDataStream === null || packageDataStream === void 0 ? void 0 : (_packageDataStream$el = packageDataStream.elasticsearch) === null || _packageDataStream$el === void 0 ? void 0 : (_packageDataStream$el2 = _packageDataStream$el.privileges) === null || _packageDataStream$el2 === void 0 ? void 0 : _packageDataStream$el2.indices;
  if (!(indexPrivileges !== null && indexPrivileges !== void 0 && indexPrivileges.length)) {
    return streamOut;
  }
  const [valid, invalid] = (0, _lodash.partition)(indexPrivileges, permission => DATA_STREAM_ALLOWED_INDEX_PRIVILEGES.has(permission));
  if (invalid.length) {
    _.appContextService.getLogger().warn(`Ignoring invalid or forbidden index privilege(s) in "${stream.id}" data stream: ${invalid}`);
  }
  if (valid.length) {
    stream.data_stream.elasticsearch = {
      privileges: {
        indices: valid
      }
    };
  }
  return streamOut;
}
async function _compilePackageStream(pkgInfo, vars, input, streamIn) {
  let stream = streamIn;
  if (!stream.enabled) {
    return {
      ...stream,
      compiled_stream: undefined
    };
  }
  const packageDataStreams = (0, _services.getNormalizedDataStreams)(pkgInfo);
  if (!packageDataStreams) {
    throw new Error('Stream template not found, no data streams');
  }
  const packageDataStream = packageDataStreams.find(pkgDataStream => pkgDataStream.dataset === stream.data_stream.dataset);
  if (!packageDataStream) {
    throw new Error(`Stream template not found, unable to find dataset ${stream.data_stream.dataset}`);
  }
  stream = _applyIndexPrivileges(packageDataStream, streamIn);
  const streamFromPkg = (packageDataStream.streams || []).find(pkgStream => pkgStream.input === input.type);
  if (!streamFromPkg) {
    throw new Error(`Stream template not found, unable to find stream for input ${input.type}`);
  }
  if (!streamFromPkg.template_path) {
    throw new Error(`Stream template path not found for dataset ${stream.data_stream.dataset}`);
  }
  const datasetPath = packageDataStream.path;
  const [pkgStreamTemplate] = await (0, _assets.getAssetsData)(pkgInfo, path => path.endsWith(streamFromPkg.template_path), datasetPath);
  if (!pkgStreamTemplate || !pkgStreamTemplate.buffer) {
    throw new Error(`Unable to load stream template ${streamFromPkg.template_path} for dataset ${stream.data_stream.dataset}`);
  }
  const yaml = (0, _agent.compileTemplate)(
  // Populate template variables from package-, input-, and stream-level vars
  Object.assign({}, vars, input.vars, stream.vars), pkgStreamTemplate.buffer.toString());
  stream.compiled_stream = yaml;
  return {
    ...stream
  };
}
function enforceFrozenInputs(oldInputs, newInputs, force = false) {
  const resultInputs = [...newInputs];
  for (const input of resultInputs) {
    const oldInput = oldInputs.find(i => i.type === input.type);
    if (oldInput !== null && oldInput !== void 0 && oldInput.keep_enabled) input.enabled = oldInput.enabled;
    if (input.vars && oldInput !== null && oldInput !== void 0 && oldInput.vars) {
      input.vars = _enforceFrozenVars(oldInput.vars, input.vars, force);
    }
    if (input.streams && oldInput !== null && oldInput !== void 0 && oldInput.streams) {
      for (const stream of input.streams) {
        const oldStream = oldInput.streams.find(s => s.id === stream.id);
        if (oldStream !== null && oldStream !== void 0 && oldStream.keep_enabled) stream.enabled = oldStream.enabled;
        if (stream.vars && oldStream !== null && oldStream !== void 0 && oldStream.vars) {
          stream.vars = _enforceFrozenVars(oldStream.vars, stream.vars, force);
        }
      }
    }
  }
  return resultInputs;
}
function _enforceFrozenVars(oldVars, newVars, force = false) {
  const resultVars = {};
  for (const [key, val] of Object.entries(newVars)) {
    var _oldVars$key;
    if ((_oldVars$key = oldVars[key]) !== null && _oldVars$key !== void 0 && _oldVars$key.frozen) {
      if (force) {
        resultVars[key] = val;
      } else if (!(0, _lodash.isEqual)(oldVars[key].value, val.value) || oldVars[key].type !== val.type) {
        throw new _errors.PackagePolicyValidationError(`${key} is a frozen variable and cannot be modified`);
      } else {
        resultVars[key] = oldVars[key];
      }
    } else {
      resultVars[key] = val;
    }
  }
  for (const [key, val] of Object.entries(oldVars)) {
    if (!newVars[key] && val.frozen) {
      resultVars[key] = val;
    }
  }
  return resultVars;
}
const packagePolicyService = new PackagePolicyClientImpl();
exports.packagePolicyService = packagePolicyService;
async function getPackageInfoForPackagePolicies(packagePolicies, soClient) {
  const pkgInfoMap = new Map();
  packagePolicies.forEach(({
    package: pkg
  }) => {
    if (pkg) {
      pkgInfoMap.set(`${pkg.name}-${pkg.version}`, pkg);
    }
  });
  const resultMap = new Map();
  await (0, _pMap.default)(pkgInfoMap.keys(), async pkgKey => {
    const pkgInfo = pkgInfoMap.get(pkgKey);
    if (pkgInfo) {
      const pkgInfoData = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: pkgInfo.name,
        pkgVersion: pkgInfo.version,
        prerelease: true
      });
      resultMap.set(pkgKey, pkgInfoData);
    }
  });
  return resultMap;
}
function updatePackageInputs(basePackagePolicy, packageInfo, inputsUpdated, dryRun) {
  var _packageInfo$policy_t;
  if (!inputsUpdated) return basePackagePolicy;
  const availablePolicyTemplates = (_packageInfo$policy_t = packageInfo.policy_templates) !== null && _packageInfo$policy_t !== void 0 ? _packageInfo$policy_t : [];
  const inputs = [...basePackagePolicy.inputs.filter(input => {
    var _policyTemplate$input, _policyTemplate$input2;
    if (!input.policy_template) {
      return true;
    }
    const policyTemplate = availablePolicyTemplates.find(({
      name
    }) => name === input.policy_template);

    // Ignore any policy templates removed in the new package version
    if (!policyTemplate) {
      return false;
    }

    // Ignore any inputs removed from this policy template in the new package version
    const policyTemplateStillIncludesInput = (0, _services.isInputOnlyPolicyTemplate)(policyTemplate) ? policyTemplate.input === input.type : (_policyTemplate$input = (_policyTemplate$input2 = policyTemplate.inputs) === null || _policyTemplate$input2 === void 0 ? void 0 : _policyTemplate$input2.some(policyTemplateInput => policyTemplateInput.type === input.type)) !== null && _policyTemplate$input !== void 0 ? _policyTemplate$input : false;
    return policyTemplateStillIncludesInput;
  })];
  for (const update of inputsUpdated) {
    let originalInput;
    if (update.policy_template) {
      // If the updated value defines a policy template, try to find an original input
      // with the same policy template value
      const matchingInput = inputs.find(i => i.type === update.type && i.policy_template === update.policy_template);

      // If we didn't find an input with the same policy template, try to look for one
      // with the same type, but with an undefined policy template. This ensures we catch
      // cases where we're upgrading an older policy from before policy template was
      // reliably define on package policy inputs.
      originalInput = matchingInput || inputs.find(i => i.type === update.type && !i.policy_template);
    } else {
      // For inputs that don't specify a policy template, just grab the first input
      // that matches its `type`
      originalInput = inputs.find(i => i.type === update.type);
    }

    // If there's no corresponding input on the original package policy, just
    // take the override value from the new package as-is. This case typically
    // occurs when inputs or package policy templates are added/removed between versions.
    if (originalInput === undefined) {
      inputs.push(update);
      continue;
    }

    // For flags like this, we only want to override the original value if it was set
    // as `undefined` in the original object. An explicit true/false value should be
    // persisted from the original object to the result after the override process is complete.
    if (originalInput.enabled === undefined && update.enabled !== undefined) {
      originalInput.enabled = update.enabled;
    }
    if (originalInput.keep_enabled === undefined && update.keep_enabled !== undefined) {
      originalInput.keep_enabled = update.keep_enabled;
    }

    // `policy_template` should always be defined, so if we have an older policy here we need
    // to ensure we set it
    if (originalInput.policy_template === undefined && update.policy_template !== undefined) {
      originalInput.policy_template = update.policy_template;
    }
    if (update.vars) {
      const indexOfInput = inputs.indexOf(originalInput);
      inputs[indexOfInput] = deepMergeVars(originalInput, update, true);
      originalInput = inputs[indexOfInput];
    }
    if (update.streams) {
      var _originalInput;
      const isInputPkgUpdate = packageInfo.type === 'input' && update.streams.length === 1 && ((_originalInput = originalInput) === null || _originalInput === void 0 ? void 0 : _originalInput.streams.length) === 1;
      for (const stream of update.streams) {
        var _originalInput2, _originalStream;
        let originalStream = (_originalInput2 = originalInput) === null || _originalInput2 === void 0 ? void 0 : _originalInput2.streams.find(s => s.data_stream.dataset === stream.data_stream.dataset);

        // this handles the input only pkg case where the new stream cannot have a dataset name
        // so will never match. Input only packages only ever have one stream.
        if (!originalStream && isInputPkgUpdate) {
          var _originalInput3;
          originalStream = {
            ...update.streams[0],
            vars: (_originalInput3 = originalInput) === null || _originalInput3 === void 0 ? void 0 : _originalInput3.streams[0].vars
          };
        }
        if (originalStream === undefined) {
          originalInput.streams.push(stream);
          continue;
        }
        if (((_originalStream = originalStream) === null || _originalStream === void 0 ? void 0 : _originalStream.enabled) === undefined) {
          originalStream.enabled = stream.enabled;
        }
        if (stream.vars) {
          // streams wont match for input pkgs
          const indexOfStream = isInputPkgUpdate ? 0 : originalInput.streams.indexOf(originalStream);
          originalInput.streams[indexOfStream] = deepMergeVars(originalStream, stream, true);
          originalStream = originalInput.streams[indexOfStream];
        }
      }
    }

    // Filter all stream that have been removed from the input
    originalInput.streams = originalInput.streams.filter(originalStream => {
      var _update$streams$some, _update$streams;
      return (_update$streams$some = (_update$streams = update.streams) === null || _update$streams === void 0 ? void 0 : _update$streams.some(s => s.data_stream.dataset === originalStream.data_stream.dataset)) !== null && _update$streams$some !== void 0 ? _update$streams$some : false;
    });
  }
  const resultingPackagePolicy = {
    ...basePackagePolicy,
    inputs
  };
  const validationResults = (0, _services.validatePackagePolicy)(resultingPackagePolicy, packageInfo, _jsYaml.safeLoad);
  if ((0, _services.validationHasErrors)(validationResults)) {
    const responseFormattedValidationErrors = Object.entries((0, _std.getFlattenedObject)(validationResults)).map(([key, value]) => ({
      key,
      message: value
    })).filter(({
      message
    }) => !!message);
    if (responseFormattedValidationErrors.length) {
      if (dryRun) {
        return {
          ...resultingPackagePolicy,
          errors: responseFormattedValidationErrors
        };
      }
      throw new _errors.PackagePolicyValidationError(_i18n.i18n.translate('xpack.fleet.packagePolicyInvalidError', {
        defaultMessage: 'Package policy is invalid: {errors}',
        values: {
          errors: responseFormattedValidationErrors.map(({
            key,
            message
          }) => `${key}: ${message}`).join('\n')
        }
      }));
    }
  }
  return resultingPackagePolicy;
}
function preconfigurePackageInputs(basePackagePolicy, packageInfo, preconfiguredInputs) {
  if (!preconfiguredInputs) return basePackagePolicy;
  const inputs = [...basePackagePolicy.inputs];
  for (const preconfiguredInput of preconfiguredInputs) {
    // Preconfiguration does not currently support multiple policy templates, so overrides will have an undefined
    // policy template, so we only match on `type` in that case.
    let originalInput = preconfiguredInput.policy_template ? inputs.find(i => i.type === preconfiguredInput.type && i.policy_template === preconfiguredInput.policy_template) : inputs.find(i => i.type === preconfiguredInput.type);

    // If the input do not exist skip
    if (originalInput === undefined) {
      continue;
    }
    if (preconfiguredInput.enabled !== undefined) {
      originalInput.enabled = preconfiguredInput.enabled;
    }
    if (preconfiguredInput.keep_enabled !== undefined) {
      originalInput.keep_enabled = preconfiguredInput.keep_enabled;
    }
    if (preconfiguredInput.vars) {
      const indexOfInput = inputs.indexOf(originalInput);
      inputs[indexOfInput] = deepMergeVars(originalInput, preconfiguredInput);
      originalInput = inputs[indexOfInput];
    }
    if (preconfiguredInput.streams) {
      for (const stream of preconfiguredInput.streams) {
        var _originalInput4;
        let originalStream = (_originalInput4 = originalInput) === null || _originalInput4 === void 0 ? void 0 : _originalInput4.streams.find(s => s.data_stream.dataset === stream.data_stream.dataset);
        if (originalStream === undefined) {
          continue;
        }
        if (stream.enabled !== undefined) {
          originalStream.enabled = stream.enabled;
        }
        if (stream.vars) {
          const indexOfStream = originalInput.streams.indexOf(originalStream);
          originalInput.streams[indexOfStream] = deepMergeVars(originalStream, stream);
          originalStream = originalInput.streams[indexOfStream];
        }
      }
    }
  }
  const resultingPackagePolicy = {
    ...basePackagePolicy,
    inputs
  };
  validatePackagePolicyOrThrow(resultingPackagePolicy, packageInfo);
  return resultingPackagePolicy;
}
async function validateIsNotHostedPolicy(soClient, id, force = false, errorMessage) {
  const agentPolicy = await _agent_policy.agentPolicyService.get(soClient, id, false);
  if (!agentPolicy) {
    throw new Error('Agent policy not found');
  }
  if (agentPolicy.is_managed && !force) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(errorMessage !== null && errorMessage !== void 0 ? errorMessage : `Cannot update integrations of hosted agent policy ${id}`);
  }
}
async function updatePackagePolicyVersion(packagePolicy, soClient, currentVersion) {
  if (packagePolicy.package) {
    await (0, _cleanup.removeOldAssets)({
      soClient,
      pkgName: packagePolicy.package.name,
      currentVersion: packagePolicy.package.version
    });
    if (packagePolicy.package.version !== currentVersion) {
      const upgradeTelemetry = {
        packageName: packagePolicy.package.name,
        currentVersion: currentVersion || 'unknown',
        newVersion: packagePolicy.package.version,
        status: 'success',
        eventType: 'package-policy-upgrade'
      };
      (0, _upgrade_sender.sendTelemetryEvents)(_.appContextService.getLogger(), _.appContextService.getTelemetryEventsSender(), upgradeTelemetry);
      _.appContextService.getLogger().info(`Package policy upgraded successfully`);
      _.appContextService.getLogger().debug(JSON.stringify(upgradeTelemetry));
    }
  }
}
function deepMergeVars(original, override, keepOriginalValue = false) {
  if (!original.vars) {
    original.vars = {
      ...override.vars
    };
  }
  const result = {
    ...original
  };
  const overrideVars = Array.isArray(override.vars) ? override.vars : Object.entries(override.vars).map(([key, rest]) => ({
    name: key,
    ...rest
  }));
  for (const {
    name,
    ...overrideVal
  } of overrideVars) {
    const originalVar = original.vars[name];
    result.vars[name] = {
      ...originalVar,
      ...overrideVal
    };

    // Ensure that any value from the original object is persisted on the newly merged resulting object,
    // even if we merge other data about the given variable
    if (keepOriginalValue && (originalVar === null || originalVar === void 0 ? void 0 : originalVar.value) !== undefined) {
      result.vars[name].value = originalVar.value;
    }
  }
  return result;
}