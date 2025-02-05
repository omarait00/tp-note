"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseChecker = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const checkLicense = license => {
  const check = license.check('globalSearch', 'basic');
  switch (check.state) {
    case 'expired':
      return {
        valid: false,
        message: 'expired'
      };
    case 'invalid':
      return {
        valid: false,
        message: 'invalid'
      };
    case 'unavailable':
      return {
        valid: false,
        message: 'unavailable'
      };
    case 'valid':
      return {
        valid: true
      };
    default:
      throw new Error(`Invalid license state: ${check.state}`);
  }
};
class LicenseChecker {
  constructor(license$) {
    (0, _defineProperty2.default)(this, "subscription", void 0);
    (0, _defineProperty2.default)(this, "state", {
      valid: false,
      message: 'unknown'
    });
    this.subscription = license$.subscribe(license => {
      this.state = checkLicense(license);
    });
  }
  getState() {
    return this.state;
  }
  clean() {
    this.subscription.unsubscribe();
  }
}
exports.LicenseChecker = LicenseChecker;