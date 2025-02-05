"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointArtifactExceptionValidationError = void 0;
var _server = require("../../../../../lists/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EndpointArtifactExceptionValidationError extends _server.ListsErrorWithStatusCode {
  constructor(message, statusCode = 400) {
    super(`EndpointArtifactError: ${message}`, statusCode);
  }
}
exports.EndpointArtifactExceptionValidationError = EndpointArtifactExceptionValidationError;