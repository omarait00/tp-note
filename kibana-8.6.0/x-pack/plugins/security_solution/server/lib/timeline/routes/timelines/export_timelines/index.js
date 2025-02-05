"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  exportTimelinesRoute: true
};
exports.exportTimelinesRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../common/constants");
var _utils = require("../../../../detection_engine/routes/utils");
var _timelines = require("../../../schemas/timelines");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
var _common = require("../../../utils/common");
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

const exportTimelinesRoute = (router, config, security) => {
  router.post({
    path: _constants.TIMELINE_EXPORT_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidationWithExcess)(_timelines.exportTimelinesQuerySchema),
      body: (0, _route_validation.buildRouteValidationWithExcess)(_timelines.exportTimelinesRequestBodySchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    try {
      var _request$body, _request$body2;
      const siemResponse = (0, _utils.buildSiemResponse)(response);
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const exportSizeLimit = config.maxTimelineImportExportSize;
      if (((_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.ids) != null && request.body.ids.length > exportSizeLimit) {
        return siemResponse.error({
          statusCode: 400,
          body: `Can't export more than ${exportSizeLimit} timelines`
        });
      }
      const responseBody = await (0, _helpers.getExportTimelineByObjectIds)({
        frameworkRequest,
        ids: (_request$body2 = request.body) === null || _request$body2 === void 0 ? void 0 : _request$body2.ids
      });
      return response.ok({
        headers: {
          'Content-Disposition': `attachment; filename="${request.query.file_name}"`,
          'Content-Type': 'application/ndjson'
        },
        body: responseBody
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
exports.exportTimelinesRoute = exportTimelinesRoute;