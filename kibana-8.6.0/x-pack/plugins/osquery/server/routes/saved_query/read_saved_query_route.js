"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readSavedQueryRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _utils = require("./utils");
var _common = require("../../../common");
var _types = require("../../../common/types");
var _utils2 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const readSavedQueryRoute = (router, osqueryContext) => {
  router.get({
    path: '/api/osquery/saved_queries/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-readSavedQueries`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$servi;
    const coreContext = await context.core;
    const savedObjectsClient = coreContext.savedObjects.client;
    const savedQuery = await savedObjectsClient.get(_types.savedQuerySavedObjectType, request.params.id);
    if (savedQuery.attributes.ecs_mapping) {
      // @ts-expect-error update types
      savedQuery.attributes.ecs_mapping = (0, _utils2.convertECSMappingToObject)(savedQuery.attributes.ecs_mapping);
    }
    savedQuery.attributes.prebuilt = await (0, _utils.isSavedQueryPrebuilt)((_osqueryContext$servi = osqueryContext.service.getPackageService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.asInternalUser, savedQuery.id);
    return response.ok({
      body: {
        data: savedQuery
      }
    });
  });
};
exports.readSavedQueryRoute = readSavedQueryRoute;