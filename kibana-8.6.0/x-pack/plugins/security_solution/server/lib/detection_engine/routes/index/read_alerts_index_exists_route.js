"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readAlertsIndexExistsRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const readAlertsIndexExistsRoute = router => {
  router.get({
    path: _constants.DETECTION_ENGINE_ALERTS_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const core = await context.core;
      const securitySolution = await context.securitySolution;
      const siemClient = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getAppClient();
      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }
      const index = siemClient.getSignalsIndex();
      const indexExists = await (0, _securitysolutionEsUtils.getIndexExists)(core.elasticsearch.client.asInternalUser, index);
      return response.ok({
        body: {
          indexExists
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
exports.readAlertsIndexExistsRoute = readAlertsIndexExistsRoute;