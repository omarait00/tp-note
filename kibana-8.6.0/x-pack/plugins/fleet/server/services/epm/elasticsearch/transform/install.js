"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransform = exports.installTransforms = void 0;
var _elasticsearch = require("@elastic/elasticsearch");
var _jsYaml = require("js-yaml");
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
var _constants = require("../../../../../common/constants");
var _install = require("../template/install");
var _field = require("../../fields/field");
var _template = require("../template/template");
var _meta = require("../meta");
var _install2 = require("../../packages/install");
var _archive = require("../../archive");
var _models = require("../../../../../common/types/models");
var _packages = require("../../packages");
var _retry = require("../retry");
var _remove = require("./remove");
var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_TRANSFORM_TEMPLATES_PRIORITY = 250;
var TRANSFORM_SPECS_TYPES;
(function (TRANSFORM_SPECS_TYPES) {
  TRANSFORM_SPECS_TYPES["MANIFEST"] = "manifest";
  TRANSFORM_SPECS_TYPES["FIELDS"] = "fields";
  TRANSFORM_SPECS_TYPES["TRANSFORM"] = "transform";
})(TRANSFORM_SPECS_TYPES || (TRANSFORM_SPECS_TYPES = {}));
const installLegacyTransformsAssets = async (installablePackage, installNameSuffix, transformPaths, esClient, savedObjectsClient, logger, esReferences = [], previousInstalledTransformEsAssets = []) => {
  let installedTransforms = [];
  if (transformPaths.length > 0) {
    const transformRefs = transformPaths.reduce((acc, path) => {
      acc.push({
        id: getLegacyTransformNameForInstallation(installablePackage, path, installNameSuffix),
        type: _models.ElasticsearchAssetType.transform
      });
      return acc;
    }, []);

    // get and save transform refs before installing transforms
    esReferences = await (0, _install2.updateEsAssetReferences)(savedObjectsClient, installablePackage.name, esReferences, {
      assetsToAdd: transformRefs
    });
    const transforms = transformPaths.map(path => {
      const content = JSON.parse((0, _common.getAsset)(path).toString('utf-8'));
      content._meta = (0, _meta.getESAssetMetadata)({
        packageName: installablePackage.name
      });
      return {
        installationName: getLegacyTransformNameForInstallation(installablePackage, path, installNameSuffix),
        content
      };
    });
    const installationPromises = transforms.map(async transform => {
      return handleTransformInstall({
        esClient,
        logger,
        transform
      });
    });
    installedTransforms = await Promise.all(installationPromises).then(results => results.flat());
  }
  if (previousInstalledTransformEsAssets.length > 0) {
    esReferences = await (0, _install2.updateEsAssetReferences)(savedObjectsClient, installablePackage.name, esReferences, {
      assetsToRemove: previousInstalledTransformEsAssets
    });
  }
  return {
    installedTransforms,
    esReferences
  };
};
const processTransformAssetsPerModule = (installablePackage, installNameSuffix, transformPaths) => {
  const transformsSpecifications = new Map();
  const destinationIndexTemplates = [];
  const transforms = [];
  transformPaths.forEach(path => {
    const {
      transformModuleId,
      fileName
    } = getTransformFolderAndFileNames(installablePackage, path);

    // Since there can be multiple assets per transform definition
    // We want to create a unique list of assets/specifications for each transform
    if (transformsSpecifications.get(transformModuleId) === undefined) {
      transformsSpecifications.set(transformModuleId, new Map());
    }
    const packageAssets = transformsSpecifications.get(transformModuleId);
    const content = (0, _jsYaml.safeLoad)((0, _common.getAsset)(path).toString('utf-8'));
    if (fileName === TRANSFORM_SPECS_TYPES.FIELDS) {
      const validFields = (0, _field.processFields)(content);
      const mappings = (0, _template.generateMappings)(validFields);
      packageAssets === null || packageAssets === void 0 ? void 0 : packageAssets.set('mappings', mappings);
    }
    if (fileName === TRANSFORM_SPECS_TYPES.TRANSFORM) {
      var _transformsSpecificat, _transformsSpecificat2;
      (_transformsSpecificat = transformsSpecifications.get(transformModuleId)) === null || _transformsSpecificat === void 0 ? void 0 : _transformsSpecificat.set('destinationIndex', content.dest);
      (_transformsSpecificat2 = transformsSpecifications.get(transformModuleId)) === null || _transformsSpecificat2 === void 0 ? void 0 : _transformsSpecificat2.set('transform', content);
      content._meta = (0, _meta.getESAssetMetadata)({
        packageName: installablePackage.name
      });
      transforms.push({
        transformModuleId,
        installationName: getTransformAssetNameForInstallation(installablePackage, transformModuleId, `default-${installNameSuffix}`),
        content
      });
    }
    if (fileName === TRANSFORM_SPECS_TYPES.MANIFEST) {
      if ((0, _mlIsPopulatedObject.isPopulatedObject)(content, ['start']) && content.start === false) {
        var _transformsSpecificat3;
        (_transformsSpecificat3 = transformsSpecifications.get(transformModuleId)) === null || _transformsSpecificat3 === void 0 ? void 0 : _transformsSpecificat3.set('start', false);
      }
      // If manifest.yml contains destination_index_template
      // Combine the mappings and other index template settings from manifest.yml into a single index template
      // Create the index template and track the template in EsAssetReferences
      if ((0, _mlIsPopulatedObject.isPopulatedObject)(content, ['destination_index_template']) || (0, _mlIsPopulatedObject.isPopulatedObject)(packageAssets.get('mappings'))) {
        var _ref;
        const destinationIndexTemplate = (_ref = content.destination_index_template) !== null && _ref !== void 0 ? _ref : {};
        destinationIndexTemplates.push({
          transformModuleId,
          _meta: (0, _meta.getESAssetMetadata)({
            packageName: installablePackage.name
          }),
          installationName: getTransformAssetNameForInstallation(installablePackage, transformModuleId, 'template'),
          template: destinationIndexTemplate
        });
        packageAssets.set('destinationIndexTemplate', destinationIndexTemplate);
      }
    }
  });
  const indexTemplatesRefs = destinationIndexTemplates.map(template => ({
    id: template.installationName,
    type: _models.ElasticsearchAssetType.indexTemplate
  }));
  const componentTemplatesRefs = [...destinationIndexTemplates.map(template => ({
    id: `${template.installationName}${_constants.USER_SETTINGS_TEMPLATE_SUFFIX}`,
    type: _models.ElasticsearchAssetType.componentTemplate
  })), ...destinationIndexTemplates.map(template => ({
    id: `${template.installationName}${_constants.PACKAGE_TEMPLATE_SUFFIX}`,
    type: _models.ElasticsearchAssetType.componentTemplate
  }))];
  const transformRefs = transforms.map(t => ({
    id: t.installationName,
    type: _models.ElasticsearchAssetType.transform
  }));
  return {
    indexTemplatesRefs,
    componentTemplatesRefs,
    transformRefs,
    transforms,
    destinationIndexTemplates,
    transformsSpecifications
  };
};
const installTransformsAssets = async (installablePackage, installNameSuffix, transformPaths, esClient, savedObjectsClient, logger, esReferences = [], previousInstalledTransformEsAssets = []) => {
  let installedTransforms = [];
  if (transformPaths.length > 0) {
    const {
      indexTemplatesRefs,
      componentTemplatesRefs,
      transformRefs,
      transforms,
      destinationIndexTemplates,
      transformsSpecifications
    } = processTransformAssetsPerModule(installablePackage, installNameSuffix, transformPaths);
    // get and save refs associated with the transforms before installing
    esReferences = await (0, _install2.updateEsAssetReferences)(savedObjectsClient, installablePackage.name, esReferences, {
      assetsToAdd: [...indexTemplatesRefs, ...componentTemplatesRefs, ...transformRefs],
      assetsToRemove: previousInstalledTransformEsAssets
    });

    // create index templates and component templates
    await Promise.all(destinationIndexTemplates.map(destinationIndexTemplate => {
      var _transformsSpecificat4, _transformsSpecificat5;
      const customMappings = (_transformsSpecificat4 = (_transformsSpecificat5 = transformsSpecifications.get(destinationIndexTemplate.transformModuleId)) === null || _transformsSpecificat5 === void 0 ? void 0 : _transformsSpecificat5.get('mappings')) !== null && _transformsSpecificat4 !== void 0 ? _transformsSpecificat4 : {};
      const registryElasticsearch = {
        'index_template.settings': destinationIndexTemplate.template.settings,
        'index_template.mappings': destinationIndexTemplate.template.mappings
      };
      const componentTemplates = (0, _install.buildComponentTemplates)({
        mappings: customMappings,
        templateName: destinationIndexTemplate.installationName,
        registryElasticsearch,
        packageName: installablePackage.name,
        defaultSettings: {}
      });
      if (destinationIndexTemplate || customMappings) {
        var _transformsSpecificat6;
        return (0, _install.installComponentAndIndexTemplateForDataStream)({
          esClient,
          logger,
          componentTemplates,
          indexTemplate: {
            templateName: destinationIndexTemplate.installationName,
            // @ts-expect-error We don't need to pass data_stream property here
            // as this template is applied to only an index and not a data stream
            indexTemplate: {
              template: {
                settings: undefined,
                mappings: undefined
              },
              priority: DEFAULT_TRANSFORM_TEMPLATES_PRIORITY,
              index_patterns: [(_transformsSpecificat6 = transformsSpecifications.get(destinationIndexTemplate.transformModuleId)) === null || _transformsSpecificat6 === void 0 ? void 0 : _transformsSpecificat6.get('destinationIndex').index],
              _meta: destinationIndexTemplate._meta,
              composed_of: Object.keys(componentTemplates)
            }
          }
        });
      }
    }).filter(p => p !== undefined));

    // create destination indices
    await Promise.all(transforms.map(async transform => {
      const index = transform.content.dest.index;
      const pipelineId = transform.content.dest.pipeline;
      try {
        await (0, _retry.retryTransientEsErrors)(() => esClient.indices.create({
          index,
          ...(pipelineId ? {
            settings: {
              default_pipeline: pipelineId
            }
          } : {})
        }, {
          ignore: [400]
        }), {
          logger
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }));

    // create & optionally start transforms
    const transformsPromises = transforms.map(async transform => {
      var _transformsSpecificat7;
      return handleTransformInstall({
        esClient,
        logger,
        transform,
        startTransform: (_transformsSpecificat7 = transformsSpecifications.get(transform.transformModuleId)) === null || _transformsSpecificat7 === void 0 ? void 0 : _transformsSpecificat7.get('start')
      });
    });
    installedTransforms = await Promise.all(transformsPromises).then(results => results.flat());
  }
  return {
    installedTransforms,
    esReferences
  };
};
const installTransforms = async (installablePackage, paths, esClient, savedObjectsClient, logger, esReferences) => {
  var _ref2, _esReferences;
  const transformPaths = paths.filter(path => isTransform(path));
  const installation = await (0, _packages.getInstallation)({
    savedObjectsClient,
    pkgName: installablePackage.name
  });
  esReferences = (_ref2 = (_esReferences = esReferences) !== null && _esReferences !== void 0 ? _esReferences : installation === null || installation === void 0 ? void 0 : installation.installed_es) !== null && _ref2 !== void 0 ? _ref2 : [];
  let previousInstalledTransformEsAssets = [];
  if (installation) {
    previousInstalledTransformEsAssets = installation.installed_es.filter(({
      type,
      id
    }) => type === _models.ElasticsearchAssetType.transform);
    if (previousInstalledTransformEsAssets.length) {
      logger.debug(`Found previous transform references:\n ${JSON.stringify(previousInstalledTransformEsAssets)}`);
    }
  }

  // delete all previous transform
  await (0, _remove.deleteTransforms)(esClient, previousInstalledTransformEsAssets.map(asset => asset.id));
  const installNameSuffix = `${installablePackage.version}`;

  // If package contains legacy transform specifications (i.e. with json instead of yml)
  if (transformPaths.some(p => p.endsWith('.json')) || transformPaths.length === 0) {
    return await installLegacyTransformsAssets(installablePackage, installNameSuffix, transformPaths, esClient, savedObjectsClient, logger, esReferences, previousInstalledTransformEsAssets);
  }
  return await installTransformsAssets(installablePackage, installNameSuffix, transformPaths, esClient, savedObjectsClient, logger, esReferences, previousInstalledTransformEsAssets);
};
exports.installTransforms = installTransforms;
const isTransform = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return !path.endsWith('/') && pathParts.type === _models.ElasticsearchAssetType.transform;
};
exports.isTransform = isTransform;
async function handleTransformInstall({
  esClient,
  logger,
  transform,
  startTransform
}) {
  try {
    await (0, _retry.retryTransientEsErrors)(() =>
    // defer validation on put if the source index is not available
    esClient.transform.putTransform({
      transform_id: transform.installationName,
      defer_validation: true,
      body: transform.content
    }), {
      logger
    });
  } catch (err) {
    var _err$body, _err$body$error;
    // swallow the error if the transform already exists.
    const isAlreadyExistError = err instanceof _elasticsearch.errors.ResponseError && (err === null || err === void 0 ? void 0 : (_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) === 'resource_already_exists_exception';
    if (!isAlreadyExistError) {
      throw err;
    }
  }

  // start transform by default if not set in yml file
  // else, respect the setting
  if (startTransform === undefined || startTransform === true) {
    await esClient.transform.startTransform({
      transform_id: transform.installationName
    }, {
      ignore: [409]
    });
    logger.debug(`Started transform: ${transform.installationName}`);
  }
  return {
    id: transform.installationName,
    type: _models.ElasticsearchAssetType.transform
  };
}
const getLegacyTransformNameForInstallation = (installablePackage, path, suffix) => {
  var _pathPaths$pop;
  const pathPaths = path.split('/');
  const filename = pathPaths === null || pathPaths === void 0 ? void 0 : (_pathPaths$pop = pathPaths.pop()) === null || _pathPaths$pop === void 0 ? void 0 : _pathPaths$pop.split('.')[0];
  const folderName = pathPaths === null || pathPaths === void 0 ? void 0 : pathPaths.pop();
  return `${installablePackage.name}.${folderName}-${filename}-${suffix}`;
};
const getTransformAssetNameForInstallation = (installablePackage, transformModuleId, suffix) => {
  return `logs-${installablePackage.name}.${transformModuleId}${suffix ? '-' + suffix : ''}`;
};
const getTransformFolderAndFileNames = (installablePackage, path) => {
  var _pathPaths$pop2, _transformModuleId;
  const pathPaths = path.split('/');
  const fileName = pathPaths === null || pathPaths === void 0 ? void 0 : (_pathPaths$pop2 = pathPaths.pop()) === null || _pathPaths$pop2 === void 0 ? void 0 : _pathPaths$pop2.split('.')[0];
  let transformModuleId = pathPaths === null || pathPaths === void 0 ? void 0 : pathPaths.pop();

  // If fields.yml is located inside a directory called 'fields' (e.g. {exampleFolder}/fields/fields.yml)
  // We need to go one level up to get the real folder name
  if (transformModuleId === 'fields') {
    transformModuleId = pathPaths === null || pathPaths === void 0 ? void 0 : pathPaths.pop();
  }
  return {
    fileName: fileName !== null && fileName !== void 0 ? fileName : '',
    transformModuleId: (_transformModuleId = transformModuleId) !== null && _transformModuleId !== void 0 ? _transformModuleId : ''
  };
};