"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleExecutionResultsRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
var _utils = require("../../../routes/utils");
var _rule_monitoring = require("../../../../../../common/detection_engine/rule_monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns execution results of a given rule (aggregated by execution UUID) from Event Log.
 * Accepts rule's saved object ID (`rule.id`), `start`, `end` and `filters` query params.
 */
const getRuleExecutionResultsRoute = router => {
  router.get({
    path: _rule_monitoring.GET_RULE_EXECUTION_RESULTS_URL,
    validate: {
      params: (0, _route_validation.buildRouteValidation)(_rule_monitoring.GetRuleExecutionResultsRequestParams),
      query: (0, _route_validation.buildRouteValidation)(_rule_monitoring.GetRuleExecutionResultsRequestQuery)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const {
      ruleId
    } = request.params;
    const {
      start,
      end,
      query_text: queryText,
      status_filters: statusFilters,
      page,
      per_page: perPage,
      sort_field: sortField,
      sort_order: sortOrder
    } = request.query;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const ctx = await context.resolve(['securitySolution']);
      const executionLog = ctx.securitySolution.getRuleExecutionLog();
      const executionResultsResponse = await executionLog.getExecutionResults({
        ruleId,
        start,
        end,
        queryText,
        statusFilters,
        page,
        perPage,
        sortField,
        sortOrder
      });
      const responseBody = executionResultsResponse;
      return response.ok({
        body: responseBody
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getRuleExecutionResultsRoute = getRuleExecutionResultsRoute;