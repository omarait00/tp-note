"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionFilterRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _build_exception_filter = require("../services/exception_lists/build_exception_filter");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionFilterRoute = router => {
  router.post({
    options: {
      tags: ['access:securitySolution']
    },
    path: `${_securitysolutionListConstants.EXCEPTION_FILTER}`,
    validate: {
      body: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.getExceptionFilterSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      var _ctx$lists, _ctx$lists2, _filter;
      const ctx = await context.resolve(['lists']);
      const listClient = (_ctx$lists = ctx.lists) === null || _ctx$lists === void 0 ? void 0 : _ctx$lists.getListClient();
      if (!listClient) {
        return siemResponse.error({
          body: 'Cannot retrieve list client',
          statusCode: 500
        });
      }
      const exceptionListClient = (_ctx$lists2 = ctx.lists) === null || _ctx$lists2 === void 0 ? void 0 : _ctx$lists2.getExceptionListClient();
      const exceptionItems = [];
      const {
        type,
        alias = null,
        exclude_exceptions: excludeExceptions = true,
        chunk_size: chunkSize = 10
      } = request.body;
      if (type === 'exception_list_ids') {
        const listIds = request.body.exception_list_ids.map(({
          exception_list_id: listId
        }) => listId);
        const namespaceTypes = request.body.exception_list_ids.map(({
          namespace_type: namespaceType
        }) => namespaceType);

        // Stream the results from the Point In Time (PIT) finder into this array
        let items = [];
        const executeFunctionOnStream = responseBody => {
          items = [...items, ...responseBody.data];
        };
        await (exceptionListClient === null || exceptionListClient === void 0 ? void 0 : exceptionListClient.findExceptionListsItemPointInTimeFinder({
          executeFunctionOnStream,
          filter: [],
          listId: listIds,
          maxSize: undefined,
          // NOTE: This is unbounded when it is "undefined"
          namespaceType: namespaceTypes,
          perPage: 1_000,
          // See https://github.com/elastic/kibana/issues/93770 for choice of 1k
          sortField: undefined,
          sortOrder: undefined
        }));
        exceptionItems.push(...items);
      } else {
        const {
          exceptions
        } = request.body;
        exceptionItems.push(...exceptions);
      }
      const {
        filter
      } = await (0, _build_exception_filter.buildExceptionFilter)({
        alias,
        chunkSize,
        excludeExceptions,
        listClient,
        lists: exceptionItems
      });
      return response.ok({
        body: (_filter = {
          filter
        }) !== null && _filter !== void 0 ? _filter : {}
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
exports.getExceptionFilterRoute = getExceptionFilterRoute;