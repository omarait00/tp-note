"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapSuppressedAlerts = void 0;
var _objectHash = _interopRequireDefault(require("object-hash"));
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _build_bulk_body = require("./build_bulk_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const wrapSuppressedAlerts = ({
  suppressionBuckets,
  spaceId,
  completeRule,
  mergeStrategy,
  indicesToQuery,
  buildReasonMessage,
  alertTimestampOverride
}) => {
  return suppressionBuckets.map(bucket => {
    const id = (0, _objectHash.default)([bucket.event._index, bucket.event._id, String(bucket.event._version), `${spaceId}:${completeRule.alertId}`, bucket.terms, bucket.start, bucket.end]);
    const baseAlert = (0, _build_bulk_body.buildBulkBody)(spaceId, completeRule, bucket.event, mergeStrategy, [], true, buildReasonMessage, indicesToQuery, alertTimestampOverride);
    return {
      _id: id,
      _index: '',
      _source: {
        ...baseAlert,
        [_ruleDataUtils.ALERT_SUPPRESSION_TERMS]: bucket.terms,
        [_ruleDataUtils.ALERT_SUPPRESSION_START]: bucket.start,
        [_ruleDataUtils.ALERT_SUPPRESSION_END]: bucket.end,
        [_ruleDataUtils.ALERT_SUPPRESSION_DOCS_COUNT]: bucket.count - 1,
        [_ruleDataUtils.ALERT_UUID]: id
      }
    };
  });
};
exports.wrapSuppressedAlerts = wrapSuppressedAlerts;