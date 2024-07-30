"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFieldStatsRoute = initFieldStatsRoute;
var _elasticsearch = require("@elastic/elasticsearch");
var _configSchema = require("@kbn/config-schema");
var _common = require("../../../kibana_utils/common");
var _constants = require("../../common/constants");
var _field_stats_utils = require("../../common/utils/field_stats_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function initFieldStatsRoute(setup) {
  const router = setup.http.createRouter();
  router.post({
    path: _constants.FIELD_STATS_API_PATH,
    validate: {
      body: _configSchema.schema.object({
        dslQuery: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        fromDate: _configSchema.schema.string(),
        toDate: _configSchema.schema.string(),
        dataViewId: _configSchema.schema.string(),
        fieldName: _configSchema.schema.string(),
        size: _configSchema.schema.maybe(_configSchema.schema.number())
      }, {
        unknowns: 'allow'
      })
    }
  }, async (context, req, res) => {
    const requestClient = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      fromDate,
      toDate,
      fieldName,
      dslQuery,
      size,
      dataViewId
    } = req.body;
    const [{
      savedObjects,
      elasticsearch
    }, {
      dataViews
    }] = await setup.getStartServices();
    const savedObjectsClient = savedObjects.getScopedClient(req);
    const esClient = elasticsearch.client.asScoped(req).asCurrentUser;
    const indexPatternsService = await dataViews.dataViewsServiceFactory(savedObjectsClient, esClient);
    try {
      const dataView = await indexPatternsService.get(dataViewId);
      const field = dataView.fields.find(f => f.name === fieldName);
      if (!field) {
        throw new Error(`Field {fieldName} not found in data view ${dataView.title}`);
      }
      const searchHandler = async body => {
        const result = await requestClient.search((0, _field_stats_utils.buildSearchParams)({
          dataViewPattern: dataView.title,
          timeFieldName: dataView.timeFieldName,
          fromDate,
          toDate,
          dslQuery,
          runtimeMappings: dataView.getRuntimeMappings(),
          ...body
        }));
        return result;
      };
      const stats = await (0, _field_stats_utils.fetchAndCalculateFieldStats)({
        searchHandler,
        dataView,
        field,
        fromDate,
        toDate,
        size
      });
      return res.ok({
        body: stats
      });
    } catch (e) {
      if (e instanceof _common.SavedObjectNotFound) {
        return res.notFound();
      }
      if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
        return res.notFound();
      }
      if (e.isBoom) {
        if (e.output.statusCode === 404) {
          return res.notFound();
        }
        throw new Error(e.output.message);
      } else {
        throw e;
      }
    }
  });
}