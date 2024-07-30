"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserActionsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
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
const getUserActionsRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: _constants.CASE_USER_ACTIONS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string()
    })
  },
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
      const casesClient = await caseContext.getCasesClient();
      const caseId = request.params.case_id;
      return response.ok({
        body: await casesClient.userActions.getAll({
          caseId
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve case user actions in route case id: ${request.params.case_id}: ${error}`,
        error
      });
    }
  }
});
exports.getUserActionsRoute = getUserActionsRoute;