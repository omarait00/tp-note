"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Endpoint base error class that supports an optional second argument for providing additional data
 * for the error.
 */
class EndpointError extends Error {
  constructor(message, meta) {
    super(message);
    // For debugging - capture name of subclasses
    this.meta = meta;
    this.name = this.constructor.name;
  }
}
exports.EndpointError = EndpointError;