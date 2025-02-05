"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultAsyncGetParams = getDefaultAsyncGetParams;
exports.getDefaultAsyncSubmitParams = getDefaultAsyncSubmitParams;
exports.getIgnoreThrottled = getIgnoreThrottled;
var _common = require("../../../../common");
var _es_search = require("../es_search");
var _async_utils = require("../common/async_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @internal
 */
async function getIgnoreThrottled(uiSettingsClient) {
  const includeFrozen = await uiSettingsClient.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);
  return includeFrozen ? {
    ignore_throttled: false
  } : {};
}

/**
 @internal
 */
async function getDefaultAsyncSubmitParams(uiSettingsClient, searchConfig, options) {
  return {
    // TODO: adjust for partial results
    batched_reduce_size: searchConfig.asyncSearch.batchedReduceSize,
    ...(0, _async_utils.getCommonDefaultAsyncSubmitParams)(searchConfig, options),
    ...(await getIgnoreThrottled(uiSettingsClient)),
    ...(await (0, _es_search.getDefaultSearchParams)(uiSettingsClient))
  };
}

/**
 @internal
 */
function getDefaultAsyncGetParams(searchConfig, options) {
  return {
    ...(0, _async_utils.getCommonDefaultAsyncGetParams)(searchConfig, options)
  };
}