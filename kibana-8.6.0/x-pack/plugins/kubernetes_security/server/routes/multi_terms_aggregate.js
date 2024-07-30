"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMultiTermsAggregateRoute = exports.doSearch = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../session_view/common/constants");
var _constants2 = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerMultiTermsAggregateRoute = router => {
  router.get({
    path: _constants2.MULTI_TERMS_AGGREGATE_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        query: _configSchema.schema.string(),
        countBy: _configSchema.schema.maybe(_configSchema.schema.string()),
        groupBys: _configSchema.schema.arrayOf(_configSchema.schema.object({
          field: _configSchema.schema.string(),
          missing: _configSchema.schema.maybe(_configSchema.schema.string())
        }), {
          defaultValue: []
        }),
        page: _configSchema.schema.number(),
        perPage: _configSchema.schema.maybe(_configSchema.schema.number()),
        index: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      query,
      countBy,
      groupBys,
      page,
      perPage,
      index
    } = request.query;
    try {
      const body = await doSearch(client, query, groupBys, page, perPage, index, countBy);
      return response.ok({
        body
      });
    } catch (err) {
      return response.badRequest(err.message);
    }
  });
};
exports.registerMultiTermsAggregateRoute = registerMultiTermsAggregateRoute;
const doSearch = async (client, query, groupBys, page,
// zero based
perPage = _constants2.AGGREGATE_PAGE_SIZE, index, countBy) => {
  var _search$aggregations;
  const queryDSL = JSON.parse(query);
  const countByAggs = countBy ? {
    count_by_aggs: {
      cardinality: {
        field: countBy
      }
    }
  } : undefined;
  const search = await client.search({
    index: [index || _constants.PROCESS_EVENTS_INDEX],
    body: {
      query: queryDSL,
      size: 0,
      aggs: {
        custom_agg: {
          multi_terms: {
            terms: groupBys
          },
          aggs: {
            ...countByAggs,
            bucket_sort: {
              bucket_sort: {
                size: perPage + 1,
                // check if there's a "next page"
                from: perPage * page
              }
            }
          }
        }
      }
    }
  });
  const agg = (_search$aggregations = search.aggregations) === null || _search$aggregations === void 0 ? void 0 : _search$aggregations.custom_agg;
  const buckets = (agg === null || agg === void 0 ? void 0 : agg.buckets) || [];
  const hasNextPage = buckets.length > perPage;
  if (hasNextPage) {
    buckets.pop();
  }
  return {
    buckets,
    hasNextPage
  };
};
exports.doSearch = doSearch;