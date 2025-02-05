"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indicesRoutes = indicesRoutes;
var _error_wrapper = require("../client/error_wrapper");
var _indices_schema = require("./schemas/indices_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Indices routes.
 */
function indicesRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup Indices
   *
   * @api {post} /api/ml/indices/field_caps Field caps
   * @apiName FieldCaps
   * @apiDescription Retrieves the capabilities of fields among multiple indices.
   *
   * @apiSchema (body) indicesSchema
   */
  router.post({
    path: '/api/ml/indices/field_caps',
    validate: {
      body: _indices_schema.indicesSchema
    },
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const {
        body: {
          index,
          fields: requestFields
        }
      } = request;
      const fields = requestFields !== undefined && Array.isArray(requestFields) ? requestFields.join(',') : '*';
      const body = await client.asCurrentUser.fieldCaps({
        index,
        fields
      }, {
        maxRetries: 0
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}