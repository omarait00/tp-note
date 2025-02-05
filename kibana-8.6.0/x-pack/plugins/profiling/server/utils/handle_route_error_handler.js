"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRouteHandlerError = handleRouteHandlerError;
var _server = require("../../../observability/server");
var _elasticsearch = require("@elastic/elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function handleRouteHandlerError({
  error,
  logger,
  response
}) {
  var _error$statusCode;
  if (error instanceof _server.WrappedElasticsearchClientError && error.originalError instanceof _elasticsearch.errors.RequestAbortedError) {
    return response.custom({
      statusCode: 499,
      body: {
        message: 'Client closed request'
      }
    });
  }
  logger.error(error);
  return response.customError({
    statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500,
    body: {
      message: error.message
    }
  });
}