"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistFavoriteRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../common/constants");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
var _utils = require("../../../../detection_engine/routes/utils");
var _common = require("../../../utils/common");
var _timelines = require("../../../saved_object/timelines");
var _timeline = require("../../../../../../common/types/timeline");
var _persist_favorite_schema = require("../../../schemas/timelines/persist_favorite_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const persistFavoriteRoute = (router, config, security) => {
  router.patch({
    path: _constants.TIMELINE_FAVORITE_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_persist_favorite_schema.persistFavoriteSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const {
        timelineId,
        templateTimelineId,
        templateTimelineVersion,
        timelineType
      } = request.body;
      const timeline = await (0, _timelines.persistFavorite)(frameworkRequest, timelineId || null, templateTimelineId || null, templateTimelineVersion || null, timelineType || _timeline.TimelineType.default);
      return response.ok({
        body: {
          data: {
            persistFavorite: timeline
          }
        }
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
exports.persistFavoriteRoute = persistFavoriteRoute;