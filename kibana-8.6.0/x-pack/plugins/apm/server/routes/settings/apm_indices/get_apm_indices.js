"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmIndexSettings = getApmIndexSettings;
exports.getApmIndices = getApmIndices;
exports.getApmIndicesConfig = getApmIndicesConfig;
var _apm_saved_object_constants = require("../../../../common/apm_saved_object_constants");
var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getApmIndicesSavedObject(savedObjectsClient) {
  const apmIndicesSavedObject = await (0, _with_apm_span.withApmSpan)('get_apm_indices_saved_object', () => savedObjectsClient.get(_apm_saved_object_constants.APM_INDEX_SETTINGS_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_INDEX_SETTINGS_SAVED_OBJECT_ID));
  return apmIndicesSavedObject.attributes.apmIndices;
}
function getApmIndicesConfig(config) {
  return {
    sourcemap: config.indices.sourcemap,
    error: config.indices.error,
    onboarding: config.indices.onboarding,
    span: config.indices.span,
    transaction: config.indices.transaction,
    metric: config.indices.metric,
    // system indices, not configurable
    apmAgentConfigurationIndex: '.apm-agent-configuration',
    apmCustomLinkIndex: '.apm-custom-link'
  };
}
async function getApmIndices({
  config,
  savedObjectsClient
}) {
  try {
    const apmIndicesSavedObject = await getApmIndicesSavedObject(savedObjectsClient);
    const apmIndicesConfig = getApmIndicesConfig(config);
    return {
      ...apmIndicesConfig,
      ...apmIndicesSavedObject
    };
  } catch (error) {
    return getApmIndicesConfig(config);
  }
}
async function getApmIndexSettings({
  context,
  config
}) {
  let apmIndicesSavedObject;
  try {
    const soClient = (await context.core).savedObjects.client;
    apmIndicesSavedObject = await getApmIndicesSavedObject(soClient);
  } catch (error) {
    if (error.output && error.output.statusCode === 404) {
      apmIndicesSavedObject = {};
    } else {
      throw error;
    }
  }
  const apmIndicesConfig = getApmIndicesConfig(config);
  const apmIndices = Object.keys(config.indices);
  return apmIndices.map(configurationName => {
    var _apmIndicesSavedObjec;
    return {
      configurationName,
      defaultValue: apmIndicesConfig[configurationName],
      // value defined in kibana[.dev].yml
      savedValue: (_apmIndicesSavedObjec = apmIndicesSavedObject) === null || _apmIndicesSavedObjec === void 0 ? void 0 : _apmIndicesSavedObjec[configurationName] // value saved via Saved Objects service
    };
  });
}