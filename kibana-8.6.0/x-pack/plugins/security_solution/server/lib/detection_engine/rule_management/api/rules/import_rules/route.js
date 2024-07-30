"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importRulesRoute = void 0;
var _fp = require("lodash/fp");
var _path = require("path");
var _configSchema = require("@kbn/config-schema");
var _utils = require("@kbn/utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _authz = require("../../../../../machine_learning/authz");
var _utils2 = require("../../../../routes/utils");
var _utils3 = require("../../../utils/utils");
var _create_rules_stream_from_ndjson = require("../../../logic/import/create_rules_stream_from_ndjson");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _import_rules_utils = require("../../../logic/import/import_rules_utils");
var _gather_referenced_exceptions = require("../../../logic/import/gather_referenced_exceptions");
var _import_rule_exceptions = require("../../../logic/import/import_rule_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CHUNK_PARSED_OBJECT_SIZE = 50;
const importRulesRoute = (router, config, ml) => {
  router.post({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_import`,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_securitysolutionIoTsTypes.importQuerySchema),
      body: _configSchema.schema.any() // validation on file object is accomplished later in the handler.
    },

    options: {
      tags: ['access:securitySolution'],
      body: {
        maxBytes: config.maxRuleImportPayloadBytes,
        output: 'stream'
      }
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    try {
      var _ctx$lists;
      const ctx = await context.resolve(['core', 'securitySolution', 'alerting', 'actions', 'lists', 'licensing']);
      const rulesClient = ctx.alerting.getRulesClient();
      const actionsClient = ctx.actions.getActionsClient();
      const actionSOClient = ctx.core.savedObjects.getClient({
        includedHiddenTypes: ['action']
      });
      const savedObjectsClient = ctx.core.savedObjects.client;
      const exceptionsClient = (_ctx$lists = ctx.lists) === null || _ctx$lists === void 0 ? void 0 : _ctx$lists.getExceptionListClient();
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: ctx.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      const {
        filename
      } = request.body.file.hapi;
      const fileExtension = (0, _path.extname)(filename).toLowerCase();
      if (fileExtension !== '.ndjson') {
        return siemResponse.error({
          statusCode: 400,
          body: `Invalid file extension ${fileExtension}`
        });
      }
      const objectLimit = config.maxRuleImportExportSize;

      // parse file to separate out exceptions from rules
      const readAllStream = (0, _create_rules_stream_from_ndjson.createRulesAndExceptionsStreamFromNdJson)(objectLimit);
      const [{
        exceptions,
        rules
      }] = await (0, _utils.createPromiseFromStreams)([request.body.file, ...readAllStream]);

      // import exceptions, includes validation
      const {
        errors: exceptionsErrors,
        successCount: exceptionsSuccessCount,
        success: exceptionsSuccess
      } = await (0, _import_rule_exceptions.importRuleExceptions)({
        exceptions,
        exceptionsClient,
        overwrite: request.query.overwrite_exceptions,
        maxExceptionsImportSize: objectLimit
      });

      // report on duplicate rules
      const [duplicateIdErrors, parsedObjectsWithoutDuplicateErrors] = (0, _utils3.getTupleDuplicateErrorsAndUniqueRules)(rules, request.query.overwrite);
      const migratedParsedObjectsWithoutDuplicateErrors = await (0, _utils3.migrateLegacyActionsIds)(parsedObjectsWithoutDuplicateErrors, actionSOClient);
      let parsedRules;
      let actionErrors = [];
      const actualRules = rules.filter(rule => !(rule instanceof Error));
      if (actualRules.some(rule => rule.actions && rule.actions.length > 0)) {
        const [nonExistentActionErrors, uniqueParsedObjects] = await (0, _utils3.getInvalidConnectors)(migratedParsedObjectsWithoutDuplicateErrors, actionsClient);
        parsedRules = uniqueParsedObjects;
        actionErrors = nonExistentActionErrors;
      } else {
        parsedRules = migratedParsedObjectsWithoutDuplicateErrors;
      }
      // gather all exception lists that the imported rules reference
      const foundReferencedExceptionLists = await (0, _gather_referenced_exceptions.getReferencedExceptionLists)({
        rules: parsedRules,
        savedObjectsClient
      });
      const chunkParseObjects = (0, _fp.chunk)(CHUNK_PARSED_OBJECT_SIZE, parsedRules);
      const importRuleResponse = await (0, _import_rules_utils.importRules)({
        ruleChunks: chunkParseObjects,
        rulesResponseAcc: [...actionErrors, ...duplicateIdErrors],
        mlAuthz,
        overwriteRules: request.query.overwrite,
        rulesClient,
        savedObjectsClient,
        exceptionsClient,
        spaceId: ctx.securitySolution.getSpaceId(),
        existingLists: foundReferencedExceptionLists
      });
      const errorsResp = importRuleResponse.filter(resp => (0, _utils2.isBulkError)(resp));
      const successes = importRuleResponse.filter(resp => {
        if ((0, _utils2.isImportRegular)(resp)) {
          return resp.status_code === 200;
        } else {
          return false;
        }
      });
      const importRules = {
        success: errorsResp.length === 0,
        success_count: successes.length,
        rules_count: rules.length,
        errors: errorsResp,
        exceptions_errors: exceptionsErrors,
        exceptions_success: exceptionsSuccess,
        exceptions_success_count: exceptionsSuccessCount
      };
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(importRules, _rule_management.ImportRulesResponse);
      if (errors != null) {
        return siemResponse.error({
          statusCode: 500,
          body: errors
        });
      } else {
        return response.ok({
          body: validated !== null && validated !== void 0 ? validated : {}
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
exports.importRulesRoute = importRulesRoute;