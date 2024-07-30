"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDsIndexPattern = getDsIndexPattern;
exports.getElasticsearchDataset = void 0;
exports.getIndexPatterns = getIndexPatterns;
exports.getKibanaDataset = void 0;
exports.getLegacyIndexPattern = getLegacyIndexPattern;
exports.getLogstashDataset = void 0;
var _ccs_utils = require("../../../common/ccs_utils");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// calling legacy index patterns those that are .monitoring
function getLegacyIndexPattern({
  moduleType,
  ecsLegacyOnly = false,
  config,
  ccs
}) {
  let indexPattern = '';
  switch (moduleType) {
    case 'elasticsearch':
      // there may be cases where we only want the legacy ecs version index pattern (>=8.0)
      indexPattern = ecsLegacyOnly ? _constants.INDEX_PATTERN_ELASTICSEARCH_ECS : _constants.INDEX_PATTERN_ELASTICSEARCH;
      break;
    case 'kibana':
      indexPattern = _constants.INDEX_PATTERN_KIBANA;
      break;
    case 'logstash':
      indexPattern = _constants.INDEX_PATTERN_LOGSTASH;
      break;
    case 'apm':
    case 'beats':
      indexPattern = _constants.INDEX_PATTERN_BEATS;
      break;
    case 'enterprise_search':
      indexPattern = _constants.INDEX_PATTERN_ENTERPRISE_SEARCH;
      break;
    case 'filebeat':
      indexPattern = config.ui.logs.index;
      break;
    default:
      throw new Error(`invalid module type to create index pattern: ${moduleType}`);
  }
  return (0, _ccs_utils.prefixIndexPatternWithCcs)(config, indexPattern, ccs);
}
function getDsIndexPattern({
  type = _constants.DS_INDEX_PATTERN_METRICS,
  moduleType,
  dataset,
  namespace,
  config,
  ccs
}) {
  const datasetsPattern = type === _constants.DS_INDEX_PATTERN_METRICS ? getMetricsDatasetPattern(moduleType, dataset) : getLogsDatasetPattern(moduleType, dataset);
  return (0, _ccs_utils.prefixIndexPatternWithCcs)(config, `${type}-${datasetsPattern}-${namespace !== null && namespace !== void 0 ? namespace : '*'}`, ccs);
}
function getIndexPatterns(indexPattern) {
  const legacyModuleType = isLogIndexPattern(indexPattern) ? 'filebeat' : indexPattern.moduleType;
  const {
    config,
    ccs,
    dataset,
    ecsLegacyOnly,
    moduleType,
    namespace,
    type
  } = indexPattern;
  const legacyIndexPattern = getLegacyIndexPattern({
    moduleType: legacyModuleType,
    ecsLegacyOnly,
    config,
    ccs
  });
  const dsIndexPattern = getDsIndexPattern({
    type,
    moduleType,
    dataset,
    namespace,
    config,
    ccs
  });
  return `${legacyIndexPattern},${dsIndexPattern}`;
}
const getDataset = moduleType => dataset => getMetricsDatasetPattern(moduleType, dataset);
const getElasticsearchDataset = getDataset('elasticsearch');
exports.getElasticsearchDataset = getElasticsearchDataset;
const getKibanaDataset = getDataset('kibana');
exports.getKibanaDataset = getKibanaDataset;
const getLogstashDataset = getDataset('logstash');
exports.getLogstashDataset = getLogstashDataset;
function buildDatasetPattern(moduleType, dataset, prefix) {
  return `${moduleType !== null && moduleType !== void 0 ? moduleType : '*'}.${prefix ? `${prefix}.` : ''}${dataset !== null && dataset !== void 0 ? dataset : '*'}`;
}
function getMetricsDatasetPattern(moduleType, dataset) {
  return buildDatasetPattern(moduleType, dataset, 'stack_monitoring');
}
function getLogsDatasetPattern(moduleType, dataset) {
  return buildDatasetPattern(moduleType, dataset);
}
const isLogIndexPattern = args => {
  return args.type === 'logs';
};