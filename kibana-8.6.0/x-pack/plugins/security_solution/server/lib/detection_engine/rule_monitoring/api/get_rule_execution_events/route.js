"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleExecutionEventsRoute = void 0;
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
 * Returns execution events of a given rule (e.g. status changes) from Event Log.
 * Accepts rule's saved object ID (`rule.id`) and options for filtering, sorting and pagination.
 */
const getRuleExecutionEventsRoute = router => {
  router.get({
    path: _rule_monitoring.GET_RULE_EXECUTION_EVENTS_URL,
    validate: {
      params: (0, _route_validation.buildRouteValidation)(_rule_monitoring.GetRuleExecutionEventsRequestParams),
      query: (0, _route_validation.buildRouteValidation)(_rule_monitoring.GetRuleExecutionEventsRequestQuery)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const {
      params,
      query
    } = request;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const ctx = await context.resolve(['securitySolution']);
      const executionLog = ctx.securitySolution.getRuleExecutionLog();
      const executionEventsResponse = await executionLog.getExecutionEvents({
        ruleId: params.ruleId,
        eventTypes: query.event_types,
        logLevels: query.log_levels,
        sortOrder: query.sort_order,
        page: query.page,
        perPage: query.per_page
      });
      const responseBody = executionEventsResponse;
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
exports.getRuleExecutionEventsRoute = getRuleExecutionEventsRoute;