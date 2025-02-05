"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRootTransactionByTraceId = getRootTransactionByTraceId;
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getRootTransactionByTraceId(traceId, apmEventClient) {
  var _resp$hits$hits$;
  const params = {
    apm: {
      events: [_common.ProcessorEvent.transaction]
    },
    body: {
      track_total_hits: false,
      size: 1,
      query: {
        bool: {
          should: [{
            constant_score: {
              filter: {
                bool: {
                  must_not: {
                    exists: {
                      field: _elasticsearch_fieldnames.PARENT_ID
                    }
                  }
                }
              }
            }
          }],
          filter: [{
            term: {
              [_elasticsearch_fieldnames.TRACE_ID]: traceId
            }
          }]
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_root_transaction_by_trace_id', params);
  return {
    transaction: (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source
  };
}