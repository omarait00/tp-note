"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLiveQueryResultsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _common = require("../../../common");
var _search_strategy = require("../../../common/search_strategy");
var _build_query = require("../../../common/utils/build_query");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLiveQueryResultsRoute = router => {
  router.get({
    path: '/api/osquery/live_queries/{id}/results/{actionId}',
    validate: {
      query: _configSchema.schema.object({
        filterQuery: _configSchema.schema.maybe(_configSchema.schema.string()),
        page: _configSchema.schema.maybe(_configSchema.schema.number()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number()),
        sort: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')]))
      }, {
        unknowns: 'allow'
      }),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string(),
        actionId: _configSchema.schema.string()
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
      var _actionDetails$_sourc, _request$query$page, _request$query$pageSi, _request$query$sortOr, _request$query$sort;
      const search = await context.search;
      const {
        actionDetails
      } = await (0, _rxjs.lastValueFrom)(search.search({
        actionId: request.params.id,
        filterQuery: (0, _build_query.createFilter)(request.query.filterQuery),
        factoryQueryType: _search_strategy.OsqueryQueries.actionDetails
      }, {
        abortSignal,
        strategy: 'osquerySearchStrategy'
      }));
      const queries = actionDetails === null || actionDetails === void 0 ? void 0 : (_actionDetails$_sourc = actionDetails._source) === null || _actionDetails$_sourc === void 0 ? void 0 : _actionDetails$_sourc.queries;
      await (0, _rxjs.lastValueFrom)((0, _rxjs.zip)(...(0, _lodash.map)(queries, query => {
        var _query$agents$length, _query$agents;
        return (0, _utils.getActionResponses)(search, query.action_id, (_query$agents$length = (_query$agents = query.agents) === null || _query$agents === void 0 ? void 0 : _query$agents.length) !== null && _query$agents$length !== void 0 ? _query$agents$length : 0);
      })));
      const res = await (0, _rxjs.lastValueFrom)(search.search({
        actionId: request.params.actionId,
        factoryQueryType: _search_strategy.OsqueryQueries.results,
        filterQuery: (0, _build_query.createFilter)(request.query.filterQuery),
        pagination: (0, _build_query.generateTablePaginationOptions)((_request$query$page = request.query.page) !== null && _request$query$page !== void 0 ? _request$query$page : 0, (_request$query$pageSi = request.query.pageSize) !== null && _request$query$pageSi !== void 0 ? _request$query$pageSi : 100),
        sort: {
          direction: (_request$query$sortOr = request.query.sortOrder) !== null && _request$query$sortOr !== void 0 ? _request$query$sortOr : 'desc',
          field: (_request$query$sort = request.query.sort) !== null && _request$query$sort !== void 0 ? _request$query$sort : '@timestamp'
        }
      }, {
        abortSignal,
        strategy: 'osquerySearchStrategy'
      }));
      return response.ok({
        body: {
          data: res
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
exports.getLiveQueryResultsRoute = getLiveQueryResultsRoute;
function getRequestAbortedSignal(aborted$) {
  const controller = new AbortController();
  aborted$.subscribe(() => controller.abort());
  return controller.signal;
}