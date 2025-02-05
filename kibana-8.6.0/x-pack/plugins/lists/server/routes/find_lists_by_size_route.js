"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findListsBySizeRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _lodash = require("lodash");
var _utils = require("../services/utils");
var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findListsBySizeRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_securitysolutionListConstants.FIND_LISTS_BY_SIZE}`,
    validate: {
      query: (0, _utils2.buildRouteValidation)(_securitysolutionIoTsListTypes.findListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    try {
      const listClient = await (0, _utils2.getListClient)(context);
      const {
        cursor,
        filter: filterOrUndefined,
        page: pageOrUndefined,
        per_page: perPageOrUndefined,
        sort_field: sortField,
        sort_order: sortOrder
      } = request.query;
      const page = pageOrUndefined !== null && pageOrUndefined !== void 0 ? pageOrUndefined : 1;
      const perPage = perPageOrUndefined !== null && perPageOrUndefined !== void 0 ? perPageOrUndefined : 20;
      const filter = filterOrUndefined !== null && filterOrUndefined !== void 0 ? filterOrUndefined : '';
      const {
        isValid,
        errorMessage,
        cursor: [currentIndexPosition, searchAfter]
      } = (0, _utils.decodeCursor)({
        cursor,
        page,
        perPage,
        sortField
      });
      if (!isValid) {
        return siemResponse.error({
          body: errorMessage,
          statusCode: 400
        });
      } else {
        const valueLists = await listClient.findList({
          currentIndexPosition,
          filter,
          page,
          perPage,
          runtimeMappings: undefined,
          searchAfter,
          sortField,
          sortOrder
        });
        const listBooleans = [];
        const chunks = (0, _lodash.chunk)(valueLists.data, 10);
        for (const listChunk of chunks) {
          const booleans = await Promise.all(listChunk.map(async valueList => {
            // Currently the only list types we support for exceptions
            if (valueList.type !== 'ip_range' && valueList.type !== 'ip' && valueList.type !== 'keyword') {
              return false;
            }
            const list = await listClient.findListItem({
              currentIndexPosition: 0,
              filter: '',
              listId: valueList.id,
              page: 0,
              perPage: 0,
              runtimeMappings: undefined,
              searchAfter: [],
              sortField: undefined,
              sortOrder: undefined
            });
            if (valueList.type === 'ip_range' && list && list.total < _securitysolutionListConstants.MAXIMUM_SMALL_VALUE_LIST_SIZE) {
              const rangeList = await listClient.findListItem({
                currentIndexPosition: 0,
                filter: 'is_cidr: false',
                listId: valueList.id,
                page: 0,
                perPage: 0,
                runtimeMappings: {
                  is_cidr: {
                    script: `
                          if (params._source["ip_range"] instanceof String) {
                            emit(true);
                          } else {
                            emit(false);
                          }
                          `,
                    type: 'boolean'
                  }
                },
                searchAfter: [],
                sortField: undefined,
                sortOrder: undefined
              });
              return rangeList && rangeList.total < _securitysolutionListConstants.MAXIMUM_SMALL_IP_RANGE_VALUE_LIST_DASH_SIZE ? true : false;
            }
            return list && list.total < _securitysolutionListConstants.MAXIMUM_SMALL_VALUE_LIST_SIZE ? true : false;
          }));
          listBooleans.push(...booleans);
        }
        const smallLists = valueLists.data.filter((valueList, index) => listBooleans[index]);
        const largeLists = valueLists.data.filter((valueList, index) => !listBooleans[index]);
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)({
          largeLists,
          smallLists
        }, _securitysolutionIoTsListTypes.foundListsBySizeSchema);
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
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.findListsBySizeRoute = findListsBySizeRoute;