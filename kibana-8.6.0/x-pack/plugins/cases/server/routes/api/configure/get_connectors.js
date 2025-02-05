"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnectorsRoute = void 0;
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Be aware that this api will only return 20 connectors
 */
const getConnectorsRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: `${_constants.CASE_CONFIGURE_CONNECTORS_URL}/_find`,
  handler: async ({
    context,
    response
  }) => {
    try {
      const caseContext = await context.cases;
      const client = await caseContext.getCasesClient();
      return response.ok({
        body: await client.configure.getConnectors()
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get connectors in route: ${error}`,
        error
      });
    }
  }
});
exports.getConnectorsRoute = getConnectorsRoute;