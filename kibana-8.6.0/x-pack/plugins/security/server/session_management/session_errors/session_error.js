"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionErrorReason = exports.SessionError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let SessionErrorReason;
exports.SessionErrorReason = SessionErrorReason;
(function (SessionErrorReason) {
  SessionErrorReason["SESSION_MISSING"] = "SESSION_MISSING";
  SessionErrorReason["SESSION_EXPIRED"] = "SESSION_EXPIRED";
  SessionErrorReason["UNEXPECTED_SESSION_ERROR"] = "UNEXPECTED_SESSION_ERROR";
})(SessionErrorReason || (exports.SessionErrorReason = SessionErrorReason = {}));
class SessionError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
exports.SessionError = SessionError;