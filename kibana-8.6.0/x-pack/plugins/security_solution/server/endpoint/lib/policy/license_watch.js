"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolicyWatcher = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../../../../../fleet/common");
var _policy_config = require("../../../../common/license/policy_config");
var _policy = require("../../../../common/endpoint/service/policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class PolicyWatcher {
  constructor(policyService, soStart, esStart, logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "policyService", void 0);
    (0, _defineProperty2.default)(this, "subscription", void 0);
    (0, _defineProperty2.default)(this, "soStart", void 0);
    this.policyService = policyService;
    this.esClient = esStart.client.asInternalUser;
    this.logger = logger;
    this.soStart = soStart;
  }

  /**
   * The policy watcher is not called as part of a HTTP request chain, where the
   * request-scoped SOClient could be passed down. It is called via license observable
   * changes. We are acting as the 'system' in response to license changes, so we are
   * intentionally using the system user here. Be very aware of what you are using this
   * client to do
   */
  makeInternalSOClient(soStart) {
    const fakeRequest = {
      headers: {},
      getBasePath: () => '',
      path: '/',
      route: {
        settings: {}
      },
      url: {
        href: {}
      },
      raw: {
        req: {
          url: '/'
        }
      }
    };
    return soStart.getScopedClient(fakeRequest, {
      excludedWrappers: ['security']
    });
  }
  start(licenseService) {
    var _licenseService$getLi;
    this.subscription = (_licenseService$getLi = licenseService.getLicenseInformation$()) === null || _licenseService$getLi === void 0 ? void 0 : _licenseService$getLi.subscribe(this.watch.bind(this));
  }
  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  async watch(license) {
    let page = 1;
    let response;
    do {
      try {
        response = await this.policyService.list(this.makeInternalSOClient(this.soStart), {
          page: page++,
          perPage: 100,
          kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: endpoint`
        });
      } catch (e) {
        this.logger.warn(`Unable to verify endpoint policies in line with license change: failed to fetch package policies: ${e.message}`);
        return;
      }
      for (const policy of response.items) {
        const updatePolicy = (0, _policy.getPolicyDataForUpdate)(policy);
        const policyConfig = updatePolicy.inputs[0].config.policy.value;
        try {
          if (!(0, _policy_config.isEndpointPolicyValidForLicense)(policyConfig, license)) {
            updatePolicy.inputs[0].config.policy.value = (0, _policy_config.unsetPolicyFeaturesAccordingToLicenseLevel)(policyConfig, license);
            try {
              await this.policyService.update(this.makeInternalSOClient(this.soStart), this.esClient, policy.id, updatePolicy);
            } catch (e) {
              // try again for transient issues
              try {
                await this.policyService.update(this.makeInternalSOClient(this.soStart), this.esClient, policy.id, updatePolicy);
              } catch (ee) {
                this.logger.warn(`Unable to remove platinum features from policy ${policy.id}`);
                this.logger.warn(ee);
              }
            }
          }
        } catch (error) {
          this.logger.warn(`Failure while attempting to verify Endpoint Policy features for policy [${policy.id}]`);
          this.logger.warn(error);
        }
      }
    } while (response.page * response.perPage < response.total);
  }
}
exports.PolicyWatcher = PolicyWatcher;