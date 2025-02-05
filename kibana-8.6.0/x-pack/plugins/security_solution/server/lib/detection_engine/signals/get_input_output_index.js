"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInputIndex = exports.DataViewError = void 0;
var _constants = require("../../../../common/constants");
var _with_security_span = require("../../../utils/with_security_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DataViewError extends Error {}
exports.DataViewError = DataViewError;
const getInputIndex = async ({
  index,
  services,
  version,
  logger,
  ruleId,
  dataViewId
}) => {
  // If data views defined, use it
  if (dataViewId != null && dataViewId !== '') {
    // Check to see that the selected dataView exists
    let dataView;
    try {
      dataView = await services.savedObjectsClient.get('index-pattern', dataViewId);
    } catch (exc) {
      throw new DataViewError(exc.message);
    }
    const indices = dataView.attributes.title.split(',');
    const runtimeMappings = dataView.attributes.runtimeFieldMap != null ? JSON.parse(dataView.attributes.runtimeFieldMap) : {};
    logger.debug(`[rule_id:${ruleId}] - Data view "${dataViewId}" found - indices to search include: ${indices}.`);
    logger.debug(`[rule_id:${ruleId}] - Data view "${dataViewId}" includes ${Object.keys(runtimeMappings).length} mapped runtime fields.`);

    // if data view does exist, return it and it's runtimeMappings
    return {
      index: indices,
      runtimeMappings
    };
  }
  if (index != null) {
    logger.debug(`[rule_id:${ruleId}] - Indices to search include: ${index}.`);
    return {
      index,
      runtimeMappings: {}
    };
  } else {
    const configuration = await (0, _with_security_span.withSecuritySpan)('getDefaultIndex', () => services.savedObjectsClient.get('config', version));
    if (configuration.attributes != null && configuration.attributes[_constants.DEFAULT_INDEX_KEY] != null) {
      logger.debug(`[rule_id:${ruleId}] - No index patterns defined, falling back to using configured default indices: ${configuration.attributes[_constants.DEFAULT_INDEX_KEY]}.`);
      return {
        index: configuration.attributes[_constants.DEFAULT_INDEX_KEY],
        runtimeMappings: {}
      };
    } else {
      logger.debug(`[rule_id:${ruleId}] - No index patterns defined, falling back to using default indices: ${_constants.DEFAULT_INDEX_PATTERN}.`);
      return {
        index: _constants.DEFAULT_INDEX_PATTERN,
        runtimeMappings: {}
      };
    }
  }
};
exports.getInputIndex = getInputIndex;