"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importRules = void 0;
var _legacy_action_migration = require("../rule_actions/legacy_action_migration");
var _utils = require("../../../routes/utils");
var _create_rules = require("../crud/create_rules");
var _read_rules = require("../crud/read_rules");
var _patch_rules = require("../crud/patch_rules");
var _validation = require("../../../../machine_learning/validation");
var _check_rule_exception_references = require("./check_rule_exception_references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/**
 * Takes rules to be imported and either creates or updates rules
 * based on user overwrite preferences
 * @param ruleChunks {array} - rules being imported
 * @param rulesResponseAcc {array} - the accumulation of success and
 * error messages gathered through the rules import logic
 * @param mlAuthz {object}
 * @param overwriteRules {boolean} - whether to overwrite existing rules
 * with imported rules if their rule_id matches
 * @param rulesClient {object}
 * @param savedObjectsClient {object}
 * @param exceptionsClient {object}
 * @param spaceId {string} - space being used during import
 * @param existingLists {object} - all exception lists referenced by
 * rules that were found to exist
 * @returns {Promise} an array of error and success messages from import
 */
const importRules = async ({
  ruleChunks,
  rulesResponseAcc,
  mlAuthz,
  overwriteRules,
  rulesClient,
  savedObjectsClient,
  exceptionsClient,
  spaceId,
  existingLists
}) => {
  let importRuleResponse = [...rulesResponseAcc];

  // If we had 100% errors and no successful rule could be imported we still have to output an error.
  // otherwise we would output we are success importing 0 rules.
  if (ruleChunks.length === 0) {
    return importRuleResponse;
  } else {
    while (ruleChunks.length) {
      var _ruleChunks$shift;
      const batchParseObjects = (_ruleChunks$shift = ruleChunks.shift()) !== null && _ruleChunks$shift !== void 0 ? _ruleChunks$shift : [];
      const newImportRuleResponse = await Promise.all(batchParseObjects.reduce((accum, parsedRule) => {
        const importsWorkerPromise = new Promise(async (resolve, reject) => {
          try {
            if (parsedRule instanceof Error) {
              // If the JSON object had a validation or parse error then we return
              // early with the error and an (unknown) for the ruleId
              resolve((0, _utils.createBulkErrorObject)({
                statusCode: 400,
                message: parsedRule.message
              }));
              return null;
            }
            try {
              const [exceptionErrors, exceptions] = (0, _check_rule_exception_references.checkRuleExceptionReferences)({
                rule: parsedRule,
                existingLists
              });
              importRuleResponse = [...importRuleResponse, ...exceptionErrors];
              (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(parsedRule.type));
              const rule = await (0, _read_rules.readRules)({
                rulesClient,
                ruleId: parsedRule.rule_id,
                id: undefined
              });
              if (rule == null) {
                await (0, _create_rules.createRules)({
                  rulesClient,
                  params: {
                    ...parsedRule,
                    exceptions_list: [...exceptions]
                  }
                });
                resolve({
                  rule_id: parsedRule.rule_id,
                  status_code: 200
                });
              } else if (rule != null && overwriteRules) {
                const migratedRule = await (0, _legacy_action_migration.legacyMigrate)({
                  rulesClient,
                  savedObjectsClient,
                  rule
                });
                await (0, _patch_rules.patchRules)({
                  rulesClient,
                  existingRule: migratedRule,
                  nextParams: {
                    ...parsedRule,
                    exceptions_list: [...exceptions]
                  }
                });
                resolve({
                  rule_id: parsedRule.rule_id,
                  status_code: 200
                });
              } else if (rule != null) {
                resolve((0, _utils.createBulkErrorObject)({
                  ruleId: parsedRule.rule_id,
                  statusCode: 409,
                  message: `rule_id: "${parsedRule.rule_id}" already exists`
                }));
              }
            } catch (err) {
              var _err$statusCode;
              resolve((0, _utils.createBulkErrorObject)({
                ruleId: parsedRule.rule_id,
                statusCode: (_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 400,
                message: err.message
              }));
            }
          } catch (error) {
            reject(error);
          }
        });
        return [...accum, importsWorkerPromise];
      }, []));
      importRuleResponse = [...importRuleResponse, ...newImportRuleResponse];
    }
    return importRuleResponse;
  }
};
exports.importRules = importRules;