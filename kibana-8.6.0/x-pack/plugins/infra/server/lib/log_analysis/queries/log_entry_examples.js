"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryExamplesResponseRT = exports.logEntryExampleHitRT = exports.createLogEntryExamplesQuery = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _log_analysis = require("../../../../common/log_analysis");
var _elasticsearch_runtime_types = require("../../../utils/elasticsearch_runtime_types");
var _common = require("./common");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLogEntryExamplesQuery = (indices, runtimeMappings, timestampField, tiebreakerField, startTime, endTime, dataset, exampleCount, categoryQuery) => ({
  ..._common.defaultRequestParameters,
  body: {
    size: exampleCount,
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
        }, ...(dataset !== '' ? [{
          term: {
            [_log_analysis.partitionField]: dataset
          }
        }] : [{
          bool: {
            must_not: [{
              exists: {
                field: _log_analysis.partitionField
              }
            }]
          }
        }]), ...(categoryQuery ? [{
          match: {
            message: {
              query: categoryQuery,
              operator: 'and'
            }
          }
        }] : [])]
      }
    },
    runtime_mappings: runtimeMappings,
    sort: [{
      [timestampField]: 'asc'
    }, {
      [tiebreakerField]: 'asc'
    }],
    _source: false,
    fields: ['event.dataset', 'message']
  },
  index: indices
});
exports.createLogEntryExamplesQuery = createLogEntryExamplesQuery;
const logEntryExampleHitRT = rt.type({
  _id: rt.string,
  fields: rt.partial({
    'event.dataset': rt.array(rt.string),
    message: rt.array(rt.string)
  }),
  sort: rt.tuple([rt.number, rt.number])
});
exports.logEntryExampleHitRT = logEntryExampleHitRT;
const logEntryExamplesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(logEntryExampleHitRT)
  })
})]);
exports.logEntryExamplesResponseRT = logEntryExamplesResponseRT;