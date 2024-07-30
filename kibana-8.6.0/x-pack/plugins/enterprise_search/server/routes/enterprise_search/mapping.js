"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMappingRoute = registerMappingRoute;
var _configSchema = require("@kbn/config-schema");
var _fetch_mapping = require("../../lib/fetch_mapping");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerMappingRoute({
  router,
  log
}) {
  router.get({
    path: '/internal/enterprise_search/mappings/{index_name}',
    validate: {
      params: _configSchema.schema.object({
        index_name: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const mapping = await (0, _fetch_mapping.fetchMapping)(client, request.params.index_name);
    return response.ok({
      body: mapping,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
}