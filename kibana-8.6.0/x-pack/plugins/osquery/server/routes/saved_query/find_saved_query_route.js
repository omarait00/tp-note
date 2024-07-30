"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSavedQueryRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _common = require("../../../common");
var _types = require("../../../common/types");
var _utils = require("../utils");
var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findSavedQueryRoute = (router, osqueryContext) => {
  router.get({
    path: '/api/osquery/saved_queries',
    validate: {
      query: _configSchema.schema.object({
        page: _configSchema.schema.maybe(_configSchema.schema.number()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number()),
        sort: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')]))
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-readSavedQueries`]
    }
  }, async (context, request, response) => {
    var _request$query$page, _request$query$sortOr, _osqueryContext$servi;
    const coreContext = await context.core;
    const savedObjectsClient = coreContext.savedObjects.client;
    const savedQueries = await savedObjectsClient.find({
      type: _types.savedQuerySavedObjectType,
      page: (_request$query$page = request.query.page) !== null && _request$query$page !== void 0 ? _request$query$page : 1,
      perPage: request.query.pageSize,
      sortField: request.query.sort,
      sortOrder: (_request$query$sortOr = request.query.sortOrder) !== null && _request$query$sortOr !== void 0 ? _request$query$sortOr : 'desc'
    });
    const prebuiltSavedQueriesMap = await (0, _utils2.getInstalledSavedQueriesMap)((_osqueryContext$servi = osqueryContext.service.getPackageService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.asInternalUser);
    const savedObjects = savedQueries.saved_objects.map(savedObject => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const ecs_mapping = savedObject.attributes.ecs_mapping;
      savedObject.attributes.prebuilt = !!prebuiltSavedQueriesMap[savedObject.id];
      if (ecs_mapping) {
        // @ts-expect-error update types
        savedObject.attributes.ecs_mapping = (0, _utils.convertECSMappingToObject)(ecs_mapping);
      }
      return savedObject;
    });
    return response.ok({
      body: {
        ...(0, _lodash.omit)(savedQueries, 'saved_objects'),
        data: savedObjects
      }
    });
  });
};
exports.findSavedQueryRoute = findSavedQueryRoute;