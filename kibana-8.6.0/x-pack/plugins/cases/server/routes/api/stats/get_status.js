"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusRoute = void 0;
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated since version 8.1.0
 */
const getStatusRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: _constants.CASE_STATUS_URL,
  options: {
    deprecated: true
  },
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const caseContext = await context.cases;
      const client = await caseContext.getCasesClient();
      return response.ok({
        body: await client.metrics.getStatusTotalsByType(request.query)
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get status stats in route: ${error}`,
        error
      });
    }
  }
});
exports.getStatusRoute = getStatusRoute;