"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetK8sAnomaliesRoute = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _infra_ml = require("../../../../common/http_api/infra_ml");
var _runtime_types = require("../../../../common/runtime_types");
var _request_context = require("../../../utils/request_context");
var _infra_ml2 = require("../../../lib/infra_ml");
var _errors = require("../../../lib/infra_ml/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initGetK8sAnomaliesRoute = ({
  framework
}) => {
  framework.registerRoute({
    method: 'post',
    path: _infra_ml.INFA_ML_GET_METRICS_K8S_ANOMALIES_PATH,
    validate: {
      body: (0, _runtime_types.createValidationFunction)(_infra_ml.getMetricsK8sAnomaliesRequestPayloadRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      data: {
        sourceId,
        anomalyThreshold,
        timeRange: {
          startTime,
          endTime
        },
        sort: sortParam,
        pagination: paginationParam,
        metric,
        query
      }
    } = request.body;
    const {
      sort,
      pagination
    } = getSortAndPagination(sortParam, paginationParam);
    try {
      const infraMlContext = await (0, _request_context.assertHasInfraMlPlugins)(requestContext);
      const {
        data: anomalies,
        paginationCursors,
        hasMoreEntries,
        timing
      } = await (0, _infra_ml2.getMetricK8sAnomalies)({
        context: await infraMlContext.infra,
        sourceId,
        anomalyThreshold,
        startTime,
        endTime,
        metric,
        query,
        sort,
        pagination
      });
      return response.ok({
        body: _infra_ml.getMetricsK8sAnomaliesSuccessReponsePayloadRT.encode({
          data: {
            anomalies,
            hasMoreEntries,
            paginationCursors
          },
          timing
        })
      });
    } catch (error) {
      var _error$statusCode, _error$message;
      if (_boom.default.isBoom(error)) {
        throw error;
      }
      if ((0, _errors.isMlPrivilegesError)(error)) {
        return response.customError({
          statusCode: 403,
          body: {
            message: error.message
          }
        });
      }
      return response.customError({
        statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500,
        body: {
          message: (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : 'An unexpected error occurred'
        }
      });
    }
  }));
};
exports.initGetK8sAnomaliesRoute = initGetK8sAnomaliesRoute;
const getSortAndPagination = (sort = {}, pagination = {}) => {
  const sortDefaults = {
    field: 'anomalyScore',
    direction: 'desc'
  };
  const sortWithDefaults = {
    ...sortDefaults,
    ...sort
  };
  const paginationDefaults = {
    pageSize: 50
  };
  const paginationWithDefaults = {
    ...paginationDefaults,
    ...pagination
  };
  return {
    sort: sortWithDefaults,
    pagination: paginationWithDefaults
  };
};