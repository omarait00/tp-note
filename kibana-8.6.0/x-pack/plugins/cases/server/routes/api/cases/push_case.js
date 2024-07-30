"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushCaseRoute = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
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

const pushCaseRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'post',
  path: _constants.CASE_PUSH_URL,
  handler: async ({
    context,
    request,
    response
  }) => {
    try {
      const caseContext = await context.cases;
      const casesClient = await caseContext.getCasesClient();
      const params = (0, _pipeable.pipe)(_api.CasePushRequestParamsRt.decode(request.params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      return response.ok({
        body: await casesClient.cases.push({
          caseId: params.case_id,
          connectorId: params.connector_id
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to push case in route: ${error}`,
        error
      });
    }
  }
});
exports.pushCaseRoute = pushCaseRoute;