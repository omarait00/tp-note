"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createTimelinesRoute: true
};
exports.createTimelinesRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../common/constants");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
var _utils = require("../../../../detection_engine/routes/utils");
var _timelines = require("../../../schemas/timelines");
var _common = require("../../../utils/common");
var _failure_cases = require("../../../utils/failure_cases");
var _helpers = require("./helpers");
Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _helpers[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createTimelinesRoute = (router, _, security) => {
  router.post({
    path: _constants.TIMELINE_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_timelines.createTimelineSchema)
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
        timeline,
        version
      } = request.body;
      const {
        templateTimelineId,
        templateTimelineVersion,
        timelineType,
        title,
        status
      } = timeline;
      const compareTimelinesStatus = new _common.CompareTimelinesStatus({
        status,
        title,
        timelineType,
        timelineInput: {
          id: timelineId,
          version
        },
        templateTimelineInput: {
          id: templateTimelineId,
          version: templateTimelineVersion
        },
        frameworkRequest
      });
      await compareTimelinesStatus.init();

      // Create timeline
      if (compareTimelinesStatus.isCreatable) {
        const newTimeline = await (0, _helpers.createTimelines)({
          frameworkRequest,
          timeline,
          timelineVersion: version
        });
        return response.ok({
          body: {
            data: {
              persistTimeline: newTimeline
            }
          }
        });
      } else {
        return siemResponse.error(compareTimelinesStatus.checkIsFailureCases(_common.TimelineStatusActions.create) || {
          statusCode: 405,
          body: _failure_cases.DEFAULT_ERROR
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.createTimelinesRoute = createTimelinesRoute;