"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateMetricInterval = void 0;
var _constants = require("../../common/constants");
var _inventory_models = require("../../common/inventory_models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Look at the data from metricbeat and get the max period for a given timerange.
 * This is useful for visualizing metric modules like s3 that only send metrics once per day.
 */
const calculateMetricInterval = async (client, options, modules, nodeType) => {
  let from = options.timerange.from;
  if (nodeType) {
    const inventoryModel = (0, _inventory_models.findInventoryModel)(nodeType);
    from = options.timerange.to - inventoryModel.metrics.defaultTimeRangeInSeconds * 1000;
  }
  const query = {
    allow_no_indices: true,
    index: options.indexPattern,
    ignore_unavailable: true,
    body: {
      query: {
        bool: {
          filter: [{
            range: {
              [_constants.TIMESTAMP_FIELD]: {
                gte: from,
                lte: options.timerange.to,
                format: 'epoch_millis'
              }
            }
          }]
        }
      },
      size: 0,
      aggs: {
        modules: {
          terms: {
            field: 'event.dataset',
            include: modules
          },
          aggs: {
            period: {
              max: {
                field: 'metricset.period'
              }
            }
          }
        }
      }
    }
  };
  const resp = await client(query);

  // if ES doesn't return an aggregations key, something went seriously wrong.
  if (!resp.aggregations) {
    return;
  }
  const intervals = resp.aggregations.modules.buckets.map(a => a.period.value).filter(v => !!v);
  if (!intervals.length) {
    return;
  }
  return Math.max(...intervals) / 1000;
};
exports.calculateMetricInterval = calculateMetricInterval;