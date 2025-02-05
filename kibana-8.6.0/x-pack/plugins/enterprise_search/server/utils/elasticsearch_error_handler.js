"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elasticsearchErrorHandler = elasticsearchErrorHandler;
var _i18n = require("@kbn/i18n");
var _error_codes = require("../../common/types/error_codes");
var _create_error = require("./create_error");
var _identify_exceptions = require("./identify_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function elasticsearchErrorHandler(log, requestHandler) {
  return async (context, request, response) => {
    try {
      return await requestHandler(context, request, response);
    } catch (error) {
      let enterpriseSearchError;
      if ((0, _identify_exceptions.isUnauthorizedException)(error)) {
        enterpriseSearchError = {
          errorCode: _error_codes.ErrorCode.UNAUTHORIZED,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.unauthorizedError', {
            defaultMessage: 'You do not have sufficient permissions.'
          }),
          statusCode: 403
        };
      } else {
        enterpriseSearchError = {
          errorCode: _error_codes.ErrorCode.UNCAUGHT_EXCEPTION,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.uncaughtExceptionError', {
            defaultMessage: 'Enterprise Search encountered an error.'
          }),
          statusCode: 502
        };
      }
      if (enterpriseSearchError !== undefined) {
        log.error(_i18n.i18n.translate('xpack.enterpriseSearch.server.routes.errorLogMessage', {
          defaultMessage: 'An error occurred while resolving request to {requestUrl}: {errorMessage}',
          values: {
            errorMessage: enterpriseSearchError.message,
            requestUrl: request.url.toString()
          }
        }));
        log.error(error);
        return (0, _create_error.createError)({
          ...enterpriseSearchError,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.checkKibanaLogsMessage', {
            defaultMessage: '{errorMessage} Check Kibana Server logs for details.',
            values: {
              errorMessage: enterpriseSearchError.message
            }
          }),
          response
        });
      }
      throw error;
    }
  };
}