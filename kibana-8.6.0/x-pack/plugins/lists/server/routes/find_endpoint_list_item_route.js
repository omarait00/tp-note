"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findEndpointListItemRoute = void 0;
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

const findEndpointListItemRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_securitysolutionListConstants.ENDPOINT_LIST_ITEM_URL}/_find`,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.findEndpointListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const exceptionLists = await (0, _utils.getExceptionListClient)(context);
      const {
        filter,
        page,
        per_page: perPage,
        sort_field: sortField,
        sort_order: sortOrder
      } = request.query;
      const exceptionListItems = await exceptionLists.findEndpointListItem({
        filter,
        page,
        perPage,
        pit: undefined,
        searchAfter: undefined,
        sortField,
        sortOrder
      });
      if (exceptionListItems == null) {
        // Although I have this line of code here, this is an incredibly rare thing to have
        // happen as the findEndpointListItem tries to auto-create the endpoint list if
        // does not exist.
        return siemResponse.error({
          body: `list id: "${_securitysolutionListConstants.ENDPOINT_LIST_ID}" does not exist`,
          statusCode: 404
        });
      }
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(exceptionListItems, _securitysolutionIoTsListTypes.foundExceptionListItemSchema);
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
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.findEndpointListItemRoute = findEndpointListItemRoute;