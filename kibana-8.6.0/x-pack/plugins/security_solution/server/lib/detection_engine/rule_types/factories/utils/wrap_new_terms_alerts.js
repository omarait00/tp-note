"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapNewTermsAlerts = void 0;
var _objectHash = _interopRequireDefault(require("object-hash"));
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _field_names = require("../../../../../../common/field_maps/field_names");
var _reason_formatters = require("../../../signals/reason_formatters");
var _build_bulk_body = require("./build_bulk_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const wrapNewTermsAlerts = ({
  eventsAndTerms,
  spaceId,
  completeRule,
  mergeStrategy,
  indicesToQuery,
  alertTimestampOverride
}) => {
  return eventsAndTerms.map(eventAndTerms => {
    const id = (0, _objectHash.default)([eventAndTerms.event._index, eventAndTerms.event._id, String(eventAndTerms.event._version), `${spaceId}:${completeRule.alertId}`, eventAndTerms.newTerms]);
    const baseAlert = (0, _build_bulk_body.buildBulkBody)(spaceId, completeRule, eventAndTerms.event, mergeStrategy, [], true, _reason_formatters.buildReasonMessageForNewTermsAlert, indicesToQuery, alertTimestampOverride);
    return {
      _id: id,
      _index: '',
      _source: {
        ...baseAlert,
        [_field_names.ALERT_NEW_TERMS]: eventAndTerms.newTerms,
        [_ruleDataUtils.ALERT_UUID]: id
      }
    };
  });
};
exports.wrapNewTermsAlerts = wrapNewTermsAlerts;