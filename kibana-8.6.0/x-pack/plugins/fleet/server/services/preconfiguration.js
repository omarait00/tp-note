"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparePreconfiguredPolicyToCurrent = comparePreconfiguredPolicyToCurrent;
exports.ensurePreconfiguredPackagesAndPolicies = ensurePreconfiguredPackagesAndPolicies;
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _constants = require("../../common/constants");
var _constants2 = require("../constants");
var _saved_object = require("./saved_object");
var _registry = require("./epm/registry");
var _packages = require("./epm/packages");
var _install = require("./epm/packages/install");
var _bulk_install_packages = require("./epm/packages/bulk_install_packages");
var _agent_policy = require("./agent_policy");
var _package_policy = require("./package_policy");
var _app_context = require("./app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function ensurePreconfiguredPackagesAndPolicies(soClient, esClient, policies = [], packages = [], defaultOutput, defaultDownloadSource, spaceId) {
  const logger = _app_context.appContextService.getLogger();

  // Validate configured packages to ensure there are no version conflicts
  const packageNames = (0, _lodash.groupBy)(packages, pkg => pkg.name);
  const duplicatePackages = Object.entries(packageNames).filter(([, versions]) => versions.length > 1);
  if (duplicatePackages.length) {
    // List duplicate packages as a comma-separated list of <package-name>:<semver>
    // If there are multiple packages with duplicate versions, separate them with semicolons, e.g
    // package-a:1.0.0, package-a:2.0.0; package-b:1.0.0, package-b:2.0.0
    const duplicateList = duplicatePackages.map(([, versions]) => versions.map(v => (0, _registry.pkgToPkgKey)(v)).join(', ')).join('; ');
    throw new Error(_i18n.i18n.translate('xpack.fleet.preconfiguration.duplicatePackageError', {
      defaultMessage: 'Duplicate packages specified in configuration: {duplicateList}',
      values: {
        duplicateList
      }
    }));
  }
  const packagesToInstall = packages.map(pkg => pkg.version === _constants.PRECONFIGURATION_LATEST_KEYWORD ? pkg.name : pkg);

  // Preinstall packages specified in Kibana config
  const preconfiguredPackages = await (0, _bulk_install_packages.bulkInstallPackages)({
    savedObjectsClient: soClient,
    esClient,
    packagesToInstall,
    force: true,
    // Always force outdated packages to be installed if a later version isn't installed
    spaceId
  });
  const fulfilledPackages = [];
  const rejectedPackages = [];
  for (let i = 0; i < preconfiguredPackages.length; i++) {
    const packageResult = preconfiguredPackages[i];
    if ('error' in packageResult) {
      logger.warn(`Failed installing package [${packages[i].name}] due to error: [${packageResult.error}]`);
      rejectedPackages.push({
        package: {
          name: packages[i].name,
          version: packages[i].version
        },
        error: packageResult.error
      });
    } else {
      fulfilledPackages.push(packageResult);
    }
  }

  // Keeping this outside of the Promise.all because it introduces a race condition.
  // If one of the required packages fails to install/upgrade it might get stuck in the installing state.
  // On the next call to the /setup API, if there is a upgrade available for one of the required packages a race condition
  // will occur between upgrading the package and reinstalling the previously failed package.
  // By moving this outside of the Promise.all, the upgrade will occur first, and then we'll attempt to reinstall any
  // packages that are stuck in the installing state.
  await (0, _install.ensurePackagesCompletedInstall)(soClient, esClient);

  // Create policies specified in Kibana config
  const preconfiguredPolicies = await Promise.allSettled(policies.map(async preconfiguredAgentPolicy => {
    if (preconfiguredAgentPolicy.id) {
      // Check to see if a preconfigured policy with the same preconfiguration id was already deleted by the user
      const preconfigurationId = preconfiguredAgentPolicy.id.toString();
      const searchParams = {
        searchFields: ['id'],
        search: (0, _saved_object.escapeSearchQueryPhrase)(preconfigurationId)
      };
      const deletionRecords = await soClient.find({
        type: _constants2.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE,
        ...searchParams
      });
      const wasDeleted = deletionRecords.total > 0;
      if (wasDeleted) {
        return {
          created: false,
          deleted: preconfigurationId
        };
      }
    } else if (!preconfiguredAgentPolicy.is_default && !preconfiguredAgentPolicy.is_default_fleet_server) {
      throw new Error(_i18n.i18n.translate('xpack.fleet.preconfiguration.missingIDError', {
        defaultMessage: '{agentPolicyName} is missing an `id` field. `id` is required, except for policies marked is_default or is_default_fleet_server.',
        values: {
          agentPolicyName: preconfiguredAgentPolicy.name
        }
      }));
    }
    const {
      created,
      policy
    } = await _agent_policy.agentPolicyService.ensurePreconfiguredAgentPolicy(soClient, esClient, (0, _lodash.omit)(preconfiguredAgentPolicy, 'is_managed') // Don't add `is_managed` until the policy has been fully configured
    );

    if (!created) {
      if (!(policy !== null && policy !== void 0 && policy.is_managed)) return {
        created,
        policy
      };
      const {
        hasChanged,
        fields
      } = comparePreconfiguredPolicyToCurrent(preconfiguredAgentPolicy, policy);
      const newFields = {
        download_source_id: defaultDownloadSource.id,
        ...fields
      };
      if (hasChanged) {
        const updatedPolicy = await _agent_policy.agentPolicyService.update(soClient, esClient, String(preconfiguredAgentPolicy.id), newFields, {
          force: true
        });
        return {
          created,
          policy: updatedPolicy
        };
      }
      return {
        created,
        policy
      };
    }
    return {
      created,
      policy,
      shouldAddIsManagedFlag: preconfiguredAgentPolicy.is_managed
    };
  }));
  const fulfilledPolicies = [];
  const rejectedPolicies = [];
  for (let i = 0; i < preconfiguredPolicies.length; i++) {
    const policyResult = preconfiguredPolicies[i];
    if (policyResult.status === 'rejected') {
      rejectedPolicies.push({
        error: policyResult.reason,
        agentPolicy: {
          name: policies[i].name
        }
      });
      continue;
    }
    fulfilledPolicies.push(policyResult.value);
    const {
      created,
      policy,
      shouldAddIsManagedFlag
    } = policyResult.value;
    if (created || policies[i].is_managed) {
      const preconfiguredAgentPolicy = policies[i];
      const {
        package_policies: packagePolicies
      } = preconfiguredAgentPolicy;
      const agentPolicyWithPackagePolicies = await _agent_policy.agentPolicyService.get(soClient, policy.id, true);
      const installedPackagePolicies = await Promise.all(packagePolicies.map(async ({
        package: pkg,
        name,
        ...newPackagePolicy
      }) => {
        const installedPackage = await (0, _packages.getInstallation)({
          savedObjectsClient: soClient,
          pkgName: pkg.name
        });
        if (!installedPackage) {
          const rejectedPackage = rejectedPackages.find(rp => {
            var _rp$package;
            return ((_rp$package = rp.package) === null || _rp$package === void 0 ? void 0 : _rp$package.name) === pkg.name;
          });
          if (rejectedPackage) {
            throw new Error(_i18n.i18n.translate('xpack.fleet.preconfiguration.packageRejectedError', {
              defaultMessage: `[{agentPolicyName}] could not be added. [{pkgName}] could not be installed due to error: [{errorMessage}]`,
              values: {
                agentPolicyName: preconfiguredAgentPolicy.name,
                pkgName: pkg.name,
                errorMessage: rejectedPackage.error.toString()
              }
            }));
          }
          throw new Error(_i18n.i18n.translate('xpack.fleet.preconfiguration.packageMissingError', {
            defaultMessage: '[{agentPolicyName}] could not be added. [{pkgName}] is not installed, add [{pkgName}] to [{packagesConfigValue}] or remove it from [{packagePolicyName}].',
            values: {
              agentPolicyName: preconfiguredAgentPolicy.name,
              packagePolicyName: name,
              pkgName: pkg.name,
              packagesConfigValue: 'xpack.fleet.packages'
            }
          }));
        }
        return {
          name,
          installedPackage,
          ...newPackagePolicy
        };
      }));
      const packagePoliciesToAdd = installedPackagePolicies.filter(installablePackagePolicy => {
        return !(agentPolicyWithPackagePolicies === null || agentPolicyWithPackagePolicies === void 0 ? void 0 : agentPolicyWithPackagePolicies.package_policies).some(packagePolicy => packagePolicy.id !== undefined && packagePolicy.id === installablePackagePolicy.id || packagePolicy.name === installablePackagePolicy.name);
      });
      _elasticApmNode.default.startTransaction('fleet.preconfiguration.addPackagePolicies.improved.prReview.50', 'fleet');
      await addPreconfiguredPolicyPackages(soClient, esClient, policy, packagePoliciesToAdd, defaultOutput, true);
      _elasticApmNode.default.endTransaction('fleet.preconfiguration.addPackagePolicies.improved.prReview.50');

      // Add the is_managed flag after configuring package policies to avoid errors
      if (shouldAddIsManagedFlag) {
        await _agent_policy.agentPolicyService.update(soClient, esClient, policy.id, {
          is_managed: true
        }, {
          force: true
        });
      }
    }
  }
  return {
    policies: fulfilledPolicies.map(p => p.policy ? {
      id: p.policy.id,
      updated_at: p.policy.updated_at
    } : {
      id: p.deleted,
      updated_at: _i18n.i18n.translate('xpack.fleet.preconfiguration.policyDeleted', {
        defaultMessage: 'Preconfigured policy {id} was deleted; skipping creation',
        values: {
          id: p.deleted
        }
      })
    }),
    packages: fulfilledPackages.map(pkg => 'version' in pkg ? (0, _registry.pkgToPkgKey)(pkg) : pkg.name),
    nonFatalErrors: [...rejectedPackages, ...rejectedPolicies]
  };
}
function comparePreconfiguredPolicyToCurrent(policyFromConfig, currentPolicy) {
  // Namespace is omitted from being compared because even for managed policies, we still
  // want users to be able to pick their own namespace: https://github.com/elastic/kibana/issues/110533
  const configTopLevelFields = (0, _lodash.omit)(policyFromConfig, 'package_policies', 'id', 'namespace');
  const currentTopLevelFields = (0, _lodash.pick)(currentPolicy, ...Object.keys(configTopLevelFields));
  return {
    hasChanged: !(0, _lodash.isEqual)(configTopLevelFields, currentTopLevelFields),
    fields: configTopLevelFields
  };
}
async function addPreconfiguredPolicyPackages(soClient, esClient, agentPolicy, installedPackagePolicies, defaultOutput, bumpAgentPolicyRevison = false) {
  // Cache package info objects so we don't waste lookup time on the latest package
  // every time we call `getPackageInfo`
  const packageInfoMap = new Map();

  // Add packages synchronously to avoid overwriting
  for (const {
    installedPackage,
    id,
    name,
    description,
    inputs
  } of installedPackagePolicies) {
    let packageInfo;
    if (packageInfoMap.has(installedPackage.name)) {
      packageInfo = packageInfoMap.get(installedPackage.name);
    } else {
      packageInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: installedPackage.name,
        pkgVersion: installedPackage.version
      });
    }
    await (0, _agent_policy.addPackageToAgentPolicy)(soClient, esClient, installedPackage, agentPolicy, defaultOutput, packageInfo, name, id, description, policy => (0, _package_policy.preconfigurePackageInputs)(policy, packageInfo, inputs), bumpAgentPolicyRevison);
  }
}