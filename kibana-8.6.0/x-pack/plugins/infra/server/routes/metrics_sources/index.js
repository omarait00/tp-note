"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMetricsSourceConfigurationRoutes = void 0;
var _configSchema = require("@kbn/config-schema");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _runtime_types = require("../../../common/runtime_types");
var _has_data = require("../../lib/sources/has_data");
var _create_search_client = require("../../lib/create_search_client");
var _errors = require("../../lib/sources/errors");
var _metrics_sources = require("../../../common/metrics_sources");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initMetricsSourceConfigurationRoutes = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'get',
    path: '/api/metrics/source/{sourceId}',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string()
      })
    }
  }, async (requestContext, request, response) => {
    const {
      sourceId
    } = request.params;
    const soClient = (await requestContext.core).savedObjects.client;
    try {
      const [source, metricIndicesExist, indexFields] = await Promise.all([libs.sources.getSourceConfiguration(soClient, sourceId), libs.sourceStatus.hasMetricIndices(requestContext, sourceId), libs.fields.getFields(requestContext, sourceId, 'METRICS')]);
      if (!source) {
        return response.notFound();
      }
      const status = {
        metricIndicesExist,
        indexFields
      };
      return response.ok({
        body: _metrics_sources.metricsSourceConfigurationResponseRT.encode({
          source: {
            ...source,
            status
          }
        })
      });
    } catch (error) {
      var _error$statusCode, _error$message;
      return response.customError({
        statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500,
        body: {
          message: (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : 'An unexpected error occurred'
        }
      });
    }
  });
  framework.registerRoute({
    method: 'patch',
    path: '/api/metrics/source/{sourceId}',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string()
      }),
      body: (0, _runtime_types.createValidationFunction)(_metrics_sources.partialMetricsSourceConfigurationReqPayloadRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      sources
    } = libs;
    const {
      sourceId
    } = request.params;
    const sourceConfigurationPayload = request.body;
    try {
      const soClient = (await requestContext.core).savedObjects.client;
      const sourceConfiguration = await sources.getSourceConfiguration(soClient, sourceId);
      if (sourceConfiguration.origin === 'internal') {
        response.conflict({
          body: 'A conflicting read-only source configuration already exists.'
        });
      }
      const sourceConfigurationExists = sourceConfiguration.origin === 'stored';
      const patchedSourceConfiguration = await (sourceConfigurationExists ? sources.updateSourceConfiguration(soClient, sourceId, sourceConfigurationPayload) : sources.createSourceConfiguration(soClient, sourceId, sourceConfigurationPayload));
      const [metricIndicesExist, indexFields] = await Promise.all([libs.sourceStatus.hasMetricIndices(requestContext, sourceId), libs.fields.getFields(requestContext, sourceId, 'METRICS')]);
      const status = {
        metricIndicesExist,
        indexFields
      };
      return response.ok({
        body: _metrics_sources.metricsSourceConfigurationResponseRT.encode({
          source: {
            ...patchedSourceConfiguration,
            status
          }
        })
      });
    } catch (error) {
      var _error$statusCode2, _error$message2;
      if (_boom.default.isBoom(error)) {
        throw error;
      }
      if (error instanceof _errors.AnomalyThresholdRangeError) {
        return response.customError({
          statusCode: 400,
          body: {
            message: error.message
          }
        });
      }
      return response.customError({
        statusCode: (_error$statusCode2 = error.statusCode) !== null && _error$statusCode2 !== void 0 ? _error$statusCode2 : 500,
        body: {
          message: (_error$message2 = error.message) !== null && _error$message2 !== void 0 ? _error$message2 : 'An unexpected error occurred'
        }
      });
    }
  }));
  framework.registerRoute({
    method: 'get',
    path: '/api/metrics/source/{sourceId}/hasData',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string()
      })
    }
  }, async (requestContext, request, response) => {
    const {
      sourceId
    } = request.params;
    const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
    const soClient = (await requestContext.core).savedObjects.client;
    const source = await libs.sources.getSourceConfiguration(soClient, sourceId);
    const results = await (0, _has_data.hasData)(source.configuration.metricAlias, client);
    return response.ok({
      body: {
        hasData: results,
        configuration: source.configuration
      }
    });
  });
};
exports.initMetricsSourceConfigurationRoutes = initMetricsSourceConfigurationRoutes;