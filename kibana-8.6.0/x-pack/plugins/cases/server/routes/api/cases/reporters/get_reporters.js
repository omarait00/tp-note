"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReportersRoute = void 0;
var _constants = require("../../../../../common/constants");
var _error = require("../../../../common/error");
var _create_cases_route = require("../../create_cases_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getReportersRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: _constants.CASE_REPORTERS_URL,
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const caseContext = await context.cases;
      const client = await caseContext.getCasesClient();
      const options = request.query;
      return response.ok({
        body: await client.cases.getReporters({
          ...options
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to find cases in route: ${error}`,
        error
      });
    }
  }
});
exports.getReportersRoute = getReportersRoute;