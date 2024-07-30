"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllAlertsAttachedToCaseRoute = void 0;
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

const getAllAlertsAttachedToCaseRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: _constants.CASE_DETAILS_ALERTS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string({
        minLength: 1
      })
    })
  },
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const caseId = request.params.case_id;
      const caseContext = await context.cases;
      const casesClient = await caseContext.getCasesClient();
      return response.ok({
        body: await casesClient.attachments.getAllAlertsAttachToCase({
          caseId
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve alert ids for this case id: ${request.params.case_id}: ${error}`,
        error
      });
    }
  }
});
exports.getAllAlertsAttachedToCaseRoute = getAllAlertsAttachedToCaseRoute;