"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPrebuiltSavedObjectsRoute = void 0;
var _constants = require("../../../../../common/constants");
var _utils = require("../../../detection_engine/routes/utils");
var _common = require("../../../timeline/utils/common");
var _bulk_create_saved_objects = require("../helpers/bulk_create_saved_objects");
var _schema = require("../schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createPrebuiltSavedObjectsRoute = (router, logger, security) => {
  router.post({
    path: _constants.PREBUILT_SAVED_OBJECTS_BULK_CREATE,
    validate: _schema.createPrebuiltSavedObjectsSchema,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _result$hostRiskScore, _result$userRiskScore;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      template_name: templateName
    } = request.params;
    const securitySolution = await context.securitySolution;
    const spaceId = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getSpaceId();
    const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
    const savedObjectsClient = (await frameworkRequest.context.core).savedObjects.client;
    const result = await (0, _bulk_create_saved_objects.bulkCreateSavedObjects)({
      savedObjectsClient,
      logger,
      spaceId,
      savedObjectTemplate: templateName
    });
    const error = (result === null || result === void 0 ? void 0 : (_result$hostRiskScore = result.hostRiskScoreDashboards) === null || _result$hostRiskScore === void 0 ? void 0 : _result$hostRiskScore.error) || (result === null || result === void 0 ? void 0 : (_result$userRiskScore = result.userRiskScoreDashboards) === null || _result$userRiskScore === void 0 ? void 0 : _result$userRiskScore.error);
    if (error != null) {
      return siemResponse.error({
        statusCode: error.statusCode,
        body: error.message
      });
    } else {
      return response.ok({
        body: result
      });
    }
  });
};
exports.createPrebuiltSavedObjectsRoute = createPrebuiltSavedObjectsRoute;