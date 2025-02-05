"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToSchemaConfig = convertToSchemaConfig;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function convertToSchemaConfig(agg) {
  const aggType = agg.type.name;
  const hasSubAgg = ['derivative', 'moving_avg', 'serial_diff', 'cumulative_sum', 'sum_bucket', 'avg_bucket', 'min_bucket', 'max_bucket'].includes(aggType);
  const formatAgg = hasSubAgg ? agg.params.customMetric || agg.aggConfigs.getRequestAggById(agg.params.metricAgg) : agg;
  const params = {};
  if (aggType === 'geohash_grid') {
    params.precision = agg.params.precision;
    params.useGeocentroid = agg.params.useGeocentroid;
  }
  const label = agg.makeLabel && agg.makeLabel();
  return {
    accessor: 0,
    format: formatAgg.toSerializedFieldFormat(),
    params,
    label,
    aggType,
    aggId: agg.id,
    aggParams: agg.params
  };
}