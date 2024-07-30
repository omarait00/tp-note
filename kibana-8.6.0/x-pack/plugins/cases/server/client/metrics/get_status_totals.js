"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusTotalsByType = getStatusTotalsByType;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _api = require("../../../common/api");
var _authorization = require("../../authorization");
var _utils = require("../utils");
var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getStatusTotalsByType(params, clientArgs) {
  const {
    services: {
      caseService
    },
    logger,
    authorization
  } = clientArgs;
  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesStatusRequestRt).decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getCaseStatuses);
    const options = (0, _utils.constructQueryOptions)({
      owner: queryParams.owner,
      from: queryParams.from,
      to: queryParams.to,
      authorizationFilter
    });
    const statusStats = await caseService.getCaseStatusStats({
      searchOptions: options
    });
    return _api.CasesStatusResponseRt.encode({
      count_open_cases: statusStats.open,
      count_in_progress_cases: statusStats['in-progress'],
      count_closed_cases: statusStats.closed
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get status stats: ${error}`,
      error,
      logger
    });
  }
}