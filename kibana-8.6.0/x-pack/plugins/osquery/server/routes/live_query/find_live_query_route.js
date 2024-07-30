"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLiveQueryRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _common = require("../../../common");
var _search_strategy = require("../../../common/search_strategy");
var _build_query = require("../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findLiveQueryRoute = router => {
  router.get({
    path: '/api/osquery/live_queries',
    validate: {
      query: _configSchema.schema.object({
        filterQuery: _configSchema.schema.maybe(_configSchema.schema.string()),
        page: _configSchema.schema.maybe(_configSchema.schema.number()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number()),
        sort: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')]))
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    const abortSignal = getRequestAbortedSignal(request.events.aborted$);
    try {
      var _request$query$page, _request$query$pageSi, _request$query$sortOr, _request$query$sort;
      const search = await context.search;
      const res = await (0, _rxjs.lastValueFrom)(search.search({
        factoryQueryType: _search_strategy.OsqueryQueries.actions,
        filterQuery: (0, _build_query.createFilter)(request.query.filterQuery),
        pagination: (0, _build_query.generateTablePaginationOptions)((_request$query$page = request.query.page) !== null && _request$query$page !== void 0 ? _request$query$page : 0, (_request$query$pageSi = request.query.pageSize) !== null && _request$query$pageSi !== void 0 ? _request$query$pageSi : 100),
        sort: {
          direction: (_request$query$sortOr = request.query.sortOrder) !== null && _request$query$sortOr !== void 0 ? _request$query$sortOr : 'desc',
          field: (_request$query$sort = request.query.sort) !== null && _request$query$sort !== void 0 ? _request$query$sort : 'created_at'
        }
      }, {
        abortSignal,
        strategy: 'osquerySearchStrategy'
      }));
      return response.ok({
        body: {
          data: {
            ...(0, _lodash.omit)(res, 'edges'),
            items: res.edges
          }
        }
      });
    } catch (e) {
      var _e$statusCode;
      return response.customError({
        statusCode: (_e$statusCode = e.statusCode) !== null && _e$statusCode !== void 0 ? _e$statusCode : 500,
        body: {
          message: e.message
        }
      });
    }
  });
};
exports.findLiveQueryRoute = findLiveQueryRoute;
function getRequestAbortedSignal(aborted$) {
  const controller = new AbortController();
  aborted$.subscribe(() => controller.abort());
  return controller.signal;
}