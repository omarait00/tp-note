"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertMetricToMetricsAPIMetric = void 0;
var _network_traffic = require("../../../../common/inventory_models/shared/metrics/snapshot/network_traffic");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const convertMetricToMetricsAPIMetric = (metric, index) => {
  const id = `metric_${index}`;
  if (metric.aggregation === 'rate' && metric.field) {
    return {
      id,
      aggregations: (0, _network_traffic.networkTraffic)(id, metric.field)
    };
  }
  if (['p95', 'p99'].includes(metric.aggregation) && metric.field) {
    const percent = metric.aggregation === 'p95' ? 95 : 99;
    return {
      id,
      aggregations: {
        [id]: {
          percentiles: {
            field: metric.field,
            percents: [percent]
          }
        }
      }
    };
  }
  if (['max', 'min', 'avg', 'cardinality', 'sum'].includes(metric.aggregation) && metric.field) {
    return {
      id,
      aggregations: {
        [id]: {
          [metric.aggregation]: {
            field: metric.field
          }
        }
      }
    };
  }
  if (metric.aggregation === 'count') {
    return {
      id,
      aggregations: {
        [id]: {
          bucket_script: {
            buckets_path: {
              count: '_count'
            },
            script: {
              source: 'count * 1',
              lang: 'expression'
            },
            gap_policy: 'skip'
          }
        }
      }
    };
  }
};
exports.convertMetricToMetricsAPIMetric = convertMetricToMetricsAPIMetric;