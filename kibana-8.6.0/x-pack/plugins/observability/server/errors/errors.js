"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SLONotFound = exports.ObservabilityError = exports.NotSupportedError = exports.InvalidTransformError = exports.InternalQueryError = exports.IllegalArgumentError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class ObservabilityError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
exports.ObservabilityError = ObservabilityError;
class SLONotFound extends ObservabilityError {}
exports.SLONotFound = SLONotFound;
class InternalQueryError extends ObservabilityError {}
exports.InternalQueryError = InternalQueryError;
class NotSupportedError extends ObservabilityError {}
exports.NotSupportedError = NotSupportedError;
class IllegalArgumentError extends ObservabilityError {}
exports.IllegalArgumentError = IllegalArgumentError;
class InvalidTransformError extends ObservabilityError {}
exports.InvalidTransformError = InvalidTransformError;