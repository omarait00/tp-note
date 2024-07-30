"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateAPIKeyRoute = registerCreateAPIKeyRoute;
var _configSchema = require("@kbn/config-schema");
var _create_api_key = require("../../lib/indices/create_api_key");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerCreateAPIKeyRoute({
  log,
  router
}, security) {
  router.post({
    path: '/internal/enterprise_search/{indexName}/api_keys',
    validate: {
      body: _configSchema.schema.object({
        keyName: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      keyName
    } = request.body;
    const createResponse = await (0, _create_api_key.createApiKey)(request, security, indexName, keyName);
    if (!createResponse) {
      throw new Error('Unable to create API Key');
    }
    return response.ok({
      body: {
        apiKey: createResponse
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
}