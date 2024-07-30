"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteStoredScriptRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _utils = require("../../../../../lists/server/routes/utils");
var _constants = require("../../../../common/constants");
var _delete_script = require("./lib/delete_script");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteStoredScriptRoute = router => {
  router.delete({
    path: _constants.RISK_SCORE_DELETE_STORED_SCRIPT,
    validate: {
      body: _delete_script.deleteStoredScriptBodySchema
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      client
    } = (await context.core).elasticsearch;
    const options = request.body;
    try {
      await (0, _delete_script.deleteStoredScript)({
        client,
        options
      });
      return response.ok({
        body: options
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
exports.deleteStoredScriptRoute = deleteStoredScriptRoute;