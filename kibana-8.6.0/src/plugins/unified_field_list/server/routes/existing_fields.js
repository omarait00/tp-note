"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existingFieldsRoute = existingFieldsRoute;
var _elasticsearch = require("@elastic/elasticsearch");
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../data/server");
var _field_existing_utils = require("../../common/utils/field_existing_utils");
var _constants = require("../../common/constants");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function existingFieldsRoute(setup, logger) {
  const router = setup.http.createRouter();
  router.post({
    path: _constants.FIELD_EXISTING_API_PATH,
    validate: {
      params: _configSchema.schema.object({
        dataViewId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        dslQuery: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        fromDate: _configSchema.schema.maybe(_configSchema.schema.string()),
        toDate: _configSchema.schema.maybe(_configSchema.schema.string()),
        timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, req, res) => {
    const [{
      savedObjects,
      elasticsearch,
      uiSettings
    }, {
      dataViews
    }] = await setup.getStartServices();
    const savedObjectsClient = savedObjects.getScopedClient(req);
    const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
    const [includeFrozen, useSampling, metaFields] = await Promise.all([uiSettingsClient.get(_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN), uiSettingsClient.get(_common.FIELD_EXISTENCE_SETTING), uiSettingsClient.get(_server.UI_SETTINGS.META_FIELDS)]);
    const esClient = elasticsearch.client.asScoped(req).asCurrentUser;
    try {
      const dataViewsService = await dataViews.dataViewsServiceFactory(savedObjectsClient, esClient);
      return res.ok({
        body: await (0, _field_existing_utils.fetchFieldExistence)({
          ...req.body,
          dataViewsService,
          includeFrozen,
          useSampling,
          metaFields,
          dataView: await dataViewsService.get(req.params.dataViewId),
          search: async params => {
            const contextCore = await context.core;
            return await contextCore.elasticsearch.client.asCurrentUser.search({
              ...params
            }, {
              // Global request timeout. Will cancel the request if exceeded. Overrides the elasticsearch.requestTimeout
              requestTimeout: '5000ms',
              // Fails fast instead of retrying- default is to retry
              maxRetries: 0
            });
          }
        })
      });
    } catch (e) {
      if (e instanceof _elasticsearch.errors.TimeoutError) {
        logger.info(`Field existence check timed out on ${req.params.dataViewId}`);
        // 408 is Request Timeout
        return res.customError({
          statusCode: 408,
          body: e.message
        });
      }
      logger.info(`Field existence check failed on ${req.params.dataViewId}: ${(0, _field_existing_utils.isBoomError)(e) ? e.output.payload.message : e.message}`);
      if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
        return res.notFound({
          body: e.message
        });
      }
      if ((0, _field_existing_utils.isBoomError)(e)) {
        if (e.output.statusCode === 404) {
          return res.notFound({
            body: e.output.payload.message
          });
        }
        throw new Error(e.output.payload.message);
      } else {
        throw e;
      }
    }
  });
}