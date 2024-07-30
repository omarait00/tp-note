"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findCommentsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _api = require("../../../../common/api");
var _constants = require("../../../../common/constants");
var _create_cases_route = require("../create_cases_route");
var _error = require("../../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findCommentsRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: `${_constants.CASE_COMMENTS_URL}/_find`,
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
      const query = (0, _pipeable.pipe)((0, _api.excess)(_api.FindQueryParamsRt).decode(request.query), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const caseContext = await context.cases;
      const client = await caseContext.getCasesClient();
      return response.ok({
        body: await client.attachments.find({
          caseID: request.params.case_id,
          queryParams: query
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to find comments in route case id: ${request.params.case_id}: ${error}`,
        error
      });
    }
  }
});
exports.findCommentsRoute = findCommentsRoute;