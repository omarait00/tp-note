"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQuery = createQuery;
exports.createTypeFilter = void 0;
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Builds a type filter syntax that supports backwards compatibility to read
 * from indices before and after `_type` is removed from Elasticsearch
 *
 * TODO: this backwards compatibility helper will only be supported for 5.x-6. This
 * function should be removed in 7.0
 */
const createTypeFilter = type => {
  return {
    bool: {
      should: [{
        term: {
          _type: type
        }
      }, {
        term: {
          type
        }
      }]
    }
  };
};
exports.createTypeFilter = createTypeFilter;
/*
 * Creates the boilerplace for querying monitoring data, including filling in
 * start time and end time, and injecting additional filters.
 *
 * Create a bool for types that will query for documents using `_type` (true type) and `type` (as a field)
 * Makes backwards compatibility for types being deprecated in Elasticsearch
 *
 * Options object:
 * @param {String} options.type - `type` field value of the documents
 * @param {Array} options.filters - additional filters to add to the `bool` section of the query. Default: []
 * @param {string} options.clusterUuid - a UUID of the cluster (optional)
 * @param {Date} options.start - numeric timestamp (optional)
 * @param {Date} options.end - numeric timestamp (optional)
 */
function createQuery(options) {
  const {
    type,
    clusterUuid,
    start,
    end,
    filters = []
  } = options;
  let typeFilter;
  if (type) {
    typeFilter = createTypeFilter(type);
  }
  let clusterUuidFilter;
  if (clusterUuid) {
    clusterUuidFilter = {
      term: {
        cluster_uuid: clusterUuid
      }
    };
  }
  let timeRangeFilter;
  if (start || end) {
    timeRangeFilter = {
      range: {
        timestamp: {
          format: 'epoch_millis'
        }
      }
    };
    if (start) {
      timeRangeFilter.range.timestamp.gte = _moment.default.utc(start).valueOf();
    }
    if (end) {
      timeRangeFilter.range.timestamp.lte = _moment.default.utc(end).valueOf();
    }
  }
  const combinedFilters = [typeFilter, clusterUuidFilter, timeRangeFilter, ...filters];
  return {
    bool: {
      filter: combinedFilters.filter(Boolean)
    }
  };
}