"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimelineRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../common/constants");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
var _utils = require("../../../../detection_engine/routes/utils");
var _common = require("../../../utils/common");
var _timelines = require("../../../schemas/timelines");
var _timelines2 = require("../../../saved_object/timelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTimelineRoute = (router, config, security) => {
  router.get({
    path: _constants.TIMELINE_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidationWithExcess)(_timelines.getTimelineQuerySchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    try {
      var _request$query;
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const query = (_request$query = request.query) !== null && _request$query !== void 0 ? _request$query : {};
      const {
        template_timeline_id: templateTimelineId,
        id
      } = query;
      let res = null;
      if (templateTimelineId != null && id == null) {
        res = await (0, _timelines2.getTimelineTemplateOrNull)(frameworkRequest, templateTimelineId);
      } else if (templateTimelineId == null && id != null) {
        res = await (0, _timelines2.getTimelineOrNull)(frameworkRequest, id);
      } else {
        throw new Error('please provide id or template_timeline_id');
      }
      return response.ok({
        body: res ? {
          data: {
            getOneTimeline: res
          }
        } : {}
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      const siemResponse = (0, _utils.buildSiemResponse)(response);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getTimelineRoute = getTimelineRoute;