"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureFleetDirectories = ensureFleetDirectories;
exports.ensureFleetFileUploadIndices = ensureFleetFileUploadIndices;
exports.ensureFleetGlobalEsAssets = ensureFleetGlobalEsAssets;
exports.formatNonFatalErrors = formatNonFatalErrors;
exports.setupFleet = setupFleet;
var _promises = _interopRequireDefault(require("fs/promises"));
var _lodash = require("lodash");
var _pMap = _interopRequireDefault(require("p-map"));
var _constants = require("../../../spaces/common/constants");
var _constants2 = require("../../common/constants");
var _constants3 = require("../constants");
var _app_context = require("./app_context");
var _agent_policy = require("./agent_policy");
var _preconfiguration = require("./preconfiguration");
var _outputs = require("./preconfiguration/outputs");
var _output = require("./output");
var _download_source = require("./download_source");
var _api_keys = require("./api_keys");
var _ = require(".");
var _setup_utils = require("./setup_utils");
var _install = require("./epm/elasticsearch/ingest_pipeline/install");
var _install2 = require("./epm/elasticsearch/template/install");
var _packages = require("./epm/packages");
var _install3 = require("./epm/packages/install");
var _managed_package_policies = require("./managed_package_policies");
var _upgrade_package_install_version = require("./setup/upgrade_package_install_version");
var _upgrade_agent_policy_schema_version = require("./setup/upgrade_agent_policy_schema_version");
var _fleet_server_host = require("./fleet_server_host");
var _fleet_server_host2 = require("./preconfiguration/fleet_server_host");
var _get = require("./epm/packages/get");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function setupFleet(soClient, esClient) {
  return (0, _setup_utils.awaitIfPending)(async () => createSetupSideEffects(soClient, esClient));
}
async function createSetupSideEffects(soClient, esClient) {
  var _appContextService$ge, _appContextService$ge2;
  const logger = _app_context.appContextService.getLogger();
  logger.info('Beginning fleet setup');
  await ensureFleetDirectories();
  const {
    agentPolicies: policiesOrUndefined,
    packages: packagesOrUndefined
  } = (_appContextService$ge = _app_context.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 ? _appContextService$ge : {};
  const policies = policiesOrUndefined !== null && policiesOrUndefined !== void 0 ? policiesOrUndefined : [];
  let packages = packagesOrUndefined !== null && packagesOrUndefined !== void 0 ? packagesOrUndefined : [];
  logger.debug('Setting Fleet server config');
  await (0, _fleet_server_host.migrateSettingsToFleetServerHost)(soClient);
  logger.debug('Setting up Fleet download source');
  const defaultDownloadSource = await _download_source.downloadSourceService.ensureDefault(soClient);
  logger.debug('Setting up Fleet Sever Hosts');
  await (0, _fleet_server_host2.ensurePreconfiguredFleetServerHosts)(soClient, esClient, (0, _fleet_server_host2.getPreconfiguredFleetServerHostFromConfig)(_app_context.appContextService.getConfig()));
  logger.debug('Setting up Fleet outputs');
  await Promise.all([(0, _outputs.ensurePreconfiguredOutputs)(soClient, esClient, (0, _outputs.getPreconfiguredOutputFromConfig)(_app_context.appContextService.getConfig())), _.settingsService.settingsSetup(soClient)]);
  const defaultOutput = await _output.outputService.ensureDefaultOutput(soClient);
  if ((_appContextService$ge2 = _app_context.appContextService.getConfig()) !== null && _appContextService$ge2 !== void 0 && _appContextService$ge2.agentIdVerificationEnabled) {
    logger.debug('Setting up Fleet Elasticsearch assets');
    await ensureFleetGlobalEsAssets(soClient, esClient);
  }
  await ensureFleetFileUploadIndices(soClient, esClient);
  // Ensure that required packages are always installed even if they're left out of the config
  const preconfiguredPackageNames = new Set(packages.map(pkg => pkg.name));
  const autoUpdateablePackages = (0, _lodash.compact)(await Promise.all(_constants2.AUTO_UPDATE_PACKAGES.map(pkg => (0, _install3.isPackageInstalled)({
    savedObjectsClient: soClient,
    pkgName: pkg.name
  }).then(installed => installed ? pkg : undefined))));
  packages = [...packages, ...autoUpdateablePackages.filter(pkg => !preconfiguredPackageNames.has(pkg.name))];
  logger.debug('Setting up initial Fleet packages');
  const {
    nonFatalErrors: preconfiguredPackagesNonFatalErrors
  } = await (0, _preconfiguration.ensurePreconfiguredPackagesAndPolicies)(soClient, esClient, policies, packages, defaultOutput, defaultDownloadSource, _constants.DEFAULT_SPACE_ID);
  const packagePolicyUpgradeErrors = (await (0, _managed_package_policies.upgradeManagedPackagePolicies)(soClient, esClient)).filter(result => {
    var _result$errors;
    return ((_result$errors = result.errors) !== null && _result$errors !== void 0 ? _result$errors : []).length > 0;
  });
  const nonFatalErrors = [...preconfiguredPackagesNonFatalErrors, ...packagePolicyUpgradeErrors];
  logger.debug('Upgrade Fleet package install versions');
  await (0, _upgrade_package_install_version.upgradePackageInstallVersion)({
    soClient,
    esClient,
    logger
  });
  logger.debug('Upgrade Agent policy schema version');
  await (0, _upgrade_agent_policy_schema_version.upgradeAgentPolicySchemaVersion)(soClient);
  logger.debug('Setting up Fleet enrollment keys');
  await ensureDefaultEnrollmentAPIKeysExists(soClient, esClient);
  if (nonFatalErrors.length > 0) {
    logger.info('Encountered non fatal errors during Fleet setup');
    formatNonFatalErrors(nonFatalErrors).forEach(error => logger.info(JSON.stringify(error)));
  }
  logger.info('Fleet setup completed');
  return {
    isInitialized: true,
    nonFatalErrors
  };
}

/**
 * Ensure ES assets shared by all Fleet index template are installed
 */
async function ensureFleetFileUploadIndices(soClient, esClient) {
  const {
    diagnosticFileUploadEnabled
  } = _app_context.appContextService.getExperimentalFeatures();
  if (!diagnosticFileUploadEnabled) return;
  const logger = _app_context.appContextService.getLogger();
  const installedFileUploadIntegrations = await (0, _get.getInstallationsByName)({
    savedObjectsClient: soClient,
    pkgNames: [..._constants2.FILE_STORAGE_INTEGRATION_NAMES]
  });
  if (!installedFileUploadIntegrations.length) return [];
  const integrationNames = installedFileUploadIntegrations.map(({
    name
  }) => name);
  logger.debug(`Ensuring file upload write indices for ${integrationNames}`);
  return (0, _install2.ensureFileUploadWriteIndices)({
    esClient,
    logger,
    integrationNames
  });
}
/**
 * Ensure ES assets shared by all Fleet index template are installed
 */
async function ensureFleetGlobalEsAssets(soClient, esClient) {
  const logger = _app_context.appContextService.getLogger();
  // Ensure Global Fleet ES assets are installed
  logger.debug('Creating Fleet component template and ingest pipeline');
  const globalAssetsRes = await Promise.all([(0, _install2.ensureDefaultComponentTemplates)(esClient, logger),
  // returns an array
  (0, _install.ensureFleetFinalPipelineIsInstalled)(esClient, logger)]);
  const assetResults = globalAssetsRes.flat();
  if (assetResults.some(asset => asset.isCreated)) {
    // Update existing index template
    const installedPackages = await (0, _packages.getInstallations)(soClient);
    const bundledPackages = await (0, _packages.getBundledPackages)();
    const findMatchingBundledPkg = pkg => bundledPackages.find(bundledPkg => bundledPkg.name === pkg.name && bundledPkg.version === pkg.version);
    await (0, _pMap.default)(installedPackages.saved_objects, async ({
      attributes: installation
    }) => {
      if (installation.install_source !== 'registry') {
        const matchingBundledPackage = findMatchingBundledPkg(installation);
        if (!matchingBundledPackage) {
          logger.error(`Package needs to be manually reinstalled ${installation.name} after installing Fleet global assets`);
          return;
        }
      }
      await (0, _packages.reinstallPackageForInstallation)({
        soClient,
        esClient,
        installation
      }).catch(err => {
        logger.error(`Package needs to be manually reinstalled ${installation.name} after installing Fleet global assets: ${err.message}`);
      });
    }, {
      concurrency: 10
    });
  }
}
async function ensureDefaultEnrollmentAPIKeysExists(soClient, esClient, options) {
  const security = _app_context.appContextService.getSecurity();
  if (!security) {
    return;
  }
  if (!(await security.authc.apiKeys.areAPIKeysEnabled())) {
    return;
  }
  const {
    items: agentPolicies
  } = await _agent_policy.agentPolicyService.list(soClient, {
    perPage: _constants3.SO_SEARCH_LIMIT
  });
  await (0, _pMap.default)(agentPolicies, agentPolicy => (0, _api_keys.ensureDefaultEnrollmentAPIKeyForAgentPolicy)(soClient, esClient, agentPolicy.id), {
    concurrency: 20
  });
}

/**
 * Maps the `nonFatalErrors` object returned by the setup process to a more readable
 * and predictable format suitable for logging output or UI presentation.
 */
function formatNonFatalErrors(nonFatalErrors) {
  return nonFatalErrors.flatMap(e => {
    if ('error' in e) {
      return {
        name: e.error.name,
        message: e.error.message
      };
    } else if ('errors' in e) {
      return e.errors.map(upgradePackagePolicyError => {
        if (typeof upgradePackagePolicyError === 'string') {
          return {
            name: 'SetupNonFatalError',
            message: upgradePackagePolicyError
          };
        }
        return {
          name: upgradePackagePolicyError.key,
          message: upgradePackagePolicyError.message
        };
      });
    }
  });
}

/**
 * Confirm existence of various directories used by Fleet and warn if they don't exist
 */
async function ensureFleetDirectories() {
  var _config$developer;
  const logger = _app_context.appContextService.getLogger();
  const config = _app_context.appContextService.getConfig();
  const bundledPackageLocation = config === null || config === void 0 ? void 0 : (_config$developer = config.developer) === null || _config$developer === void 0 ? void 0 : _config$developer.bundledPackageLocation;
  const registryUrl = (0, _.getRegistryUrl)();
  if (!bundledPackageLocation) {
    logger.warn('xpack.fleet.developer.bundledPackageLocation is not configured');
    return;
  }
  try {
    await _promises.default.stat(bundledPackageLocation);
  } catch (error) {
    logger.warn(`Bundled package directory ${bundledPackageLocation} does not exist. All packages will be sourced from ${registryUrl}.`);
  }
}