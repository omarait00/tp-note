"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDataView = exports.registerUpdateDataViewRouteLegacy = exports.registerUpdateDataViewRoute = void 0;
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

const indexPatternUpdateSchema = _configSchema.schema.object({
  title: _configSchema.schema.maybe(_configSchema.schema.string()),
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  typeMeta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
  sourceFilters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    value: _configSchema.schema.string()
  }))),
  fieldFormats: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.serializedFieldFormatSchema)),
  fields: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.fieldSpecSchema)),
  allowNoIndex: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  runtimeFieldMap: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _schemas.runtimeFieldSchema)),
  name: _configSchema.schema.maybe(_configSchema.schema.string())
});
const updateDataView = async ({
  dataViewsService,
  usageCollection,
  spec,
  id,
  refreshFields,
  counterName
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  const dataView = await dataViewsService.get(id);
  const {
    title,
    timeFieldName,
    sourceFilters,
    fieldFormats,
    type,
    typeMeta,
    fields,
    runtimeFieldMap,
    name
  } = spec;
  let isChanged = false;
  let doRefreshFields = false;
  if (title !== undefined && title !== dataView.title) {
    isChanged = true;
    dataView.title = title;
  }
  if (timeFieldName !== undefined && timeFieldName !== dataView.timeFieldName) {
    isChanged = true;
    dataView.timeFieldName = timeFieldName;
  }
  if (sourceFilters !== undefined) {
    isChanged = true;
    dataView.sourceFilters = sourceFilters;
  }
  if (fieldFormats !== undefined) {
    isChanged = true;
    dataView.fieldFormatMap = fieldFormats;
  }
  if (type !== undefined) {
    isChanged = true;
    dataView.type = type;
  }
  if (typeMeta !== undefined) {
    isChanged = true;
    dataView.typeMeta = typeMeta;
  }
  if (name !== undefined) {
    isChanged = true;
    dataView.name = name;
  }
  if (fields !== undefined) {
    isChanged = true;
    doRefreshFields = true;
    dataView.fields.replaceAll(Object.values(fields || {}).map(field => ({
      ...field,
      aggregatable: true,
      searchable: true
    })));
  }
  if (runtimeFieldMap !== undefined) {
    isChanged = true;
    dataView.replaceAllRuntimeFields(runtimeFieldMap);
  }
  if (isChanged) {
    const result = await dataViewsService.updateSavedObject(dataView);
    if (doRefreshFields && refreshFields) {
      await dataViewsService.refreshFields(dataView);
    }
    return result;
  }
  return dataView;
};
exports.updateDataView = updateDataView;
const updateDataViewRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.post({
    path,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        refresh_fields: _configSchema.schema.maybe(_configSchema.schema.boolean({
          defaultValue: false
        })),
        [serviceKey]: indexPatternUpdateSchema
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
    const id = req.params.id;
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      refresh_fields = true
    } = req.body;
    const spec = req.body[serviceKey];
    const dataView = await updateDataView({
      dataViewsService,
      usageCollection,
      id,
      refreshFields: refresh_fields,
      spec,
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
const registerUpdateDataViewRoute = updateDataViewRouteFactory(_constants.SPECIFIC_DATA_VIEW_PATH, _constants.SERVICE_KEY);
exports.registerUpdateDataViewRoute = registerUpdateDataViewRoute;
const registerUpdateDataViewRouteLegacy = updateDataViewRouteFactory(_constants.SPECIFIC_DATA_VIEW_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerUpdateDataViewRouteLegacy = registerUpdateDataViewRouteLegacy;