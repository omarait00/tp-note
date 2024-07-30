"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCountRoute = exports.doCount = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../session_view/common/constants");
var _constants2 = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerCountRoute = router => {
  router.get({
    path: _constants2.COUNT_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        query: _configSchema.schema.string(),
        field: _configSchema.schema.string(),
        index: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      query,
      field,
      index
    } = request.query;
    try {
      const body = await doCount(client, query, field, index);
      return response.ok({
        body
      });
    } catch (err) {
      return response.badRequest(err.message);
    }
  });
};
exports.registerCountRoute = registerCountRoute;
const doCount = async (client, query, field, index) => {
  var _search$aggregations;
  const queryDSL = JSON.parse(query);
  const search = await client.search({
    index: [index || _constants.PROCESS_EVENTS_INDEX],
    body: {
      query: queryDSL,
      size: 0,
      aggs: {
        custom_count: {
          cardinality: {
            field
          }
        }
      }
    }
  });
  const agg = (_search$aggregations = search.aggregations) === null || _search$aggregations === void 0 ? void 0 : _search$aggregations.custom_count;
  return (agg === null || agg === void 0 ? void 0 : agg.value) || 0;
};
exports.doCount = doCount;