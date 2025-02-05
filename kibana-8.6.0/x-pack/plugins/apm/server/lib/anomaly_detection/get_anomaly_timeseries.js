"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalyTimeseries = getAnomalyTimeseries;
var _lodash = require("lodash");
var _server = require("../../../../observability/server");
var _common = require("../../../../../../src/plugins/data/common");
var _apm_ml_anomaly_query = require("./apm_ml_anomaly_query");
var _apm_ml_detectors = require("../../../common/anomaly_detection/apm_ml_detectors");
var _apm_ml_jobs_query = require("./apm_ml_jobs_query");
var _as_mutable_array = require("../../../common/utils/as_mutable_array");
var _maybe = require("../../../common/utils/maybe");
var _anomaly_search = require("./anomaly_search");
var _get_anomaly_result_bucket_size = require("./get_anomaly_result_bucket_size");
var _get_ml_jobs_with_apm_group = require("./get_ml_jobs_with_apm_group");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FALLBACK_ML_BUCKET_SPAN = 15; // minutes

function divide(value, divider) {
  if (value === null) {
    return null;
  }
  return value / divider;
}

// Expected bounds are retrieved with bucket span interval padded to the time range
// so we need to cut the excess bounds to just the start and end time
// so that the chart show up correctly without the padded time
function getBoundedX(value, start, end) {
  if (value === null) {
    return null;
  }
  if (value < start) return start;
  if (value > end) return end;
  return value;
}
async function getAnomalyTimeseries({
  serviceName,
  transactionType,
  start,
  end,
  logger,
  mlClient,
  environment: preferredEnvironment
}) {
  var _mlJobs$find, _parseInterval$asSeco, _parseInterval, _anomaliesResponse$ag, _anomaliesResponse$ag2;
  if (!mlClient) {
    return [];
  }
  const mlJobs = await (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(mlClient.anomalyDetectors);
  if (!mlJobs.length) {
    return [];
  }

  // If multiple ML jobs exist
  // find the first job with valid running datafeed that matches the preferred environment
  const preferredBucketSpan = (_mlJobs$find = mlJobs.find(j => j.datafeedState !== undefined && j.environment === preferredEnvironment)) === null || _mlJobs$find === void 0 ? void 0 : _mlJobs$find.bucketSpan;
  const minBucketSize = (_parseInterval$asSeco = (_parseInterval = (0, _common.parseInterval)(preferredBucketSpan !== null && preferredBucketSpan !== void 0 ? preferredBucketSpan : `${FALLBACK_ML_BUCKET_SPAN}m`)) === null || _parseInterval === void 0 ? void 0 : _parseInterval.asSeconds()) !== null && _parseInterval$asSeco !== void 0 ? _parseInterval$asSeco : FALLBACK_ML_BUCKET_SPAN * 60; // secs

  // Expected bounds (aka ML model plots) are stored as points in time, in intervals of the predefined bucket_span,
  // so to query bounds that include start and end time
  // we need to append bucket size before and after the range
  const extendedStart = start - minBucketSize * 1000; // ms
  const extendedEnd = end + minBucketSize * 1000; // ms

  const {
    intervalString
  } = (0, _get_anomaly_result_bucket_size.getAnomalyResultBucketSize)({
    start: extendedStart,
    end: extendedEnd,
    // If the calculated bucketSize is smaller than the bucket span interval,
    // use the original job's bucket_span
    minBucketSize
  });
  const anomaliesResponse = await (0, _anomaly_search.anomalySearch)(mlClient.mlSystem.mlAnomalySearch, {
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _apm_ml_anomaly_query.apmMlAnomalyQuery)({
            serviceName,
            transactionType
          }), ...(0, _server.rangeQuery)(extendedStart, extendedEnd, 'timestamp'), ...(0, _apm_ml_jobs_query.apmMlJobsQuery)(mlJobs)]
        }
      },
      aggs: {
        by_timeseries_id: {
          composite: {
            size: 5000,
            sources: (0, _as_mutable_array.asMutableArray)([{
              jobId: {
                terms: {
                  field: 'job_id'
                }
              }
            }, {
              detectorIndex: {
                terms: {
                  field: 'detector_index'
                }
              }
            }, {
              serviceName: {
                terms: {
                  field: 'partition_field_value'
                }
              }
            }, {
              transactionType: {
                terms: {
                  field: 'by_field_value'
                }
              }
            }])
          },
          aggs: {
            timeseries: {
              date_histogram: {
                field: 'timestamp',
                fixed_interval: intervalString,
                extended_bounds: {
                  min: extendedStart,
                  max: extendedEnd
                }
              },
              aggs: {
                top_anomaly: {
                  top_metrics: {
                    metrics: (0, _as_mutable_array.asMutableArray)([{
                      field: 'record_score'
                    }, {
                      field: 'actual'
                    }]),
                    size: 1,
                    sort: {
                      record_score: 'desc'
                    }
                  }
                },
                model_lower: {
                  min: {
                    field: 'model_lower'
                  }
                },
                model_upper: {
                  max: {
                    field: 'model_upper'
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  const jobsById = (0, _lodash.keyBy)(mlJobs, job => job.jobId);
  const series = (_anomaliesResponse$ag = (_anomaliesResponse$ag2 = anomaliesResponse.aggregations) === null || _anomaliesResponse$ag2 === void 0 ? void 0 : _anomaliesResponse$ag2.by_timeseries_id.buckets.map(bucket => {
    const jobId = bucket.key.jobId;
    const job = (0, _maybe.maybe)(jobsById[jobId]);
    if (!job) {
      logger.warn(`Could not find job for id ${jobId}`);
      return undefined;
    }
    const type = (0, _apm_ml_detectors.getApmMlDetectorType)(Number(bucket.key.detectorIndex));

    // ml failure rate is stored as 0-100, we calculate failure rate as 0-1
    const divider = type === _apm_ml_detectors.ApmMlDetectorType.txFailureRate ? 100 : 1;
    return {
      jobId,
      type,
      serviceName: bucket.key.serviceName,
      environment: job.environment,
      transactionType: bucket.key.transactionType,
      version: job.version,
      anomalies: bucket.timeseries.buckets.map(dateBucket => {
        var _ref, _dateBucket$top_anoma, _ref2, _dateBucket$top_anoma2;
        return {
          x: dateBucket.key,
          y: (_ref = (_dateBucket$top_anoma = dateBucket.top_anomaly.top[0]) === null || _dateBucket$top_anoma === void 0 ? void 0 : _dateBucket$top_anoma.metrics.record_score) !== null && _ref !== void 0 ? _ref : null,
          actual: divide((_ref2 = (_dateBucket$top_anoma2 = dateBucket.top_anomaly.top[0]) === null || _dateBucket$top_anoma2 === void 0 ? void 0 : _dateBucket$top_anoma2.metrics.actual) !== null && _ref2 !== void 0 ? _ref2 : null, divider)
        };
      }),
      bounds: bucket.timeseries.buckets.map(dateBucket => {
        return {
          x: getBoundedX(dateBucket.key, start, end),
          y0: divide(dateBucket.model_lower.value, divider),
          y1: divide(dateBucket.model_upper.value, divider)
        };
      })
    };
  })) !== null && _anomaliesResponse$ag !== void 0 ? _anomaliesResponse$ag : [];
  return (0, _lodash.compact)(series);
}