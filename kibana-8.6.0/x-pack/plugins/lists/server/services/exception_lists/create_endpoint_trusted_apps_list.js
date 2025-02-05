"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEndpointTrustedAppsList = void 0;
var _server = require("../../../../../../src/core/server");
var _uuid = _interopRequireDefault(require("uuid"));
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates the Endpoint Trusted Apps agnostic list if it does not yet exist
 *
 * @param savedObjectsClient
 * @param user
 * @param tieBreaker
 * @param version
 */
const createEndpointTrustedAppsList = async ({
  savedObjectsClient,
  user,
  tieBreaker,
  version
}) => {
  const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectType)({
    namespaceType: 'agnostic'
  });
  const dateNow = new Date().toISOString();
  try {
    const savedObject = await savedObjectsClient.create(savedObjectType, {
      comments: undefined,
      created_at: dateNow,
      created_by: user,
      description: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION,
      entries: undefined,
      immutable: false,
      item_id: undefined,
      list_id: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID,
      list_type: 'list',
      meta: undefined,
      name: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_NAME,
      os_types: [],
      tags: [],
      tie_breaker_id: tieBreaker !== null && tieBreaker !== void 0 ? tieBreaker : _uuid.default.v4(),
      type: 'endpoint',
      updated_by: user,
      version
    }, {
      // We intentionally hard coding the id so that there can only be one Trusted apps list within the space
      id: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID
    });
    return (0, _utils.transformSavedObjectToExceptionList)({
      savedObject
    });
  } catch (err) {
    if (_server.SavedObjectsErrorHelpers.isConflictError(err)) {
      return null;
    } else {
      throw err;
    }
  }
};
exports.createEndpointTrustedAppsList = createEndpointTrustedAppsList;