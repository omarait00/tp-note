"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetShareableReferencesApi = initGetShareableReferencesApi;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../../lib/errors");
var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function initGetShareableReferencesApi(deps) {
  const {
    externalRouter,
    getStartServices
  } = deps;
  externalRouter.post({
    path: '/api/spaces/_get_shareable_references',
    validate: {
      body: _configSchema.schema.object({
        objects: _configSchema.schema.arrayOf(_configSchema.schema.object({
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        }))
      })
    }
  }, (0, _lib.createLicensedRouteHandler)(async (context, request, response) => {
    const [startServices] = await getStartServices();
    const scopedClient = startServices.savedObjects.getScopedClient(request);
    const {
      objects
    } = request.body;
    try {
      const collectedObjects = await scopedClient.collectMultiNamespaceReferences(objects, {
        purpose: 'updateObjectsSpaces'
      });
      return response.ok({
        body: collectedObjects
      });
    } catch (error) {
      return response.customError((0, _errors.wrapError)(error));
    }
  }));
}