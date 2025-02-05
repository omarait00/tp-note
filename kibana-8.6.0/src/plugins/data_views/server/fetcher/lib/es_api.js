"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callFieldCapsApi = callFieldCapsApi;
exports.callIndexAliasApi = callIndexAliasApi;
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Call the index.getAlias API for a list of indices.
 *
 *  If `indices` is an array or comma-separated list and some of the
 *  values don't match anything but others do this will return the
 *  matches and not throw an error.
 *
 *  If not a single index matches then a NoMatchingIndicesError will
 *  be thrown.
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array<String>|String} indices
 *  @return {Promise<IndexAliasResponse>}
 */
async function callIndexAliasApi(callCluster, indices) {
  try {
    return await callCluster.indices.getAlias({
      index: indices,
      ignore_unavailable: true,
      allow_no_indices: false
    });
  } catch (error) {
    throw (0, _errors.convertEsError)(indices, error);
  }
}
/**
 *  Call the fieldCaps API for a list of indices.
 *
 *  Just like callIndexAliasApi(), callFieldCapsApi() throws
 *  if no indexes are matched, but will return potentially
 *  "partial" results if even a single index is matched.
 *
 *  @param  {Function} callCluster bound function for accessing an es client
 *  @param  {Array<String>|String} indices
 *  @param  {Object} fieldCapsOptions
 *  @return {Promise<FieldCapsResponse>}
 */
async function callFieldCapsApi(params) {
  const {
    callCluster,
    indices,
    filter,
    fieldCapsOptions = {
      allow_no_indices: false
    }
  } = params;
  try {
    return await callCluster.fieldCaps({
      index: indices,
      fields: '*',
      ignore_unavailable: true,
      index_filter: filter,
      ...fieldCapsOptions
    }, {
      meta: true
    });
  } catch (error) {
    throw (0, _errors.convertEsError)(indices, error);
  }
}