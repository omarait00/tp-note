"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogoutReason = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let LogoutReason;
exports.LogoutReason = LogoutReason;
(function (LogoutReason) {
  LogoutReason["SESSION_EXPIRED"] = "SESSION_EXPIRED";
  LogoutReason["AUTHENTICATION_ERROR"] = "AUTHENTICATION_ERROR";
  LogoutReason["LOGGED_OUT"] = "LOGGED_OUT";
  LogoutReason["UNAUTHENTICATED"] = "UNAUTHENTICATED";
})(LogoutReason || (exports.LogoutReason = LogoutReason = {}));