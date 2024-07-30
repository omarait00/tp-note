"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateConnectorConfiguration = void 0;
var _i18n = require("@kbn/i18n");
var _ = require("../..");
var _connectors = require("../../../common/types/connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateConnectorConfiguration = async (client, connectorId, configuration) => {
  const connectorResult = await client.asCurrentUser.get({
    id: connectorId,
    index: _.CONNECTORS_INDEX
  });
  const connector = connectorResult._source;
  if (connector) {
    const status = connector.status === _connectors.ConnectorStatus.NEEDS_CONFIGURATION ? _connectors.ConnectorStatus.CONFIGURED : connector.status;
    const result = await client.asCurrentUser.index({
      document: {
        ...connector,
        configuration,
        status
      },
      id: connectorId,
      index: _.CONNECTORS_INDEX
    });
    await client.asCurrentUser.indices.refresh({
      index: _.CONNECTORS_INDEX
    });
    return result;
  } else {
    throw new Error(_i18n.i18n.translate('xpack.enterpriseSearch.server.connectors.configuration.error', {
      defaultMessage: 'Could not find document'
    }));
  }
};
exports.updateConnectorConfiguration = updateConnectorConfiguration;