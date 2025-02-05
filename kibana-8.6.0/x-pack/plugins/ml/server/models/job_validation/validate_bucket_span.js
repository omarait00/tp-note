"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateBucketSpan = validateBucketSpan;
var _bucket_span_estimator = require("../bucket_span_estimator");
var _job_utils = require("../../../common/util/job_utils");
var _validation = require("../../../common/constants/validation");
var _validate_job_object = require("./validate_job_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BUCKET_SPAN_HIGH_THRESHOLD = 1;
const wrapQuery = query => ({
  bool: {
    must: [query],
    must_not: []
  }
});

// Choosing a bucket from the set of recommendations which minimises
// the sum difference from each suggested bucket length:
// L* = argmin_L{ sum(abs(L_i - L)) } for L in {L_i}
// For example: [10m, 10m, 10m, 30m, 1h]
// [ 3 * (10 - 10) + 30 - 10 + 60 - 10 = 70,
//   3 * (30 - 10) + 30 - 30 + 60 - 30 = 90,
//   3 * (60 - 10) + 60 - 30 + 60 - 60 = 180]
// 70 is the lowest so 10m would be picked
const pickBucketSpan = bucketSpans => {
  if (bucketSpans.length === 1) {
    return bucketSpans[0];
  }
  const getSumDistance = (spans, span) => {
    return spans.reduce((sum, c) => {
      return sum + Math.abs(c - span);
    }, 0);
  };
  const spansMs = bucketSpans.map(span => span.ms);
  const sumDistances = spansMs.map(ms => getSumDistance(spansMs, ms));
  const minSumDistance = Math.min(...sumDistances);
  const i = sumDistances.findIndex(d => d === minSumDistance);
  return bucketSpans[i];
};
async function validateBucketSpan(client, job, duration) {
  (0, _validate_job_object.validateJobObject)(job);

  // if there is no duration, do not run the estimate test
  if (typeof duration === 'undefined' || typeof duration.start === 'undefined' || typeof duration.end === 'undefined') {
    return Promise.resolve([]);
  }
  const messages = [];

  // Bucket span must be a valid interval, greater than 0,
  // and if specified in ms must be a multiple of 1000ms
  const parsedBucketSpan = (0, _job_utils.parseTimeIntervalForJob)(job.analysis_config.bucket_span);
  if (parsedBucketSpan === null) {
    messages.push({
      id: 'bucket_span_invalid'
    });
    return messages;
  }
  const bucketSpanDays = parsedBucketSpan.asDays();

  // test #1: check if bucket span is higher than define threshold
  if (bucketSpanDays >= BUCKET_SPAN_HIGH_THRESHOLD) {
    messages.push({
      id: 'bucket_span_high'
    });
  }
  if (_validation.SKIP_BUCKET_SPAN_ESTIMATION) {
    if (messages.length === 0) {
      messages.push({
        id: 'success_bucket_span',
        bucketSpan: job.analysis_config.bucket_span
      });
    }
    return messages;
  }

  // test #2: check if bucket span differs from bucket span estimator result

  // prepare the request data for bucket span estimation
  const getRequestData = () => {
    return {
      aggTypes: [],
      duration,
      fields: [],
      index: job.datafeed_config.indices.join(','),
      query: wrapQuery(job.datafeed_config.query),
      splitField: undefined,
      timeField: job.data_description.time_field
    };
  };
  const estimatorConfigs = [];
  job.analysis_config.detectors.forEach(detector => {
    const data = getRequestData();
    const aggType = (0, _job_utils.mlFunctionToESAggregation)(detector.function);
    const fieldName = typeof detector.field_name === 'undefined' ? null : detector.field_name;
    data.aggTypes.push(aggType);
    data.fields.push(fieldName);
    if (typeof detector.partition_field_name !== 'undefined') {
      data.splitField = detector.partition_field_name;
    }
    estimatorConfigs.push(data);
  });

  // do the actual bucket span estimation
  try {
    const estimations = estimatorConfigs.map(data => {
      return new Promise(resolve => {
        (0, _bucket_span_estimator.estimateBucketSpanFactory)(client)(data).then(resolve)
        // this catch gets triggered when the estimation code runs without error
        // but isn't able to come up with a bucket span estimation.
        // this doesn't trigger a HTTP error but an object with an error message.
        // triggering a HTTP error would be too severe for this case.
        .catch(resp => {
          resolve({
            error: true,
            message: resp
          });
        });
      });
    });

    // run the estimations, filter valid results, then pick a bucket span.
    const results = await Promise.all(estimations);
    const bucketSpans = results.filter(result => result.name && result.ms);
    if (bucketSpans.length > 0) {
      const bucketSpan = pickBucketSpan(bucketSpans);

      // only trigger an info-level message if the bucket span estimator is able to come up
      // with an estimation and it doesn't match the job configuration.
      if (bucketSpan.name !== job.analysis_config.bucket_span) {
        messages.push({
          id: 'bucket_span_estimation_mismatch',
          currentBucketSpan: job.analysis_config.bucket_span,
          estimateBucketSpan: bucketSpan.name
        });
      }
    }
    // this catch gets triggered when an actual error gets thrown when running
    // the estimation code, for example when the request payload is malformed
  } catch (error) {
    throw new Error(error);
  }
  if (messages.length === 0) {
    messages.push({
      id: 'success_bucket_span',
      bucketSpan: job.analysis_config.bucket_span
    });
  }
  return messages;
}