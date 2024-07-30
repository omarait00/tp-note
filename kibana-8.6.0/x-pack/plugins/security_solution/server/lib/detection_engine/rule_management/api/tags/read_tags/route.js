"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readTagsRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../../common/constants");
var _utils = require("../../../../routes/utils");
var _read_tags = require("./read_tags");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const readTagsRoute = router => {
  router.get({
    path: _constants.DETECTION_ENGINE_TAGS_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _await$context$alerti;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const rulesClient = (_await$context$alerti = await context.alerting) === null || _await$context$alerti === void 0 ? void 0 : _await$context$alerti.getRulesClient();
    if (!rulesClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }
    try {
      const tags = await (0, _read_tags.readTags)({
        rulesClient
      });
      return response.ok({
        body: tags
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
exports.readTagsRoute = readTagsRoute;