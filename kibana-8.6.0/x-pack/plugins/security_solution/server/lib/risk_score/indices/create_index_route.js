"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEsIndexRoute = void 0;
var _utils = require("../../../../../lists/server/routes/utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../common/constants");
var _create_index = require("./lib/create_index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createEsIndexRoute = (router, logger) => {
  router.put({
    path: _constants.RISK_SCORE_CREATE_INDEX,
    validate: {
      body: _create_index.createEsIndexBodySchema
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      client
    } = (await context.core).elasticsearch;
    const esClient = client.asCurrentUser;
    const options = request.body;
    try {
      const result = await (0, _create_index.createIndex)({
        esClient,
        logger,
        options
      });
      const error = result[options.index].error;
      if (error != null) {
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode
        });
      } else {
        return response.ok({
          body: options
        });
      }
    } catch (e) {
      const error = (0, _securitysolutionEsUtils.transformError)(e);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.createEsIndexRoute = createEsIndexRoute;