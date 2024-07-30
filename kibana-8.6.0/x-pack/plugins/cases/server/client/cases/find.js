"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = void 0;
var _lodash = require("lodash");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _api = require("../../../common/api");
var _error = require("../../common/error");
var _utils = require("../../common/utils");
var _utils2 = require("../utils");
var _utils3 = require("../../authorization/utils");
var _authorization = require("../../authorization");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves a case and optionally its comments.
 *
 * @ignore
 */
const find = async (params, clientArgs) => {
  const {
    services: {
      caseService,
      licensingService
    },
    authorization,
    logger
  } = clientArgs;
  try {
    const fields = (0, _utils.asArray)(params.fields);
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesFindRequestRt).decode({
      ...params,
      fields
    }), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findCases);

    /**
     * Assign users to a case is only available to Platinum+
     */

    if (!(0, _lodash.isEmpty)(queryParams.assignees)) {
      const hasPlatinumLicenseOrGreater = await licensingService.isAtLeastPlatinum();
      if (!hasPlatinumLicenseOrGreater) {
        throw _boom.default.forbidden('In order to filter cases by assignees, you must be subscribed to an Elastic Platinum license');
      }
      licensingService.notifyUsage(_constants.LICENSING_CASE_ASSIGNMENT_FEATURE);
    }
    const queryArgs = {
      tags: queryParams.tags,
      reporters: queryParams.reporters,
      sortByField: queryParams.sortField,
      status: queryParams.status,
      severity: queryParams.severity,
      owner: queryParams.owner,
      from: queryParams.from,
      to: queryParams.to,
      assignees: queryParams.assignees
    };
    const statusStatsOptions = (0, _utils2.constructQueryOptions)({
      ...queryArgs,
      status: undefined,
      authorizationFilter
    });
    const caseQueryOptions = (0, _utils2.constructQueryOptions)({
      ...queryArgs,
      authorizationFilter
    });
    const [cases, statusStats] = await Promise.all([caseService.findCasesGroupedByID({
      caseOptions: {
        ...queryParams,
        ...caseQueryOptions,
        searchFields: (0, _utils.asArray)(queryParams.searchFields),
        fields: (0, _utils3.includeFieldsRequiredForAuthentication)(fields)
      }
    }), caseService.getCaseStatusStats({
      searchOptions: statusStatsOptions
    })]);
    ensureSavedObjectsAreAuthorized([...cases.casesMap.values()]);
    return _api.CasesFindResponseRt.encode((0, _utils.transformCases)({
      casesMap: cases.casesMap,
      page: cases.page,
      perPage: cases.perPage,
      total: cases.total,
      countOpenCases: statusStats.open,
      countInProgressCases: statusStats['in-progress'],
      countClosedCases: statusStats.closed
    }));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to find cases: ${JSON.stringify(params)}: ${error}`,
      error,
      logger
    });
  }
};
exports.find = find;