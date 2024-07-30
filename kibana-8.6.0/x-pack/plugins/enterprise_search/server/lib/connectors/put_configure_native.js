"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureNativeConnector = void 0;
var _ = require("../..");
var _native_connectors = require("../../../common/connectors/native_connectors");
var _connectors = require("../../../common/types/connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configureNativeConnector = async (client, connectorId, serviceType) => {
  const nativeConnector = _native_connectors.NATIVE_CONNECTOR_DEFINITIONS[serviceType];
  if (!nativeConnector) {
    throw new Error(`Could not find connector definition for service type ${serviceType}`);
  }
  const result = await client.asCurrentUser.update({
    doc: {
      configuration: nativeConnector.configuration,
      features: nativeConnector.features,
      name: nativeConnector.name,
      service_type: serviceType,
      status: _connectors.ConnectorStatus.NEEDS_CONFIGURATION
    },
    id: connectorId,
    index: _.CONNECTORS_INDEX,
    refresh: true
  });
  return result.result === 'updated' ? true : false;
};
exports.configureNativeConnector = configureNativeConnector;