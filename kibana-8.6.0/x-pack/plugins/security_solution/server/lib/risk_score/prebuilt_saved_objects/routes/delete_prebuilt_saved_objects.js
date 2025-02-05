"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePrebuiltSavedObjectsRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _utils = require("../../../detection_engine/routes/utils");
var _common = require("../../../timeline/utils/common");
var _bulk_delete_saved_objects = require("../helpers/bulk_delete_saved_objects");
var _schema = require("../schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deletePrebuiltSavedObjectsRoute = (router, security) => {
  router.post({
    path: _constants.PREBUILT_SAVED_OBJECTS_BULK_DELETE,
    validate: _schema.deletePrebuiltSavedObjectsSchema,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _request$body;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      template_name: templateName
    } = request.params;
    const deleteAll = request === null || request === void 0 ? void 0 : (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.deleteAll;
    try {
      const securitySolution = await context.securitySolution;
      const spaceId = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getSpaceId();
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const savedObjectsClient = (await frameworkRequest.context.core).savedObjects.client;
      const res = await (0, _bulk_delete_saved_objects.bulkDeleteSavedObjects)({
        deleteAll,
        savedObjectsClient,
        spaceId,
        savedObjectTemplate: templateName
      });
      return response.ok({
        body: res
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
exports.deletePrebuiltSavedObjectsRoute = deletePrebuiltSavedObjectsRoute;