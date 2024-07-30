"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityLicenseService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _operators = require("rxjs/operators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SecurityLicenseService {
  constructor() {
    (0, _defineProperty2.default)(this, "licenseSubscription", void 0);
  }
  setup({
    license$
  }) {
    let rawLicense;
    this.licenseSubscription = license$.subscribe(nextRawLicense => {
      rawLicense = nextRawLicense;
    });
    return {
      license: Object.freeze({
        isLicenseAvailable: () => {
          var _rawLicense$isAvailab, _rawLicense;
          return (_rawLicense$isAvailab = (_rawLicense = rawLicense) === null || _rawLicense === void 0 ? void 0 : _rawLicense.isAvailable) !== null && _rawLicense$isAvailab !== void 0 ? _rawLicense$isAvailab : false;
        },
        isEnabled: () => this.isSecurityEnabledFromRawLicense(rawLicense),
        hasAtLeast: licenseType => {
          var _rawLicense2;
          return (_rawLicense2 = rawLicense) === null || _rawLicense2 === void 0 ? void 0 : _rawLicense2.hasAtLeast(licenseType);
        },
        getFeatures: () => this.calculateFeaturesFromRawLicense(rawLicense),
        features$: license$.pipe((0, _operators.map)(nextRawLicense => this.calculateFeaturesFromRawLicense(nextRawLicense)))
      })
    };
  }
  stop() {
    if (this.licenseSubscription) {
      this.licenseSubscription.unsubscribe();
      this.licenseSubscription = undefined;
    }
  }
  isSecurityEnabledFromRawLicense(rawLicense) {
    if (!rawLicense) {
      return false;
    }
    const securityFeature = rawLicense.getFeature('security');
    return securityFeature !== undefined && securityFeature.isAvailable && securityFeature.isEnabled;
  }
  calculateFeaturesFromRawLicense(rawLicense) {
    // If, for some reason, we cannot get license information from Elasticsearch,
    // assume worst-case and lock user at login screen.
    if (!(rawLicense !== null && rawLicense !== void 0 && rawLicense.isAvailable)) {
      return {
        showLogin: true,
        allowLogin: false,
        showLinks: false,
        showRoleMappingsManagement: false,
        allowAccessAgreement: false,
        allowAuditLogging: false,
        allowRoleDocumentLevelSecurity: false,
        allowRoleFieldLevelSecurity: false,
        allowRbac: false,
        allowSubFeaturePrivileges: false,
        allowUserProfileCollaboration: false,
        layout: rawLicense !== undefined && !(rawLicense !== null && rawLicense !== void 0 && rawLicense.isAvailable) ? 'error-xpack-unavailable' : 'error-es-unavailable'
      };
    }
    if (!this.isSecurityEnabledFromRawLicense(rawLicense)) {
      return {
        showLogin: false,
        allowLogin: false,
        showLinks: false,
        showRoleMappingsManagement: false,
        allowAccessAgreement: false,
        allowAuditLogging: false,
        allowRoleDocumentLevelSecurity: false,
        allowRoleFieldLevelSecurity: false,
        allowRbac: false,
        allowSubFeaturePrivileges: false,
        allowUserProfileCollaboration: false
      };
    }
    const isLicenseStandardOrBetter = rawLicense.hasAtLeast('standard');
    const isLicenseGoldOrBetter = rawLicense.hasAtLeast('gold');
    const isLicensePlatinumOrBetter = rawLicense.hasAtLeast('platinum');
    return {
      showLogin: true,
      allowLogin: true,
      showLinks: true,
      showRoleMappingsManagement: isLicenseGoldOrBetter,
      allowAccessAgreement: isLicenseGoldOrBetter,
      allowAuditLogging: isLicenseGoldOrBetter,
      allowSubFeaturePrivileges: isLicenseGoldOrBetter,
      // Only platinum and trial licenses are compliant with field- and document-level security.
      allowRoleDocumentLevelSecurity: isLicensePlatinumOrBetter,
      allowRoleFieldLevelSecurity: isLicensePlatinumOrBetter,
      allowRbac: true,
      allowUserProfileCollaboration: isLicenseStandardOrBetter
    };
  }
}
exports.SecurityLicenseService = SecurityLicenseService;