"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportRulesRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _get_existing_prepackaged_rules = require("../../../logic/search/get_existing_prepackaged_rules");
var _get_export_by_object_ids = require("../../../logic/export/get_export_by_object_ids");
var _get_export_all = require("../../../logic/export/get_export_all");
var _utils = require("../../../../routes/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const exportRulesRoute = (router, config, logger) => {
  router.post({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_export`,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_rule_management.ExportRulesRequestQuery),
      body: (0, _route_validation.buildRouteValidation)(_rule_management.ExportRulesRequestBody)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _await$context$lists;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const rulesClient = (await context.alerting).getRulesClient();
    const exceptionsClient = (_await$context$lists = await context.lists) === null || _await$context$lists === void 0 ? void 0 : _await$context$lists.getExceptionListClient();
    const savedObjectsClient = (await context.core).savedObjects.client;
    try {
      var _request$body, _request$body2;
      const exportSizeLimit = config.maxRuleImportExportSize;
      if (((_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.objects) != null && request.body.objects.length > exportSizeLimit) {
        return siemResponse.error({
          statusCode: 400,
          body: `Can't export more than ${exportSizeLimit} rules`
        });
      } else {
        const nonPackagedRulesCount = await (0, _get_existing_prepackaged_rules.getNonPackagedRulesCount)({
          rulesClient
        });
        if (nonPackagedRulesCount > exportSizeLimit) {
          return siemResponse.error({
            statusCode: 400,
            body: `Can't export more than ${exportSizeLimit} rules`
          });
        }
      }
      const exportedRulesAndExceptions = ((_request$body2 = request.body) === null || _request$body2 === void 0 ? void 0 : _request$body2.objects) != null ? await (0, _get_export_by_object_ids.getExportByObjectIds)(rulesClient, exceptionsClient, savedObjectsClient, request.body.objects, logger) : await (0, _get_export_all.getExportAll)(rulesClient, exceptionsClient, savedObjectsClient, logger);
      const responseBody = request.query.exclude_export_details ? exportedRulesAndExceptions.rulesNdjson : `${exportedRulesAndExceptions.rulesNdjson}${exportedRulesAndExceptions.exceptionLists}${exportedRulesAndExceptions.exportDetails}`;
      return response.ok({
        headers: {
          'Content-Disposition': `attachment; filename="${request.query.file_name}"`,
          'Content-Type': 'application/ndjson'
        },
        body: responseBody
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
exports.exportRulesRoute = exportRulesRoute;