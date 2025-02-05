"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomHttpRequestError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
class CustomHttpRequestError extends Error {
  constructor(message, statusCode = 500, meta) {
    super(message);
    // For debugging - capture name of subclasses
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.message = message;
  }
}
exports.CustomHttpRequestError = CustomHttpRequestError;