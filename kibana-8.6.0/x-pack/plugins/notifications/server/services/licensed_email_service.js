"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicensedEmailService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LicensedEmailService {
  constructor(emailService, license$, minimumLicense, logger) {
    (0, _defineProperty2.default)(this, "validLicense$", new _rxjs.ReplaySubject(1));
    this.emailService = emailService;
    this.minimumLicense = minimumLicense;
    this.logger = logger;
    // no need to explicitly unsubscribe as the license$ observable already completes on stop()
    license$.pipe((0, _rxjs.map)(license => this.checkValidLicense(license))).subscribe(this.validLicense$);
  }
  async sendPlainTextEmail(payload) {
    if (await (0, _rxjs.firstValueFrom)(this.validLicense$, {
      defaultValue: false
    })) {
      await this.emailService.sendPlainTextEmail(payload);
    } else {
      throw new Error('The current license does not allow sending email notifications');
    }
  }
  checkValidLicense(license) {
    const licenseCheck = license.check(_common.PLUGIN_ID, this.minimumLicense);
    if (licenseCheck.state === 'valid') {
      this.logger.debug('Your current license allows sending email notifications');
      return true;
    }
    this.logger.warn(licenseCheck.message || 'The current license does not allow sending email notifications');
    return false;
  }
}
exports.LicensedEmailService = LicensedEmailService;