"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryDatasetsResponseRT = exports.createLogEntryDatasetsQuery = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _elasticsearch_runtime_types = require("../../../../utils/elasticsearch_runtime_types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLogEntryDatasetsQuery = (indexName, timestampField, startTime, endTime, runtimeMappings, size, afterKey) => ({
  ...defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [{
          range: {
            [timestampField]: {
              gte: startTime,
              lte: endTime,
              format: 'epoch_millis'
            }
          }
        }, {
          exists: {
            field: 'event.dataset'
          }
        }]
      }
    },
    runtime_mappings: runtimeMappings,
    aggs: {
      dataset_buckets: {
        composite: {
          after: afterKey,
          size,
          sources: [{
            dataset: {
              terms: {
                field: 'event.dataset',
                order: 'asc'
              }
            }
          }]
        }
      }
    }
  },
  index: indexName,
  size: 0
});
exports.createLogEntryDatasetsQuery = createLogEntryDatasetsQuery;
const defaultRequestParameters = {
  allow_no_indices: true,
  ignore_unavailable: true,
  track_scores: false,
  track_total_hits: false
};
const compositeDatasetKeyRT = rt.type({
  dataset: rt.string
});
const logEntryDatasetBucketRT = rt.type({
  key: compositeDatasetKeyRT
});
const logEntryDatasetsResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  aggregations: rt.type({
    dataset_buckets: rt.intersection([rt.type({
      buckets: rt.array(logEntryDatasetBucketRT)
    }), rt.partial({
      after_key: compositeDatasetKeyRT
    })])
  })
})]);
exports.logEntryDatasetsResponseRT = logEntryDatasetsResponseRT;