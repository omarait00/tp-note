"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionListRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _create_exception_list_handler = require("../handlers/create_exception_list_handler");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createExceptionListRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _securitysolutionListConstants.EXCEPTION_LIST_URL,
    validate: {
      body: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.createExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      return await (0, _create_exception_list_handler.createExceptionListHandler)(context, request, response, siemResponse);
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.createExceptionListRoute = createExceptionListRoute;