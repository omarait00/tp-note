"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataVisualizer = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _mlAggUtils = require("@kbn/ml-agg-utils");
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
var _field_types = require("../../../common/constants/field_types");
var _job_utils = require("../../../common/util/job_utils");
var _query_utils = require("../../lib/query_utils");
var _datafeed_utils = require("../../../common/util/datafeed_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SAMPLER_TOP_TERMS_THRESHOLD = 100000;
const SAMPLER_TOP_TERMS_SHARD_SIZE = 5000;
const AGGREGATABLE_EXISTS_REQUEST_BATCH_SIZE = 200;
const FIELDS_REQUEST_BATCH_SIZE = 10;
class DataVisualizer {
  constructor(client) {
    (0, _defineProperty2.default)(this, "_asCurrentUser", void 0);
    this._asCurrentUser = client.asCurrentUser;
  }

  // Obtains overall stats on the fields in the supplied index pattern, returning an object
  // containing the total document count, and four arrays showing which of the supplied
  // aggregatable and non-aggregatable fields do or do not exist in documents.
  // Sampling will be used if supplied samplerShardSize > 0.
  async getOverallStats(indexPatternTitle, query, aggregatableFields, nonAggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const stats = {
      totalCount: 0,
      aggregatableExistsFields: [],
      aggregatableNotExistsFields: [],
      nonAggregatableExistsFields: [],
      nonAggregatableNotExistsFields: []
    };

    // To avoid checking for the existence of too many aggregatable fields in one request,
    // split the check into multiple batches (max 200 fields per request).
    const batches = [[]];
    (0, _lodash.each)(aggregatableFields, field => {
      let lastArray = (0, _lodash.last)(batches);
      if (lastArray.length === AGGREGATABLE_EXISTS_REQUEST_BATCH_SIZE) {
        lastArray = [];
        batches.push(lastArray);
      }
      lastArray.push(field);
    });
    await Promise.all(batches.map(async fields => {
      const batchStats = await this.checkAggregatableFieldsExist(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, undefined, runtimeMappings);

      // Total count will be returned with each batch of fields. Just overwrite.
      stats.totalCount = batchStats.totalCount;

      // Add to the lists of fields which do and do not exist.
      stats.aggregatableExistsFields.push(...batchStats.aggregatableExistsFields);
      stats.aggregatableNotExistsFields.push(...batchStats.aggregatableNotExistsFields);
    }));
    await Promise.all(nonAggregatableFields.map(async field => {
      const existsInDocs = await this.checkNonAggregatableFieldExists(indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, runtimeMappings);
      const fieldData = {
        fieldName: field,
        existsInDocs,
        stats: {}
      };
      if (existsInDocs === true) {
        stats.nonAggregatableExistsFields.push(fieldData);
      } else {
        stats.nonAggregatableNotExistsFields.push(fieldData);
      }
    }));
    return stats;
  }

  // Obtains binned histograms for supplied list of fields. The statistics for each field in the
  // returned array depend on the type of the field (keyword, number, date etc).
  // Sampling will be used if supplied samplerShardSize > 0.
  async getHistogramsForFields(indexPattern, query, fields, samplerShardSize, runtimeMappings) {
    return await (0, _mlAggUtils.fetchHistogramsForFields)(this._asCurrentUser, indexPattern, query, fields, samplerShardSize, runtimeMappings);
  }

  // Obtains statistics for supplied list of fields. The statistics for each field in the
  // returned array depend on the type of the field (keyword, number, date etc).
  // Sampling will be used if supplied samplerShardSize > 0.
  async getStatsForFields(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, intervalMs, maxExamples, runtimeMappings) {
    // Batch up fields by type, getting stats for multiple fields at a time.
    const batches = [];
    const batchedFields = {};
    (0, _lodash.each)(fields, field => {
      if (field.fieldName === undefined) {
        // undefined fieldName is used for a document count request.
        // getDocumentCountStats requires timeField - don't add to batched requests if not defined
        if (timeFieldName !== undefined) {
          batches.push([field]);
        }
      } else {
        const fieldType = field.type;
        if (batchedFields[fieldType] === undefined) {
          batchedFields[fieldType] = [[]];
        }
        let lastArray = (0, _lodash.last)(batchedFields[fieldType]);
        if (lastArray.length === FIELDS_REQUEST_BATCH_SIZE) {
          lastArray = [];
          batchedFields[fieldType].push(lastArray);
        }
        lastArray.push(field);
      }
    });
    (0, _lodash.each)(batchedFields, lists => {
      batches.push(...lists);
    });
    let results = [];
    await Promise.all(batches.map(async batch => {
      let batchStats = [];
      const first = batch[0];
      switch (first.type) {
        case _field_types.ML_JOB_FIELD_TYPES.NUMBER:
          // undefined fieldName is used for a document count request.
          if (first.fieldName !== undefined) {
            batchStats = await this.getNumericFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          } else {
            // Will only ever be one document count card,
            // so no value in batching up the single request.
            if (intervalMs !== undefined) {
              const stats = await this.getDocumentCountStats(indexPatternTitle, query, timeFieldName, earliestMs, latestMs, intervalMs, runtimeMappings);
              batchStats.push(stats);
            }
          }
          break;
        case _field_types.ML_JOB_FIELD_TYPES.KEYWORD:
        case _field_types.ML_JOB_FIELD_TYPES.IP:
          batchStats = await this.getStringFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          break;
        case _field_types.ML_JOB_FIELD_TYPES.DATE:
          batchStats = await this.getDateFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          break;
        case _field_types.ML_JOB_FIELD_TYPES.BOOLEAN:
          batchStats = await this.getBooleanFieldsStats(indexPatternTitle, query, batch, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings);
          break;
        case _field_types.ML_JOB_FIELD_TYPES.TEXT:
        default:
          // Use an exists filter on the the field name to get
          // examples of the field, so cannot batch up.
          await Promise.all(batch.map(async field => {
            const stats = await this.getFieldExamples(indexPatternTitle, query, field.fieldName, timeFieldName, earliestMs, latestMs, maxExamples, runtimeMappings);
            batchStats.push(stats);
          }));
          break;
      }
      results = [...results, ...batchStats];
    }));
    return results;
  }
  async checkAggregatableFieldsExist(indexPatternTitle, query, aggregatableFields, samplerShardSize, timeFieldName, earliestMs, latestMs, datafeedConfig, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
    const datafeedAggregations = (0, _datafeed_utils.getDatafeedAggregations)(datafeedConfig);

    // Value count aggregation faster way of checking if field exists than using
    // filter aggregation with exists query.
    const aggs = datafeedAggregations !== undefined ? {
      ...datafeedAggregations
    } : {};

    // Combine runtime fields from the index pattern as well as the datafeed
    const combinedRuntimeMappings = {
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? runtimeMappings : {}),
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(datafeedConfig) && (0, _mlIsPopulatedObject.isPopulatedObject)(datafeedConfig.runtime_mappings) ? datafeedConfig.runtime_mappings : {})
    };
    aggregatableFields.forEach((field, i) => {
      var _datafeedConfig$scrip;
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field, i);
      aggs[`${safeFieldName}_count`] = {
        filter: {
          exists: {
            field
          }
        }
      };
      let cardinalityField;
      if (datafeedConfig !== null && datafeedConfig !== void 0 && (_datafeedConfig$scrip = datafeedConfig.script_fields) !== null && _datafeedConfig$scrip !== void 0 && _datafeedConfig$scrip.hasOwnProperty(field)) {
        cardinalityField = aggs[`${safeFieldName}_cardinality`] = {
          cardinality: {
            script: datafeedConfig === null || datafeedConfig === void 0 ? void 0 : datafeedConfig.script_fields[field].script
          }
        };
      } else {
        cardinalityField = {
          cardinality: {
            field
          }
        };
      }
      aggs[`${safeFieldName}_cardinality`] = cardinalityField;
    });
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(aggs) ? {
        aggs: (0, _mlAggUtils.buildSamplerAggregation)(aggs, samplerShardSize)
      } : {}),
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(combinedRuntimeMappings) ? {
        runtime_mappings: combinedRuntimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      track_total_hits: true,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const aggregations = body.aggregations;
    // @ts-expect-error incorrect search response type
    const totalCount = body.hits.total.value;
    const stats = {
      totalCount,
      aggregatableExistsFields: [],
      aggregatableNotExistsFields: []
    };
    const aggsPath = (0, _mlAggUtils.getSamplerAggregationsResponsePath)(samplerShardSize);
    const sampleCount = samplerShardSize > 0 ? (0, _lodash.get)(aggregations, ['sample', 'doc_count'], 0) : totalCount;
    aggregatableFields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field, i);
      const count = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_count`, 'doc_count'], 0);
      if (count > 0) {
        const cardinality = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_cardinality`, 'value'], 0);
        stats.aggregatableExistsFields.push({
          fieldName: field,
          existsInDocs: true,
          stats: {
            sampleCount,
            count,
            cardinality
          }
        });
      } else {
        var _datafeedConfig$scrip2, _datafeedConfig$runti;
        if (datafeedConfig !== null && datafeedConfig !== void 0 && (_datafeedConfig$scrip2 = datafeedConfig.script_fields) !== null && _datafeedConfig$scrip2 !== void 0 && _datafeedConfig$scrip2.hasOwnProperty(field) || datafeedConfig !== null && datafeedConfig !== void 0 && (_datafeedConfig$runti = datafeedConfig.runtime_mappings) !== null && _datafeedConfig$runti !== void 0 && _datafeedConfig$runti.hasOwnProperty(field)) {
          const cardinality = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_cardinality`, 'value'], 0);
          stats.aggregatableExistsFields.push({
            fieldName: field,
            existsInDocs: true,
            stats: {
              sampleCount,
              count,
              cardinality
            }
          });
        } else {
          stats.aggregatableNotExistsFields.push({
            fieldName: field,
            existsInDocs: false
          });
        }
      }
    });
    return stats;
  }
  async checkNonAggregatableFieldExists(indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    filterCriteria.push({
      exists: {
        field
      }
    });
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    // @ts-expect-error incorrect search response type
    return body.hits.total.value > 0;
  }
  async getDocumentCountStats(indexPatternTitle, query, timeFieldName, earliestMs, latestMs, intervalMs, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);

    // Don't use the sampler aggregation as this can lead to some potentially
    // confusing date histogram results depending on the date range of data amongst shards.

    const aggs = {
      eventRate: {
        date_histogram: {
          field: timeFieldName,
          fixed_interval: `${intervalMs}ms`,
          min_doc_count: 1
        }
      }
    };
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      aggs,
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const buckets = {};
    const dataByTimeBucket = (0, _lodash.get)(body, ['aggregations', 'eventRate', 'buckets'], []);
    (0, _lodash.each)(dataByTimeBucket, dataForTime => {
      const time = dataForTime.key;
      buckets[time] = dataForTime.doc_count;
    });
    return {
      documentCounts: {
        interval: intervalMs,
        buckets
      }
    };
  }
  async getNumericFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);

    // Build the percents parameter which defines the percentiles to query
    // for the metric distribution data.
    // Use a fixed percentile spacing of 5%.
    const MAX_PERCENT = 100;
    const PERCENTILE_SPACING = 5;
    let count = 0;
    const percents = Array.from(Array(MAX_PERCENT / PERCENTILE_SPACING), () => count += PERCENTILE_SPACING);
    const aggs = {};
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      aggs[`${safeFieldName}_field_stats`] = {
        filter: {
          exists: {
            field: field.fieldName
          }
        },
        aggs: {
          actual_stats: {
            stats: {
              field: field.fieldName
            }
          }
        }
      };
      aggs[`${safeFieldName}_percentiles`] = {
        percentiles: {
          field: field.fieldName,
          percents,
          keyed: false
        }
      };
      const top = {
        terms: {
          field: field.fieldName,
          size: 10,
          order: {
            _count: 'desc'
          }
        }
      };
      aggs[`${safeFieldName}_top`] = top;
    });
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      aggs: (0, _mlAggUtils.buildSamplerAggregation)(aggs, samplerShardSize),
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const aggregations = body.aggregations;
    const aggsPath = (0, _mlAggUtils.getSamplerAggregationsResponsePath)(samplerShardSize);
    const batchStats = [];
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      const docCount = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_field_stats`, 'doc_count'], 0);
      const fieldStatsResp = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_field_stats`, 'actual_stats'], {});
      const topAggsPath = [...aggsPath, `${safeFieldName}_top`];
      if (samplerShardSize < 1 && field.cardinality >= SAMPLER_TOP_TERMS_THRESHOLD) {
        topAggsPath.push('top');
      }
      const topValues = (0, _lodash.get)(aggregations, [...topAggsPath, 'buckets'], []);
      const stats = {
        fieldName: field.fieldName,
        count: docCount,
        min: (0, _lodash.get)(fieldStatsResp, 'min', 0),
        max: (0, _lodash.get)(fieldStatsResp, 'max', 0),
        avg: (0, _lodash.get)(fieldStatsResp, 'avg', 0),
        isTopValuesSampled: field.cardinality >= SAMPLER_TOP_TERMS_THRESHOLD || samplerShardSize > 0,
        topValues,
        topValuesSampleSize: topValues.reduce((acc, curr) => acc + curr.doc_count, (0, _lodash.get)(aggregations, [...topAggsPath, 'sum_other_doc_count'], 0)),
        topValuesSamplerShardSize: field.cardinality >= SAMPLER_TOP_TERMS_THRESHOLD ? SAMPLER_TOP_TERMS_SHARD_SIZE : samplerShardSize
      };
      if (stats.count > 0) {
        const percentiles = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_percentiles`, 'values'], []);
        const medianPercentile = (0, _lodash.find)(percentiles, {
          key: 50
        });
        stats.median = medianPercentile !== undefined ? medianPercentile.value : 0;
        stats.distribution = this.processDistributionData(percentiles, PERCENTILE_SPACING, stats.min);
      }
      batchStats.push(stats);
    });
    return batchStats;
  }
  async getStringFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
    const aggs = {};
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      const top = {
        terms: {
          field: field.fieldName,
          size: 10,
          order: {
            _count: 'desc'
          }
        }
      };
      aggs[`${safeFieldName}_top`] = top;
    });
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      aggs: (0, _mlAggUtils.buildSamplerAggregation)(aggs, samplerShardSize),
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const aggregations = body.aggregations;
    const aggsPath = (0, _mlAggUtils.getSamplerAggregationsResponsePath)(samplerShardSize);
    const batchStats = [];
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      const topAggsPath = [...aggsPath, `${safeFieldName}_top`];
      if (samplerShardSize < 1 && field.cardinality >= SAMPLER_TOP_TERMS_THRESHOLD) {
        topAggsPath.push('top');
      }
      const topValues = (0, _lodash.get)(aggregations, [...topAggsPath, 'buckets'], []);
      const stats = {
        fieldName: field.fieldName,
        isTopValuesSampled: field.cardinality >= SAMPLER_TOP_TERMS_THRESHOLD || samplerShardSize > 0,
        topValues,
        topValuesSampleSize: topValues.reduce((acc, curr) => acc + curr.doc_count, (0, _lodash.get)(aggregations, [...topAggsPath, 'sum_other_doc_count'], 0)),
        topValuesSamplerShardSize: field.cardinality >= SAMPLER_TOP_TERMS_THRESHOLD ? SAMPLER_TOP_TERMS_SHARD_SIZE : samplerShardSize
      };
      batchStats.push(stats);
    });
    return batchStats;
  }
  async getDateFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
    const aggs = {};
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      aggs[`${safeFieldName}_field_stats`] = {
        filter: {
          exists: {
            field: field.fieldName
          }
        },
        aggs: {
          actual_stats: {
            stats: {
              field: field.fieldName
            }
          }
        }
      };
    });
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      aggs: (0, _mlAggUtils.buildSamplerAggregation)(aggs, samplerShardSize),
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const aggregations = body.aggregations;
    const aggsPath = (0, _mlAggUtils.getSamplerAggregationsResponsePath)(samplerShardSize);
    const batchStats = [];
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      const docCount = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_field_stats`, 'doc_count'], 0);
      const fieldStatsResp = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_field_stats`, 'actual_stats'], {});
      batchStats.push({
        fieldName: field.fieldName,
        count: docCount,
        earliest: (0, _lodash.get)(fieldStatsResp, 'min', 0),
        latest: (0, _lodash.get)(fieldStatsResp, 'max', 0)
      });
    });
    return batchStats;
  }
  async getBooleanFieldsStats(indexPatternTitle, query, fields, samplerShardSize, timeFieldName, earliestMs, latestMs, runtimeMappings) {
    const index = indexPatternTitle;
    const size = 0;
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);
    const aggs = {};
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      aggs[`${safeFieldName}_value_count`] = {
        filter: {
          exists: {
            field: field.fieldName
          }
        }
      };
      aggs[`${safeFieldName}_values`] = {
        terms: {
          field: field.fieldName,
          size: 2
        }
      };
    });
    const searchBody = {
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      aggs: (0, _mlAggUtils.buildSamplerAggregation)(aggs, samplerShardSize),
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const aggregations = body.aggregations;
    const aggsPath = (0, _mlAggUtils.getSamplerAggregationsResponsePath)(samplerShardSize);
    const batchStats = [];
    fields.forEach((field, i) => {
      const safeFieldName = (0, _job_utils.getSafeAggregationName)(field.fieldName, i);
      const stats = {
        fieldName: field.fieldName,
        count: (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_value_count`, 'doc_count'], 0),
        trueCount: 0,
        falseCount: 0
      };
      const valueBuckets = (0, _lodash.get)(aggregations, [...aggsPath, `${safeFieldName}_values`, 'buckets'], []);
      valueBuckets.forEach(bucket => {
        stats[`${bucket.key_as_string}Count`] = bucket.doc_count;
      });
      batchStats.push(stats);
    });
    return batchStats;
  }
  async getFieldExamples(indexPatternTitle, query, field, timeFieldName, earliestMs, latestMs, maxExamples, runtimeMappings) {
    const index = indexPatternTitle;

    // Request at least 100 docs so that we have a chance of obtaining
    // 'maxExamples' of the field.
    const size = Math.max(100, maxExamples);
    const filterCriteria = (0, _query_utils.buildBaseFilterCriteria)(timeFieldName, earliestMs, latestMs, query);

    // Use an exists filter to return examples of the field.
    filterCriteria.push({
      exists: {
        field
      }
    });
    const searchBody = {
      fields: [field],
      _source: false,
      query: {
        bool: {
          filter: filterCriteria
        }
      },
      ...((0, _mlIsPopulatedObject.isPopulatedObject)(runtimeMappings) ? {
        runtime_mappings: runtimeMappings
      } : {})
    };
    const body = await this._asCurrentUser.search({
      index,
      size,
      body: searchBody
    }, {
      maxRetries: 0
    });
    const stats = {
      fieldName: field,
      examples: []
    };
    // @ts-expect-error incorrect search response type
    if (body.hits.total.value > 0) {
      const hits = body.hits.hits;
      for (let i = 0; i < hits.length; i++) {
        // Use lodash get() to support field names containing dots.
        const doc = (0, _lodash.get)(hits[i].fields, field);
        // the results from fields query is always an array
        if (Array.isArray(doc) && doc.length > 0) {
          const example = doc[0];
          if (example !== undefined && stats.examples.indexOf(example) === -1) {
            stats.examples.push(example);
            if (stats.examples.length === maxExamples) {
              break;
            }
          }
        }
      }
    }
    return stats;
  }
  processDistributionData(percentiles, percentileSpacing, minValue) {
    const distribution = {
      percentiles: [],
      minPercentile: 0,
      maxPercentile: 100
    };
    if (percentiles.length === 0) {
      return distribution;
    }
    let percentileBuckets = [];
    let lowerBound = minValue;
    if (lowerBound >= 0) {
      // By default return results for 0 - 90% percentiles.
      distribution.minPercentile = 0;
      distribution.maxPercentile = 90;
      percentileBuckets = percentiles.slice(0, percentiles.length - 2);

      // Look ahead to the last percentiles and process these too if
      // they don't add more than 50% to the value range.
      const lastValue = (0, _lodash.last)(percentileBuckets).value;
      const upperBound = lowerBound + 1.5 * (lastValue - lowerBound);
      const filteredLength = percentileBuckets.length;
      for (let i = filteredLength; i < percentiles.length; i++) {
        if (percentiles[i].value < upperBound) {
          percentileBuckets.push(percentiles[i]);
          distribution.maxPercentile += percentileSpacing;
        } else {
          break;
        }
      }
    } else {
      // By default return results for 5 - 95% percentiles.
      const dataMin = lowerBound;
      lowerBound = percentiles[0].value;
      distribution.minPercentile = 5;
      distribution.maxPercentile = 95;
      percentileBuckets = percentiles.slice(1, percentiles.length - 1);

      // Add in 0-5 and 95-100% if they don't add more
      // than 25% to the value range at either end.
      const lastValue = (0, _lodash.last)(percentileBuckets).value;
      const maxDiff = 0.25 * (lastValue - lowerBound);
      if (lowerBound - dataMin < maxDiff) {
        percentileBuckets.splice(0, 0, percentiles[0]);
        distribution.minPercentile = 0;
        lowerBound = dataMin;
      }
      if (percentiles[percentiles.length - 1].value - lastValue < maxDiff) {
        percentileBuckets.push(percentiles[percentiles.length - 1]);
        distribution.maxPercentile = 100;
      }
    }

    // Combine buckets with the same value.
    const totalBuckets = percentileBuckets.length;
    let lastBucketValue = lowerBound;
    let numEqualValueBuckets = 0;
    for (let i = 0; i < totalBuckets; i++) {
      const bucket = percentileBuckets[i];

      // Results from the percentiles aggregation can have precision rounding
      // artifacts e.g returning 200 and 200.000000000123, so check for equality
      // around double floating point precision i.e. 15 sig figs.
      if (bucket.value.toPrecision(15) !== lastBucketValue.toPrecision(15)) {
        // Create a bucket for any 'equal value' buckets which had a value <= last bucket
        if (numEqualValueBuckets > 0) {
          distribution.percentiles.push({
            percent: numEqualValueBuckets * percentileSpacing,
            minValue: lastBucketValue,
            maxValue: lastBucketValue
          });
        }
        distribution.percentiles.push({
          percent: percentileSpacing,
          minValue: lastBucketValue,
          maxValue: bucket.value
        });
        lastBucketValue = bucket.value;
        numEqualValueBuckets = 0;
      } else {
        numEqualValueBuckets++;
        if (i === totalBuckets - 1) {
          // If at the last bucket, create a final bucket for the equal value buckets.
          distribution.percentiles.push({
            percent: numEqualValueBuckets * percentileSpacing,
            minValue: lastBucketValue,
            maxValue: lastBucketValue
          });
        }
      }
    }
    return distribution;
  }
}
exports.DataVisualizer = DataVisualizer;