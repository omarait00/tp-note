"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultPolicy = void 0;
var _policy_config = require("../../../common/endpoint/models/policy_config");
var _constants = require("../constants");
var _policy_config_helpers = require("../../../common/endpoint/models/policy_config_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create the default endpoint policy based on the current license and configuration type
 */
const createDefaultPolicy = (licenseService, config) => {
  const factoryPolicy = (0, _policy_config.policyFactory)();
  const defaultPolicyPerType = (config === null || config === void 0 ? void 0 : config.type) === 'cloud' ? getCloudPolicyConfig(factoryPolicy) : getEndpointPolicyWithIntegrationConfig(factoryPolicy, config);

  // Apply license limitations in the final step, so it's not overriden (see malware popup)
  return licenseService.isPlatinumPlus() ? defaultPolicyPerType : (0, _policy_config.policyFactoryWithoutPaidFeatures)(defaultPolicyPerType);
};

/**
 * Create a copy of an object with all keys set to false
 */
exports.createDefaultPolicy = createDefaultPolicy;
const falsyObjectKeys = obj => {
  return Object.keys(obj).reduce((accumulator, key) => {
    return {
      ...accumulator,
      [key]: false
    };
  }, {});
};
const getEndpointPolicyConfigPreset = config => {
  var _config$endpointConfi, _config$endpointConfi2, _config$endpointConfi3;
  const isNGAV = (config === null || config === void 0 ? void 0 : (_config$endpointConfi = config.endpointConfig) === null || _config$endpointConfi === void 0 ? void 0 : _config$endpointConfi.preset) === _constants.ENDPOINT_CONFIG_PRESET_NGAV;
  const isEDREssential = (config === null || config === void 0 ? void 0 : (_config$endpointConfi2 = config.endpointConfig) === null || _config$endpointConfi2 === void 0 ? void 0 : _config$endpointConfi2.preset) === _constants.ENDPOINT_CONFIG_PRESET_EDR_ESSENTIAL;
  const isEDRComplete = (config === null || config === void 0 ? void 0 : (_config$endpointConfi3 = config.endpointConfig) === null || _config$endpointConfi3 === void 0 ? void 0 : _config$endpointConfi3.preset) === _constants.ENDPOINT_CONFIG_PRESET_EDR_COMPLETE;
  return {
    isNGAV,
    isEDREssential,
    isEDRComplete
  };
};

/**
 * Retrieve policy for endpoint based on the preset selected in the endpoint integration config
 */
const getEndpointPolicyWithIntegrationConfig = (policy, config) => {
  const {
    isNGAV,
    isEDREssential,
    isEDRComplete
  } = getEndpointPolicyConfigPreset(config);
  if (isEDRComplete) {
    return policy;
  } else if (isNGAV || isEDREssential) {
    const events = {
      process: true,
      file: isEDREssential,
      network: isEDREssential
    };
    return {
      ...policy,
      linux: {
        ...policy.linux,
        events: {
          ...falsyObjectKeys(policy.linux.events),
          ...events
        }
      },
      windows: {
        ...policy.windows,
        events: {
          ...falsyObjectKeys(policy.windows.events),
          ...events
        }
      },
      mac: {
        ...policy.mac,
        events: {
          ...falsyObjectKeys(policy.mac.events),
          ...events
        }
      }
    };
  }

  // data collection by default
  return (0, _policy_config_helpers.disableProtections)(policy);
};

/**
 * Retrieve policy for cloud based on the on the cloud integration config
 */
const getCloudPolicyConfig = policy => {
  // Disabling all protections, since it's not yet supported on Cloud integrations
  const policyWithDisabledProtections = (0, _policy_config_helpers.disableProtections)(policy);
  return {
    ...policyWithDisabledProtections,
    linux: {
      ...policyWithDisabledProtections.linux,
      events: {
        ...policyWithDisabledProtections.linux.events,
        session_data: true
      }
    }
  };
};