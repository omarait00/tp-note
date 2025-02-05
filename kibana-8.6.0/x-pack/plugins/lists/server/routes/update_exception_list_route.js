"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExceptionListRoute = void 0;
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

const updateExceptionListRoute = router => {
  router.put({
    options: {
      tags: ['access:lists-all']
    },
    path: _securitysolutionListConstants.EXCEPTION_LIST_URL,
    validate: {
      body: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.updateExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const {
        _version,
        tags,
        name,
        description,
        id,
        list_id: listId,
        meta,
        namespace_type: namespaceType,
        os_types: osTypes,
        type,
        version
      } = request.body;
      const exceptionLists = await (0, _utils.getExceptionListClient)(context);
      if (id == null && listId == null) {
        return siemResponse.error({
          body: 'either id or list_id need to be defined',
          statusCode: 404
        });
      } else {
        const list = await exceptionLists.updateExceptionList({
          _version,
          description,
          id,
          listId,
          meta,
          name,
          namespaceType,
          osTypes,
          tags,
          type,
          version
        });
        if (list == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionList)({
              id,
              listId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(list, _securitysolutionIoTsListTypes.exceptionListSchema);
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
exports.updateExceptionListRoute = updateExceptionListRoute;