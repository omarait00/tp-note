"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchCommentRoute = void 0;
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _configSchema = require("@kbn/config-schema");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _api = require("../../../../common/api");
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const patchCommentRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'patch',
  path: _constants.CASE_COMMENTS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string()
    })
  },
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const query = (0, _pipeable.pipe)(_api.CommentPatchRequestRt.decode(request.body), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const caseContext = await context.cases;
      const client = await caseContext.getCasesClient();
      return response.ok({
        body: await client.attachments.update({
          caseID: request.params.case_id,
          updateRequest: query
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to patch comment in route case id: ${request.params.case_id}: ${error}`,
        error
      });
    }
  }
});
exports.patchCommentRoute = patchCommentRoute;