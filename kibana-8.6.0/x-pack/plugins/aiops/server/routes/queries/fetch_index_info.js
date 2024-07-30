"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomDocsRequest = exports.fetchIndexInfo = void 0;
var _fieldTypes = require("@kbn/field-types");
var _mlAggUtils = require("@kbn/ml-agg-utils");
var _get_query_with_params = require("./get_query_with_params");
var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO Consolidate with duplicate `fetchPValues` in
// `x-pack/plugins/apm/server/routes/correlations/queries/fetch_duration_field_candidates.ts`

const POPULATED_DOC_COUNT_SAMPLE_SIZE = 1000;
const SUPPORTED_ES_FIELD_TYPES = [_fieldTypes.ES_FIELD_TYPES.KEYWORD, _fieldTypes.ES_FIELD_TYPES.IP, _fieldTypes.ES_FIELD_TYPES.BOOLEAN];
const getRandomDocsRequest = params => ({
  ...(0, _get_request_base.getRequestBase)(params),
  body: {
    fields: ['*'],
    _source: false,
    query: {
      function_score: {
        query: (0, _get_query_with_params.getQueryWithParams)({
          params
        }),
        // @ts-ignore
        random_score: {}
      }
    },
    size: POPULATED_DOC_COUNT_SAMPLE_SIZE,
    // Used to determine sample probability for follow up queries
    track_total_hits: true
  }
});
exports.getRandomDocsRequest = getRandomDocsRequest;
const fetchIndexInfo = async (esClient, params, abortSignal) => {
  const {
    index
  } = params;
  // Get all supported fields
  const respMapping = await esClient.fieldCaps({
    index,
    fields: '*'
  }, {
    signal: abortSignal,
    maxRetries: 0
  });
  const finalFieldCandidates = new Set([]);
  const acceptableFields = new Set();
  Object.entries(respMapping.fields).forEach(([key, value]) => {
    const fieldTypes = Object.keys(value);
    const isSupportedType = fieldTypes.some(type => SUPPORTED_ES_FIELD_TYPES.includes(type));
    const isAggregatable = fieldTypes.some(type => value[type].aggregatable);

    // Check if fieldName is something we can aggregate on
    if (isSupportedType && isAggregatable) {
      acceptableFields.add(key);
    }
  });

  // Only the deviation window will be used to identify field candidates and sample probability based on total doc count.
  const resp = await esClient.search(getRandomDocsRequest({
    ...params,
    start: params.deviationMin,
    end: params.deviationMax
  }), {
    signal: abortSignal,
    maxRetries: 0
  });
  const sampledDocs = resp.hits.hits.map(d => {
    var _d$fields;
    return (_d$fields = d.fields) !== null && _d$fields !== void 0 ? _d$fields : {};
  });

  // Get all field names for each returned doc and flatten it
  // to a list of unique field names used across all docs
  // and filter by list of acceptable fields.
  [...new Set(sampledDocs.map(Object.keys).flat(1))].forEach(field => {
    if (acceptableFields.has(field)) {
      finalFieldCandidates.add(field);
    }
  });
  const totalDocCount = resp.hits.total.value;
  const sampleProbability = (0, _mlAggUtils.getSampleProbability)(totalDocCount);
  return {
    fieldCandidates: [...finalFieldCandidates],
    sampleProbability,
    totalDocCount
  };
};
exports.fetchIndexInfo = fetchIndexInfo;