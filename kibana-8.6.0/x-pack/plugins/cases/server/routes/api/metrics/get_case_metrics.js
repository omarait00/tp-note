"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCaseMetricRoute = void 0;
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

const getCaseMetricRoute = (0, _create_cases_route.createCasesRoute)({
  method: 'get',
  path: _constants.CASE_METRICS_DETAILS_URL,
  params: {
    params: _configSchema.schema.object({
      case_id: _configSchema.schema.string({
        minLength: 1
      })
    }),
    query: _configSchema.schema.object({
      features: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string({
        minLength: 1
      })), _configSchema.schema.string({
        minLength: 1
      })])
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
      const {
        features
      } = request.query;
      return response.ok({
        body: await client.metrics.getCaseMetrics({
          caseId: request.params.case_id,
          features: Array.isArray(features) ? features : [features]
        })
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get case metrics in route: ${error}`,
        error
      });
    }
  }
});
exports.getCaseMetricRoute = getCaseMetricRoute;