"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformAnomalyFieldsToEcs = exports.bulkCreateMlSignals = void 0;
var _fp = require("lodash/fp");
var _setValue = _interopRequireDefault(require("set-value"));
var _reason_formatters = require("./reason_formatters");
var _enrichments = require("./enrichments");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformAnomalyFieldsToEcs = anomaly => {
  const {
    by_field_name: entityName,
    by_field_value: entityValue,
    influencers,
    timestamp
  } = anomaly;
  let errantFields = (influencers !== null && influencers !== void 0 ? influencers : []).map(influencer => ({
    name: influencer.influencer_field_name,
    value: influencer.influencer_field_values
  }));
  if (entityName && entityValue) {
    errantFields = [...errantFields, {
      name: entityName,
      value: [entityValue]
    }];
  }
  const omitDottedFields = (0, _fp.omit)(errantFields.map(field => field.name));
  const setNestedFields = errantFields.map(field => _anomaly => (0, _setValue.default)(_anomaly, field.name, field.value));
  const setTimestamp = _anomaly => (0, _setValue.default)(_anomaly, '@timestamp', new Date(timestamp).toISOString());
  return (0, _fp.flow)(omitDottedFields, setNestedFields, setTimestamp)(anomaly);
};
exports.transformAnomalyFieldsToEcs = transformAnomalyFieldsToEcs;
const transformAnomalyResultsToEcs = results => {
  return results.map(({
    _source,
    ...rest
  }) => ({
    ...rest,
    _source: transformAnomalyFieldsToEcs(
    // @ts-expect-error @elastic/elasticsearch _source is optional
    _source)
  }));
};
const bulkCreateMlSignals = async params => {
  const anomalyResults = params.anomalyHits;
  const ecsResults = transformAnomalyResultsToEcs(anomalyResults);
  const wrappedDocs = params.wrapHits(ecsResults, _reason_formatters.buildReasonMessageForMlAlert);
  return params.bulkCreate(wrappedDocs, undefined, (0, _enrichments.createEnrichEventsFunction)({
    services: params.services,
    logger: params.ruleExecutionLogger
  }));
};
exports.bulkCreateMlSignals = bulkCreateMlSignals;