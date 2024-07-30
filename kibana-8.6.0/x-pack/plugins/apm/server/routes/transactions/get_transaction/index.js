"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransaction = getTransaction;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _as_mutable_array = require("../../../../common/utils/as_mutable_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTransaction({
  transactionId,
  traceId,
  apmEventClient,
  start,
  end
}) {
  var _resp$hits$hits$;
  const resp = await apmEventClient.search('get_transaction', {
    apm: {
      events: [_common.ProcessorEvent.transaction]
    },
    body: {
      track_total_hits: false,
      size: 1,
      query: {
        bool: {
          filter: (0, _as_mutable_array.asMutableArray)([{
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_ID]: transactionId
            }
          }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRACE_ID, traceId), ...(start && end ? (0, _server.rangeQuery)(start, end) : [])])
        }
      }
    }
  });
  return (_resp$hits$hits$ = resp.hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source;
}