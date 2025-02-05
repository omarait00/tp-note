"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsGetPingsRoute = exports.getPingsRouteQuerySchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
var _query_pings = require("../../common/pings/query_pings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPingsRouteQuerySchema = _configSchema.schema.object({
  from: _configSchema.schema.string(),
  to: _configSchema.schema.string(),
  locations: _configSchema.schema.maybe(_configSchema.schema.string()),
  excludedLocations: _configSchema.schema.maybe(_configSchema.schema.string()),
  monitorId: _configSchema.schema.maybe(_configSchema.schema.string()),
  index: _configSchema.schema.maybe(_configSchema.schema.number()),
  size: _configSchema.schema.maybe(_configSchema.schema.number()),
  pageIndex: _configSchema.schema.maybe(_configSchema.schema.number()),
  sort: _configSchema.schema.maybe(_configSchema.schema.string()),
  status: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.getPingsRouteQuerySchema = getPingsRouteQuerySchema;
const syntheticsGetPingsRoute = libs => ({
  method: 'GET',
  path: _constants.SYNTHETICS_API_URLS.PINGS,
  validate: {
    query: getPingsRouteQuerySchema
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      from,
      to,
      index,
      monitorId,
      status,
      sort,
      size,
      pageIndex,
      locations,
      excludedLocations
    } = request.query;
    return await (0, _query_pings.queryPings)({
      uptimeEsClient,
      dateRange: {
        from,
        to
      },
      index,
      monitorId,
      status,
      sort,
      size,
      pageIndex,
      locations: locations ? JSON.parse(locations) : [],
      excludedLocations
    });
  }
});
exports.syntheticsGetPingsRoute = syntheticsGetPingsRoute;