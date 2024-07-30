"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChangePointRequest = exports.fetchChangePointPValues = void 0;
var _lodash = require("lodash");
var _mlAggUtils = require("@kbn/ml-agg-utils");
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
var _constants = require("../../../common/constants");
var _is_request_aborted_error = require("../../lib/is_request_aborted_error");
var _get_query_with_params = require("./get_query_with_params");
var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO Consolidate with duplicate `fetchDurationFieldCandidates` in
// `x-pack/plugins/apm/server/routes/correlations/queries/fetch_failed_events_correlation_p_values.ts`

const getChangePointRequest = (params, fieldName,
// The default value of 1 means no sampling will be used
sampleProbability = 1) => {
  var _params$timeFieldName;
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params
  });
  const timeFieldName = (_params$timeFieldName = params.timeFieldName) !== null && _params$timeFieldName !== void 0 ? _params$timeFieldName : '@timestamp';
  let filter = [];
  if (Array.isArray(query.bool.filter)) {
    filter = query.bool.filter.filter(d => Object.keys(d)[0] !== 'range');
    query.bool.filter = [...filter, {
      range: {
        [timeFieldName]: {
          gte: params.deviationMin,
          lt: params.deviationMax,
          format: 'epoch_millis'
        }
      }
    }];
  }
  const pValueAgg = {
    change_point_p_value: {
      significant_terms: {
        field: fieldName,
        background_filter: {
          bool: {
            filter: [...filter, {
              range: {
                [timeFieldName]: {
                  gte: params.baselineMin,
                  lt: params.baselineMax,
                  format: 'epoch_millis'
                }
              }
            }]
          }
        },
        // @ts-expect-error `p_value` is not yet part of `AggregationsAggregationContainer`
        p_value: {
          background_is_superset: false
        },
        size: 1000
      }
    }
  };
  const randomSamplerAgg = {
    sample: {
      // @ts-expect-error `random_sampler` is not yet part of `AggregationsAggregationContainer`
      random_sampler: {
        probability: sampleProbability,
        seed: _mlAggUtils.RANDOM_SAMPLER_SEED
      },
      aggs: pValueAgg
    }
  };
  const body = {
    query,
    size: 0,
    aggs: sampleProbability < 1 ? randomSamplerAgg : pValueAgg
  };
  return {
    ...(0, _get_request_base.getRequestBase)(params),
    body
  };
};
exports.getChangePointRequest = getChangePointRequest;
function isRandomSamplerAggregation(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['sample']);
}
const fetchChangePointPValues = async (esClient, params, fieldNames, logger,
// The default value of 1 means no sampling will be used
sampleProbability = 1, emitError, abortSignal) => {
  const result = [];
  const settledPromises = await Promise.allSettled(fieldNames.map(fieldName => esClient.search(getChangePointRequest(params, fieldName, sampleProbability), {
    signal: abortSignal,
    maxRetries: 0
  })));
  function reportError(fieldName, error) {
    if (!(0, _is_request_aborted_error.isRequestAbortedError)(error)) {
      logger.error(`Failed to fetch p-value aggregation for fieldName "${fieldName}", got: \n${JSON.stringify(error, null, 2)}`);
      emitError(`Failed to fetch p-value aggregation for fieldName "${fieldName}".`);
    }
  }
  for (const [index, settledPromise] of settledPromises.entries()) {
    const fieldName = fieldNames[index];
    if (settledPromise.status === 'rejected') {
      reportError(fieldName, settledPromise.reason);
      // Still continue the analysis even if individual p-value queries fail.
      continue;
    }
    const resp = settledPromise.value;
    if (resp.aggregations === undefined) {
      reportError(fieldName, resp);
      // Still continue the analysis even if individual p-value queries fail.
      continue;
    }
    const overallResult = isRandomSamplerAggregation(resp.aggregations) ? resp.aggregations.sample.change_point_p_value : resp.aggregations.change_point_p_value;
    for (const bucket of overallResult.buckets) {
      const pValue = Math.exp(-bucket.score);

      // Scale the score into a value from 0 - 1
      // using a concave piecewise linear function in -log(p-value)
      const normalizedScore = 0.5 * Math.min(Math.max((bucket.score - 3.912) / 2.995, 0), 1) + 0.25 * Math.min(Math.max((bucket.score - 6.908) / 6.908, 0), 1) + 0.25 * Math.min(Math.max((bucket.score - 13.816) / 101.314, 0), 1);
      if (typeof pValue === 'number' && pValue < _constants.SPIKE_ANALYSIS_THRESHOLD) {
        result.push({
          fieldName,
          fieldValue: String(bucket.key),
          doc_count: bucket.doc_count,
          bg_count: bucket.bg_count,
          total_doc_count: overallResult.doc_count,
          total_bg_count: overallResult.bg_count,
          score: bucket.score,
          pValue,
          normalizedScore
        });
      }
    }
  }
  return (0, _lodash.uniqBy)(result, d => `${d.fieldName},${d.fieldValue}`);
};
exports.fetchChangePointPValues = fetchChangePointPValues;