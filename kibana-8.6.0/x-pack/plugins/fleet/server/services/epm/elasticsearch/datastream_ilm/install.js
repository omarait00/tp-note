"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installIlmForDataStream = void 0;
var _models = require("../../../../../common/types/models");
var _install = require("../../packages/install");
var _common = require("../transform/common");
var _meta = require("../meta");
var _retry = require("../retry");
var _remove = require("./remove");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const installIlmForDataStream = async (registryPackage, paths, esClient, savedObjectsClient, logger, esReferences) => {
  const previousInstalledIlmEsAssets = esReferences.filter(({
    type
  }) => type === _models.ElasticsearchAssetType.dataStreamIlmPolicy);

  // delete all previous ilm
  await (0, _remove.deleteIlms)(esClient, previousInstalledIlmEsAssets.map(asset => asset.id));
  if (previousInstalledIlmEsAssets.length > 0) {
    // remove the saved object reference
    esReferences = await (0, _install.updateEsAssetReferences)(savedObjectsClient, registryPackage.name, esReferences, {
      assetsToRemove: previousInstalledIlmEsAssets
    });
  }

  // install the latest dataset
  const dataStreams = registryPackage.data_streams;
  if (!(dataStreams !== null && dataStreams !== void 0 && dataStreams.length)) return {
    installedIlms: [],
    esReferences
  };
  const dataStreamIlmPaths = paths.filter(path => isDataStreamIlm(path));
  let installedIlms = [];
  if (dataStreamIlmPaths.length > 0) {
    const ilmPathDatasets = dataStreams.reduce((acc, dataStream) => {
      dataStreamIlmPaths.forEach(path => {
        if (isDatasetIlm(path, dataStream.path)) {
          acc.push({
            path,
            dataStream
          });
        }
      });
      return acc;
    }, []);
    const ilmRefs = ilmPathDatasets.reduce((acc, ilmPathDataset) => {
      if (ilmPathDataset) {
        acc.push({
          id: getIlmNameForInstallation(ilmPathDataset),
          type: _models.ElasticsearchAssetType.dataStreamIlmPolicy
        });
      }
      return acc;
    }, []);
    esReferences = await (0, _install.updateEsAssetReferences)(savedObjectsClient, registryPackage.name, esReferences, {
      assetsToAdd: ilmRefs
    });
    const ilmInstallations = ilmPathDatasets.map(ilmPathDataset => {
      const content = JSON.parse((0, _common.getAsset)(ilmPathDataset.path).toString('utf-8'));
      content.policy._meta = (0, _meta.getESAssetMetadata)({
        packageName: registryPackage.name
      });
      return {
        installationName: getIlmNameForInstallation(ilmPathDataset),
        content
      };
    });
    const installationPromises = ilmInstallations.map(async ilmInstallation => {
      return handleIlmInstall({
        esClient,
        ilmInstallation,
        logger
      });
    });
    installedIlms = await Promise.all(installationPromises).then(results => results.flat());
  }
  return {
    installedIlms,
    esReferences
  };
};
exports.installIlmForDataStream = installIlmForDataStream;
async function handleIlmInstall({
  esClient,
  ilmInstallation,
  logger
}) {
  await (0, _retry.retryTransientEsErrors)(() => esClient.transport.request({
    method: 'PUT',
    path: `/_ilm/policy/${ilmInstallation.installationName}`,
    body: ilmInstallation.content
  }), {
    logger
  });
  return {
    id: ilmInstallation.installationName,
    type: _models.ElasticsearchAssetType.dataStreamIlmPolicy
  };
}
const isDataStreamIlm = path => {
  return new RegExp('(?<package>.*)/data_stream/(?<dataset>.*)/elasticsearch/ilm/*.*').test(path);
};
const isDatasetIlm = (path, datasetName) => {
  return new RegExp(`(?<package>.*)/data_stream\\/${datasetName}/elasticsearch/ilm/*.*`).test(path);
};
const getIlmNameForInstallation = ilmPathDataset => {
  var _ilmPathDataset$path$, _ilmPathDataset$path$2;
  const filename = ilmPathDataset === null || ilmPathDataset === void 0 ? void 0 : (_ilmPathDataset$path$ = ilmPathDataset.path.split('/')) === null || _ilmPathDataset$path$ === void 0 ? void 0 : (_ilmPathDataset$path$2 = _ilmPathDataset$path$.pop()) === null || _ilmPathDataset$path$2 === void 0 ? void 0 : _ilmPathDataset$path$2.split('.')[0];
  return `${ilmPathDataset.dataStream.type}-${ilmPathDataset.dataStream.package}.${ilmPathDataset.dataStream.path}-${filename}`;
};