"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMappings = void 0;
var _server = require("../../../../actions/server");
var _error = require("../../common/error");
var _connectors = require("../../connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createMappings = async ({
  connector,
  owner,
  refresh
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    services: {
      connectorMappingsService
    },
    logger
  } = clientArgs;
  try {
    var _casesConnectors$get$, _casesConnectors$get;
    const mappings = (_casesConnectors$get$ = (_casesConnectors$get = _connectors.casesConnectors.get(connector.type)) === null || _casesConnectors$get === void 0 ? void 0 : _casesConnectors$get.getMapping()) !== null && _casesConnectors$get$ !== void 0 ? _casesConnectors$get$ : [];
    const theMapping = await connectorMappingsService.post({
      unsecuredSavedObjectsClient,
      attributes: {
        mappings,
        owner
      },
      references: [{
        type: _server.ACTION_SAVED_OBJECT_TYPE,
        name: `associated-${_server.ACTION_SAVED_OBJECT_TYPE}`,
        id: connector.id
      }],
      refresh
    });
    return theMapping.attributes.mappings;
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to create mapping connector id: ${connector.id} type: ${connector.type}: ${error}`,
      error,
      logger
    });
  }
};
exports.createMappings = createMappings;