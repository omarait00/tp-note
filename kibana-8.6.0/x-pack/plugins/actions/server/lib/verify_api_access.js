"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyApiAccess = verifyApiAccess;
var _boom = _interopRequireDefault(require("@hapi/boom"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function verifyApiAccess(licenseState) {
  const licenseCheckResults = licenseState.getLicenseInformation();
  if (licenseCheckResults.showAppLink && licenseCheckResults.enableAppLink) {
    return null;
  }
  throw _boom.default.forbidden(licenseCheckResults.message);
}