"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResolveIndexRoute = registerResolveIndexRoute;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerResolveIndexRoute(router) {
  router.get({
    path: '/internal/index-pattern-management/resolve_index/{query}',
    validate: {
      params: _configSchema.schema.object({
        query: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        expand_wildcards: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('all'), _configSchema.schema.literal('open'), _configSchema.schema.literal('closed'), _configSchema.schema.literal('hidden'), _configSchema.schema.literal('none')]))
      })
    }
  }, async (context, req, res) => {
    const esClient = (await context.core).elasticsearch.client;
    const body = await esClient.asCurrentUser.indices.resolveIndex({
      name: req.params.query,
      expand_wildcards: req.query.expand_wildcards || 'open'
    });
    return res.ok({
      body
    });
  });
}