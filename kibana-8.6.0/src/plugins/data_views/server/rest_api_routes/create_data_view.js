"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateDataViewRouteLegacy = exports.registerCreateDataViewRoute = exports.createDataView = void 0;
var _configSchema = require("@kbn/config-schema");
var _handle_errors = require("./util/handle_errors");
var _schemas = require("./util/schemas");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createDataView = async ({
  dataViewsService,
  usageCollection,
  spec,
  override,
  refreshFields,
  counterName
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  return dataViewsService.createAndSave(spec, override, !refreshFields);
};
exports.createDataView = createDataView;
const dataViewSpecSchema = _configSchema.schema.object({
  title: _configSchema.schema.string(),
  version: _configSchema.schema.maybe(_configSchema.schema.string()),
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
  sourceFilters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    value: _configSchema.schema.string()
  }))),
  fields: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.fieldSpecSchema)),
  typeMeta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  fieldFormats: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.serializedFieldFormatSchema)),
  fieldAttrs: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    customLabel: _configSchema.schema.maybe(_configSchema.schema.string()),
    count: _configSchema.schema.maybe(_configSchema.schema.number())
  }))),
  allowNoIndex: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  runtimeFieldMap: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.runtimeFieldSchema)),
  name: _configSchema.schema.maybe(_configSchema.schema.string())
});
const registerCreateDataViewRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.post({
    path,
    validate: {
      body: _configSchema.schema.object({
        override: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        })),
        refresh_fields: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        })),
        data_view: serviceKey === _constants.SERVICE_KEY ? dataViewSpecSchema : _configSchema.schema.never(),
        index_pattern: serviceKey === _constants.SERVICE_KEY_LEGACY ? dataViewSpecSchema : _configSchema.schema.never()
      })
    }
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const core = await ctx.core;
    const savedObjectsClient = core.savedObjects.client;
    const elasticsearchClient = core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const body = req.body;
    const spec = serviceKey === _constants.SERVICE_KEY ? body.data_view : body.index_pattern;
    const dataView = await createDataView({
      dataViewsService,
      usageCollection,
      spec: {
        ...spec,
        name: spec.name || spec.title
      },
      override: body.override,
      refreshFields: body.refresh_fields,
      counterName: `${req.route.method} ${path}`
    });
    return res.ok({
      headers: {
        'content-type': 'application/json'
      },
      body: {
        [serviceKey]: dataView.toSpec()
      }
    });
  })));
};
const registerCreateDataViewRoute = registerCreateDataViewRouteFactory(_constants.DATA_VIEW_PATH, _constants.SERVICE_KEY);
exports.registerCreateDataViewRoute = registerCreateDataViewRoute;
const registerCreateDataViewRouteLegacy = registerCreateDataViewRouteFactory(_constants.DATA_VIEW_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerCreateDataViewRouteLegacy = registerCreateDataViewRouteLegacy;