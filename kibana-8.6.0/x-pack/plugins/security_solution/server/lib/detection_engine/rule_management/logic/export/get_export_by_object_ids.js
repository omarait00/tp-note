"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRulesFromObjects = exports.getExportByObjectIds = void 0;
var _lodash = require("lodash");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _get_export_details_ndjson = require("./get_export_details_ndjson");
var _rule_schema = require("../../../rule_schema");
var _find_rules = require("../search/find_rules");
var _get_export_rule_exceptions = require("./get_export_rule_exceptions");
var _rule_actions_legacy = require("../../../rule_actions_legacy");
var _rule_converters = require("../../normalization/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const getExportByObjectIds = async (rulesClient, exceptionsClient, savedObjectsClient, objects, logger) => {
  const rulesAndErrors = await getRulesFromObjects(rulesClient, savedObjectsClient, objects, logger);

  // Retrieve exceptions
  const exceptions = rulesAndErrors.rules.flatMap(rule => {
    var _rule$exceptions_list;
    return (_rule$exceptions_list = rule.exceptions_list) !== null && _rule$exceptions_list !== void 0 ? _rule$exceptions_list : [];
  });
  const {
    exportData: exceptionLists,
    exportDetails: exceptionDetails
  } = await (0, _get_export_rule_exceptions.getRuleExceptionsForExport)(exceptions, exceptionsClient);
  const rulesNdjson = (0, _securitysolutionUtils.transformDataToNdjson)(rulesAndErrors.rules);
  const exportDetails = (0, _get_export_details_ndjson.getExportDetailsNdjson)(rulesAndErrors.rules, rulesAndErrors.missingRules, exceptionDetails);
  return {
    rulesNdjson,
    exportDetails,
    exceptionLists
  };
};
exports.getExportByObjectIds = getExportByObjectIds;
const getRulesFromObjects = async (rulesClient, savedObjectsClient, objects, logger) => {
  // If we put more than 1024 ids in one block like "alert.attributes.tags: (id1 OR id2 OR ... OR id1100)"
  // then the KQL -> ES DSL query generator still puts them all in the same "should" array, but ES defaults
  // to limiting the length of "should" arrays to 1024. By chunking the array into blocks of 1024 ids,
  // we can force the KQL -> ES DSL query generator into grouping them in blocks of 1024.
  // The generated KQL query here looks like
  // "alert.attributes.tags: (id1 OR id2 OR ... OR id1024) OR alert.attributes.tags: (...) ..."
  const chunkedObjects = (0, _lodash.chunk)(objects, 1024);
  const filter = chunkedObjects.map(chunkedArray => {
    const joinedIds = chunkedArray.map(object => object.rule_id).join(' OR ');
    return `alert.attributes.params.ruleId: (${joinedIds})`;
  }).join(' OR ');
  const rules = await (0, _find_rules.findRules)({
    rulesClient,
    filter,
    page: 1,
    fields: undefined,
    perPage: 10000,
    sortField: undefined,
    sortOrder: undefined
  });
  const alertIds = rules.data.map(rule => rule.id);
  const legacyActions = await (0, _rule_actions_legacy.legacyGetBulkRuleActionsSavedObject)({
    alertIds,
    savedObjectsClient,
    logger
  });
  const alertsAndErrors = objects.map(({
    rule_id: ruleId
  }) => {
    const matchingRule = rules.data.find(rule => rule.params.ruleId === ruleId);
    if (matchingRule != null && (0, _rule_schema.isAlertType)(matchingRule) && matchingRule.params.immutable !== true) {
      return {
        statusCode: 200,
        rule: (0, _rule_converters.internalRuleToAPIResponse)(matchingRule, null, legacyActions[matchingRule.id])
      };
    } else {
      return {
        statusCode: 404,
        missingRuleId: {
          rule_id: ruleId
        }
      };
    }
  });
  const missingRules = alertsAndErrors.filter(resp => resp.statusCode === 404);
  const exportedRules = alertsAndErrors.filter(resp => resp.statusCode === 200);
  return {
    exportedCount: exportedRules.length,
    missingRules: missingRules.map(mr => mr.missingRuleId),
    rules: exportedRules.map(er => er.rule)
  };
};
exports.getRulesFromObjects = getRulesFromObjects;