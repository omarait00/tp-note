"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFieldHistogramsRoutes = registerFieldHistogramsRoutes;
var _mlAggUtils = require("@kbn/ml-agg-utils");
var _common = require("../../../common/api_schemas/common");
var _field_histograms = require("../../../common/api_schemas/field_histograms");
var _ = require("..");
var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerFieldHistogramsRoutes({
  router,
  license
}) {
  router.post({
    path: (0, _.addBasePath)('field_histograms/{dataViewTitle}'),
    validate: {
      params: _common.dataViewTitleSchema,
      body: _field_histograms.fieldHistogramsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      dataViewTitle
    } = req.params;
    const {
      query,
      fields,
      runtimeMappings,
      samplerShardSize
    } = req.body;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const resp = await (0, _mlAggUtils.fetchHistogramsForFields)(esClient.asCurrentUser, dataViewTitle, query, fields, samplerShardSize, runtimeMappings);
      return res.ok({
        body: resp
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
}