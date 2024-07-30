"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmEventClient = getApmEventClient;
var _common = require("../../../../../../src/plugins/data/common");
var _get_apm_indices = require("../../routes/settings/apm_indices/get_apm_indices");
var _create_apm_event_client = require("./create_es_client/create_apm_event_client");
var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getApmEventClient({
  context,
  params,
  config,
  request
}) {
  return (0, _with_apm_span.withApmSpan)('get_apm_event_client', async () => {
    const coreContext = await context.core;
    const [indices, includeFrozen] = await Promise.all([(0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: coreContext.savedObjects.client,
      config
    }), (0, _with_apm_span.withApmSpan)('get_ui_settings', () => coreContext.uiSettings.client.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN))]);
    return new _create_apm_event_client.APMEventClient({
      esClient: coreContext.elasticsearch.client.asCurrentUser,
      debug: params.query._inspect,
      request,
      indices,
      options: {
        includeFrozen,
        forceSyntheticSource: config.forceSyntheticSource
      }
    });
  });
}