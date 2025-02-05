"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapAnyErrorToKibanaHttpResponse = void 0;
var _server = require("../../../../../../src/core/server");
var _error_symbols = require("../../lib/reindexing/error_symbols");
var _error = require("../../lib/reindexing/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mapAnyErrorToKibanaHttpResponse = e => {
  if (e instanceof _error.ReindexError) {
    switch (e.symbol) {
      case _error_symbols.AccessForbidden:
        return _server.kibanaResponseFactory.forbidden({
          body: e.message
        });
      case _error_symbols.IndexNotFound:
        return _server.kibanaResponseFactory.notFound({
          body: e.message
        });
      case _error_symbols.CannotCreateIndex:
      case _error_symbols.ReindexTaskCannotBeDeleted:
        throw e;
      case _error_symbols.ReindexTaskFailed:
        // Bad data
        return _server.kibanaResponseFactory.customError({
          body: e.message,
          statusCode: 422
        });
      case _error_symbols.ReindexAlreadyInProgress:
      case _error_symbols.MultipleReindexJobsFound:
      case _error_symbols.ReindexCannotBeCancelled:
        return _server.kibanaResponseFactory.badRequest({
          body: e.message
        });
      default:
      // nothing matched
    }
  }

  throw e;
};
exports.mapAnyErrorToKibanaHttpResponse = mapAnyErrorToKibanaHttpResponse;