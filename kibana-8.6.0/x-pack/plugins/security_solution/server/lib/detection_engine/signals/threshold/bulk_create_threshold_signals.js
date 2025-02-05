"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransformedHits = exports.bulkCreateThresholdSignals = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _utils = require("../utils");
var _reason_formatters = require("../reason_formatters");
var _enrichments = require("../enrichments");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTransformedHits = (buckets, inputIndex, startedAt, from, threshold, ruleId) => buckets.map((bucket, i) => {
  var _threshold$cardinalit, _bucket$cardinality_c;
  // In case of absent threshold fields, `bucket.key` will be an empty string. Note that `Object.values('')` is `[]`,
  // so the below logic works in either case (whether `terms` or `composite`).
  return {
    _index: inputIndex,
    _id: (0, _utils.calculateThresholdSignalUuid)(ruleId, startedAt, threshold.field, Object.values(bucket.key).sort().join(',')),
    _source: {
      [_ruleDataUtils.TIMESTAMP]: bucket.max_timestamp.value_as_string,
      ...bucket.key,
      threshold_result: {
        cardinality: (_threshold$cardinalit = threshold.cardinality) !== null && _threshold$cardinalit !== void 0 && _threshold$cardinalit.length ? [{
          field: threshold.cardinality[0].field,
          value: (_bucket$cardinality_c = bucket.cardinality_count) === null || _bucket$cardinality_c === void 0 ? void 0 : _bucket$cardinality_c.value
        }] : undefined,
        count: bucket.doc_count,
        from: bucket.min_timestamp.value_as_string ? new Date(bucket.min_timestamp.value_as_string) : from,
        terms: Object.entries(bucket.key).map(([key, val]) => ({
          field: key,
          value: val
        }))
      }
    }
  };
});
exports.getTransformedHits = getTransformedHits;
const bulkCreateThresholdSignals = async params => {
  const ruleParams = params.completeRule.ruleParams;
  const ecsResults = getTransformedHits(params.buckets, params.inputIndexPattern.join(','), params.startedAt, params.from, ruleParams.threshold, ruleParams.ruleId);
  return params.bulkCreate(params.wrapHits(ecsResults, _reason_formatters.buildReasonMessageForThresholdAlert), undefined, (0, _enrichments.createEnrichEventsFunction)({
    services: params.services,
    logger: params.ruleExecutionLogger
  }));
};
exports.bulkCreateThresholdSignals = bulkCreateThresholdSignals;