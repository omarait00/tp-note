"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMonitorListRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createMonitorListRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.MONITOR_LIST,
  validate: {
    query: _configSchema.schema.object({
      dateRangeStart: _configSchema.schema.string(),
      dateRangeEnd: _configSchema.schema.string(),
      filters: _configSchema.schema.maybe(_configSchema.schema.string()),
      pagination: _configSchema.schema.maybe(_configSchema.schema.string()),
      statusFilter: _configSchema.schema.maybe(_configSchema.schema.string()),
      query: _configSchema.schema.maybe(_configSchema.schema.string()),
      pageSize: _configSchema.schema.number()
    })
  },
  options: {
    tags: ['access:uptime-read']
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      dateRangeStart,
      dateRangeEnd,
      filters,
      pagination,
      statusFilter,
      pageSize,
      query
    } = request.query;
    const decodedPagination = pagination ? JSON.parse(decodeURIComponent(pagination)) : _constants.CONTEXT_DEFAULTS.CURSOR_PAGINATION;
    try {
      const result = await libs.requests.getMonitorStates({
        uptimeEsClient,
        dateRangeStart,
        dateRangeEnd,
        pagination: decodedPagination,
        pageSize,
        filters,
        query,
        statusFilter
      });
      return result;
    } catch (e) {
      /**
       * This particular error is usually indicative of a mapping problem within the user's
       * indices. It's relevant for the UI because we will be able to provide the user with a
       * tailored message to help them remediate this problem on their own with minimal effort.
       */
      if (e.name === 'ResponseError') {
        return response.badRequest({
          body: e
        });
      }
      throw e;
    }
  }
});
exports.createMonitorListRoute = createMonitorListRoute;