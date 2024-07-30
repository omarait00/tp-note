"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateApiKey = void 0;
var _ = require("../..");
var _to_alphanumeric = require("../../../common/utils/to_alphanumeric");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const generateApiKey = async (client, indexName) => {
  const apiKeyResult = await client.asCurrentUser.security.createApiKey({
    name: `${indexName}-connector`,
    role_descriptors: {
      [`${(0, _to_alphanumeric.toAlphanumeric)(indexName)}-connector-role`]: {
        cluster: ['monitor'],
        index: [{
          names: [indexName, `${_.CONNECTORS_INDEX}*`],
          privileges: ['all']
        }]
      }
    }
  });
  const connectorResult = await client.asCurrentUser.search({
    index: _.CONNECTORS_INDEX,
    query: {
      term: {
        index_name: indexName
      }
    }
  });
  const connector = connectorResult.hits.hits[0];
  if (connector) {
    var _connector$fields;
    if ((_connector$fields = connector.fields) !== null && _connector$fields !== void 0 && _connector$fields.api_key_id) {
      await client.asCurrentUser.security.invalidateApiKey({
        id: connector.fields.api_key_id
      });
    }
    await client.asCurrentUser.index({
      document: {
        ...connector._source,
        api_key_id: apiKeyResult.id
      },
      id: connector._id,
      index: _.CONNECTORS_INDEX
    });
  }
  return apiKeyResult;
};
exports.generateApiKey = generateApiKey;