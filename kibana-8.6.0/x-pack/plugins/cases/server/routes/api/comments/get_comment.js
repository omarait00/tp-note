"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommentRoute = void 0;
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

const getCommentRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: _constants.CASE_COMMENT_DETAILS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string(),
      comment_id: _configSchema.schema.string()
    })
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
        body: await client.attachments.get({
          attachmentID: request.params.comment_id,
          caseID: request.params.case_id
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get comment in route case id: ${request.params.case_id} comment id: ${request.params.comment_id}: ${error}`,
        error
      });
    }
  }
});
exports.getCommentRoute = getCommentRoute;