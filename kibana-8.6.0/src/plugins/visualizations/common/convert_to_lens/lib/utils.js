"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStdDevAgg = exports.isSiblingPipeline = exports.isSchemaConfig = exports.isPipeline = exports.isPercentileRankAgg = exports.isPercentileAgg = exports.isMetricAggWithoutParams = exports.isColumnWithMeta = exports.getValidColumns = exports.getMetricFromParentPipelineAgg = exports.getLabelForPercentile = exports.getLabel = exports.getFieldNameFromField = exports.getCustomBucketsFromSiblingAggs = void 0;
var _lodash = require("lodash");
var _common = require("../../../../data/common");
var _vis_schemas = require("../../vis_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getLabel = agg => {
  var _agg$aggParams$custom;
  return agg.aggParams && 'customLabel' in agg.aggParams ? (_agg$aggParams$custom = agg.aggParams.customLabel) !== null && _agg$aggParams$custom !== void 0 ? _agg$aggParams$custom : agg.label : agg.label;
};
exports.getLabel = getLabel;
const getLabelForPercentile = agg => {
  return agg.aggParams && 'customLabel' in agg.aggParams && agg.aggParams.customLabel !== '' ? agg.label : '';
};
exports.getLabelForPercentile = getLabelForPercentile;
const getValidColumns = columns => {
  if (columns && Array.isArray(columns)) {
    const nonNullColumns = columns.filter(c => c !== null);
    if (nonNullColumns.length !== columns.length) {
      return null;
    }
    return nonNullColumns;
  }
  return columns ? [columns] : null;
};
exports.getValidColumns = getValidColumns;
const getFieldNameFromField = field => {
  if (!field) {
    return null;
  }
  if (typeof field === 'string') {
    return field;
  }
  return field.name;
};
exports.getFieldNameFromField = getFieldNameFromField;
const isSchemaConfig = agg => {
  if (agg.aggType) {
    return true;
  }
  return false;
};
exports.isSchemaConfig = isSchemaConfig;
const isColumnWithMeta = column => {
  if (column.meta) {
    return true;
  }
  return false;
};
exports.isColumnWithMeta = isColumnWithMeta;
const SIBBLING_PIPELINE_AGGS = [_common.METRIC_TYPES.AVG_BUCKET, _common.METRIC_TYPES.SUM_BUCKET, _common.METRIC_TYPES.MAX_BUCKET, _common.METRIC_TYPES.MIN_BUCKET];
const PARENT_PIPELINE_AGGS = [_common.METRIC_TYPES.CUMULATIVE_SUM, _common.METRIC_TYPES.DERIVATIVE, _common.METRIC_TYPES.MOVING_FN];
const AGGS_WITHOUT_SPECIAL_RARAMS = [_common.METRIC_TYPES.AVG, _common.METRIC_TYPES.COUNT, _common.METRIC_TYPES.MAX, _common.METRIC_TYPES.MIN, _common.METRIC_TYPES.SUM, _common.METRIC_TYPES.MEDIAN, _common.METRIC_TYPES.CARDINALITY, _common.METRIC_TYPES.VALUE_COUNT];
const PIPELINE_AGGS = [...SIBBLING_PIPELINE_AGGS, ...PARENT_PIPELINE_AGGS];
const isSiblingPipeline = metric => {
  return SIBBLING_PIPELINE_AGGS.includes(metric.aggType);
};
exports.isSiblingPipeline = isSiblingPipeline;
const isPipeline = metric => {
  return PIPELINE_AGGS.includes(metric.aggType);
};
exports.isPipeline = isPipeline;
const isMetricAggWithoutParams = metric => {
  return AGGS_WITHOUT_SPECIAL_RARAMS.includes(metric.aggType);
};
exports.isMetricAggWithoutParams = isMetricAggWithoutParams;
const isPercentileAgg = metric => {
  return metric.aggType === _common.METRIC_TYPES.PERCENTILES;
};
exports.isPercentileAgg = isPercentileAgg;
const isPercentileRankAgg = metric => {
  return metric.aggType === _common.METRIC_TYPES.PERCENTILE_RANKS;
};
exports.isPercentileRankAgg = isPercentileRankAgg;
const isStdDevAgg = metric => {
  return metric.aggType === _common.METRIC_TYPES.STD_DEV;
};
exports.isStdDevAgg = isStdDevAgg;
const getCustomBucketsFromSiblingAggs = metrics => {
  return metrics.reduce((acc, metric) => {
    var _metric$aggParams;
    if (isSiblingPipeline(metric) && (_metric$aggParams = metric.aggParams) !== null && _metric$aggParams !== void 0 && _metric$aggParams.customBucket && metric.aggId) {
      const customBucket = acc.find(bucket => {
        var _metric$aggParams2, _metric$aggParams2$cu;
        return (0, _lodash.isEqual)((0, _lodash.omit)((_metric$aggParams2 = metric.aggParams) === null || _metric$aggParams2 === void 0 ? void 0 : (_metric$aggParams2$cu = _metric$aggParams2.customBucket) === null || _metric$aggParams2$cu === void 0 ? void 0 : _metric$aggParams2$cu.serialize(), ['id']), (0, _lodash.omit)(bucket.customBucket.serialize(), ['id']));
      });
      if (customBucket) {
        customBucket.metricIds.push(metric.aggId);
      } else {
        acc.push({
          customBucket: metric.aggParams.customBucket,
          metricIds: [metric.aggId]
        });
      }
    }
    return acc;
  }, []);
};
exports.getCustomBucketsFromSiblingAggs = getCustomBucketsFromSiblingAggs;
const getMetricFromParentPipelineAgg = (agg, aggs) => {
  if (!agg.aggParams) {
    return null;
  }
  if (isSiblingPipeline(agg)) {
    if (agg.aggParams.customMetric) {
      return (0, _vis_schemas.convertToSchemaConfig)(agg.aggParams.customMetric);
    }
    return null;
  }
  const {
    customMetric,
    metricAgg
  } = agg.aggParams;
  if (!customMetric && metricAgg === 'custom') {
    return null;
  }
  let metric;
  if (!customMetric) {
    metric = aggs.find(({
      aggId
    }) => aggId === metricAgg);
  } else {
    metric = (0, _vis_schemas.convertToSchemaConfig)(customMetric);
  }
  return metric;
};
exports.getMetricFromParentPipelineAgg = getMetricFromParentPipelineAgg;