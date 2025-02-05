"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateAlertId = exports.buildParent = exports.buildAncestors = exports.buildAlert = exports.additionalAlertFields = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _crypto = require("crypto");
var _utils = require("../../../signals/utils");
var _constants = require("../../../../../../common/constants");
var _field_names = require("../../../../../../common/field_maps/field_names");
var _rule_management = require("../../../rule_management");
var _transform_actions = require("../../../../../../common/detection_engine/transform_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const generateAlertId = alert => {
  return (0, _crypto.createHash)('sha256').update(alert[_field_names.ALERT_ANCESTORS].reduce((acc, ancestor) => acc.concat(ancestor.id, ancestor.index), '').concat(alert[_ruleDataUtils.ALERT_RULE_UUID])).digest('hex');
};

/**
 * Takes an event document and extracts the information needed for the corresponding entry in the child
 * alert's ancestors array.
 * @param doc The parent event
 */
exports.generateAlertId = generateAlertId;
const buildParent = doc => {
  var _ref;
  const isSignal = (0, _utils.isWrappedSignalHit)(doc) || (0, _utils.isWrappedDetectionAlert)(doc);
  const parent = {
    id: doc._id,
    type: isSignal ? 'signal' : 'event',
    index: doc._index,
    depth: isSignal ? (_ref = (0, _utils.getField)(doc, _field_names.ALERT_DEPTH)) !== null && _ref !== void 0 ? _ref : 1 : 0,
    rule: isSignal ? (0, _utils.getField)(doc, _ruleDataUtils.ALERT_RULE_UUID) : undefined
  };
  return parent;
};

/**
 * Takes a parent event document with N ancestors and adds the parent document to the ancestry array,
 * creating an array of N+1 ancestors.
 * @param doc The parent event for which to extend the ancestry.
 */
exports.buildParent = buildParent;
const buildAncestors = doc => {
  var _ref2;
  const newAncestor = buildParent(doc);
  const existingAncestors = (_ref2 = (0, _utils.getField)(doc, _field_names.ALERT_ANCESTORS)) !== null && _ref2 !== void 0 ? _ref2 : [];
  return [...existingAncestors, newAncestor];
};

/**
 * Builds the `kibana.alert.*` fields that are common across all alerts.
 * @param docs The parent alerts/events of the new alert to be built.
 * @param rule The rule that is generating the new alert.
 * @param spaceId The space ID in which the rule was executed.
 * @param reason Human readable string summarizing alert.
 * @param indicesToQuery Array of index patterns searched by the rule.
 */
exports.buildAncestors = buildAncestors;
const buildAlert = (docs, completeRule, spaceId, reason, indicesToQuery, alertTimestampOverride, overrides) => {
  var _alertTimestampOverri, _overrides$severityOv, _overrides$riskScoreO, _overrides$nameOverri;
  const parents = docs.map(buildParent);
  const depth = parents.reduce((acc, parent) => Math.max(parent.depth, acc), 0) + 1;
  const ancestors = docs.reduce((acc, doc) => acc.concat(buildAncestors(doc)), []);
  const {
    output_index: outputIndex,
    ...commonRuleParams
  } = (0, _rule_management.commonParamsCamelToSnake)(completeRule.ruleParams);
  const ruleParamsSnakeCase = {
    ...commonRuleParams,
    ...(0, _rule_management.typeSpecificCamelToSnake)(completeRule.ruleParams)
  };
  const {
    actions,
    schedule,
    name,
    tags,
    enabled,
    createdBy,
    updatedBy,
    throttle,
    createdAt,
    updatedAt
  } = completeRule.ruleConfig;
  const params = completeRule.ruleParams;
  const originalTime = (0, _utils.getValidDateFromDoc)({
    doc: docs[0],
    primaryTimestamp: _ruleDataUtils.TIMESTAMP
  });
  return {
    [_ruleDataUtils.TIMESTAMP]: (_alertTimestampOverri = alertTimestampOverride === null || alertTimestampOverride === void 0 ? void 0 : alertTimestampOverride.toISOString()) !== null && _alertTimestampOverri !== void 0 ? _alertTimestampOverri : new Date().toISOString(),
    [_ruleDataUtils.SPACE_IDS]: spaceId != null ? [spaceId] : [],
    [_ruleDataUtils.EVENT_KIND]: 'signal',
    [_field_names.ALERT_ORIGINAL_TIME]: originalTime === null || originalTime === void 0 ? void 0 : originalTime.toISOString(),
    [_ruleDataUtils.ALERT_RULE_CONSUMER]: _constants.SERVER_APP_ID,
    [_field_names.ALERT_ANCESTORS]: ancestors,
    [_ruleDataUtils.ALERT_STATUS]: _ruleDataUtils.ALERT_STATUS_ACTIVE,
    [_ruleDataUtils.ALERT_WORKFLOW_STATUS]: 'open',
    [_field_names.ALERT_DEPTH]: depth,
    [_ruleDataUtils.ALERT_REASON]: reason,
    [_field_names.ALERT_BUILDING_BLOCK_TYPE]: params.buildingBlockType,
    [_ruleDataUtils.ALERT_SEVERITY]: (_overrides$severityOv = overrides === null || overrides === void 0 ? void 0 : overrides.severityOverride) !== null && _overrides$severityOv !== void 0 ? _overrides$severityOv : params.severity,
    [_ruleDataUtils.ALERT_RISK_SCORE]: (_overrides$riskScoreO = overrides === null || overrides === void 0 ? void 0 : overrides.riskScoreOverride) !== null && _overrides$riskScoreO !== void 0 ? _overrides$riskScoreO : params.riskScore,
    [_ruleDataUtils.ALERT_RULE_PARAMETERS]: ruleParamsSnakeCase,
    [_field_names.ALERT_RULE_ACTIONS]: actions.map(_transform_actions.transformAlertToRuleAction),
    [_ruleDataUtils.ALERT_RULE_AUTHOR]: params.author,
    [_ruleDataUtils.ALERT_RULE_CREATED_AT]: createdAt.toISOString(),
    [_ruleDataUtils.ALERT_RULE_CREATED_BY]: createdBy !== null && createdBy !== void 0 ? createdBy : '',
    [_ruleDataUtils.ALERT_RULE_DESCRIPTION]: params.description,
    [_ruleDataUtils.ALERT_RULE_ENABLED]: enabled,
    [_field_names.ALERT_RULE_EXCEPTIONS_LIST]: params.exceptionsList,
    [_field_names.ALERT_RULE_FALSE_POSITIVES]: params.falsePositives,
    [_ruleDataUtils.ALERT_RULE_FROM]: params.from,
    [_field_names.ALERT_RULE_IMMUTABLE]: params.immutable,
    [_ruleDataUtils.ALERT_RULE_INTERVAL]: schedule.interval,
    [_field_names.ALERT_RULE_INDICES]: indicesToQuery,
    [_ruleDataUtils.ALERT_RULE_LICENSE]: params.license,
    [_field_names.ALERT_RULE_MAX_SIGNALS]: params.maxSignals,
    [_ruleDataUtils.ALERT_RULE_NAME]: (_overrides$nameOverri = overrides === null || overrides === void 0 ? void 0 : overrides.nameOverride) !== null && _overrides$nameOverri !== void 0 ? _overrides$nameOverri : name,
    [_ruleDataUtils.ALERT_RULE_NAMESPACE_FIELD]: params.namespace,
    [_ruleDataUtils.ALERT_RULE_NOTE]: params.note,
    [_ruleDataUtils.ALERT_RULE_REFERENCES]: params.references,
    [_field_names.ALERT_RULE_RISK_SCORE_MAPPING]: params.riskScoreMapping,
    [_ruleDataUtils.ALERT_RULE_RULE_ID]: params.ruleId,
    [_ruleDataUtils.ALERT_RULE_RULE_NAME_OVERRIDE]: params.ruleNameOverride,
    [_field_names.ALERT_RULE_SEVERITY_MAPPING]: params.severityMapping,
    [_ruleDataUtils.ALERT_RULE_TAGS]: tags,
    [_field_names.ALERT_RULE_THREAT]: params.threat,
    [_field_names.ALERT_RULE_THROTTLE]: throttle !== null && throttle !== void 0 ? throttle : undefined,
    [_field_names.ALERT_RULE_TIMELINE_ID]: params.timelineId,
    [_field_names.ALERT_RULE_TIMELINE_TITLE]: params.timelineTitle,
    [_field_names.ALERT_RULE_TIMESTAMP_OVERRIDE]: params.timestampOverride,
    [_ruleDataUtils.ALERT_RULE_TO]: params.to,
    [_ruleDataUtils.ALERT_RULE_TYPE]: params.type,
    [_ruleDataUtils.ALERT_RULE_UPDATED_AT]: updatedAt.toISOString(),
    [_ruleDataUtils.ALERT_RULE_UPDATED_BY]: updatedBy !== null && updatedBy !== void 0 ? updatedBy : '',
    [_ruleDataUtils.ALERT_RULE_UUID]: completeRule.alertId,
    [_ruleDataUtils.ALERT_RULE_VERSION]: params.version,
    ...(0, _securitysolutionRules.flattenWithPrefix)(_field_names.ALERT_RULE_META, params.meta),
    // These fields don't exist in the mappings, but leaving here for now to limit changes to the alert building logic
    'kibana.alert.rule.risk_score': params.riskScore,
    'kibana.alert.rule.severity': params.severity,
    'kibana.alert.rule.building_block_type': params.buildingBlockType
  };
};
exports.buildAlert = buildAlert;
const isThresholdResult = thresholdResult => {
  return typeof thresholdResult === 'object';
};

/**
 * Creates signal fields that are only available in the special case where a signal has only 1 parent signal/event.
 * We copy the original time from the document as "original_time" since we override the timestamp with the current date time.
 * @param doc The parent signal/event of the new signal to be built.
 */
const additionalAlertFields = doc => {
  var _doc$_source;
  const thresholdResult = (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : _doc$_source.threshold_result;
  if (thresholdResult != null && !isThresholdResult(thresholdResult)) {
    throw new Error(`threshold_result failed to validate: ${thresholdResult}`);
  }
  const additionalFields = {
    ...(thresholdResult != null ? {
      [_field_names.ALERT_THRESHOLD_RESULT]: thresholdResult
    } : {})
  };
  for (const [key, val] of Object.entries((_doc$_source2 = doc._source) !== null && _doc$_source2 !== void 0 ? _doc$_source2 : {})) {
    var _doc$_source2;
    if (key.startsWith('event.')) {
      additionalFields[`${_field_names.ALERT_ORIGINAL_EVENT}.${key.replace('event.', '')}`] = val;
    }
  }
  return additionalFields;
};
exports.additionalAlertFields = additionalAlertFields;