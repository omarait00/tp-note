"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRequest = void 0;
var _inventory_models = require("../../../../../common/inventory_models");
var _serialized_query = require("../../../../utils/serialized_query");
var _create_metric_aggregations = require("./create_metric_aggregations");
var _create_bucket_selector = require("./create_bucket_selector");
var _utils = require("../../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRequest = (index, nodeType, metric, timerange, compositeSize, afterKey, condition, filterQuery, customMetric, fieldsExisted) => {
  const filters = [{
    range: {
      '@timestamp': {
        gte: timerange.from,
        lte: timerange.to,
        format: 'epoch_millis'
      }
    }
  }];
  const parsedFilters = (0, _serialized_query.parseFilterQuery)(filterQuery);
  if (parsedFilters) {
    filters.push(parsedFilters);
  }
  const inventoryFields = (0, _inventory_models.findInventoryFields)(nodeType);
  const composite = {
    size: compositeSize,
    sources: [{
      node: {
        terms: {
          field: inventoryFields.id
        }
      }
    }]
  };
  if (afterKey) {
    composite.after = afterKey;
  }
  const metricAggregations = (0, _create_metric_aggregations.createMetricAggregations)(timerange, nodeType, metric, customMetric);
  const bucketSelector = (0, _create_bucket_selector.createBucketSelector)(metric, condition, customMetric);
  const containerContextAgg = nodeType === 'pod' && fieldsExisted && fieldsExisted[_utils.termsAggField[_utils.KUBERNETES_POD_UID]] ? {
    containerContext: {
      terms: {
        field: _utils.termsAggField[_utils.KUBERNETES_POD_UID],
        size: _utils.NUMBER_OF_DOCUMENTS
      },
      aggs: {
        container: {
          top_hits: {
            size: 1,
            _source: {
              includes: ['container.*']
            }
          }
        }
      }
    }
  } : undefined;
  const includesList = ['host.*', 'labels.*', 'tags', 'cloud.*', 'orchestrator.*'];
  const excludesList = ['host.cpu.*', 'host.disk.*', 'host.network.*'];
  if (!containerContextAgg) includesList.push('container.*');
  const additionalContextAgg = {
    additionalContext: {
      top_hits: {
        size: 1,
        _source: {
          includes: includesList,
          excludes: excludesList
        }
      }
    }
  };
  const request = {
    allow_no_indices: true,
    ignore_unavailable: true,
    index,
    body: {
      size: 0,
      query: {
        bool: {
          filter: filters
        }
      },
      aggs: {
        nodes: {
          composite,
          aggs: {
            ...metricAggregations,
            ...bucketSelector,
            ...additionalContextAgg,
            ...containerContextAgg
          }
        }
      }
    }
  };
  return request;
};
exports.createRequest = createRequest;