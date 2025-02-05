"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anomalyChartsDataProvider = anomalyChartsDataProvider;
exports.chartLimits = chartLimits;
exports.getDefaultChartsData = getDefaultChartsData;
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _d = require("d3");
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
var _common = require("../../../common");
var _job_utils = require("../../../common/util/job_utils");
var _anomaly_utils = require("../../../common/util/anomaly_utils");
var _guards = require("../../../common/types/guards");
var _aggregation_types = require("../../../common/constants/aggregation_types");
var _parse_interval = require("../../../common/util/parse_interval");
var _field_types = require("../../../common/constants/field_types");
var _datafeed_utils = require("../../../common/util/datafeed_utils");
var _validation_utils = require("../../../common/util/validation_utils");
var _charts = require("../../../common/constants/charts");
var _chart_utils = require("../../../common/util/chart_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function chartLimits(data = []) {
  const domain = (0, _d.extent)(data, d => {
    let metricValue = d.value;
    if (metricValue === null && d.anomalyScore !== undefined && d.actual !== undefined) {
      // If an anomaly coincides with a gap in the data, use the anomaly actual value.
      metricValue = Array.isArray(d.actual) ? d.actual[0] : d.actual;
    }
    return metricValue;
  });
  const limits = {
    max: domain[1],
    min: domain[0]
  };
  if (limits.max === limits.min) {
    // @ts-ignore
    limits.max = (0, _d.max)(data, d => {
      if (d.typical) {
        return Math.max(d.value, ...d.typical);
      } else {
        // If analysis with by and over field, and more than one cause,
        // there will be no actual and typical value.
        // TODO - produce a better visual for population analyses.
        return d.value;
      }
    });
    // @ts-ignore
    limits.min = (0, _d.min)(data, d => {
      if (d.typical) {
        return Math.min(d.value, ...d.typical);
      } else {
        // If analysis with by and over field, and more than one cause,
        // there will be no actual and typical value.
        // TODO - produce a better visual for population analyses.
        return d.value;
      }
    });
  }

  // add padding of 5% of the difference between max and min
  // if we ended up with the same value for both of them
  if (limits.max === limits.min) {
    const padding = limits.max * 0.05;
    limits.max += padding;
    limits.min -= padding;
  }
  return limits;
}
const CHART_MAX_POINTS = 500;
const MAX_SCHEDULED_EVENTS = 10; // Max number of scheduled events displayed per bucket.
const SAMPLER_TOP_TERMS_SHARD_SIZE = 20000;
const ENTITY_AGGREGATION_SIZE = 10;
const AGGREGATION_MIN_DOC_COUNT = 1;
const CARDINALITY_PRECISION_THRESHOLD = 100;
const USE_OVERALL_CHART_LIMITS = false;
const ML_TIME_FIELD_NAME = 'timestamp';
function getDefaultChartsData() {
  return {
    chartsPerRow: 1,
    errorMessages: undefined,
    seriesToPlot: [],
    // default values, will update on every re-render
    tooManyBuckets: false,
    timeFieldName: 'timestamp'
  };
}
function anomalyChartsDataProvider(mlClient, client) {
  let handleError = () => {};
  async function fetchMetricData(index, entityFields, query, metricFunction,
  // ES aggregation name
  metricFieldName, summaryCountFieldName, timeFieldName, earliestMs, latestMs, intervalMs, datafeedConfig) {
    var _resp$aggregations$by, _resp$aggregations, _resp$aggregations$by2;
    const scriptFields = datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.script_fields;
    const aggFields = (0, _datafeed_utils.getDatafeedAggregations)(datafeedConfig);

    // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the time range, entity fields,
    // plus any additional supplied query.
    const shouldCriteria = [];
    const mustCriteria = [{
      range: {
        [timeFieldName]: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }, ...(query ? [query] : [])];
    entityFields.forEach(entity => {
      if (entity.fieldValue && entity.fieldValue.toString().length !== 0) {
        mustCriteria.push({
          term: {
            [entity.fieldName]: entity.fieldValue
          }
        });
      } else {
        // Add special handling for blank entity field values, checking for either
        // an empty string or the field not existing.
        shouldCriteria.push({
          bool: {
            must: [{
              term: {
                [entity.fieldName]: ''
              }
            }]
          }
        });
        shouldCriteria.push({
          bool: {
            must_not: [{
              exists: {
                field: entity.fieldName
              }
            }]
          }
        });
      }
    });
    const esSearchRequest = {
      index,
      query: {
        bool: {
          must: mustCriteria
        }
      },
      aggs: {
        byTime: {
          date_histogram: {
            field: timeFieldName,
            fixed_interval: `${intervalMs}ms`,
            min_doc_count: 0
          }
        }
      },
      ...((0, _common.isRuntimeMappings)(datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.runtime_mappings) ? {
        runtime_mappings: datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.runtime_mappings
      } : {}),
      size: 0,
      _source: false
    };
    if (shouldCriteria.length > 0) {
      esSearchRequest.query.bool.should = shouldCriteria;
      esSearchRequest.query.bool.minimum_should_match = shouldCriteria.length / 2;
    }
    esSearchRequest.aggs.byTime.aggs = {};
    if (metricFieldName !== undefined && metricFieldName !== '' && metricFunction) {
      const metricAgg = {
        [metricFunction]: {}
      };
      if (scriptFields !== undefined && scriptFields[metricFieldName] !== undefined) {
        metricAgg[metricFunction].script = scriptFields[metricFieldName].script;
      } else {
        metricAgg[metricFunction].field = metricFieldName;
      }
      if (metricFunction === 'percentiles') {
        metricAgg[metricFunction].percents = [_job_utils.ML_MEDIAN_PERCENTS];
      }

      // when the field is an aggregation field, because the field doesn't actually exist in the indices
      // we need to pass all the sub aggs from the original datafeed config
      // so that we can access the aggregated field
      if ((0, _mlIsPopulatedObject.isPopulatedObject)(aggFields)) {
        var _aggFields$accessor$a;
        // first item under aggregations can be any name, not necessarily 'buckets'
        const accessor = Object.keys(aggFields)[0];
        const tempAggs = {
          ...((_aggFields$accessor$a = aggFields[accessor].aggs) !== null && _aggFields$accessor$a !== void 0 ? _aggFields$accessor$a : aggFields[accessor].aggregations)
        };
        const foundValue = (0, _validation_utils.findAggField)(tempAggs, metricFieldName);
        if (foundValue !== undefined) {
          tempAggs.metric = foundValue;
          delete tempAggs[metricFieldName];
        }
        esSearchRequest.aggs.byTime.aggs = tempAggs;
      } else {
        esSearchRequest.aggs.byTime.aggs.metric = metricAgg;
      }
    } else {
      // if metricFieldName is not defined, it's probably a variation of the non zero count function
      // refer to buildConfigFromDetector
      if (summaryCountFieldName !== undefined && metricFunction === _aggregation_types.ES_AGGREGATION.CARDINALITY) {
        // if so, check if summaryCountFieldName is an aggregation field
        if (typeof aggFields === 'object' && Object.keys(aggFields).length > 0) {
          var _aggFields$accessor$a2;
          // first item under aggregations can be any name, not necessarily 'buckets'
          const accessor = Object.keys(aggFields)[0];
          const tempAggs = {
            ...((_aggFields$accessor$a2 = aggFields[accessor].aggs) !== null && _aggFields$accessor$a2 !== void 0 ? _aggFields$accessor$a2 : aggFields[accessor].aggregations)
          };
          const foundCardinalityField = (0, _validation_utils.findAggField)(tempAggs, summaryCountFieldName);
          if (foundCardinalityField !== undefined) {
            tempAggs.metric = foundCardinalityField;
          }
          esSearchRequest.aggs.byTime.aggs = tempAggs;
        }
      }
    }
    const resp = await (client === null || client === void 0 ? void 0 : client.asCurrentUser.search(esSearchRequest, {
      maxRetries: 0
    }));
    const obj = {
      success: true,
      results: {}
    };
    // @ts-ignore
    const dataByTime = (_resp$aggregations$by = resp === null || resp === void 0 ? void 0 : (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : (_resp$aggregations$by2 = _resp$aggregations.byTime) === null || _resp$aggregations$by2 === void 0 ? void 0 : _resp$aggregations$by2.buckets) !== null && _resp$aggregations$by !== void 0 ? _resp$aggregations$by : [];
    dataByTime.forEach(dataForTime => {
      if (metricFunction === 'count') {
        obj.results[dataForTime.key] = dataForTime.doc_count;
      } else {
        var _dataForTime$metric, _dataForTime$metric2;
        const value = dataForTime === null || dataForTime === void 0 ? void 0 : (_dataForTime$metric = dataForTime.metric) === null || _dataForTime$metric === void 0 ? void 0 : _dataForTime$metric.value;
        const values = dataForTime === null || dataForTime === void 0 ? void 0 : (_dataForTime$metric2 = dataForTime.metric) === null || _dataForTime$metric2 === void 0 ? void 0 : _dataForTime$metric2.values;
        if (dataForTime.doc_count === 0) {
          // @ts-ignore
          obj.results[dataForTime.key] = null;
        } else if (value !== undefined) {
          obj.results[dataForTime.key] = value;
        } else if (values !== undefined) {
          // Percentiles agg currently returns NaN rather than null when none of the docs in the
          // bucket contain the field used in the aggregation
          // (see elasticsearch issue https://github.com/elastic/elasticsearch/issues/29066).
          // Store as null, so values can be handled in the same manner downstream as other aggs
          // (min, mean, max) which return null.
          const medianValues = values[_job_utils.ML_MEDIAN_PERCENTS];
          obj.results[dataForTime.key] = !isNaN(medianValues) ? medianValues : null;
        } else {
          // @ts-ignore
          obj.results[dataForTime.key] = null;
        }
      }
    });
    return obj;
  }

  /**
   * TODO Make an API endpoint (also used by the SMV).
   * @param jobId
   * @param detectorIndex
   * @param criteriaFields
   * @param earliestMs
   * @param latestMs
   * @param intervalMs
   * @param aggType
   */
  async function getModelPlotOutput(jobId, detectorIndex, criteriaFields, earliestMs, latestMs, intervalMs, aggType) {
    const obj = {
      success: true,
      results: {}
    };

    // if an aggType object has been passed in, use it.
    // otherwise default to min and max aggs for the upper and lower bounds
    const modelAggs = aggType === undefined ? {
      max: 'max',
      min: 'min'
    } : {
      max: aggType.max,
      min: aggType.min
    };

    // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the job ID and time range.
    const mustCriteria = [{
      term: {
        job_id: jobId
      }
    }, {
      range: {
        timestamp: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }];

    // Add in term queries for each of the specified criteria.
    (0, _lodash.each)(criteriaFields, criteria => {
      mustCriteria.push({
        term: {
          [criteria.fieldName]: criteria.fieldValue
        }
      });
    });

    // Add criteria for the detector index. Results from jobs created before 6.1 will not
    // contain a detector_index field, so use a should criteria with a 'not exists' check.
    const shouldCriteria = [{
      term: {
        detector_index: detectorIndex
      }
    }, {
      bool: {
        must_not: [{
          exists: {
            field: 'detector_index'
          }
        }]
      }
    }];
    const searchRequest = {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              result_type: 'model_plot'
            }
          }, {
            bool: {
              must: mustCriteria,
              should: shouldCriteria,
              minimum_should_match: 1
            }
          }]
        }
      },
      aggs: {
        times: {
          date_histogram: {
            field: 'timestamp',
            fixed_interval: `${intervalMs}ms`,
            min_doc_count: 0
          },
          aggs: {
            actual: {
              avg: {
                field: 'actual'
              }
            },
            modelUpper: {
              [modelAggs.max]: {
                field: 'model_upper'
              }
            },
            modelLower: {
              [modelAggs.min]: {
                field: 'model_lower'
              }
            }
          }
        }
      }
    };
    const resp = await mlClient.anomalySearch(searchRequest, [jobId]);
    const aggregationsByTime = (0, _lodash.get)(resp, ['aggregations', 'times', 'buckets'], []);
    (0, _lodash.each)(aggregationsByTime, dataForTime => {
      const time = dataForTime.key;
      const modelUpper = (0, _lodash.get)(dataForTime, ['modelUpper', 'value']);
      const modelLower = (0, _lodash.get)(dataForTime, ['modelLower', 'value']);
      const actual = (0, _lodash.get)(dataForTime, ['actual', 'value']);
      obj.results[time] = {
        actual,
        modelUpper: modelUpper === undefined || isFinite(modelUpper) === false ? null : modelUpper,
        modelLower: modelLower === undefined || isFinite(modelLower) === false ? null : modelLower
      };
    });
    return obj;
  }
  function processRecordsForDisplay(combinedJobRecords, anomalyRecords) {
    // Aggregate the anomaly data by detector, and entity (by/over/partition).
    if (anomalyRecords.length === 0) {
      return {
        records: [],
        errors: undefined
      };
    }
    // Aggregate by job, detector, and analysis fields (partition, by, over).
    const aggregatedData = {};
    const jobsErrorMessage = {};
    (0, _lodash.each)(anomalyRecords, record => {
      // Check if we can plot a chart for this record, depending on whether the source data
      // is chartable, and if model plot is enabled for the job.

      const job = combinedJobRecords[record.job_id];

      // if we already know this job has datafeed aggregations we cannot support
      // no need to do more checks
      if (jobsErrorMessage[record.job_id] !== undefined) {
        return;
      }
      let isChartable = (0, _job_utils.isSourceDataChartableForDetector)(job, record.detector_index) || (0, _job_utils.isMappableJob)(job, record.detector_index);
      if (isChartable === false) {
        if ((0, _job_utils.isModelPlotChartableForDetector)(job, record.detector_index)) {
          // Check if model plot is enabled for this job.
          // Need to check the entity fields for the record in case the model plot config has a terms list.
          const entityFields = (0, _anomaly_utils.getEntityFieldList)(record);
          if ((0, _job_utils.isModelPlotEnabled)(job, record.detector_index, entityFields)) {
            isChartable = true;
          } else {
            isChartable = false;
            jobsErrorMessage[record.job_id] = _i18n.i18n.translate('xpack.ml.timeSeriesJob.sourceDataNotChartableWithDisabledModelPlotMessage', {
              defaultMessage: 'source data is not viewable for this detector and model plot is disabled'
            });
          }
        } else {
          jobsErrorMessage[record.job_id] = _i18n.i18n.translate('xpack.ml.timeSeriesJob.sourceDataModelPlotNotChartableMessage', {
            defaultMessage: 'both source data and model plot are not chartable for this detector'
          });
        }
      }
      if (isChartable === false) {
        return;
      }
      const jobId = record.job_id;
      if (aggregatedData[jobId] === undefined) {
        aggregatedData[jobId] = {};
      }
      const detectorsForJob = aggregatedData[jobId];
      const detectorIndex = record.detector_index;
      if (detectorsForJob[detectorIndex] === undefined) {
        detectorsForJob[detectorIndex] = {};
      }

      // TODO - work out how best to display results from detectors with just an over field.
      const firstFieldName = record.partition_field_name || record.by_field_name || record.over_field_name;
      const firstFieldValue = record.partition_field_value || record.by_field_value || record.over_field_value;
      if (firstFieldName !== undefined && firstFieldValue !== undefined) {
        const groupsForDetector = detectorsForJob[detectorIndex];
        if (groupsForDetector[firstFieldName] === undefined) {
          groupsForDetector[firstFieldName] = {};
        }
        const valuesForGroup = groupsForDetector[firstFieldName];
        if (valuesForGroup[firstFieldValue] === undefined) {
          valuesForGroup[firstFieldValue] = {};
        }
        const dataForGroupValue = valuesForGroup[firstFieldValue];
        let isSecondSplit = false;
        if (record.partition_field_name !== undefined) {
          const splitFieldName = record.over_field_name || record.by_field_name;
          if (splitFieldName !== undefined) {
            isSecondSplit = true;
          }
        }
        if (isSecondSplit === false) {
          if (dataForGroupValue.maxScoreRecord === undefined) {
            dataForGroupValue.maxScore = record.record_score;
            dataForGroupValue.maxScoreRecord = record;
          } else {
            if (record.record_score > dataForGroupValue.maxScore) {
              dataForGroupValue.maxScore = record.record_score;
              dataForGroupValue.maxScoreRecord = record;
            }
          }
        } else {
          // Aggregate another level for the over or by field.
          const secondFieldName = record.over_field_name || record.by_field_name;
          const secondFieldValue = record.over_field_value || record.by_field_value;
          if (secondFieldName !== undefined && secondFieldValue !== undefined) {
            if (dataForGroupValue[secondFieldName] === undefined) {
              dataForGroupValue[secondFieldName] = {};
            }
            const splitsForGroup = dataForGroupValue[secondFieldName];
            if (splitsForGroup[secondFieldValue] === undefined) {
              splitsForGroup[secondFieldValue] = {};
            }
            const dataForSplitValue = splitsForGroup[secondFieldValue];
            if (dataForSplitValue.maxScoreRecord === undefined) {
              dataForSplitValue.maxScore = record.record_score;
              dataForSplitValue.maxScoreRecord = record;
            } else {
              if (record.record_score > dataForSplitValue.maxScore) {
                dataForSplitValue.maxScore = record.record_score;
                dataForSplitValue.maxScoreRecord = record;
              }
            }
          }
        }
      } else {
        // Detector with no partition or by field.
        const dataForDetector = detectorsForJob[detectorIndex];
        if (dataForDetector.maxScoreRecord === undefined) {
          dataForDetector.maxScore = record.record_score;
          dataForDetector.maxScoreRecord = record;
        } else {
          if (record.record_score > dataForDetector.maxScore) {
            dataForDetector.maxScore = record.record_score;
            dataForDetector.maxScoreRecord = record;
          }
        }
      }
    });

    // Group job id by error message instead of by job:
    const errorMessages = {};
    Object.keys(jobsErrorMessage).forEach(jobId => {
      const msg = jobsErrorMessage[jobId];
      if (errorMessages[msg] === undefined) {
        errorMessages[msg] = new Set([jobId]);
      } else {
        errorMessages[msg].add(jobId);
      }
    });
    let recordsForSeries = [];
    // Convert to an array of the records with the highest record_score per unique series.
    (0, _lodash.each)(aggregatedData, detectorsForJob => {
      (0, _lodash.each)(detectorsForJob, groupsForDetector => {
        if (groupsForDetector.errorMessage !== undefined) {
          recordsForSeries.push(groupsForDetector.errorMessage);
        } else {
          if (groupsForDetector.maxScoreRecord !== undefined) {
            // Detector with no partition / by field.
            recordsForSeries.push(groupsForDetector.maxScoreRecord);
          } else {
            (0, _lodash.each)(groupsForDetector, valuesForGroup => {
              (0, _lodash.each)(valuesForGroup, dataForGroupValue => {
                if (dataForGroupValue.maxScoreRecord !== undefined) {
                  recordsForSeries.push(dataForGroupValue.maxScoreRecord);
                } else {
                  // Second level of aggregation for partition and by/over.
                  (0, _lodash.each)(dataForGroupValue, splitsForGroup => {
                    (0, _lodash.each)(splitsForGroup, dataForSplitValue => {
                      recordsForSeries.push(dataForSplitValue.maxScoreRecord);
                    });
                  });
                }
              });
            });
          }
        }
      });
    });
    recordsForSeries = (0, _lodash.sortBy)(recordsForSeries, 'record_score').reverse();
    return {
      records: recordsForSeries,
      errors: errorMessages
    };
  }
  function buildConfigFromDetector(job, detectorIndex) {
    const analysisConfig = job.analysis_config;
    const detector = analysisConfig.detectors[detectorIndex];
    const config = {
      jobId: job.job_id,
      detectorIndex,
      metricFunction: detector.function === _aggregation_types.ML_JOB_AGGREGATION.LAT_LONG ? _aggregation_types.ML_JOB_AGGREGATION.LAT_LONG : (0, _job_utils.mlFunctionToESAggregation)(detector.function),
      timeField: job.data_description.time_field,
      // @ts-expect-error bucket_span is of type estypes.Duration
      interval: job.analysis_config.bucket_span,
      datafeedConfig: job.datafeed_config,
      summaryCountFieldName: job.analysis_config.summary_count_field_name,
      metricFieldName: undefined
    };
    if (detector.field_name !== undefined) {
      config.metricFieldName = detector.field_name;
    }

    // Extra checks if the job config uses a summary count field.
    const summaryCountFieldName = analysisConfig.summary_count_field_name;
    if (config.metricFunction === _aggregation_types.ES_AGGREGATION.COUNT && summaryCountFieldName !== undefined && summaryCountFieldName !== _field_types.DOC_COUNT && summaryCountFieldName !== _field_types._DOC_COUNT) {
      // Check for a detector looking at cardinality (distinct count) using an aggregation.
      // The cardinality field will be in:
      // aggregations/<agg_name>/aggregations/<summaryCountFieldName>/cardinality/field
      // or aggs/<agg_name>/aggs/<summaryCountFieldName>/cardinality/field
      let cardinalityField;
      const topAgg = (0, _lodash.get)(job.datafeed_config, 'aggregations') || (0, _lodash.get)(job.datafeed_config, 'aggs');
      if (topAgg !== undefined && Object.values(topAgg).length > 0) {
        cardinalityField = (0, _lodash.get)(Object.values(topAgg)[0], ['aggregations', summaryCountFieldName, _aggregation_types.ES_AGGREGATION.CARDINALITY, 'field']) || (0, _lodash.get)(Object.values(topAgg)[0], ['aggs', summaryCountFieldName, _aggregation_types.ES_AGGREGATION.CARDINALITY, 'field']);
      }
      if ((detector.function === _aggregation_types.ML_JOB_AGGREGATION.NON_ZERO_COUNT || detector.function === _aggregation_types.ML_JOB_AGGREGATION.LOW_NON_ZERO_COUNT || detector.function === _aggregation_types.ML_JOB_AGGREGATION.HIGH_NON_ZERO_COUNT || detector.function === _aggregation_types.ML_JOB_AGGREGATION.COUNT || detector.function === _aggregation_types.ML_JOB_AGGREGATION.HIGH_COUNT || detector.function === _aggregation_types.ML_JOB_AGGREGATION.LOW_COUNT) && cardinalityField !== undefined) {
        config.metricFunction = _aggregation_types.ES_AGGREGATION.CARDINALITY;
        config.metricFieldName = undefined;
      } else {
        // For count detectors using summary_count_field, plot sum(summary_count_field_name)
        config.metricFunction = _aggregation_types.ES_AGGREGATION.SUM;
        config.metricFieldName = summaryCountFieldName;
      }
    }
    return config;
  }
  function buildConfig(record, job) {
    const detectorIndex = record.detector_index;
    const config = {
      ...buildConfigFromDetector(job, detectorIndex)
    };
    const fullSeriesConfig = {
      bucketSpanSeconds: 0,
      entityFields: [],
      fieldName: '',
      ...config
    };
    // Add extra properties used by the explorer dashboard charts.
    fullSeriesConfig.functionDescription = record.function_description;
    const parsedBucketSpan = (0, _parse_interval.parseInterval)(job.analysis_config.bucket_span);
    if (parsedBucketSpan !== null) {
      fullSeriesConfig.bucketSpanSeconds = parsedBucketSpan.asSeconds();
    }
    fullSeriesConfig.detectorLabel = record.function;
    const jobDetectors = job.analysis_config.detectors;
    if (jobDetectors) {
      fullSeriesConfig.detectorLabel = jobDetectors[detectorIndex].detector_description;
    } else {
      if (record.field_name !== undefined) {
        fullSeriesConfig.detectorLabel += ` ${fullSeriesConfig.fieldName}`;
      }
    }
    if (record.field_name !== undefined) {
      fullSeriesConfig.fieldName = record.field_name;
      fullSeriesConfig.metricFieldName = record.field_name;
    }

    // Add the 'entity_fields' i.e. the partition, by, over fields which
    // define the metric series to be plotted.
    fullSeriesConfig.entityFields = (0, _anomaly_utils.getEntityFieldList)(record);
    if (record.function === _aggregation_types.ML_JOB_AGGREGATION.METRIC) {
      fullSeriesConfig.metricFunction = (0, _job_utils.mlFunctionToESAggregation)(record.function_description);
    }

    // Build the tooltip data for the chart info icon, showing further details on what is being plotted.
    let functionLabel = `${config.metricFunction}`;
    if (fullSeriesConfig.metricFieldName !== undefined && fullSeriesConfig.metricFieldName !== null) {
      functionLabel += ` ${fullSeriesConfig.metricFieldName}`;
    }
    fullSeriesConfig.infoTooltip = {
      jobId: record.job_id,
      aggregationInterval: fullSeriesConfig.interval,
      chartFunction: functionLabel,
      entityFields: fullSeriesConfig.entityFields.map(f => ({
        fieldName: f.fieldName,
        fieldValue: f.fieldValue
      }))
    };
    return fullSeriesConfig;
  }
  function findChartPointForTime(chartData, time) {
    return chartData.find(point => point.date === time);
  }
  function calculateChartRange(seriesConfigs, selectedEarliestMs, selectedLatestMs, recordsToPlot, timeFieldName, optimumNumPoints, timeBounds) {
    let tooManyBuckets = false;
    // Calculate the time range for the charts.
    // Fit in as many points in the available container width plotted at the job bucket span.
    // Look for the chart with the shortest bucket span as this determines
    // the length of the time range that can be plotted.
    const midpointMs = Math.ceil((selectedEarliestMs + selectedLatestMs) / 2);
    const minBucketSpanMs = Math.min.apply(null, (0, _lodash.map)(seriesConfigs, 'bucketSpanSeconds')) * 1000;
    const maxBucketSpanMs = Math.max.apply(null, (0, _lodash.map)(seriesConfigs, 'bucketSpanSeconds')) * 1000;
    const pointsToPlotFullSelection = Math.ceil((selectedLatestMs - selectedEarliestMs) / minBucketSpanMs);

    // Increase actual number of points if we can't plot the selected range
    // at optimal point spacing.
    const plotPoints = Math.max(optimumNumPoints, pointsToPlotFullSelection);
    const halfPoints = Math.ceil(plotPoints / 2);
    const boundsMin = timeBounds.min;
    const boundsMax = timeBounds.max;
    let chartRange = {
      min: boundsMin ? Math.max(midpointMs - halfPoints * minBucketSpanMs, boundsMin) : midpointMs - halfPoints * minBucketSpanMs,
      max: boundsMax ? Math.min(midpointMs + halfPoints * minBucketSpanMs, boundsMax) : midpointMs + halfPoints * minBucketSpanMs
    };
    if (plotPoints > CHART_MAX_POINTS) {
      // For each series being plotted, display the record with the highest score if possible.
      const maxTimeSpan = minBucketSpanMs * CHART_MAX_POINTS;
      let minMs = recordsToPlot[0][timeFieldName];
      let maxMs = recordsToPlot[0][timeFieldName];
      (0, _lodash.each)(recordsToPlot, record => {
        const diffMs = maxMs - minMs;
        if (diffMs < maxTimeSpan) {
          const recordTime = record[timeFieldName];
          if (recordTime < minMs) {
            if (maxMs - recordTime <= maxTimeSpan) {
              minMs = recordTime;
            }
          }
          if (recordTime > maxMs) {
            if (recordTime - minMs <= maxTimeSpan) {
              maxMs = recordTime;
            }
          }
        }
      });
      if (maxMs - minMs < maxTimeSpan) {
        // Expand out before and after the span with the highest scoring anomalies,
        // covering as much as the requested time span as possible.
        // Work out if the high scoring region is nearer the start or end of the selected time span.
        const diff = maxTimeSpan - (maxMs - minMs);
        if (minMs - 0.5 * diff <= selectedEarliestMs) {
          minMs = Math.max(selectedEarliestMs, minMs - 0.5 * diff);
          maxMs = minMs + maxTimeSpan;
        } else {
          maxMs = Math.min(selectedLatestMs, maxMs + 0.5 * diff);
          minMs = maxMs - maxTimeSpan;
        }
      }
      chartRange = {
        min: minMs,
        max: maxMs
      };
    }

    // Elasticsearch aggregation returns points at start of bucket,
    // so align the min to the length of the longest bucket,
    // and use the start of the latest selected bucket in the check
    // for too many selected buckets, respecting the max bounds set in the view.
    chartRange.min = Math.floor(chartRange.min / maxBucketSpanMs) * maxBucketSpanMs;
    if (boundsMin !== undefined && chartRange.min < boundsMin) {
      chartRange.min = chartRange.min + maxBucketSpanMs;
    }

    // When used as an embeddable, selectedEarliestMs is the start date on the time picker,
    // which may be earlier than the time of the first point plotted in the chart (as we plot
    // the first full bucket with a start date no earlier than the start).
    const selectedEarliestBucketCeil = boundsMin ? Math.ceil(Math.max(selectedEarliestMs, boundsMin) / maxBucketSpanMs) * maxBucketSpanMs : Math.ceil(selectedEarliestMs / maxBucketSpanMs) * maxBucketSpanMs;
    const selectedLatestBucketStart = boundsMax ? Math.floor(Math.min(selectedLatestMs, boundsMax) / maxBucketSpanMs) * maxBucketSpanMs : Math.floor(selectedLatestMs / maxBucketSpanMs) * maxBucketSpanMs;
    if ((chartRange.min > selectedEarliestBucketCeil || chartRange.max < selectedLatestBucketStart) && chartRange.max - chartRange.min < selectedLatestBucketStart - selectedEarliestBucketCeil) {
      tooManyBuckets = true;
    }
    return {
      chartRange,
      tooManyBuckets
    };
  }
  function initErrorHandler(errorMessages) {
    handleError = (errorMsg, jobId) => {
      // Group the jobIds by the type of error message
      if (!errorMessages) {
        errorMessages = {};
      }
      if (errorMessages[errorMsg]) {
        errorMessages[errorMsg].add(jobId);
      } else {
        errorMessages[errorMsg] = new Set([jobId]);
      }
    };
  }
  async function getAnomalyData(combinedJobRecords, anomalyRecords, selectedEarliestMs, selectedLatestMs, numberOfPoints, timeBounds, severity = 0, maxSeries = 6) {
    const data = getDefaultChartsData();
    const filteredRecords = anomalyRecords.filter(record => {
      return Number(record.record_score) >= severity;
    });
    const {
      records: allSeriesRecords,
      errors: errorMessages
    } = processRecordsForDisplay(combinedJobRecords, filteredRecords);
    initErrorHandler(errorMessages);
    if (!Array.isArray(allSeriesRecords)) return;
    const recordsToPlot = allSeriesRecords.slice(0, maxSeries);
    const hasGeoData = recordsToPlot.find(record => (record.function_description || record.function) === _aggregation_types.ML_JOB_AGGREGATION.LAT_LONG);
    const seriesConfigs = recordsToPlot.map(record => buildConfig(record, combinedJobRecords[record.job_id]));
    const seriesConfigsNoGeoData = [];
    const mapData = [];
    if (hasGeoData !== undefined) {
      for (let i = 0; i < seriesConfigs.length; i++) {
        const config = seriesConfigs[i];
        let records;
        if (config.detectorLabel !== undefined && config.detectorLabel.includes(_aggregation_types.ML_JOB_AGGREGATION.LAT_LONG) || (config === null || config === void 0 ? void 0 : config.metricFunction) === _aggregation_types.ML_JOB_AGGREGATION.LAT_LONG) {
          if (config.entityFields.length) {
            records = [recordsToPlot.find(record => {
              const entityFieldName = config.entityFields[0].fieldName;
              const entityFieldValue = config.entityFields[0].fieldValue;
              return (record[entityFieldName] && record[entityFieldName][0]) === entityFieldValue;
            })];
          } else {
            records = recordsToPlot;
          }
          mapData.push({
            ...config,
            loading: false,
            mapData: records
          });
        } else {
          seriesConfigsNoGeoData.push(config);
        }
      }
    }
    const {
      chartRange,
      tooManyBuckets
    } = calculateChartRange(seriesConfigs, selectedEarliestMs, selectedLatestMs, recordsToPlot, 'timestamp', numberOfPoints, timeBounds);
    data.tooManyBuckets = tooManyBuckets;

    // first load and wait for required data,
    // only after that trigger data processing and page render.
    // TODO - if query returns no results e.g. source data has been deleted,
    // display a message saying 'No data between earliest/latest'.
    const seriesPromises = [];
    // Use seriesConfigs list without geo data config so indices match up after seriesPromises are resolved
    // and we map through the responses
    const seriesConfigsForPromises = hasGeoData ? seriesConfigsNoGeoData : seriesConfigs;
    seriesConfigsForPromises.forEach(seriesConfig => {
      const job = combinedJobRecords[seriesConfig.jobId];
      seriesPromises.push(Promise.all([getMetricData(seriesConfig, chartRange, job), getRecordsForCriteriaChart(seriesConfig, chartRange), getScheduledEvents(seriesConfig, chartRange), getEventDistribution(seriesConfig, chartRange)]));
    });
    const response = await Promise.all(seriesPromises);
    function processChartData(responses, seriesIndex) {
      const metricData = responses[0].results;
      const records = responses[1].records;
      const jobId = seriesConfigsForPromises[seriesIndex].jobId;
      const scheduledEvents = responses[2].events[jobId];
      const eventDistribution = responses[3];
      const chartType = (0, _chart_utils.getChartType)(seriesConfigsForPromises[seriesIndex]);

      // Sort records in ascending time order matching up with chart data
      records.sort((recordA, recordB) => {
        return recordA[ML_TIME_FIELD_NAME] - recordB[ML_TIME_FIELD_NAME];
      });

      // Return dataset in format used by the chart.
      // i.e. array of Objects with keys date (timestamp), value,
      //    plus anomalyScore for points with anomaly markers.
      let chartData = [];
      if (metricData !== undefined) {
        if (records.length > 0) {
          const filterField = records[0].by_field_value || records[0].over_field_value;
          if (eventDistribution && eventDistribution.length > 0) {
            chartData = eventDistribution.filter(d => d.entity !== filterField);
          }
          (0, _lodash.map)(metricData, (value, time) => {
            // The filtering for rare/event_distribution charts needs to be handled
            // differently because of how the source data is structured.
            // For rare chart values we are only interested wether a value is either `0` or not,
            // `0` acts like a flag in the chart whether to display the dot/marker.
            // All other charts (single metric, population) are metric based and with
            // those a value of `null` acts as the flag to hide a data point.
            if (chartType === _charts.CHART_TYPE.EVENT_DISTRIBUTION && value > 0 || chartType !== _charts.CHART_TYPE.EVENT_DISTRIBUTION && value !== null) {
              chartData.push({
                date: +time,
                value,
                entity: filterField
              });
            }
          });
        } else {
          chartData = (0, _lodash.map)(metricData, (value, time) => ({
            date: +time,
            value
          }));
        }
      }

      // Iterate through the anomaly records, adding anomalyScore properties
      // to the chartData entries for anomalous buckets.
      const chartDataForPointSearch = getChartDataForPointSearch(chartData, records[0], chartType);
      (0, _lodash.each)(records, record => {
        // Look for a chart point with the same time as the record.
        // If none found, insert a point for anomalies due to a gap in the data.
        const recordTime = record[ML_TIME_FIELD_NAME];
        let chartPoint = findChartPointForTime(chartDataForPointSearch, recordTime);
        if (chartPoint === undefined) {
          chartPoint = {
            date: recordTime,
            value: null
          };
          chartData.push(chartPoint);
        }
        if (chartPoint !== undefined) {
          chartPoint.anomalyScore = record.record_score;
          if (record.actual !== undefined) {
            chartPoint.actual = record.actual;
            chartPoint.typical = record.typical;
          } else {
            const causes = (0, _lodash.get)(record, 'causes', []);
            if (causes.length > 0) {
              chartPoint.byFieldName = record.by_field_name;
              chartPoint.numberOfCauses = causes.length;
              if (causes.length === 1) {
                // If only a single cause, copy actual and typical values to the top level.
                const cause = record.causes[0];
                chartPoint.actual = cause.actual;
                chartPoint.typical = cause.typical;
              }
            }
          }
          if (record.multi_bucket_impact !== undefined) {
            chartPoint.multiBucketImpact = record.multi_bucket_impact;
          }
        }
      });

      // Add a scheduledEvents property to any points in the chart data set
      // which correspond to times of scheduled events for the job.
      if (scheduledEvents !== undefined) {
        (0, _lodash.each)(scheduledEvents, (events, time) => {
          const chartPoint = findChartPointForTime(chartDataForPointSearch, Number(time));
          if (chartPoint !== undefined) {
            // Note if the scheduled event coincides with an absence of the underlying metric data,
            // we don't worry about plotting the event.
            chartPoint.scheduledEvents = events;
          }
        });
      }
      return chartData;
    }
    function getChartDataForPointSearch(chartData, record, chartType) {
      if (chartType === _charts.CHART_TYPE.EVENT_DISTRIBUTION || chartType === _charts.CHART_TYPE.POPULATION_DISTRIBUTION) {
        return chartData.filter(d => {
          return d.entity === (record && (record.by_field_value || record.over_field_value));
        });
      }
      return chartData;
    }

    // calculate an overall min/max for all series
    const processedData = response.map(processChartData);
    const allDataPoints = (0, _lodash.reduce)(processedData, (datapoints, series) => {
      (0, _lodash.each)(series, d => datapoints.push(d));
      return datapoints;
    }, []);
    const overallChartLimits = chartLimits(allDataPoints);
    const seriesToPlot = response
    // Don't show the charts if there was an issue retrieving metric or anomaly data
    .filter(r => {
      var _r$, _r$2;
      return ((_r$ = r[0]) === null || _r$ === void 0 ? void 0 : _r$.success) === true && ((_r$2 = r[1]) === null || _r$2 === void 0 ? void 0 : _r$2.success) === true;
    }).map((d, i) => {
      return {
        ...seriesConfigsForPromises[i],
        loading: false,
        chartData: processedData[i],
        plotEarliest: chartRange.min,
        plotLatest: chartRange.max,
        selectedEarliest: selectedEarliestMs,
        selectedLatest: selectedLatestMs,
        // FIXME can we remove this?
        chartLimits: USE_OVERALL_CHART_LIMITS ? overallChartLimits : chartLimits(processedData[i])
      };
    });
    if (mapData.length) {
      // push map data in if it's available
      // @ts-ignore
      seriesToPlot.push(...mapData);
    }
    data.seriesToPlot = seriesToPlot;
    data.errorMessages = errorMessages ? Object.entries(errorMessages).reduce((acc, [errorMessage, jobs]) => {
      acc[errorMessage] = Array.from(jobs);
      return acc;
    }, {}) : undefined;
    return data;
  }
  async function getMetricData(config, range, job) {
    const {
      jobId,
      detectorIndex,
      entityFields,
      bucketSpanSeconds
    } = config;

    // If the job uses aggregation or scripted fields, and if it's a config we don't support
    // use model plot data if model plot is enabled
    // else if source data can be plotted, use that, otherwise model plot will be available.
    // @ts-ignore
    const useSourceData = (0, _job_utils.isSourceDataChartableForDetector)(job, detectorIndex);
    if (useSourceData) {
      const datafeedQuery = (0, _lodash.get)(config, 'datafeedConfig.query', null);
      try {
        return await fetchMetricData(Array.isArray(config.datafeedConfig.indices) ? config.datafeedConfig.indices.join() : config.datafeedConfig.indices, entityFields, datafeedQuery, config.metricFunction, config.metricFieldName, config.summaryCountFieldName, config.timeField, range.min, range.max, bucketSpanSeconds * 1000, config.datafeedConfig);
      } catch (error) {
        handleError(_i18n.i18n.translate('xpack.ml.timeSeriesJob.metricDataErrorMessage', {
          defaultMessage: 'an error occurred while retrieving metric data'
        }), job.job_id);
        return {
          success: false,
          results: {},
          error
        };
      }
    } else {
      // Extract the partition, by, over fields on which to filter.
      const criteriaFields = [];
      const detector = job.analysis_config.detectors[detectorIndex];
      if (detector.partition_field_name !== undefined) {
        const partitionEntity = (0, _lodash.find)(entityFields, {
          fieldName: detector.partition_field_name
        });
        if (partitionEntity !== undefined) {
          criteriaFields.push({
            fieldName: 'partition_field_name',
            fieldValue: partitionEntity.fieldName
          }, {
            fieldName: 'partition_field_value',
            fieldValue: partitionEntity.fieldValue
          });
        }
      }
      if (detector.over_field_name !== undefined) {
        const overEntity = (0, _lodash.find)(entityFields, {
          fieldName: detector.over_field_name
        });
        if (overEntity !== undefined) {
          criteriaFields.push({
            fieldName: 'over_field_name',
            fieldValue: overEntity.fieldName
          }, {
            fieldName: 'over_field_value',
            fieldValue: overEntity.fieldValue
          });
        }
      }
      if (detector.by_field_name !== undefined) {
        const byEntity = (0, _lodash.find)(entityFields, {
          fieldName: detector.by_field_name
        });
        if (byEntity !== undefined) {
          criteriaFields.push({
            fieldName: 'by_field_name',
            fieldValue: byEntity.fieldName
          }, {
            fieldName: 'by_field_value',
            fieldValue: byEntity.fieldValue
          });
        }
      }
      const obj = {
        success: true,
        results: {}
      };
      try {
        const resp = await getModelPlotOutput(jobId, detectorIndex, criteriaFields, range.min, range.max, bucketSpanSeconds * 1000);
        // Return data in format required by the explorer charts.
        const results = resp.results;
        Object.keys(results).forEach(time => {
          obj.results[time] = results[time].actual;
        });
        return obj;
      } catch (error) {
        handleError(_i18n.i18n.translate('xpack.ml.timeSeriesJob.modelPlotDataErrorMessage', {
          defaultMessage: 'an error occurred while retrieving model plot data'
        }), job.job_id);
        return {
          success: false,
          results: {},
          error
        };
      }
    }
  }

  /**
   * TODO make an endpoint
   */
  async function getScheduledEventsByBucket(jobIds, earliestMs, latestMs, intervalMs, maxJobs, maxEvents) {
    const obj = {
      success: true,
      events: {}
    };

    // Build the criteria to use in the bool filter part of the request.
    // Adds criteria for the time range plus any specified job IDs.
    const boolCriteria = [{
      range: {
        timestamp: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }, {
      exists: {
        field: 'scheduled_events'
      }
    }];
    if (jobIds && jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
      let jobIdFilterStr = '';
      (0, _lodash.each)(jobIds, (jobId, i) => {
        jobIdFilterStr += `${i > 0 ? ' OR ' : ''}job_id:${jobId}`;
      });
      boolCriteria.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    }
    const searchRequest = {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              result_type: 'bucket'
            }
          }, {
            bool: {
              must: boolCriteria
            }
          }]
        }
      },
      aggs: {
        jobs: {
          terms: {
            field: 'job_id',
            min_doc_count: 1,
            size: maxJobs
          },
          aggs: {
            times: {
              date_histogram: {
                field: 'timestamp',
                fixed_interval: `${intervalMs}ms`,
                min_doc_count: 1
              },
              aggs: {
                events: {
                  terms: {
                    field: 'scheduled_events',
                    size: maxEvents
                  }
                }
              }
            }
          }
        }
      }
    };
    const resp = await mlClient.anomalySearch(searchRequest, jobIds);
    const dataByJobId = (0, _lodash.get)(resp, ['aggregations', 'jobs', 'buckets'], []);
    (0, _lodash.each)(dataByJobId, dataForJob => {
      const jobId = dataForJob.key;
      const resultsForTime = {};
      const dataByTime = (0, _lodash.get)(dataForJob, ['times', 'buckets'], []);
      (0, _lodash.each)(dataByTime, dataForTime => {
        const time = dataForTime.key;
        const events = (0, _lodash.get)(dataForTime, ['events', 'buckets']);
        resultsForTime[time] = events.map(e => e.key);
      });
      obj.events[jobId] = resultsForTime;
    });
    return obj;
  }
  async function getScheduledEvents(config, range) {
    try {
      return await getScheduledEventsByBucket([config.jobId], range.min, range.max, config.bucketSpanSeconds * 1000, 1, MAX_SCHEDULED_EVENTS);
    } catch (error) {
      handleError(_i18n.i18n.translate('xpack.ml.timeSeriesJob.scheduledEventsByBucketErrorMessage', {
        defaultMessage: 'an error occurred while retrieving scheduled events'
      }), config.jobId);
      return {
        success: false,
        events: {},
        error
      };
    }
  }
  async function getEventDistributionData(index, splitField, filterField, query, metricFunction,
  // ES aggregation name
  metricFieldName, timeFieldName, earliestMs, latestMs, intervalMs) {
    if (splitField === undefined) {
      return [];
    }

    // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the time range, entity fields,
    // plus any additional supplied query.
    const mustCriteria = [];
    mustCriteria.push({
      range: {
        [timeFieldName]: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    });
    if (query) {
      mustCriteria.push(query);
    }
    if (!!filterField) {
      mustCriteria.push({
        term: {
          [filterField.fieldName]: filterField.fieldValue
        }
      });
    }
    const body = {
      index,
      track_total_hits: true,
      query: {
        // using function_score and random_score to get a random sample of documents.
        // otherwise all documents would have the same score and the sampler aggregation
        // would pick the first N documents instead of a random set.
        function_score: {
          query: {
            bool: {
              must: mustCriteria
            }
          },
          functions: [{
            random_score: {
              // static seed to get same randomized results on every request
              seed: 10,
              field: '_seq_no'
            }
          }]
        }
      },
      size: 0,
      aggs: {
        sample: {
          sampler: {
            shard_size: SAMPLER_TOP_TERMS_SHARD_SIZE
          },
          aggs: {
            byTime: {
              date_histogram: {
                field: timeFieldName,
                fixed_interval: `${intervalMs}ms`,
                min_doc_count: AGGREGATION_MIN_DOC_COUNT
              },
              aggs: {
                entities: {
                  terms: {
                    field: splitField === null || splitField === void 0 ? void 0 : splitField.fieldName,
                    size: ENTITY_AGGREGATION_SIZE,
                    min_doc_count: AGGREGATION_MIN_DOC_COUNT
                  }
                }
              }
            }
          }
        }
      }
    };
    if (metricFieldName !== undefined && metricFieldName !== '' && typeof metricFunction === 'string') {
      // @ts-ignore
      body.aggs.sample.aggs.byTime.aggs.entities.aggs = {};
      const metricAgg = {
        [metricFunction]: {
          field: metricFieldName
        }
      };
      if (metricFunction === 'percentiles') {
        // @ts-ignore
        metricAgg[metricFunction].percents = [_job_utils.ML_MEDIAN_PERCENTS];
      }
      if (metricFunction === 'cardinality') {
        // @ts-ignore
        metricAgg[metricFunction].precision_threshold = CARDINALITY_PRECISION_THRESHOLD;
      }
      // @ts-ignore
      body.aggs.sample.aggs.byTime.aggs.entities.aggs.metric = metricAgg;
    }
    const resp = await client.asCurrentUser.search(body, {
      maxRetries: 0
    });

    // Because of the sampling, results of metricFunctions which use sum or count
    // can be significantly skewed. Taking into account totalHits we calculate a
    // a factor to normalize results for these metricFunctions.
    // @ts-ignore
    const totalHits = resp.hits.total.value;
    const successfulShards = (0, _lodash.get)(resp, ['_shards', 'successful'], 0);
    let normalizeFactor = 1;
    if (totalHits > successfulShards * SAMPLER_TOP_TERMS_SHARD_SIZE) {
      normalizeFactor = totalHits / (successfulShards * SAMPLER_TOP_TERMS_SHARD_SIZE);
    }
    const dataByTime = (0, _lodash.get)(resp, ['aggregations', 'sample', 'byTime', 'buckets'], []);
    // @ts-ignore
    const data = dataByTime.reduce((d, dataForTime) => {
      const date = +dataForTime.key;
      const entities = (0, _lodash.get)(dataForTime, ['entities', 'buckets'], []);
      // @ts-ignore
      entities.forEach(entity => {
        let value = metricFunction === 'count' ? entity.doc_count : entity.metric.value;
        if (metricFunction === 'count' || metricFunction === 'cardinality' || metricFunction === 'sum') {
          value = value * normalizeFactor;
        }
        d.push({
          date,
          entity: entity.key,
          value
        });
      });
      return d;
    }, []);
    return data;
  }
  async function getEventDistribution(config, range) {
    const chartType = (0, _chart_utils.getChartType)(config);
    let splitField;
    let filterField = null;

    // Define splitField and filterField based on chartType
    if (chartType === _charts.CHART_TYPE.EVENT_DISTRIBUTION) {
      splitField = config.entityFields.find(f => f.fieldType === 'by');
      filterField = config.entityFields.find(f => f.fieldType === 'partition');
    } else if (chartType === _charts.CHART_TYPE.POPULATION_DISTRIBUTION) {
      splitField = config.entityFields.find(f => f.fieldType === 'over');
      filterField = config.entityFields.find(f => f.fieldType === 'partition');
    }
    const datafeedQuery = (0, _lodash.get)(config, 'datafeedConfig.query', null);
    try {
      return await getEventDistributionData(Array.isArray(config.datafeedConfig.indices) ? config.datafeedConfig.indices.join() : config.datafeedConfig.indices, splitField, filterField, datafeedQuery, config.metricFunction, config.metricFieldName, config.timeField, range.min, range.max, config.bucketSpanSeconds * 1000);
    } catch (e) {
      handleError(_i18n.i18n.translate('xpack.ml.timeSeriesJob.eventDistributionDataErrorMessage', {
        defaultMessage: 'an error occurred while retrieving data'
      }), config.jobId);
    }
  }
  async function getRecordsForCriteriaChart(config, range) {
    let criteria = [];
    criteria.push({
      fieldName: 'detector_index',
      fieldValue: config.detectorIndex
    });
    criteria = criteria.concat(config.entityFields);
    try {
      return await getRecordsForCriteria([config.jobId], criteria, 0, range.min, range.max, config.interval);
    } catch (error) {
      handleError(_i18n.i18n.translate('xpack.ml.timeSeriesJob.recordsForCriteriaErrorMessage', {
        defaultMessage: 'an error occurred while retrieving anomaly records'
      }), config.jobId);
      return {
        success: false,
        records: [],
        error
      };
    }
  }

  /**
   * Fetches anomaly records aggregating on the chart interval.
   *
   * @param jobIds
   * @param criteriaFields
   * @param threshold
   * @param earliestMs
   * @param latestMs
   * @param interval
   * @param functionDescription
   */
  async function getRecordsForCriteria(jobIds, criteriaFields, threshold, earliestMs, latestMs, interval, functionDescription) {
    const obj = {
      success: true,
      records: []
    };

    // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the time range, record score, plus any specified job IDs.
    const boolCriteria = [{
      range: {
        timestamp: {
          // @ts-ignore
          gte: earliestMs,
          // @ts-ignore
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }, {
      range: {
        record_score: {
          gte: threshold
        }
      }
    }];
    if (jobIds && jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
      let jobIdFilterStr = '';
      (0, _lodash.each)(jobIds, (jobId, i) => {
        if (i > 0) {
          jobIdFilterStr += ' OR ';
        }
        jobIdFilterStr += 'job_id:';
        jobIdFilterStr += jobId;
      });
      boolCriteria.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    }

    // Add in term queries for each of the specified criteria.
    (0, _lodash.each)(criteriaFields, criteria => {
      boolCriteria.push({
        term: {
          [criteria.fieldName]: criteria.fieldValue
        }
      });
    });
    if (functionDescription !== undefined) {
      const mlFunctionToPlotIfMetric = functionDescription !== undefined ? _anomaly_utils.aggregationTypeTransform.toML(functionDescription) : functionDescription;
      boolCriteria.push({
        term: {
          function_description: mlFunctionToPlotIfMetric
        }
      });
    }
    const searchRequest = {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              result_type: 'record'
            }
          }, {
            bool: {
              must: boolCriteria
            }
          }]
        }
      },
      aggs: {
        anomalies_over_time: {
          date_histogram: {
            field: 'timestamp',
            fixed_interval: interval,
            // Ignore empty buckets
            min_doc_count: 1
          },
          aggs: {
            top_records: {
              top_hits: {
                size: 1,
                sort: [{
                  record_score: {
                    order: 'desc'
                  }
                }]
              }
            }
          }
        }
      }
    };
    const resp = await mlClient.anomalySearch(searchRequest, jobIds);
    const records = resp.aggregations.anomalies_over_time.buckets.map(b => {
      var _b$top_records$hits$h;
      return (_b$top_records$hits$h = b.top_records.hits.hits[0]) === null || _b$top_records$hits$h === void 0 ? void 0 : _b$top_records$hits$h._source;
    }).filter(_guards.isDefined);
    obj.records = records;
    return obj;
  }
  async function getRecordsForInfluencer(jobIds, influencers, threshold, earliestMs, latestMs, maxResults, influencersFilterQuery) {
    // Build the criteria to use in the bool filter part of the request.
    // Add criteria for the time range, record score, plus any specified job IDs.
    const boolCriteria = [{
      range: {
        timestamp: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }, {
      range: {
        record_score: {
          gte: threshold
        }
      }
    }];

    // TODO optimize query
    if (jobIds && jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
      let jobIdFilterStr = '';
      (0, _lodash.each)(jobIds, (jobId, i) => {
        if (i > 0) {
          jobIdFilterStr += ' OR ';
        }
        jobIdFilterStr += 'job_id:';
        jobIdFilterStr += jobId;
      });
      boolCriteria.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    }
    if (influencersFilterQuery !== undefined) {
      boolCriteria.push(influencersFilterQuery);
    }

    // Add a nested query to filter for each of the specified influencers.
    if (influencers.length > 0) {
      boolCriteria.push({
        bool: {
          should: influencers.map(influencer => {
            return {
              nested: {
                path: 'influencers',
                query: {
                  bool: {
                    must: [{
                      match: {
                        'influencers.influencer_field_name': influencer.fieldName
                      }
                    }, {
                      match: {
                        'influencers.influencer_field_values': influencer.fieldValue
                      }
                    }]
                  }
                }
              }
            };
          }),
          minimum_should_match: 1
        }
      });
    }
    const response = await mlClient.anomalySearch({
      body: {
        size: maxResults !== undefined ? maxResults : 100,
        query: {
          bool: {
            filter: [{
              term: {
                result_type: 'record'
              }
            }, {
              bool: {
                must: boolCriteria
              }
            }]
          }
        },
        sort: [{
          record_score: {
            order: 'desc'
          }
        }]
      }
    }, jobIds);

    // @ts-ignore
    return response.hits.hits.map(hit => {
      return hit._source;
    }).filter(_guards.isDefined);
  }

  /**
   * Provides anomaly charts data
   */
  async function getAnomalyChartsData(options) {
    const {
      jobIds,
      earliestMs,
      latestMs,
      maxResults,
      influencersFilterQuery,
      influencers,
      numberOfPoints,
      threshold,
      timeBounds
    } = options;

    // First fetch records that satisfy influencers query criteria
    const recordsForInfluencers = await getRecordsForInfluencer(jobIds, influencers, threshold, earliestMs, latestMs, 500, influencersFilterQuery);
    const selectedJobs = (await mlClient.getJobs({
      job_id: jobIds
    })).jobs;
    const combinedJobRecords = (0, _lodash.keyBy)(selectedJobs, 'job_id');
    const chartData = await getAnomalyData(combinedJobRecords, recordsForInfluencers, earliestMs, latestMs, numberOfPoints, timeBounds, threshold, maxResults);
    return chartData;
  }
  return {
    getAnomalyChartsData,
    getRecordsForCriteria
  };
}