"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAggregateRoute = exports.doSearch = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../session_view/common/constants");
var _constants2 = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// sort by values
const ASC = 'asc';
const DESC = 'desc';
const registerAggregateRoute = router => {
  router.get({
    path: _constants2.AGGREGATE_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        query: _configSchema.schema.string(),
        countBy: _configSchema.schema.maybe(_configSchema.schema.string()),
        groupBy: _configSchema.schema.string(),
        page: _configSchema.schema.number(),
        perPage: _configSchema.schema.maybe(_configSchema.schema.number()),
        index: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortByCount: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      query,
      countBy,
      sortByCount,
      groupBy,
      page,
      perPage,
      index
    } = request.query;
    try {
      const body = await doSearch(client, query, groupBy, page, perPage, index, countBy, sortByCount);
      return response.ok({
        body
      });
    } catch (err) {
      return response.badRequest(err.message);
    }
  });
};
exports.registerAggregateRoute = registerAggregateRoute;
const doSearch = async (client, query, groupBy, page,
// zero based
perPage = _constants2.AGGREGATE_PAGE_SIZE, index, countBy, sortByCount) => {
  var _search$aggregations;
  const queryDSL = JSON.parse(query);
  const countByAggs = countBy ? {
    count_by_aggs: {
      cardinality: {
        field: countBy
      }
    }
  } : undefined;
  let sort = {
    _key: {
      order: ASC
    }
  };
  if (sortByCount === ASC || sortByCount === DESC) {
    sort = {
      'count_by_aggs.value': {
        order: sortByCount
      }
    };
  }
  const search = await client.search({
    index: [index || _constants.PROCESS_EVENTS_INDEX],
    body: {
      query: queryDSL,
      size: 0,
      aggs: {
        custom_agg: {
          terms: {
            field: groupBy,
            size: _constants2.AGGREGATE_MAX_BUCKETS
          },
          aggs: {
            ...countByAggs,
            bucket_sort: {
              bucket_sort: {
                sort: [sort],
                // defaulting to alphabetic sort
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