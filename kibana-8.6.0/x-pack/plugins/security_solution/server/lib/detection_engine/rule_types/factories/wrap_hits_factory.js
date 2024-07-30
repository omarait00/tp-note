"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapHitsFactory = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _utils = require("../../signals/utils");
var _build_bulk_body = require("./utils/build_bulk_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const wrapHitsFactory = ({
  completeRule,
  ignoreFields,
  mergeStrategy,
  spaceId,
  indicesToQuery,
  alertTimestampOverride
}) => (events, buildReasonMessage) => {
  const wrappedDocs = events.map(event => {
    const id = (0, _utils.generateId)(event._index, event._id, String(event._version), `${spaceId}:${completeRule.alertId}`);
    return {
      _id: id,
      _index: '',
      _source: {
        ...(0, _build_bulk_body.buildBulkBody)(spaceId, completeRule, event, mergeStrategy, ignoreFields, true, buildReasonMessage, indicesToQuery, alertTimestampOverride),
        [_ruleDataUtils.ALERT_UUID]: id
      }
    };
  });
  return wrappedDocs.filter(doc => !doc._source['kibana.alert.ancestors'].some(ancestor => ancestor.rule === completeRule.alertId));
};
exports.wrapHitsFactory = wrapHitsFactory;