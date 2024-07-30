"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startConnectorSync = void 0;
var _ = require("../..");
var _error_codes = require("../../../common/types/error_codes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const startConnectorSync = async (client, connectorId, nextSyncConfig) => {
  const connectorResult = await client.asCurrentUser.get({
    id: connectorId,
    index: _.CONNECTORS_INDEX
  });
  const connector = connectorResult._source;
  if (connector) {
    if (nextSyncConfig) {
      connector.configuration.nextSyncConfig = {
        label: 'nextSyncConfig',
        value: nextSyncConfig
      };
    }
    const result = await client.asCurrentUser.index({
      document: {
        ...connector,
        sync_now: true
      },
      id: connectorId,
      index: _.CONNECTORS_INDEX
    });
    await client.asCurrentUser.indices.refresh({
      index: _.CONNECTORS_INDEX
    });
    return result;
  } else {
    throw new Error(_error_codes.ErrorCode.RESOURCE_NOT_FOUND);
  }
};
exports.startConnectorSync = startConnectorSync;