"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertMetricToColumns = void 0;
var _common = require("../../../../../data/common");
var _convert = require("../convert");
var _supported_metrics = require("../convert/supported_metrics");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertMetricToColumns = ({
  agg,
  dataView,
  aggs,
  visType
}, percentageModeConfig = {
  isPercentageMode: false
}) => {
  const supportedAgg = _supported_metrics.SUPPORTED_METRICS[agg.aggType];
  if (!supportedAgg) {
    return null;
  }
  if (percentageModeConfig.isPercentageMode) {
    const {
      isPercentageMode,
      ...minMax
    } = percentageModeConfig;
    const formulaColumn = (0, _convert.convertToColumnInPercentageMode)({
      agg,
      dataView,
      aggs,
      visType
    }, minMax);
    return (0, _utils.getValidColumns)(formulaColumn);
  }
  switch (agg.aggType) {
    case _common.METRIC_TYPES.AVG:
    case _common.METRIC_TYPES.MIN:
    case _common.METRIC_TYPES.MAX:
    case _common.METRIC_TYPES.SUM:
    case _common.METRIC_TYPES.COUNT:
    case _common.METRIC_TYPES.CARDINALITY:
    case _common.METRIC_TYPES.VALUE_COUNT:
    case _common.METRIC_TYPES.MEDIAN:
      {
        const columns = (0, _convert.convertMetricAggregationColumnWithoutSpecialParams)(supportedAgg, {
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.STD_DEV:
      {
        const columns = (0, _convert.convertToStdDeviationFormulaColumns)({
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.PERCENTILES:
      {
        const columns = (0, _convert.convertToPercentileColumn)({
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.SINGLE_PERCENTILE:
      {
        const columns = (0, _convert.convertToPercentileColumn)({
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.PERCENTILE_RANKS:
      {
        const columns = (0, _convert.convertToPercentileRankColumn)({
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.SINGLE_PERCENTILE_RANK:
      {
        const columns = (0, _convert.convertToPercentileRankColumn)({
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.TOP_HITS:
    case _common.METRIC_TYPES.TOP_METRICS:
      {
        const columns = (0, _convert.convertToLastValueColumn)({
          agg,
          dataView,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.CUMULATIVE_SUM:
      {
        const columns = (0, _convert.convertToCumulativeSumAggColumn)({
          agg,
          dataView,
          aggs,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.DERIVATIVE:
    case _common.METRIC_TYPES.MOVING_FN:
      {
        const columns = (0, _convert.convertToOtherParentPipelineAggColumns)({
          agg,
          dataView,
          aggs,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    case _common.METRIC_TYPES.SUM_BUCKET:
    case _common.METRIC_TYPES.MIN_BUCKET:
    case _common.METRIC_TYPES.MAX_BUCKET:
    case _common.METRIC_TYPES.AVG_BUCKET:
      {
        const columns = (0, _convert.convertToSiblingPipelineColumns)({
          agg,
          dataView,
          aggs,
          visType
        });
        return (0, _utils.getValidColumns)(columns);
      }
    default:
      return null;
  }
};
exports.convertMetricToColumns = convertMetricToColumns;