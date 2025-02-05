"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAsyncKibanaSearchResponse = toAsyncKibanaSearchResponse;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Get the Kibana representation of an async search response
 */
function toAsyncKibanaSearchResponse(response, startTime, warning) {
  return {
    id: response.id,
    rawResponse: response,
    isPartial: response.is_partial,
    isRunning: response.is_running,
    took: Date.now() - startTime,
    ...(warning ? {
      warning
    } : {})
  };
}