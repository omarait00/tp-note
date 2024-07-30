"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectPairIntersection = exports.objectArrayIntersection = exports.buildAlertRoot = exports.buildAlertGroupFromSequence = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _build_alert = require("./build_alert");
var _build_bulk_body = require("./build_bulk_body");
var _generate_building_block_ids = require("./generate_building_block_ids");
var _field_names = require("../../../../../../common/field_maps/field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Takes N raw documents from ES that form a sequence and builds them into N+1 signals ready to be indexed -
 * one signal for each event in the sequence, and a "shell" signal that ties them all together. All N+1 signals
 * share the same signal.group.id to make it easy to query them.
 * @param sequence The raw ES documents that make up the sequence
 * @param completeRule object representing the rule that found the sequence
 */
const buildAlertGroupFromSequence = (logger, sequence, completeRule, mergeStrategy, spaceId, buildReasonMessage, indicesToQuery, alertTimestampOverride) => {
  const ancestors = sequence.events.flatMap(event => (0, _build_alert.buildAncestors)(event));
  if (ancestors.some(ancestor => (ancestor === null || ancestor === void 0 ? void 0 : ancestor.rule) === completeRule.alertId)) {
    return [];
  }

  // The "building block" alerts start out as regular BaseFields. We'll add the group ID and index fields
  // after creating the shell alert later on, since that's when the group ID is determined.
  let baseAlerts = [];
  try {
    baseAlerts = sequence.events.map(event => (0, _build_bulk_body.buildBulkBody)(spaceId, completeRule, event, mergeStrategy, [], false, buildReasonMessage, indicesToQuery, alertTimestampOverride));
  } catch (error) {
    logger.error(error);
    return [];
  }

  // The ID of each building block alert depends on all of the other building blocks as well,
  // so we generate the IDs after making all the BaseFields
  const buildingBlockIds = (0, _generate_building_block_ids.generateBuildingBlockIds)(baseAlerts);
  const wrappedBaseFields = baseAlerts.map((block, i) => ({
    _id: buildingBlockIds[i],
    _index: '',
    _source: {
      ...block,
      [_ruleDataUtils.ALERT_UUID]: buildingBlockIds[i]
    }
  }));

  // Now that we have an array of building blocks for the events in the sequence,
  // we can build the signal that links the building blocks together
  // and also insert the group id (which is also the "shell" signal _id) in each building block
  const shellAlert = buildAlertRoot(wrappedBaseFields, completeRule, spaceId, buildReasonMessage, indicesToQuery, alertTimestampOverride);
  const sequenceAlert = {
    _id: shellAlert[_ruleDataUtils.ALERT_UUID],
    _index: '',
    _source: shellAlert
  };

  // Finally, we have the group id from the shell alert so we can convert the BaseFields into EqlBuildingBlocks
  const wrappedBuildingBlocks = wrappedBaseFields.map((block, i) => ({
    ...block,
    _source: {
      ...block._source,
      [_field_names.ALERT_BUILDING_BLOCK_TYPE]: 'default',
      [_field_names.ALERT_GROUP_ID]: shellAlert[_field_names.ALERT_GROUP_ID],
      [_field_names.ALERT_GROUP_INDEX]: i
    }
  }));
  return [...wrappedBuildingBlocks, sequenceAlert];
};
exports.buildAlertGroupFromSequence = buildAlertGroupFromSequence;
const buildAlertRoot = (wrappedBuildingBlocks, completeRule, spaceId, buildReasonMessage, indicesToQuery, alertTimestampOverride) => {
  const mergedAlerts = objectArrayIntersection(wrappedBuildingBlocks.map(alert => alert._source));
  const reason = buildReasonMessage({
    name: completeRule.ruleConfig.name,
    severity: completeRule.ruleParams.severity,
    mergedDoc: mergedAlerts
  });
  const doc = (0, _build_alert.buildAlert)(wrappedBuildingBlocks, completeRule, spaceId, reason, indicesToQuery, alertTimestampOverride);
  const alertId = (0, _build_alert.generateAlertId)(doc);
  return {
    ...mergedAlerts,
    ...doc,
    [_ruleDataUtils.ALERT_UUID]: alertId,
    [_field_names.ALERT_GROUP_ID]: alertId
  };
};
exports.buildAlertRoot = buildAlertRoot;
const objectArrayIntersection = objects => {
  if (objects.length === 0) {
    return undefined;
  } else if (objects.length === 1) {
    return objects[0];
  } else {
    return objects.slice(1).reduce((acc, obj) => objectPairIntersection(acc, obj), objects[0]);
  }
};
exports.objectArrayIntersection = objectArrayIntersection;
const objectPairIntersection = (a, b) => {
  if (a === undefined || b === undefined) {
    return undefined;
  }
  const intersection = {};
  Object.entries(a).forEach(([key, aVal]) => {
    if (key in b) {
      const bVal = b[key];
      if (typeof aVal === 'object' && !(aVal instanceof Array) && aVal !== null && typeof bVal === 'object' && !(bVal instanceof Array) && bVal !== null) {
        intersection[key] = objectPairIntersection(aVal, bVal);
      } else if (aVal === bVal) {
        intersection[key] = aVal;
      }
    }
  });
  // Count up the number of entries that are NOT undefined in the intersection
  // If there are no keys OR all entries are undefined, return undefined
  if (Object.values(intersection).reduce((acc, value) => value !== undefined ? acc + 1 : acc, 0) === 0) {
    return undefined;
  } else {
    return intersection;
  }
};
exports.objectPairIntersection = objectPairIntersection;