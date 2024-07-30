"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAnalyticsRoutes = registerAnalyticsRoutes;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _error_codes = require("../../../common/types/error_codes");
var _add_analytics_collection = require("../../lib/analytics/add_analytics_collection");
var _delete_analytics_collection = require("../../lib/analytics/delete_analytics_collection");
var _fetch_analytics_collection = require("../../lib/analytics/fetch_analytics_collection");
var _create_error = require("../../utils/create_error");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createIndexNotFoundError = (error, response) => {
  return (0, _create_error.createError)({
    errorCode: error.message,
    message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addAnalyticsCollection.analyticsCollectionNotFoundErrorMessage', {
      defaultMessage: 'Analytics collection not found'
    }),
    response,
    statusCode: 404
  });
};
function registerAnalyticsRoutes({
  router,
  log
}) {
  router.get({
    path: '/internal/enterprise_search/analytics/collections',
    validate: {}
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const collections = await (0, _fetch_analytics_collection.fetchAnalyticsCollections)(client);
    return response.ok({
      body: collections
    });
  }));
  router.get({
    path: '/internal/enterprise_search/analytics/collections/{collection_name}',
    validate: {
      params: _configSchema.schema.object({
        collection_name: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const collection = await (0, _fetch_analytics_collection.fetchAnalyticsCollectionByName)(client, request.params.collection_name);
      if (!collection) {
        throw new Error(_error_codes.ErrorCode.ANALYTICS_COLLECTION_NOT_FOUND);
      }
      return response.ok({
        body: collection
      });
    } catch (error) {
      if (error.message === _error_codes.ErrorCode.ANALYTICS_COLLECTION_NOT_FOUND) {
        return createIndexNotFoundError(error, response);
      }
      throw error;
    }
  }));
  router.post({
    path: '/internal/enterprise_search/analytics/collections',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const body = await (0, _add_analytics_collection.addAnalyticsCollection)(client, request.body);
      return response.ok({
        body
      });
    } catch (error) {
      if (error.message === _error_codes.ErrorCode.ANALYTICS_COLLECTION_ALREADY_EXISTS) {
        return (0, _create_error.createError)({
          errorCode: error.message,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addAnalyticsCollection.analyticsCollectionExistsError', {
            defaultMessage: 'Analytics collection already exists'
          }),
          response,
          statusCode: 409
        });
      } else if (error.message === _error_codes.ErrorCode.ANALYTICS_COLLECTION_NAME_INVALID) {
        return (0, _create_error.createError)({
          errorCode: error.message,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addAnalyticsCollection.analyticsCollectionNameInvalidError', {
            defaultMessage: 'Name must only contain alphanumeric characters and underscores'
          }),
          response,
          statusCode: 400
        });
      }
      throw error;
    }
  }));
  router.delete({
    path: '/internal/enterprise_search/analytics/collections/{collection_name}',
    validate: {
      params: _configSchema.schema.object({
        collection_name: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      await (0, _delete_analytics_collection.deleteAnalyticsCollectionByName)(client, request.params.collection_name);
      return response.ok();
    } catch (error) {
      if (error.message === _error_codes.ErrorCode.ANALYTICS_COLLECTION_NOT_FOUND) {
        return createIndexNotFoundError(error, response);
      }
      throw error;
    }
  }));
}