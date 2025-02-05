"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUpdateObjectsSpacesApi = initUpdateObjectsSpacesApi;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
var _errors = require("../../../lib/errors");
var _space_schema = require("../../../lib/space_schema");
var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function initUpdateObjectsSpacesApi(deps) {
  const {
    externalRouter,
    getStartServices
  } = deps;
  const spacesSchema = _configSchema.schema.arrayOf(_configSchema.schema.string({
    validate: value => {
      if (value !== _constants.ALL_SPACES_ID && !_space_schema.SPACE_ID_REGEX.test(value)) {
        return `lower case, a-z, 0-9, "_", and "-" are allowed, OR "*"`;
      }
    }
  }), {
    validate: spaceIds => {
      if (uniq(spaceIds).length !== spaceIds.length) {
        return 'duplicate space ids are not allowed';
      }
    }
  });
  externalRouter.post({
    path: '/api/spaces/_update_objects_spaces',
    validate: {
      body: _configSchema.schema.object({
        objects: _configSchema.schema.arrayOf(_configSchema.schema.object({
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        })),
        spacesToAdd: spacesSchema,
        spacesToRemove: spacesSchema
      })
    }
  }, (0, _lib.createLicensedRouteHandler)(async (_context, request, response) => {
    const [startServices] = await getStartServices();
    const scopedClient = startServices.savedObjects.getScopedClient(request);
    const {
      objects,
      spacesToAdd,
      spacesToRemove
    } = request.body;
    try {
      const updateObjectsSpacesResponse = await scopedClient.updateObjectsSpaces(objects, spacesToAdd, spacesToRemove);
      return response.ok({
        body: updateObjectsSpacesResponse
      });
    } catch (error) {
      return response.customError((0, _errors.wrapError)(error));
    }
  }));
}

/** Returns all unique elements of an array. */
function uniq(arr) {
  return Array.from(new Set(arr));
}