"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateESIndexPatterns = generateESIndexPatterns;
exports.generateMappings = generateMappings;
exports.generateTemplateIndexPattern = generateTemplateIndexPattern;
exports.generateTemplateName = generateTemplateName;
exports.getTemplate = getTemplate;
exports.getTemplatePriority = getTemplatePriority;
exports.updateCurrentWriteIndices = void 0;
var _ = require("../../..");
var _services = require("../../../../../common/services");
var _constants = require("../../../../constants");
var _meta2 = require("../meta");
var _retry = require("../retry");
var _mappings = require("./mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_IGNORE_ABOVE = 1024;

// see discussion in https://github.com/elastic/kibana/issues/88307
const DEFAULT_TEMPLATE_PRIORITY = 200;
const DATASET_IS_PREFIX_TEMPLATE_PRIORITY = 150;
const META_PROP_KEYS = ['metric_type', 'unit'];

/**
 * getTemplate retrieves the default template but overwrites the index pattern with the given value.
 *
 * @param indexPattern String with the index pattern
 */
function getTemplate({
  templateIndexPattern,
  packageName,
  composedOfTemplates,
  templatePriority,
  hidden
}) {
  var _appContextService$ge;
  const template = getBaseTemplate(templateIndexPattern, packageName, composedOfTemplates, templatePriority, hidden);
  if (template.template.settings.index.final_pipeline) {
    throw new Error(`Error template for ${templateIndexPattern} contains a final_pipeline`);
  }
  template.composed_of = [...(template.composed_of || []), _constants.FLEET_GLOBALS_COMPONENT_TEMPLATE_NAME, ...((_appContextService$ge = _.appContextService.getConfig()) !== null && _appContextService$ge !== void 0 && _appContextService$ge.agentIdVerificationEnabled ? [_constants.FLEET_AGENT_ID_VERIFY_COMPONENT_TEMPLATE_NAME] : [])];
  return template;
}

/**
 * Generate mapping takes the given nested fields array and creates the Elasticsearch
 * mapping properties out of it.
 *
 * This assumes that all fields with dotted.names have been expanded in a previous step.
 *
 * @param fields
 */
function generateMappings(fields) {
  const dynamicTemplates = [];
  const dynamicTemplateNames = new Set();
  const {
    properties
  } = _generateMappings(fields, {
    addDynamicMapping: dynamicMapping => {
      const name = dynamicMapping.path;
      if (dynamicTemplateNames.has(name)) {
        return;
      }
      const dynamicTemplate = {
        mapping: dynamicMapping.properties
      };
      if (dynamicMapping.matchingType) {
        dynamicTemplate.match_mapping_type = dynamicMapping.matchingType;
      }
      if (dynamicMapping.pathMatch) {
        dynamicTemplate.path_match = dynamicMapping.pathMatch;
      }
      dynamicTemplateNames.add(name);
      dynamicTemplates.push({
        [dynamicMapping.path]: dynamicTemplate
      });
    }
  });
  return dynamicTemplates.length ? {
    properties,
    dynamic_templates: dynamicTemplates
  } : {
    properties
  };
}

/**
 * Generate mapping takes the given nested fields array and creates the Elasticsearch
 * mapping properties out of it.
 *
 * This assumes that all fields with dotted.names have been expanded in a previous step.
 *
 * @param fields
 */
function _generateMappings(fields, ctx) {
  let hasNonDynamicTemplateMappings = false;
  const props = {};
  // TODO: this can happen when the fields property in fields.yml is present but empty
  // Maybe validation should be moved to fields/field.ts
  if (fields) {
    fields.forEach(field => {
      var _field$object_type_ma, _field$object_type_ma2, _field$object_type_ma3, _field$object_type_ma4;
      // If type is not defined, assume keyword
      const type = field.type || 'keyword';
      if (type === 'object' && field.object_type) {
        const path = ctx.groupFieldName ? `${ctx.groupFieldName}.${field.name}` : field.name;
        const pathMatch = path.includes('*') ? path : `${path}.*`;
        let dynProperties = (0, _mappings.getDefaultProperties)(field);
        let matchingType;
        switch (field.object_type) {
          case 'histogram':
            dynProperties = (0, _mappings.histogram)(field);
            matchingType = (_field$object_type_ma = field.object_type_mapping_type) !== null && _field$object_type_ma !== void 0 ? _field$object_type_ma : '*';
            break;
          case 'text':
            dynProperties.type = field.object_type;
            matchingType = (_field$object_type_ma2 = field.object_type_mapping_type) !== null && _field$object_type_ma2 !== void 0 ? _field$object_type_ma2 : 'string';
            break;
          case 'keyword':
            dynProperties.type = field.object_type;
            matchingType = (_field$object_type_ma3 = field.object_type_mapping_type) !== null && _field$object_type_ma3 !== void 0 ? _field$object_type_ma3 : 'string';
            break;
          case 'byte':
          case 'double':
          case 'float':
          case 'long':
          case 'short':
          case 'boolean':
            dynProperties = {
              type: field.object_type
            };
            matchingType = (_field$object_type_ma4 = field.object_type_mapping_type) !== null && _field$object_type_ma4 !== void 0 ? _field$object_type_ma4 : field.object_type;
          default:
            break;
        }
        if (dynProperties && matchingType) {
          ctx.addDynamicMapping({
            path,
            pathMatch,
            matchingType,
            properties: dynProperties
          });
        }
      } else {
        let fieldProps = (0, _mappings.getDefaultProperties)(field);
        switch (type) {
          case 'group':
            const mappings = _generateMappings(field.fields, {
              ...ctx,
              groupFieldName: ctx.groupFieldName ? `${ctx.groupFieldName}.${field.name}` : field.name
            });
            if (!mappings.hasNonDynamicTemplateMappings) {
              return;
            }
            fieldProps = {
              properties: mappings.properties,
              ...generateDynamicAndEnabled(field)
            };
            break;
          case 'group-nested':
            fieldProps = {
              properties: _generateMappings(field.fields, {
                ...ctx,
                groupFieldName: ctx.groupFieldName ? `${ctx.groupFieldName}.${field.name}` : field.name
              }).properties,
              ...generateNestedProps(field),
              type: 'nested'
            };
            break;
          case 'integer':
            fieldProps.type = 'long';
            break;
          case 'scaled_float':
            fieldProps = (0, _mappings.scaledFloat)(field);
            break;
          case 'text':
            const textMapping = generateTextMapping(field);
            fieldProps = {
              ...fieldProps,
              ...textMapping,
              type: 'text'
            };
            if (field.multi_fields) {
              fieldProps.fields = generateMultiFields(field.multi_fields);
            }
            break;
          case 'object':
            fieldProps = {
              ...fieldProps,
              ...generateDynamicAndEnabled(field),
              type: 'object'
            };
            break;
          case 'keyword':
            fieldProps = (0, _mappings.keyword)(field);
            if (field.multi_fields) {
              fieldProps.fields = generateMultiFields(field.multi_fields);
            }
            break;
          case 'wildcard':
            const wildcardMapping = generateWildcardMapping(field);
            fieldProps = {
              ...fieldProps,
              ...wildcardMapping,
              type: 'wildcard'
            };
            if (field.multi_fields) {
              fieldProps.fields = generateMultiFields(field.multi_fields);
            }
            break;
          case 'constant_keyword':
            fieldProps.type = field.type;
            if (field.value) {
              fieldProps.value = field.value;
            }
            break;
          case 'nested':
            fieldProps = {
              ...fieldProps,
              ...generateNestedProps(field),
              type: 'nested'
            };
            break;
          case 'array':
            // this assumes array fields were validated in an earlier step
            // adding an array field with no object_type would result in an error
            // when the template is added to ES
            if (field.object_type) {
              fieldProps.type = field.object_type;
            }
            break;
          case 'alias':
            // this assumes alias fields were validated in an earlier step
            // adding a path to a field that doesn't exist would result in an error
            // when the template is added to ES.
            fieldProps.type = 'alias';
            fieldProps.path = field.path;
            break;
          default:
            fieldProps.type = type;
        }
        const fieldHasMetaProps = META_PROP_KEYS.some(key => key in field);
        if (fieldHasMetaProps) {
          switch (type) {
            case 'group':
            case 'group-nested':
              break;
            default:
              {
                const meta = {};
                if ('metric_type' in field) Reflect.set(meta, 'metric_type', field.metric_type);
                if ('unit' in field) Reflect.set(meta, 'unit', field.unit);
                fieldProps.meta = meta;
              }
          }
        }
        props[field.name] = fieldProps;
        hasNonDynamicTemplateMappings = true;
      }
    });
  }
  return {
    properties: props,
    hasNonDynamicTemplateMappings
  };
}
function generateDynamicAndEnabled(field) {
  const props = {};
  if (field.hasOwnProperty('enabled')) {
    props.enabled = field.enabled;
  }
  if (field.hasOwnProperty('dynamic')) {
    props.dynamic = field.dynamic;
  }
  return props;
}
function generateNestedProps(field) {
  const props = generateDynamicAndEnabled(field);
  if (field.hasOwnProperty('include_in_parent')) {
    props.include_in_parent = field.include_in_parent;
  }
  if (field.hasOwnProperty('include_in_root')) {
    props.include_in_root = field.include_in_root;
  }
  return props;
}
function generateMultiFields(fields) {
  const multiFields = {};
  if (fields) {
    fields.forEach(f => {
      const type = f.type;
      switch (type) {
        case 'text':
          multiFields[f.name] = {
            ...generateTextMapping(f),
            type: f.type
          };
          break;
        case 'keyword':
          multiFields[f.name] = (0, _mappings.keyword)(f);
          break;
        case 'long':
        case 'double':
        case 'match_only_text':
          multiFields[f.name] = {
            type: f.type
          };
          break;
      }
    });
  }
  return multiFields;
}
function generateTextMapping(field) {
  const mapping = {};
  if (field.analyzer) {
    mapping.analyzer = field.analyzer;
  }
  if (field.search_analyzer) {
    mapping.search_analyzer = field.search_analyzer;
  }
  return mapping;
}
function generateWildcardMapping(field) {
  const mapping = {
    ignore_above: DEFAULT_IGNORE_ABOVE
  };
  if (field.null_value) {
    mapping.null_value = field.null_value;
  }
  if (field.ignore_above) {
    mapping.ignore_above = field.ignore_above;
  }
  return mapping;
}

/**
 * Generates the template name out of the given information
 */
function generateTemplateName(dataStream) {
  return (0, _services.getRegistryDataStreamAssetBaseName)(dataStream);
}

/**
 * Given a data stream name, return the indexTemplate name
 */
function dataStreamNameToIndexTemplateName(dataStreamName) {
  const [type, dataset] = dataStreamName.split('-'); // ignore namespace at the end
  return [type, dataset].join('-');
}
function generateTemplateIndexPattern(dataStream) {
  // undefined or explicitly set to false
  // See also https://github.com/elastic/package-spec/pull/102
  if (!dataStream.dataset_is_prefix) {
    return (0, _services.getRegistryDataStreamAssetBaseName)(dataStream) + '-*';
  } else {
    return (0, _services.getRegistryDataStreamAssetBaseName)(dataStream) + '.*-*';
  }
}

// Template priorities are discussed in https://github.com/elastic/kibana/issues/88307
// See also https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html
//
// Built-in templates like logs-*-* and metrics-*-* have priority 100
//
// EPM generated templates for data streams have priority 200 (DEFAULT_TEMPLATE_PRIORITY)
//
// EPM generated templates for data streams with dataset_is_prefix: true have priority 150 (DATASET_IS_PREFIX_TEMPLATE_PRIORITY)

function getTemplatePriority(dataStream) {
  // undefined or explicitly set to false
  // See also https://github.com/elastic/package-spec/pull/102
  if (!dataStream.dataset_is_prefix) {
    return DEFAULT_TEMPLATE_PRIORITY;
  } else {
    return DATASET_IS_PREFIX_TEMPLATE_PRIORITY;
  }
}

/**
 * Returns a map of the data stream path fields to elasticsearch index pattern.
 * @param dataStreams an array of RegistryDataStream objects
 */
function generateESIndexPatterns(dataStreams) {
  if (!dataStreams) {
    return {};
  }
  const patterns = {};
  for (const dataStream of dataStreams) {
    patterns[dataStream.path] = generateTemplateIndexPattern(dataStream);
  }
  return patterns;
}
const flattenFieldsToNameAndType = (fields, path = '') => {
  let newFields = [];
  fields.forEach(field => {
    const fieldName = path ? `${path}.${field.name}` : field.name;
    newFields.push({
      name: fieldName,
      type: field.type
    });
    if (field.fields && field.fields.length) {
      newFields = newFields.concat(flattenFieldsToNameAndType(field.fields, fieldName));
    }
  });
  return newFields;
};
function getBaseTemplate(templateIndexPattern, packageName, composedOfTemplates, templatePriority, hidden) {
  const _meta = (0, _meta2.getESAssetMetadata)({
    packageName
  });
  return {
    priority: templatePriority,
    index_patterns: [templateIndexPattern],
    template: {
      settings: {
        index: {}
      },
      mappings: {
        _meta
      }
    },
    data_stream: {
      hidden
    },
    composed_of: composedOfTemplates,
    _meta
  };
}
const updateCurrentWriteIndices = async (esClient, logger, templates) => {
  if (!templates.length) return;
  const allIndices = await queryDataStreamsFromTemplates(esClient, templates);
  const allUpdatablesIndices = allIndices.filter(indice => {
    if (indice.replicated) {
      logger.warn(`Datastream ${indice.dataStreamName} cannot be updated because this is a replicated datastream.`);
      return false;
    }
    return true;
  });
  if (!allUpdatablesIndices.length) return;
  return updateAllDataStreams(allUpdatablesIndices, esClient, logger);
};
exports.updateCurrentWriteIndices = updateCurrentWriteIndices;
function isCurrentDataStream(item) {
  return item !== undefined;
}
const queryDataStreamsFromTemplates = async (esClient, templates) => {
  const dataStreamPromises = templates.map(template => {
    return getDataStreams(esClient, template);
  });
  const dataStreamObjects = await Promise.all(dataStreamPromises);
  return dataStreamObjects.filter(isCurrentDataStream).flat();
};
const getDataStreams = async (esClient, template) => {
  const {
    indexTemplate
  } = template;
  const body = await esClient.indices.getDataStream({
    name: indexTemplate.index_patterns.join(',')
  });
  const dataStreams = body.data_streams;
  if (!dataStreams.length) return;
  return dataStreams.map(dataStream => ({
    dataStreamName: dataStream.name,
    replicated: dataStream.replicated,
    indexTemplate
  }));
};
const rolloverDataStream = (dataStreamName, esClient) => {
  try {
    // Do no wrap rollovers in retryTransientEsErrors since it is not idempotent
    return esClient.indices.rollover({
      alias: dataStreamName
    });
  } catch (error) {
    throw new Error(`cannot rollover data stream [${dataStreamName}] due to error: ${error}`);
  }
};
const updateAllDataStreams = async (indexNameWithTemplates, esClient, logger) => {
  const updatedataStreamPromises = indexNameWithTemplates.map(templateEntry => {
    return updateExistingDataStream({
      esClient,
      logger,
      dataStreamName: templateEntry.dataStreamName
    });
  });
  await Promise.all(updatedataStreamPromises);
};
const updateExistingDataStream = async ({
  dataStreamName,
  esClient,
  logger
}) => {
  var _settings, _settings$index;
  let settings;
  try {
    const simulateResult = await (0, _retry.retryTransientEsErrors)(() => esClient.indices.simulateTemplate({
      name: dataStreamNameToIndexTemplateName(dataStreamName)
    }));
    settings = simulateResult.template.settings;
    const mappings = simulateResult.template.mappings;
    // for now, remove from object so as not to update stream or data stream properties of the index until type and name
    // are added in https://github.com/elastic/kibana/issues/66551.  namespace value we will continue
    // to skip updating and assume the value in the index mapping is correct
    if (mappings && mappings.properties) {
      delete mappings.properties.stream;
      delete mappings.properties.data_stream;
    }
    await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putMapping({
      index: dataStreamName,
      body: mappings || {},
      write_index_only: true
    }), {
      logger
    });
    // if update fails, rollover data stream
  } catch (err) {
    await rolloverDataStream(dataStreamName, esClient);
    return;
  }
  // update settings after mappings was successful to ensure
  // pointing to the new pipeline is safe
  // for now, only update the pipeline
  if (!((_settings = settings) !== null && _settings !== void 0 && (_settings$index = _settings.index) !== null && _settings$index !== void 0 && _settings$index.default_pipeline)) return;
  try {
    await (0, _retry.retryTransientEsErrors)(() => esClient.indices.putSettings({
      index: dataStreamName,
      body: {
        default_pipeline: settings.index.default_pipeline
      }
    }), {
      logger
    });
  } catch (err) {
    throw new Error(`could not update index template settings for ${dataStreamName}`);
  }
};