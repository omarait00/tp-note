"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldBeExcluded = exports.fetchDurationFieldCandidates = void 0;
var _fieldTypes = require("@kbn/field-types");
var _constants = require("../../../../common/correlations/constants");
var _utils = require("../../../../common/correlations/utils");
var _get_common_correlations_query = require("./get_common_correlations_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SUPPORTED_ES_FIELD_TYPES = [_fieldTypes.ES_FIELD_TYPES.KEYWORD, _fieldTypes.ES_FIELD_TYPES.IP, _fieldTypes.ES_FIELD_TYPES.BOOLEAN];
const shouldBeExcluded = fieldName => {
  return _constants.FIELDS_TO_EXCLUDE_AS_CANDIDATE.has(fieldName) || _constants.FIELD_PREFIX_TO_EXCLUDE_AS_CANDIDATE.some(prefix => fieldName.startsWith(prefix));
};
exports.shouldBeExcluded = shouldBeExcluded;
const fetchDurationFieldCandidates = async ({
  apmEventClient,
  eventType,
  query,
  start,
  end,
  environment,
  kuery
}) => {
  // Get all supported fields
  const [respMapping, respRandomDoc] = await Promise.all([apmEventClient.fieldCaps('get_field_caps', {
    apm: {
      events: [eventType]
    },
    fields: '*'
  }), apmEventClient.search('get_random_doc_for_field_candidate', {
    apm: {
      events: [eventType]
    },
    body: {
      track_total_hits: false,
      fields: ['*'],
      _source: false,
      query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
        start,
        end,
        environment,
        kuery,
        query
      }),
      size: _constants.POPULATED_DOC_COUNT_SAMPLE_SIZE
    }
  })]);
  const finalFieldCandidates = new Set(_constants.FIELDS_TO_ADD_AS_CANDIDATE);
  const acceptableFields = new Set();
  Object.entries(respMapping.fields).forEach(([key, value]) => {
    const fieldTypes = Object.keys(value);
    const isSupportedType = fieldTypes.some(type => SUPPORTED_ES_FIELD_TYPES.includes(type));
    // Definitely include if field name matches any of the wild card
    if ((0, _utils.hasPrefixToInclude)(key) && isSupportedType) {
      finalFieldCandidates.add(key);
    }

    // Check if fieldName is something we can aggregate on
    if (isSupportedType) {
      acceptableFields.add(key);
    }
  });
  const sampledDocs = respRandomDoc.hits.hits.map(d => {
    var _d$fields;
    return (_d$fields = d.fields) !== null && _d$fields !== void 0 ? _d$fields : {};
  });

  // Get all field names for each returned doc and flatten it
  // to a list of unique field names used across all docs
  // and filter by list of acceptable fields and some APM specific unique fields.
  [...new Set(sampledDocs.map(Object.keys).flat(1))].forEach(field => {
    if (acceptableFields.has(field) && !shouldBeExcluded(field)) {
      finalFieldCandidates.add(field);
    }
  });
  return {
    fieldCandidates: [...finalFieldCandidates]
  };
};
exports.fetchDurationFieldCandidates = fetchDurationFieldCandidates;