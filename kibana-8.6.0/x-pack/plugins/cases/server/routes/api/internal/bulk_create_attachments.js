"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateAttachmentsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bulkCreateAttachmentsRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'post',
  path: _constants.INTERNAL_BULK_CREATE_ATTACHMENTS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string()
    }),
    body: _configSchema.schema.arrayOf(_utils.escapeHatch)
  },
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const casesContext = await context.cases;
      const casesClient = await casesContext.getCasesClient();
      const caseId = request.params.case_id;
      const attachments = request.body;
      return response.ok({
        body: await casesClient.attachments.bulkCreate({
          caseId,
          attachments
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to bulk create attachments in route case id: ${request.params.case_id}: ${error}`,
        error
      });
    }
  }
});
exports.bulkCreateAttachmentsRoute = bulkCreateAttachmentsRoute;