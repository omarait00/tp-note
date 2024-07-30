"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRuntimeFieldRouteLegacy = exports.registerCreateRuntimeFieldRoute = exports.createRuntimeField = void 0;
var _configSchema = require("@kbn/config-schema");
var _handle_errors = require("../util/handle_errors");
var _schemas = require("../util/schemas");
var _constants = require("../../constants");
var _response_formatter = require("./response_formatter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createRuntimeField = async ({
  dataViewsService,
  usageCollection,
  counterName,
  id,
  name,
  runtimeField
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  const dataView = await dataViewsService.get(id);
  if (dataView.fields.getByName(name) || dataView.getRuntimeField(name)) {
    throw new Error(`Field [name = ${name}] already exists.`);
  }
  const firstNameSegment = name.split('.')[0];
  if (dataView.fields.getByName(firstNameSegment) || dataView.getRuntimeField(firstNameSegment)) {
    throw new Error(`Field [name = ${firstNameSegment}] already exists.`);
  }
  const createdRuntimeFields = dataView.addRuntimeField(name, runtimeField);
  await dataViewsService.updateSavedObject(dataView);
  return {
    dataView,
    fields: createdRuntimeFields
  };
};
exports.createRuntimeField = createRuntimeField;
const runtimeCreateFieldRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.post({
    path,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }),
        runtimeField: _schemas.runtimeFieldSchema
      })
    }
  }, (0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const core = await ctx.core;
    const savedObjectsClient = core.savedObjects.client;
    const elasticsearchClient = core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const id = req.params.id;
    const {
      name,
      runtimeField
    } = req.body;
    const {
      dataView,
      fields
    } = await createRuntimeField({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`,
      id,
      name,
      runtimeField: runtimeField
    });
    return res.ok((0, _response_formatter.responseFormatter)({
      serviceKey,
      dataView,
      fields
    }));
  }));
};
const registerCreateRuntimeFieldRoute = runtimeCreateFieldRouteFactory(_constants.RUNTIME_FIELD_PATH, _constants.SERVICE_KEY);
exports.registerCreateRuntimeFieldRoute = registerCreateRuntimeFieldRoute;
const registerCreateRuntimeFieldRouteLegacy = runtimeCreateFieldRouteFactory(_constants.RUNTIME_FIELD_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerCreateRuntimeFieldRouteLegacy = registerCreateRuntimeFieldRouteLegacy;