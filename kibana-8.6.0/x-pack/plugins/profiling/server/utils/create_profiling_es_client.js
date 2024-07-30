"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelEsRequestOnAbort = cancelEsRequestOnAbort;
exports.createProfilingEsClient = createProfilingEsClient;
var _server = require("../../../observability/server");
var _with_profiling_span = require("./with_profiling_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function cancelEsRequestOnAbort(promise, request, controller) {
  const subscription = request.events.aborted$.subscribe(() => {
    controller.abort();
  });
  return promise.finally(() => subscription.unsubscribe());
}
function createProfilingEsClient({
  request,
  esClient
}) {
  return {
    search(operationName, searchRequest) {
      const controller = new AbortController();
      const promise = (0, _with_profiling_span.withProfilingSpan)(operationName, () => {
        return cancelEsRequestOnAbort(esClient.search(searchRequest, {
          signal: controller.signal,
          meta: true
        }), request, controller);
      });
      return (0, _server.unwrapEsResponse)(promise);
    },
    mget(operationName, mgetRequest) {
      const controller = new AbortController();
      const promise = (0, _with_profiling_span.withProfilingSpan)(operationName, () => {
        return cancelEsRequestOnAbort(esClient.mget(mgetRequest, {
          signal: controller.signal,
          meta: true
        }), request, controller);
      });
      return (0, _server.unwrapEsResponse)(promise);
    }
  };
}