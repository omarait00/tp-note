"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = void 0;
var _custom_http_request_error = require("../../utils/custom_http_request_error");
var _errors = require("../errors");
var _metadata = require("../services/metadata");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Default Endpoint Routes error handler
 * @param logger
 * @param res
 * @param error
 */
const errorHandler = (logger, res, error) => {
  logger.error(error);
  if (error instanceof _custom_http_request_error.CustomHttpRequestError) {
    return res.customError({
      statusCode: error.statusCode,
      body: error
    });
  }
  if (error instanceof _errors.NotFoundError) {
    return res.notFound({
      body: error
    });
  }
  if (error instanceof _metadata.EndpointHostUnEnrolledError) {
    return res.badRequest({
      body: error
    });
  }

  // Kibana CORE will take care of `500` errors when the handler `throw`'s, including logging the error
  throw error;
};
exports.errorHandler = errorHandler;