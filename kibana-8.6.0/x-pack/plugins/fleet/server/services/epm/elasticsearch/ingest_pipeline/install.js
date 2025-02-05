"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureFleetFinalPipelineIsInstalled = ensureFleetFinalPipelineIsInstalled;
exports.installAllPipelines = installAllPipelines;
exports.prepareToInstallPipelines = void 0;
var _types = require("../../../../types");
var _archive = require("../../archive");
var _constants = require("../../../../constants");
var _services = require("../../../../../common/services");
var _meta = require("../meta");
var _retry = require("../retry");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const prepareToInstallPipelines = (installablePackage, paths) => {
  // unlike other ES assets, pipeline names are versioned so after a template is updated
  // it can be created pointing to the new template, without removing the old one and effecting data
  // so do not remove the currently installed pipelines here
  const dataStreams = installablePackage.data_streams;
  const {
    version: pkgVersion
  } = installablePackage;
  const pipelinePaths = paths.filter(path => isPipeline(path));
  const topLevelPipelinePaths = paths.filter(path => (0, _helpers.isTopLevelPipeline)(path));
  if (!(dataStreams !== null && dataStreams !== void 0 && dataStreams.length) && topLevelPipelinePaths.length === 0) return {
    assetsToAdd: [],
    install: () => Promise.resolve()
  };

  // get and save pipeline refs before installing pipelines
  let pipelineRefs = dataStreams ? dataStreams.reduce((acc, dataStream) => {
    const filteredPaths = pipelinePaths.filter(path => isDataStreamPipeline(path, dataStream.path));
    let createdDatastreamPipeline = false;
    const pipelineObjectRefs = filteredPaths.map(path => {
      const {
        name
      } = getNameAndExtension(path);
      if (name === dataStream.ingest_pipeline) {
        createdDatastreamPipeline = true;
      }
      const nameForInstallation = (0, _helpers.getPipelineNameForInstallation)({
        pipelineName: name,
        dataStream,
        packageVersion: pkgVersion
      });
      return {
        id: nameForInstallation,
        type: _types.ElasticsearchAssetType.ingestPipeline
      };
    });
    if (!createdDatastreamPipeline) {
      const nameForInstallation = (0, _services.getPipelineNameForDatastream)({
        dataStream,
        packageVersion: pkgVersion
      });
      acc.push({
        id: nameForInstallation,
        type: _types.ElasticsearchAssetType.ingestPipeline
      });
    }
    acc.push(...pipelineObjectRefs);
    return acc;
  }, []) : [];
  const topLevelPipelineRefs = topLevelPipelinePaths.map(path => {
    const {
      name
    } = getNameAndExtension(path);
    const nameForInstallation = (0, _helpers.getPipelineNameForInstallation)({
      pipelineName: name,
      packageVersion: pkgVersion
    });
    return {
      id: nameForInstallation,
      type: _types.ElasticsearchAssetType.ingestPipeline
    };
  });
  pipelineRefs = [...pipelineRefs, ...topLevelPipelineRefs];
  return {
    assetsToAdd: pipelineRefs,
    install: async (esClient, logger) => {
      const pipelines = dataStreams ? dataStreams.reduce((acc, dataStream) => {
        acc.push(installAllPipelines({
          dataStream,
          esClient,
          logger,
          paths: pipelinePaths,
          installablePackage
        }));
        return acc;
      }, []) : [];
      if (topLevelPipelinePaths) {
        pipelines.push(installAllPipelines({
          dataStream: undefined,
          esClient,
          logger,
          paths: topLevelPipelinePaths,
          installablePackage
        }));
      }
      await Promise.all(pipelines);
    }
  };
};
exports.prepareToInstallPipelines = prepareToInstallPipelines;
async function installAllPipelines({
  esClient,
  logger,
  paths,
  dataStream,
  installablePackage
}) {
  const pipelinePaths = dataStream ? paths.filter(path => isDataStreamPipeline(path, dataStream.path)) : paths;
  const pipelinesInfos = [];
  const substitutions = [];
  let datastreamPipelineCreated = false;
  pipelinePaths.forEach(path => {
    const {
      name,
      extension
    } = getNameAndExtension(path);
    const isMainPipeline = name === (dataStream === null || dataStream === void 0 ? void 0 : dataStream.ingest_pipeline);
    if (isMainPipeline) {
      datastreamPipelineCreated = true;
    }
    const nameForInstallation = (0, _helpers.getPipelineNameForInstallation)({
      pipelineName: name,
      dataStream,
      packageVersion: installablePackage.version
    });
    const content = (0, _archive.getAsset)(path).toString('utf-8');
    pipelinesInfos.push({
      nameForInstallation,
      customIngestPipelineNameForInstallation: dataStream && isMainPipeline ? (0, _services.getCustomPipelineNameForDatastream)(dataStream) : undefined,
      content,
      extension
    });
    substitutions.push({
      source: name,
      target: nameForInstallation,
      templateFunction: 'IngestPipeline'
    });
  });
  const pipelinesToInstall = pipelinesInfos.map(pipeline => {
    return {
      ...pipeline,
      contentForInstallation: (0, _helpers.rewriteIngestPipeline)(pipeline.content, substitutions)
    };
  });
  if (!datastreamPipelineCreated && dataStream) {
    const nameForInstallation = (0, _services.getPipelineNameForDatastream)({
      dataStream,
      packageVersion: installablePackage.version
    });
    pipelinesToInstall.push({
      nameForInstallation,
      customIngestPipelineNameForInstallation: (0, _services.getCustomPipelineNameForDatastream)(dataStream),
      contentForInstallation: 'processors: []',
      extension: 'yml'
    });
  }
  const installationPromises = pipelinesToInstall.map(async pipeline => {
    return installPipeline({
      esClient,
      pipeline,
      installablePackage,
      logger
    });
  });
  return Promise.all(installationPromises);
}
async function installPipeline({
  esClient,
  logger,
  pipeline,
  installablePackage,
  shouldAddCustomPipelineProcessor = true
}) {
  let pipelineToInstall = (0, _meta.appendMetadataToIngestPipeline)({
    pipeline,
    packageName: installablePackage === null || installablePackage === void 0 ? void 0 : installablePackage.name
  });
  if (shouldAddCustomPipelineProcessor) {
    pipelineToInstall = (0, _helpers.addCustomPipelineProcessor)(pipelineToInstall);
  }
  const esClientParams = {
    id: pipelineToInstall.nameForInstallation,
    body: pipelineToInstall.extension === 'yml' ? pipelineToInstall.contentForInstallation : JSON.parse(pipelineToInstall.contentForInstallation)
  };
  const esClientRequestOptions = {
    ignore: [404]
  };
  if (pipelineToInstall.extension === 'yml') {
    esClientRequestOptions.headers = {
      // pipeline is YAML
      'Content-Type': 'application/yaml',
      // but we want JSON responses (to extract error messages, status code, or other metadata)
      Accept: 'application/json'
    };
  }
  await (0, _retry.retryTransientEsErrors)(() => esClient.ingest.putPipeline(esClientParams, esClientRequestOptions), {
    logger
  });
  return {
    id: pipelineToInstall.nameForInstallation,
    type: _types.ElasticsearchAssetType.ingestPipeline
  };
}
async function ensureFleetFinalPipelineIsInstalled(esClient, logger) {
  var _res$body$FLEET_FINAL;
  const esClientRequestOptions = {
    ignore: [404]
  };
  const res = await esClient.ingest.getPipeline({
    id: _constants.FLEET_FINAL_PIPELINE_ID
  }, {
    ...esClientRequestOptions,
    meta: true
  });
  const installedVersion = res === null || res === void 0 ? void 0 : (_res$body$FLEET_FINAL = res.body[_constants.FLEET_FINAL_PIPELINE_ID]) === null || _res$body$FLEET_FINAL === void 0 ? void 0 : _res$body$FLEET_FINAL.version;
  if (res.statusCode === 404 || !installedVersion || installedVersion < _constants.FLEET_FINAL_PIPELINE_VERSION) {
    await installPipeline({
      esClient,
      logger,
      pipeline: {
        nameForInstallation: _constants.FLEET_FINAL_PIPELINE_ID,
        contentForInstallation: _constants.FLEET_FINAL_PIPELINE_CONTENT,
        extension: 'yml'
      }
    });
    return {
      isCreated: true
    };
  }
  return {
    isCreated: false
  };
}
const isDirectory = ({
  path
}) => path.endsWith('/');
const isDataStreamPipeline = (path, dataStreamDataset) => {
  const pathParts = (0, _archive.getPathParts)(path);
  return !isDirectory({
    path
  }) && pathParts.type === _types.ElasticsearchAssetType.ingestPipeline && pathParts.dataset !== undefined && dataStreamDataset === pathParts.dataset;
};
const isPipeline = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ingestPipeline;
};

// XXX: assumes path/to/file.ext -- 0..n '/' and exactly one '.'
const getNameAndExtension = path => {
  const splitPath = path.split('/');
  const filename = splitPath[splitPath.length - 1];
  return {
    name: filename.split('.')[0],
    extension: filename.split('.')[1]
  };
};