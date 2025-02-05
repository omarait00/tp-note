"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildBulkBody = void 0;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _strategies = require("../../../signals/source_fields_merging/strategies");
var _build_alert = require("./build_alert");
var _filter_source = require("./filter_source");
var _build_rule_name_from_mapping = require("../../../signals/mappings/build_rule_name_from_mapping");
var _build_severity_from_mapping = require("../../../signals/mappings/build_severity_from_mapping");
var _build_risk_score_from_mapping = require("../../../signals/mappings/build_risk_score_from_mapping");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isSourceDoc = hit => {
  return hit._source != null;
};
const buildEventTypeAlert = doc => {
  var _doc$_source, _doc$_source2;
  if (((_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : _doc$_source.event) != null && ((_doc$_source2 = doc._source) === null || _doc$_source2 === void 0 ? void 0 : _doc$_source2.event) instanceof Object) {
    var _doc$_source$event, _doc$_source3;
    return (0, _securitysolutionRules.flattenWithPrefix)('event', (_doc$_source$event = (_doc$_source3 = doc._source) === null || _doc$_source3 === void 0 ? void 0 : _doc$_source3.event) !== null && _doc$_source$event !== void 0 ? _doc$_source$event : {});
  }
  return {};
};

/**
 * Formats the search_after result for insertion into the signals index. We first create a
 * "best effort" merged "fields" with the "_source" object, then build the signal object,
 * then the event object, and finally we strip away any additional temporary data that was added
 * such as the "threshold_result".
 * @param completeRule The rule saved object to build overrides
 * @param doc The SignalSourceHit with "_source", "fields", and additional data such as "threshold_result"
 * @returns The body that can be added to a bulk call for inserting the signal.
 */
const buildBulkBody = (spaceId, completeRule, doc, mergeStrategy, ignoreFields, applyOverrides, buildReasonMessage, indicesToQuery, alertTimestampOverride) => {
  var _mergedDoc$_source, _mergedDoc$_source2, _mergedDoc$_source3, _overrides$nameOverri, _overrides$severityOv;
  const mergedDoc = (0, _strategies.getMergeStrategy)(mergeStrategy)({
    doc,
    ignoreFields
  });
  const eventFields = buildEventTypeAlert(mergedDoc);
  const filteredSource = (0, _filter_source.filterSource)(mergedDoc);
  const overrides = applyOverrides ? {
    nameOverride: (0, _build_rule_name_from_mapping.buildRuleNameFromMapping)({
      eventSource: (_mergedDoc$_source = mergedDoc._source) !== null && _mergedDoc$_source !== void 0 ? _mergedDoc$_source : {},
      ruleName: completeRule.ruleConfig.name,
      ruleNameMapping: completeRule.ruleParams.ruleNameOverride
    }).ruleName,
    severityOverride: (0, _build_severity_from_mapping.buildSeverityFromMapping)({
      eventSource: (_mergedDoc$_source2 = mergedDoc._source) !== null && _mergedDoc$_source2 !== void 0 ? _mergedDoc$_source2 : {},
      severity: completeRule.ruleParams.severity,
      severityMapping: completeRule.ruleParams.severityMapping
    }).severity,
    riskScoreOverride: (0, _build_risk_score_from_mapping.buildRiskScoreFromMapping)({
      eventSource: (_mergedDoc$_source3 = mergedDoc._source) !== null && _mergedDoc$_source3 !== void 0 ? _mergedDoc$_source3 : {},
      riskScore: completeRule.ruleParams.riskScore,
      riskScoreMapping: completeRule.ruleParams.riskScoreMapping
    }).riskScore
  } : undefined;
  const reason = buildReasonMessage({
    name: (_overrides$nameOverri = overrides === null || overrides === void 0 ? void 0 : overrides.nameOverride) !== null && _overrides$nameOverri !== void 0 ? _overrides$nameOverri : completeRule.ruleConfig.name,
    severity: (_overrides$severityOv = overrides === null || overrides === void 0 ? void 0 : overrides.severityOverride) !== null && _overrides$severityOv !== void 0 ? _overrides$severityOv : completeRule.ruleParams.severity,
    mergedDoc
  });
  if (isSourceDoc(mergedDoc)) {
    return {
      ...filteredSource,
      ...eventFields,
      ...(0, _build_alert.buildAlert)([mergedDoc], completeRule, spaceId, reason, indicesToQuery, alertTimestampOverride, overrides),
      ...(0, _build_alert.additionalAlertFields)({
        ...mergedDoc,
        _source: {
          ...mergedDoc._source,
          ...eventFields
        }
      })
    };
  }
  throw Error('Error building alert from source document.');
};
exports.buildBulkBody = buildBulkBody;