"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthorizationMode = void 0;
exports.getAuthorizationModeBySource = getAuthorizationModeBySource;
exports.getBulkAuthorizationModeBySource = getBulkAuthorizationModeBySource;
var _lodash = require("lodash");
var _lib = require("../lib");
var _saved_objects = require("../constants/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const LEGACY_VERSION = 'pre-7.10.0';
let AuthorizationMode;
exports.AuthorizationMode = AuthorizationMode;
(function (AuthorizationMode) {
  AuthorizationMode[AuthorizationMode["Legacy"] = 0] = "Legacy";
  AuthorizationMode[AuthorizationMode["RBAC"] = 1] = "RBAC";
})(AuthorizationMode || (exports.AuthorizationMode = AuthorizationMode = {}));
async function getAuthorizationModeBySource(unsecuredSavedObjectsClient, executionSource) {
  var _executionSource$sour, _await$unsecuredSaved;
  return (0, _lib.isSavedObjectExecutionSource)(executionSource) && (executionSource === null || executionSource === void 0 ? void 0 : (_executionSource$sour = executionSource.source) === null || _executionSource$sour === void 0 ? void 0 : _executionSource$sour.type) === _saved_objects.ALERT_SAVED_OBJECT_TYPE && ((_await$unsecuredSaved = (await unsecuredSavedObjectsClient.get(_saved_objects.ALERT_SAVED_OBJECT_TYPE, executionSource.source.id)).attributes.meta) === null || _await$unsecuredSaved === void 0 ? void 0 : _await$unsecuredSaved.versionApiKeyLastmodified) === LEGACY_VERSION ? AuthorizationMode.Legacy : AuthorizationMode.RBAC;
}
async function getBulkAuthorizationModeBySource(unsecuredSavedObjectsClient, executionSources = []) {
  const count = {
    [AuthorizationMode.Legacy]: 0,
    [AuthorizationMode.RBAC]: 0
  };
  if (executionSources.length === 0) {
    count[AuthorizationMode.RBAC] = 1;
    return count;
  }
  const alerts = await unsecuredSavedObjectsClient.bulkGet(executionSources.map(es => ({
    type: _saved_objects.ALERT_SAVED_OBJECT_TYPE,
    id: (0, _lodash.get)(es, 'source.id')
  })));
  const legacyVersions = alerts.saved_objects.reduce((acc, so) => {
    var _so$attributes$meta;
    return {
      ...acc,
      [so.id]: ((_so$attributes$meta = so.attributes.meta) === null || _so$attributes$meta === void 0 ? void 0 : _so$attributes$meta.versionApiKeyLastmodified) === LEGACY_VERSION
    };
  }, {});
  return executionSources.reduce((acc, es) => {
    var _es$source;
    const isAlertSavedObject = (0, _lib.isSavedObjectExecutionSource)(es) && ((_es$source = es.source) === null || _es$source === void 0 ? void 0 : _es$source.type) === _saved_objects.ALERT_SAVED_OBJECT_TYPE;
    const isLegacyVersion = legacyVersions[(0, _lodash.get)(es, 'source.id')];
    const key = isAlertSavedObject && isLegacyVersion ? AuthorizationMode.Legacy : AuthorizationMode.RBAC;
    acc[key]++;
    return acc;
  }, count);
}