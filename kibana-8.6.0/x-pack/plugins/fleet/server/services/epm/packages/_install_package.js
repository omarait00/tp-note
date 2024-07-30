"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._installPackage = _installPackage;
var _server = require("../../../../../../../src/core/server");
var _constants = require("../../../../common/constants");
var _constants2 = require("../../../constants");
var _install = require("../elasticsearch/template/install");
var _remove_legacy = require("../elasticsearch/template/remove_legacy");
var _ingest_pipeline = require("../elasticsearch/ingest_pipeline");
var _install2 = require("../elasticsearch/ilm/install");
var _install3 = require("../kibana/assets/install");
var _template = require("../elasticsearch/template/template");
var _install4 = require("../elasticsearch/transform/install");
var _ml_model = require("../elasticsearch/ml_model");
var _install5 = require("../elasticsearch/datastream_ilm/install");
var _storage = require("../archive/storage");
var _errors = require("../../../errors");
var _ = require("../..");
var _install6 = require("./install");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// this is only exported for testing
// use a leading underscore to indicate it's not the supported path
// only the more explicit `installPackage*` functions should be used
async function _installPackage({
  savedObjectsClient,
  savedObjectsImporter,
  savedObjectTagAssignmentService,
  savedObjectTagClient,
  esClient,
  logger,
  installedPkg,
  paths,
  packageInfo,
  installType,
  installSource,
  spaceId,
  verificationResult
}) {
  const {
    name: pkgName,
    version: pkgVersion,
    title: pkgTitle
  } = packageInfo;
  try {
    var _installedPkg$attribu;
    // if some installation already exists
    if (installedPkg) {
      // if the installation is currently running, don't try to install
      // instead, only return already installed assets
      if (installedPkg.attributes.install_status === 'installing' && Date.now() - Date.parse(installedPkg.attributes.install_started_at) < _constants.MAX_TIME_COMPLETE_INSTALL) {
        throw new _errors.ConcurrentInstallOperationError(`Concurrent installation or upgrade of ${pkgName || 'unknown'}-${pkgVersion || 'unknown'} detected, aborting.`);
      } else {
        // if no installation is running, or the installation has been running longer than MAX_TIME_COMPLETE_INSTALL
        // (it might be stuck) update the saved object and proceed
        await (0, _install6.restartInstallation)({
          savedObjectsClient,
          pkgName,
          pkgVersion,
          installSource,
          verificationResult
        });
      }
    } else {
      await (0, _install6.createInstallation)({
        savedObjectsClient,
        packageInfo,
        installSource,
        spaceId,
        verificationResult
      });
    }
    const kibanaAssetPromise = (0, _utils.withPackageSpan)('Install Kibana assets', () => (0, _install3.installKibanaAssetsAndReferences)({
      savedObjectsClient,
      savedObjectsImporter,
      savedObjectTagAssignmentService,
      savedObjectTagClient,
      pkgName,
      pkgTitle,
      paths,
      installedPkg,
      logger,
      spaceId
    }));
    // Necessary to avoid async promise rejection warning
    // See https://stackoverflow.com/questions/40920179/should-i-refrain-from-handling-promise-rejection-asynchronously
    kibanaAssetPromise.catch(() => {});

    // Use a shared array that is updated by each operation. This allows each operation to accurately update the
    // installation object with it's references without requiring a refresh of the SO index on each update (faster).
    let esReferences = (_installedPkg$attribu = installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.installed_es) !== null && _installedPkg$attribu !== void 0 ? _installedPkg$attribu : [];

    // the rest of the installation must happen in sequential order
    // currently only the base package has an ILM policy
    // at some point ILM policies can be installed/modified
    // per data stream and we should then save them
    esReferences = await (0, _utils.withPackageSpan)('Install ILM policies', () => (0, _install2.installILMPolicy)(packageInfo, paths, esClient, savedObjectsClient, logger, esReferences));
    ({
      esReferences
    } = await (0, _utils.withPackageSpan)('Install Data Stream ILM policies', () => (0, _install5.installIlmForDataStream)(packageInfo, paths, esClient, savedObjectsClient, logger, esReferences)));

    // installs ml models
    esReferences = await (0, _utils.withPackageSpan)('Install ML models', () => (0, _ml_model.installMlModel)(packageInfo, paths, esClient, savedObjectsClient, logger, esReferences));

    /**
     * In order to install assets in parallel, we need to split the preparation step from the installation step. This
     * allows us to know which asset references are going to be installed so that we can save them on the packages
     * SO before installation begins. In the case of a failure during installing any individual asset, we'll have the
     * references necessary to remove any assets in that were successfully installed during the rollback phase.
     *
     * This split of prepare/install could be extended to all asset types. Besides performance, it also allows us to
     * more easily write unit tests against the asset generation code without needing to mock ES responses.
     */
    const preparedIngestPipelines = (0, _ingest_pipeline.prepareToInstallPipelines)(packageInfo, paths);
    const preparedIndexTemplates = (0, _install.prepareToInstallTemplates)(packageInfo, paths, esReferences);

    // Update the references for the templates and ingest pipelines together. Need to be done togther to avoid race
    // conditions on updating the installed_es field at the same time
    // These must be saved before we actually attempt to install the templates or pipelines so that we know what to
    // cleanup in the case that a single asset fails to install.
    esReferences = await (0, _install6.updateEsAssetReferences)(savedObjectsClient, packageInfo.name, esReferences, {
      assetsToRemove: preparedIndexTemplates.assetsToRemove,
      assetsToAdd: [...preparedIngestPipelines.assetsToAdd, ...preparedIndexTemplates.assetsToAdd]
    });

    // Install index templates and ingest pipelines in parallel since they typically take the longest
    const [installedTemplates] = await Promise.all([(0, _utils.withPackageSpan)('Install index templates', () => preparedIndexTemplates.install(esClient, logger)),
    // installs versionized pipelines without removing currently installed ones
    (0, _utils.withPackageSpan)('Install ingest pipelines', () => preparedIngestPipelines.install(esClient, logger))]);
    try {
      await (0, _remove_legacy.removeLegacyTemplates)({
        packageInfo,
        esClient,
        logger
      });
    } catch (e) {
      logger.warn(`Error removing legacy templates: ${e.message}`);
    }
    const {
      diagnosticFileUploadEnabled
    } = _.appContextService.getExperimentalFeatures();
    if (diagnosticFileUploadEnabled) {
      await (0, _install.ensureFileUploadWriteIndices)({
        integrationNames: [packageInfo.name],
        esClient,
        logger
      });
    }

    // update current backing indices of each data stream
    await (0, _utils.withPackageSpan)('Update write indices', () => (0, _template.updateCurrentWriteIndices)(esClient, logger, installedTemplates));
    ({
      esReferences
    } = await (0, _utils.withPackageSpan)('Install transforms', () => (0, _install4.installTransforms)(packageInfo, paths, esClient, savedObjectsClient, logger, esReferences)));

    // If this is an update or retrying an update, delete the previous version's pipelines
    // Top-level pipeline assets will not be removed on upgrade as of ml model package addition which requires previous
    // assets to remain installed. This is a temporary solution - more robust solution tracked here https://github.com/elastic/kibana/issues/115035
    if (paths.filter(path => (0, _ingest_pipeline.isTopLevelPipeline)(path)).length === 0 && (installType === 'update' || installType === 'reupdate') && installedPkg) {
      esReferences = await (0, _utils.withPackageSpan)('Delete previous ingest pipelines', () => (0, _ingest_pipeline.deletePreviousPipelines)(esClient, savedObjectsClient, pkgName, installedPkg.attributes.version, esReferences));
    }
    // pipelines from a different version may have installed during a failed update
    if (installType === 'rollback' && installedPkg) {
      esReferences = await (0, _utils.withPackageSpan)('Delete previous ingest pipelines', () => (0, _ingest_pipeline.deletePreviousPipelines)(esClient, savedObjectsClient, pkgName, installedPkg.attributes.install_version, esReferences));
    }
    const installedKibanaAssetsRefs = await kibanaAssetPromise;
    const packageAssetResults = await (0, _utils.withPackageSpan)('Update archive entries', () => (0, _storage.saveArchiveEntries)({
      savedObjectsClient,
      paths,
      packageInfo,
      installSource
    }));
    const packageAssetRefs = packageAssetResults.saved_objects.map(result => ({
      id: result.id,
      type: _constants.ASSETS_SAVED_OBJECT_TYPE
    }));
    const updatedPackage = await (0, _utils.withPackageSpan)('Update install status', () => savedObjectsClient.update(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
      version: pkgVersion,
      install_version: pkgVersion,
      install_status: 'installed',
      package_assets: packageAssetRefs,
      install_format_schema_version: _constants2.FLEET_INSTALL_FORMAT_VERSION
    }));

    // If the package is flagged with the `keep_policies_up_to_date` flag, upgrade its
    // associated package policies after installation
    if (updatedPackage.attributes.keep_policies_up_to_date) {
      await (0, _utils.withPackageSpan)('Upgrade package policies', async () => {
        const policyIdsToUpgrade = await _.packagePolicyService.listIds(savedObjectsClient, {
          page: 1,
          perPage: _constants.SO_SEARCH_LIMIT,
          kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName}`
        });
        await _.packagePolicyService.upgrade(savedObjectsClient, esClient, policyIdsToUpgrade.items);
      });
    }
    return [...installedKibanaAssetsRefs, ...esReferences];
  } catch (err) {
    if (_server.SavedObjectsErrorHelpers.isConflictError(err)) {
      throw new _errors.ConcurrentInstallOperationError(`Concurrent installation or upgrade of ${pkgName || 'unknown'}-${pkgVersion || 'unknown'} detected, aborting. Original error: ${err.message}`);
    } else {
      throw err;
    }
  }
}