"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postCaseRoute = void 0;
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const postCaseRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'post',
  path: _constants.CASES_URL,
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const caseContext = await context.cases;
      const casesClient = await caseContext.getCasesClient();
      const theCase = request.body;
      return response.ok({
        body: await casesClient.cases.create({
          ...theCase
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to post case in route: ${error}`,
        error
      });
    }
  }
});
exports.postCaseRoute = postCaseRoute;