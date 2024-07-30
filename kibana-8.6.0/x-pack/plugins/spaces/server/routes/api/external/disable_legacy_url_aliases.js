"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDisableLegacyUrlAliasesApi = initDisableLegacyUrlAliasesApi;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../../lib/errors");
var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function initDisableLegacyUrlAliasesApi(deps) {
  const {
    externalRouter,
    getSpacesService,
    usageStatsServicePromise
  } = deps;
  const usageStatsClientPromise = usageStatsServicePromise.then(({
    getClient
  }) => getClient());
  externalRouter.post({
    path: '/api/spaces/_disable_legacy_url_aliases',
    validate: {
      body: _configSchema.schema.object({
        aliases: _configSchema.schema.arrayOf(_configSchema.schema.object({
          targetSpace: _configSchema.schema.string(),
          targetType: _configSchema.schema.string(),
          sourceId: _configSchema.schema.string()
        }))
      })
    }
  }, (0, _lib.createLicensedRouteHandler)(async (_context, request, response) => {
    const spacesClient = getSpacesService().createSpacesClient(request);
    const {
      aliases
    } = request.body;
    usageStatsClientPromise.then(usageStatsClient => usageStatsClient.incrementDisableLegacyUrlAliases());
    try {
      await spacesClient.disableLegacyUrlAliases(aliases);
      return response.noContent();
    } catch (error) {
      return response.customError((0, _errors.wrapError)(error));
    }
  }));
}