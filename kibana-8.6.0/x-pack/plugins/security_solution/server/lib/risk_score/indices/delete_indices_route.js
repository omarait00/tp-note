"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteEsIndicesRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _utils = require("../../../../../lists/server/routes/utils");
var _constants = require("../../../../common/constants");
var _delete_indices = require("./lib/delete_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bodySchema = _configSchema.schema.object({
  indices: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
const deleteEsIndicesRoute = router => {
  router.post({
    path: _constants.RISK_SCORE_DELETE_INDICES,
    validate: {
      body: bodySchema
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      indices
    } = request.body;
    try {
      await (0, _delete_indices.deleteEsIndices)({
        client,
        indices
      });
      return response.ok({
        body: {
          deleted: indices
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.deleteEsIndicesRoute = deleteEsIndicesRoute;