"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readExceptionListRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const readExceptionListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _securitysolutionListConstants.EXCEPTION_LIST_URL,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.readExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const {
        id,
        list_id: listId,
        namespace_type: namespaceType
      } = request.query;
      const exceptionLists = await (0, _utils.getExceptionListClient)(context);
      if (id != null || listId != null) {
        const exceptionList = await exceptionLists.getExceptionList({
          id,
          listId,
          namespaceType
        });
        if (exceptionList == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionList)({
              id,
              listId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(exceptionList, _securitysolutionIoTsListTypes.exceptionListSchema);
          if (errors != null) {
            return siemResponse.error({
              body: errors,
              statusCode: 500
            });
          } else {
            return response.ok({
              body: validated !== null && validated !== void 0 ? validated : {}
            });
          }
        }
      } else {
        return siemResponse.error({
          body: 'id or list_id required',
          statusCode: 400
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.readExceptionListRoute = readExceptionListRoute;