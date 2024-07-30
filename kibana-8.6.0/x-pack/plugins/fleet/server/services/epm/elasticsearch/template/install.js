"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildComponentTemplates = buildComponentTemplates;
exports.ensureAliasHasWriteIndex = ensureAliasHasWriteIndex;
exports.ensureComponentTemplate = ensureComponentTemplate;
exports.ensureDefaultComponentTemplates = ensureDefaultComponentTemplates;
exports.ensureFileUploadWriteIndices = ensureFileUploadWriteIndices;
exports.getAllTemplateRefs = getAllTemplateRefs;
exports.installComponentAndIndexTemplateForDataStream = installComponentAndIndexTemplateForDataStream;
exports.prepareTemplate = prepareTemplate;
exports.prepareToInstallTemplates = void 0;
var _lodash = require("lodash");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _constants = require("../../../../../common/constants");
var _types = require("../../../../types");
var _services = require("../../../../../common/services");
var _field = require("../../fields/field");
var _archive = require("../../archive");
var _constants2 = require("../../../../constants");
var _meta2 = require("../meta");
var _retry = require("../retry");
var _template = require("./template");
var _default_settings = require("./default_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FLEET_COMPONENT_TEMPLATE_NAMES = _constants2.FLEET_COMPONENT_TEMPLATES.map(tmpl => tmpl.name);
const prepareToInstallTemplates = (installablePackage, paths, esReferences) => {
  // remove package installation's references to index templates
  const assetsToRemove = esReferences.filter(({
    type
  }) => type === _types.ElasticsearchAssetType.indexTemplate || type === _types.ElasticsearchAssetType.componentTemplate);

  // build templates per data stream from yml files
  const dataStreams = installablePackage.data_streams;
  if (!dataStreams) return {
    assetsToAdd: [],
    assetsToRemove,
    install: () => Promise.resolve([])
  };
  const templates = dataStreams.map(dataStream => prepareTemplate({
    pkg: installablePackage,
    dataStream
  }));
  const assetsToAdd = getAllTemplateRefs(templates.map(template => template.indexTemplate));
  return {
    assetsToAdd,
    assetsToRemove,
    install: async (esClient, logger) => {
      // install any pre-built index template assets,
      // atm, this is only the base package's global index templates
      // Install component templates first, as they are used by the index templates
      await installPreBuiltComponentTemplates(paths, esClient, logger);
      await installPreBuiltTemplates(paths, esClient, logger);
      await Promise.all(templates.map(template => installComponentAndIndexTemplateForDataStream({
        esClient,
        logger,
        componentTemplates: template.componentTemplates,
        indexTemplate: template.indexTemplate
      })));
      return templates.map(template => template.indexTemplate);
    }
  };
};
exports.prepareToInstallTemplates = prepareToInstallTemplates;
const installPreBuiltTemplates = async (paths, esClient, logger) => {
  const templatePaths = paths.filter(path => isTemplate(path));
  const templateInstallPromises = templatePaths.map(async path => {
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const templateName = file.substr(0, file.lastIndexOf('.'));
    const content = JSON.parse((0, _archive.getAsset)(path).toString('utf8'));
    const esClientParams = {
      name: templateName,
      body: content
    };
    const esClientRequestOptions = {
      ignore: [404]
    };
    if (content.hasOwnProperty('template') || content.hasOwnProperty('composed_of')) {
      // Template is v2
      return (0, _retry.retryTransientEsErrors)(() => esClient.indices.putIndexTemplate(esClientParams, esClientRequestOptions), {
        logger
      });
    } else {
      // template is V1
      return (0, _retry.retryTransientEsErrors)(() => esClient.indices.putTemplate(esClientParams, esClientRequestOptions), {
        logger
      });
    }
  });
  try {
    return await Promise.all(templateInstallPromises);
  } catch (e) {
    throw new _boom.default.Boom(`Error installing prebuilt index templates ${e.message}`, {
      statusCode: 400
    });
  }
};
const installPreBuiltComponentTemplates = async (paths, esClient, logger) => {
  const templatePaths = paths.filter(path => isComponentTemplate(path));
  const templateInstallPromises = templatePaths.map(async path => {
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const templateName = file.substr(0, file.lastIndexOf('.'));
    const content = JSON.parse((0, _archive.getAsset)(path).toString('utf8'));
    const esClientParams = {
      name: templateName,
      body: content
    };
    return (0, _retry.retryTransientEsErrors)(() => esClient.cluster.putComponentTemplate(esClientParams, {
      ignore: [404]
    }), {
      logger
    });
  });
  try {
    return await Promise.all(templateInstallPromises);
  } catch (e) {
    throw new _boom.default.Boom(`Error installing prebuilt component templates ${e.message}`, {
      statusCode: 400
    });
  }
};
const isTemplate = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.indexTemplate;
};
const isComponentTemplate = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.componentTemplate;
};

/**
 * installComponentAndIndexTemplateForDataStream installs one template for each data stream
 *
 * The template is currently loaded with the pkgkey-package-data_stream
 */

async function installComponentAndIndexTemplateForDataStream({
  esClient,
  logger,
  componentTemplates,
  indexTemplate
}) {
  await installDataStreamComponentTemplates({
    esClient,
    logger,
    componentTemplates
  });
  await installTemplate({
    esClient,
    logger,
    template: indexTemplate
  });
}
function putComponentTemplate(esClient, logger, params) {
  const {
    name,
    body,
    create = false
  } = params;
  return {
    clusterPromise: (0, _retry.retryTransientEsErrors)(() => esClient.cluster.putComponentTemplate({
      name,
      body,
      create
    }, {
      ignore: [404]
    }), {
      logger
    }),
    name
  };
}
const isUserSettingsTemplate = name => name.endsWith(_constants2.USER_SETTINGS_TEMPLATE_SUFFIX);
function buildComponentTemplates(params) {
  var _registryElasticsearc, _registryElasticsearc2, _indexTemplateMapping, _mappings$dynamic_tem, _indexTemplateMapping2, _templateSettings$map;
  const {
    templateName,
    registryElasticsearch,
    packageName,
    defaultSettings,
    mappings,
    pipelineName
  } = params;
  const packageTemplateName = `${templateName}${_constants2.PACKAGE_TEMPLATE_SUFFIX}`;
  const userSettingsTemplateName = `${templateName}${_constants2.USER_SETTINGS_TEMPLATE_SUFFIX}`;
  const templatesMap = {};
  const _meta = (0, _meta2.getESAssetMetadata)({
    packageName
  });
  const indexTemplateSettings = (_registryElasticsearc = registryElasticsearch === null || registryElasticsearch === void 0 ? void 0 : registryElasticsearch['index_template.settings']) !== null && _registryElasticsearc !== void 0 ? _registryElasticsearc : {};
  const templateSettings = (0, _lodash.merge)(defaultSettings, indexTemplateSettings);
  const indexTemplateMappings = (_registryElasticsearc2 = registryElasticsearch === null || registryElasticsearch === void 0 ? void 0 : registryElasticsearch['index_template.mappings']) !== null && _registryElasticsearc2 !== void 0 ? _registryElasticsearc2 : {};
  const mappingsProperties = (0, _lodash.merge)(mappings.properties, (_indexTemplateMapping = indexTemplateMappings.properties) !== null && _indexTemplateMapping !== void 0 ? _indexTemplateMapping : {});
  const mappingsDynamicTemplates = (0, _lodash.uniqBy)((0, _lodash.concat)((_mappings$dynamic_tem = mappings.dynamic_templates) !== null && _mappings$dynamic_tem !== void 0 ? _mappings$dynamic_tem : [], (_indexTemplateMapping2 = indexTemplateMappings.dynamic_templates) !== null && _indexTemplateMapping2 !== void 0 ? _indexTemplateMapping2 : []), dynampingTemplate => Object.keys(dynampingTemplate)[0]);
  templatesMap[packageTemplateName] = {
    template: {
      settings: {
        ...templateSettings,
        index: {
          ...templateSettings.index,
          ...(pipelineName ? {
            default_pipeline: pipelineName
          } : {}),
          mapping: {
            ...(templateSettings === null || templateSettings === void 0 ? void 0 : templateSettings.mapping),
            total_fields: {
              ...(templateSettings === null || templateSettings === void 0 ? void 0 : (_templateSettings$map = templateSettings.mapping) === null || _templateSettings$map === void 0 ? void 0 : _templateSettings$map.total_fields),
              limit: '10000'
            }
          }
        }
      },
      mappings: {
        properties: mappingsProperties,
        dynamic_templates: mappingsDynamicTemplates.length ? mappingsDynamicTemplates : undefined,
        ...(0, _lodash.omit)(indexTemplateMappings, 'properties', 'dynamic_templates')
      }
    },
    _meta
  };

  // return empty/stub template
  templatesMap[userSettingsTemplateName] = {
    template: {
      settings: {}
    },
    _meta
  };
  return templatesMap;
}
async function installDataStreamComponentTemplates({
  esClient,
  logger,
  componentTemplates
}) {
  // TODO: Check return values for errors
  await Promise.all(Object.entries(componentTemplates).map(async ([name, body]) => {
    if (isUserSettingsTemplate(name)) {
      try {
        // Attempt to create custom component templates, ignore if they already exist
        const {
          clusterPromise
        } = putComponentTemplate(esClient, logger, {
          body,
          name,
          create: true
        });
        return await clusterPromise;
      } catch (e) {
        var _e$body, _e$body$error;
        if ((e === null || e === void 0 ? void 0 : e.statusCode) === 400 && (_e$body = e.body) !== null && _e$body !== void 0 && (_e$body$error = _e$body.error) !== null && _e$body$error !== void 0 && _e$body$error.reason.includes('already exists')) {
          // ignore
        } else {
          throw e;
        }
      }
    } else {
      const {
        clusterPromise
      } = putComponentTemplate(esClient, logger, {
        body,
        name
      });
      return clusterPromise;
    }
  }));
}
async function ensureDefaultComponentTemplates(esClient, logger) {
  return Promise.all(_constants2.FLEET_COMPONENT_TEMPLATES.map(({
    name,
    body
  }) => ensureComponentTemplate(esClient, logger, name, body)));
}

/*
 * Given a list of integration names, if the integrations support file upload
 * then ensure that the alias has a matching write index, as we use "plain" indices
 * not data streams.
 * e.g .fleet-file-data-agent must have .fleet-file-data-agent-00001 as the write index
 * before files can be uploaded.
 */
async function ensureFileUploadWriteIndices(opts) {
  const {
    esClient,
    logger,
    integrationNames
  } = opts;
  const integrationsWithFileUpload = integrationNames.filter(integration => _constants.FILE_STORAGE_INTEGRATION_NAMES.includes(integration));
  if (!integrationsWithFileUpload.length) return [];
  const ensure = aliasName => ensureAliasHasWriteIndex({
    esClient,
    logger,
    aliasName,
    writeIndexName: (0, _services.getFileWriteIndexName)(aliasName),
    body: (0, _services.getFileStorageWriteIndexBody)(aliasName)
  });
  return Promise.all(integrationsWithFileUpload.flatMap(integrationName => {
    const indexName = _constants.FILE_STORAGE_INTEGRATION_INDEX_NAMES[integrationName];
    return [ensure((0, _services.getFileDataIndexName)(indexName)), ensure((0, _services.getFileMetadataIndexName)(indexName))];
  }));
}
async function ensureComponentTemplate(esClient, logger, name, body) {
  var _getTemplateRes$compo;
  const getTemplateRes = await (0, _retry.retryTransientEsErrors)(() => esClient.cluster.getComponentTemplate({
    name
  }, {
    ignore: [404]
  }), {
    logger
  });
  const existingTemplate = getTemplateRes === null || getTemplateRes === void 0 ? void 0 : (_getTemplateRes$compo = getTemplateRes.component_templates) === null || _getTemplateRes$compo === void 0 ? void 0 : _getTemplateRes$compo[0];
  if (!existingTemplate) {
    await putComponentTemplate(esClient, logger, {
      name,
      body
    }).clusterPromise;
  }
  return {
    isCreated: !existingTemplate
  };
}
async function ensureAliasHasWriteIndex(opts) {
  const {
    esClient,
    logger,
    aliasName,
    writeIndexName,
    body
  } = opts;
  const existingIndex = await (0, _retry.retryTransientEsErrors)(() => esClient.indices.exists({
    index: [aliasName]
  }, {
    ignore: [404]
  }), {
    logger
  });
  if (!existingIndex) {
    await (0, _retry.retryTransientEsErrors)(() => esClient.indices.create({
      index: writeIndexName,
      ...body
    }, {
      ignore: [404]
    }), {
      logger
    });
  }
}
function prepareTemplate({
  pkg,
  dataStream
}) {
  const {
    name: packageName,
    version: packageVersion
  } = pkg;
  const fields = (0, _field.loadFieldsFromYaml)(pkg, dataStream.path);
  const validFields = (0, _field.processFields)(fields);
  const mappings = (0, _template.generateMappings)(validFields);
  const templateName = (0, _template.generateTemplateName)(dataStream);
  const templateIndexPattern = (0, _template.generateTemplateIndexPattern)(dataStream);
  const templatePriority = (0, _template.getTemplatePriority)(dataStream);
  const pipelineName = (0, _services.getPipelineNameForDatastream)({
    dataStream,
    packageVersion
  });
  const defaultSettings = (0, _default_settings.buildDefaultSettings)({
    templateName,
    packageName,
    fields: validFields,
    type: dataStream.type,
    ilmPolicy: dataStream.ilm_policy
  });
  const componentTemplates = buildComponentTemplates({
    defaultSettings,
    mappings,
    packageName,
    templateName,
    pipelineName,
    registryElasticsearch: dataStream.elasticsearch
  });
  const template = (0, _template.getTemplate)({
    templateIndexPattern,
    packageName,
    composedOfTemplates: Object.keys(componentTemplates),
    templatePriority,
    hidden: dataStream.hidden
  });
  return {
    componentTemplates,
    indexTemplate: {
      templateName,
      indexTemplate: template
    }
  };
}
async function installTemplate({
  esClient,
  logger,
  template
}) {
  // TODO: Check return values for errors
  const esClientParams = {
    name: template.templateName,
    body: template.indexTemplate
  };
  await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putIndexTemplate(esClientParams, {
    ignore: [404]
  }), {
    logger
  });
}
function getAllTemplateRefs(installedTemplates) {
  return installedTemplates.flatMap(installedTemplate => {
    const indexTemplates = [{
      id: installedTemplate.templateName,
      type: _types.ElasticsearchAssetType.indexTemplate
    }];
    const componentTemplates = installedTemplate.indexTemplate.composed_of
    // Filter global component template shared between integrations
    .filter(componentTemplateId => !FLEET_COMPONENT_TEMPLATE_NAMES.includes(componentTemplateId)).map(componentTemplateId => ({
      id: componentTemplateId,
      type: _types.ElasticsearchAssetType.componentTemplate
    }));
    return indexTemplates.concat(componentTemplates);
  });
}