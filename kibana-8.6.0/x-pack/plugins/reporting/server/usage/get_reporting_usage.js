"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReportingUsage = getReportingUsage;
var _lodash = require("lodash");
var _constants = require("../../common/constants");
var _runtime_fields = require("../lib/store/runtime_fields");
var _get_export_stats = require("./get_export_stats");
var _get_export_type_handler = require("./get_export_type_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var keys;
(function (keys) {
  keys["JOB_TYPE"] = "jobTypes";
  keys["LAYOUT"] = "layoutTypes";
  keys["OBJECT_TYPE"] = "objectTypes";
  keys["STATUS_BY_APP"] = "statusByApp";
  keys["STATUS"] = "statusTypes";
  keys["OUTPUT_SIZE"] = "output_size";
  keys["ERROR_CODE"] = "errorCodes";
  keys["EXECUTION_TIMES"] = "executionTimes";
  keys["QUEUE_TIMES"] = "queue_times";
  keys["IS_DEPRECATED"] = "meta.isDeprecated";
  keys["CSV_ROWS"] = "csv_rows";
  keys["PDF_CPU"] = "pdf_cpu";
  keys["PDF_MEM"] = "pdf_memory";
  keys["PDF_PAGES"] = "pdf_pages";
  keys["PNG_CPU"] = "png_cpu";
  keys["PNG_MEM"] = "png_memory";
})(keys || (keys = {}));
var fields;
(function (fields) {
  fields["JOB_TYPE"] = "jobtype";
  fields["LAYOUT"] = "meta.layout.keyword";
  fields["CSV_NUM_ROWS"] = "metrics.csv.rows";
  fields["PDF_CPU"] = "metrics.pdf.cpuInPercentage";
  fields["PDF_MEMORY"] = "metrics.pdf.memoryInMegabytes";
  fields["PDF_NUM_PAGES"] = "metrics.pdf.pages";
  fields["PNG_CPU"] = "metrics.png.cpuInPercentage";
  fields["PNG_MEMORY"] = "metrics.png.memoryInMegabytes";
  fields["OBJECT_TYPE"] = "meta.objectType.keyword";
  fields["OUTPUT_SIZE"] = "output.size";
  fields["ERROR_CODE"] = "output.error_code";
  fields["STATUS"] = "status";
})(fields || (fields = {}));
const DEFAULT_TERMS_SIZE = 10;
const SIZE_PERCENTILES = [1, 5, 25, 50, 75, 95, 99];
const METRIC_PERCENTILES = [50, 75, 95, 99];

// indexes some key/count buckets by the "key" property
const getKeyCount = buckets => buckets.reduce((accum, {
  key,
  doc_count: count
}) => ({
  ...accum,
  [key]: count
}), {});

// indexes some key/count buckets by statusType > jobType > appName: statusCount
const getAppStatuses = buckets => buckets.reduce((statuses, statusBucket) => {
  return {
    ...statuses,
    [statusBucket.key]: statusBucket.jobTypes.buckets.reduce((jobTypes, job) => {
      return {
        ...jobTypes,
        [job.key]: job.appNames.buckets.reduce((apps, app) => {
          return {
            ...apps,
            [app.key]: app.doc_count
          };
        }, {})
      };
    }, {})
  };
}, {});
function normalizeJobtypes(jobBuckets, jobTypeMetrics) {
  return jobBuckets.reduce((accum, bucket) => {
    var _bucket$execution_tim;
    const {
      key,
      doc_count: count,
      isDeprecated,
      output_size: outputSizes,
      layoutTypes,
      objectTypes,
      errorCodes
    } = bucket;
    const deprecatedCount = isDeprecated === null || isDeprecated === void 0 ? void 0 : isDeprecated.doc_count;
    const executionTimes = (_bucket$execution_tim = bucket.execution_times) !== null && _bucket$execution_tim !== void 0 ? _bucket$execution_tim : {};

    // format the search results into the telemetry schema
    const jobType = {
      total: count,
      deprecated: deprecatedCount,
      app: getKeyCount((0, _lodash.get)(objectTypes, 'buckets', [])),
      metrics: jobTypeMetrics && jobTypeMetrics[key] || undefined,
      output_size: (0, _lodash.get)(outputSizes, 'values', {}),
      error_codes: getKeyCount((0, _lodash.get)(errorCodes, 'buckets', [])),
      layout: getKeyCount((0, _lodash.get)(layoutTypes, 'buckets', [])),
      execution_times: (0, _lodash.pick)(executionTimes !== null && executionTimes !== void 0 ? executionTimes : {}, ['min', 'max', 'avg'])
    };
    return {
      ...accum,
      [key]: jobType
    };
  }, {});
}
function getAggStats(aggs, jobTypeMetrics) {
  var _aggs$keys$QUEUE_TIME, _get;
  const {
    buckets: jobBuckets
  } = aggs[keys.JOB_TYPE];
  const jobTypes = normalizeJobtypes(jobBuckets, jobTypeMetrics);
  const all = aggs.doc_count;
  let statusTypes = {};
  const statusBuckets = (0, _lodash.get)(aggs[keys.STATUS], 'buckets', []);
  if (statusBuckets) {
    statusTypes = getKeyCount(statusBuckets);
  }
  let statusByApp = {};
  const statusAppBuckets = (0, _lodash.get)(aggs[keys.STATUS_BY_APP], 'buckets', []);
  if (statusAppBuckets) {
    statusByApp = getAppStatuses(statusAppBuckets);
  }
  const queueTimes = (_aggs$keys$QUEUE_TIME = aggs[keys.QUEUE_TIMES]) !== null && _aggs$keys$QUEUE_TIME !== void 0 ? _aggs$keys$QUEUE_TIME : {};
  return {
    _all: all,
    status: statusTypes,
    statuses: statusByApp,
    output_size: (_get = (0, _lodash.get)(aggs[keys.OUTPUT_SIZE], 'values')) !== null && _get !== void 0 ? _get : undefined,
    queue_times: (0, _lodash.pick)(queueTimes, ['min', 'max', 'avg']),
    ...jobTypes
  };
}
function normalizeMetrics(metrics) {
  if (!metrics) {
    return;
  }
  const metricBuckets = metrics.buckets;
  return metricBuckets.reduce((accum, next) => {
    return {
      ...accum,
      [next.key]: {
        pdf_pages: next.pdf_pages,
        pdf_cpu: next.pdf_cpu,
        pdf_memory: next.pdf_memory,
        png_cpu: next.png_cpu,
        png_memory: next.png_memory,
        csv_rows: next.csv_rows
      }
    };
  }, {});
}
async function handleResponse(response) {
  var _response$aggregation;
  const ranges = ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.ranges) || {};
  let last7DaysUsage = {};
  let allUsage = {};
  const rangesBuckets = ranges.buckets;
  if (rangesBuckets) {
    var _response$aggregation2;
    const {
      all,
      last7Days
    } = rangesBuckets;
    last7DaysUsage = last7Days ? getAggStats(last7Days) : {};

    // calculate metrics per job type for the stats covering all-time
    const jobTypeMetrics = normalizeMetrics((_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.metrics);
    allUsage = all ? getAggStats(all, jobTypeMetrics) : {};
  }
  return {
    last7Days: last7DaysUsage,
    ...allUsage
  };
}

/*
 * Reporting Usage Collector's "fetch" method
 */
async function getReportingUsage(getLicense, esClient, exportTypesRegistry) {
  const reportingIndex = _constants.REPORTING_SYSTEM_INDEX;
  const params = {
    index: `${reportingIndex}-*`,
    filter_path: 'aggregations.*.buckets,aggregations.metrics_*',
    body: {
      size: 0,
      runtime_mappings: _runtime_fields.runtimeFields,
      // queue_time_ms, execution_time_ms
      aggs: {
        ranges: {
          filters: {
            filters: {
              all: {
                match_all: {}
              },
              last7Days: {
                range: {
                  created_at: {
                    gte: 'now-7d/d'
                  }
                }
              }
            }
          },
          aggs: {
            [keys.JOB_TYPE]: {
              terms: {
                field: fields.JOB_TYPE,
                size: DEFAULT_TERMS_SIZE
              },
              aggs: {
                isDeprecated: {
                  filter: {
                    term: {
                      [keys.IS_DEPRECATED]: true
                    }
                  }
                },
                [keys.LAYOUT]: {
                  terms: {
                    field: fields.LAYOUT,
                    size: DEFAULT_TERMS_SIZE
                  }
                },
                [keys.STATUS_BY_APP]: {
                  terms: {
                    field: fields.STATUS,
                    size: DEFAULT_TERMS_SIZE
                  },
                  aggs: {
                    appNames: {
                      terms: {
                        field: fields.OBJECT_TYPE,
                        size: DEFAULT_TERMS_SIZE
                      }
                    }
                  }
                },
                [keys.OBJECT_TYPE]: {
                  terms: {
                    field: fields.OBJECT_TYPE,
                    size: DEFAULT_TERMS_SIZE
                  }
                },
                // per-job output size
                [keys.OUTPUT_SIZE]: {
                  percentiles: {
                    field: fields.OUTPUT_SIZE,
                    percents: SIZE_PERCENTILES
                  }
                },
                // per-job error codes
                [keys.ERROR_CODE]: {
                  terms: {
                    field: fields.ERROR_CODE,
                    size: DEFAULT_TERMS_SIZE
                  }
                },
                // runtime fields
                [keys.EXECUTION_TIMES]: {
                  stats: {
                    field: _runtime_fields.FIELD_EXECUTION_TIME_MS
                  }
                }
              }
            },
            [keys.STATUS]: {
              terms: {
                field: fields.STATUS,
                size: DEFAULT_TERMS_SIZE
              }
            },
            // overall output sizes
            [keys.OUTPUT_SIZE]: {
              percentiles: {
                field: fields.OUTPUT_SIZE
              }
            },
            // overall error codes
            [keys.ERROR_CODE]: {
              terms: {
                field: fields.ERROR_CODE,
                size: DEFAULT_TERMS_SIZE
              }
            },
            [keys.QUEUE_TIMES]: {
              stats: {
                field: _runtime_fields.FIELD_QUEUE_TIME_MS
              }
            }
          }
        },
        metrics: {
          terms: {
            field: fields.JOB_TYPE,
            size: 10
          },
          aggs: {
            [keys.CSV_ROWS]: {
              percentiles: {
                field: fields.CSV_NUM_ROWS,
                percents: METRIC_PERCENTILES
              }
            },
            [keys.PDF_PAGES]: {
              percentiles: {
                field: fields.PDF_NUM_PAGES,
                percents: METRIC_PERCENTILES
              }
            },
            [keys.PDF_MEM]: {
              percentiles: {
                field: fields.PDF_MEMORY,
                percents: METRIC_PERCENTILES
              }
            },
            [keys.PDF_CPU]: {
              percentiles: {
                field: fields.PDF_CPU,
                percents: METRIC_PERCENTILES
              }
            },
            [keys.PNG_MEM]: {
              percentiles: {
                field: fields.PNG_MEMORY,
                percents: METRIC_PERCENTILES
              }
            },
            [keys.PNG_CPU]: {
              percentiles: {
                field: fields.PNG_CPU,
                percents: METRIC_PERCENTILES
              }
            }
          }
        }
      }
    }
  };
  const featureAvailability = await getLicense();
  return esClient.search(params).then(response => handleResponse(response)).then(usage => {
    const exportTypesHandler = (0, _get_export_type_handler.getExportTypesHandler)(exportTypesRegistry);
    const availability = exportTypesHandler.getAvailability(featureAvailability);
    const {
      last7Days,
      ...all
    } = usage;
    return {
      available: true,
      enabled: true,
      last7Days: (0, _get_export_stats.getExportStats)(last7Days, availability, exportTypesHandler),
      ...(0, _get_export_stats.getExportStats)(all, availability, exportTypesHandler)
    };
  });
}