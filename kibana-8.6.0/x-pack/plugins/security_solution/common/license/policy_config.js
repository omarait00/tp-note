"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsetPolicyFeaturesAccordingToLicenseLevel = exports.isEndpointPolicyValidForLicense = void 0;
var _license = require("./license");
var _policy_config = require("../endpoint/models/policy_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isEndpointMalwarePolicyValidForLicense(policy, license) {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    // platinum allows all malware features
    return true;
  }
  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)();

  // only platinum or higher may disable malware notification
  if (policy.windows.popup.malware.enabled !== defaults.windows.popup.malware.enabled || policy.mac.popup.malware.enabled !== defaults.mac.popup.malware.enabled) {
    return false;
  }

  // Only Platinum or higher may change the malware message (which can be blank or what Endpoint defaults)
  if ([policy.windows, policy.mac].some(p => p.popup.malware.message !== '' && p.popup.malware.message !== _policy_config.DefaultPolicyNotificationMessage)) {
    return false;
  }
  return true;
}
function isEndpointRansomwarePolicyValidForLicense(policy, license) {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    const defaults = (0, _policy_config.policyFactoryWithSupportedFeatures)();

    // only platinum or higher may enable ransomware protection
    if (policy.windows.ransomware.supported !== defaults.windows.ransomware.supported) {
      return false;
    }
    return true;
  }
  // only platinum or higher may enable ransomware
  // only platinum or higher may enable ransomware notification
  // Only Platinum or higher may change the ransomware message
  // (which can be blank or what Endpoint defaults)
  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)();
  if (policy.windows.ransomware.supported !== defaults.windows.ransomware.supported) {
    return false;
  }
  if (policy.windows.ransomware.mode !== defaults.windows.ransomware.mode) {
    return false;
  }
  if (policy.windows.popup.ransomware.enabled !== defaults.windows.popup.ransomware.enabled) {
    return false;
  }
  if (policy.windows.popup.ransomware.message !== '' && policy.windows.popup.ransomware.message !== _policy_config.DefaultPolicyNotificationMessage) {
    return false;
  }
  return true;
}
function isEndpointMemoryPolicyValidForLicense(policy, license) {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    const defaults = (0, _policy_config.policyFactoryWithSupportedFeatures)();
    // only platinum or higher may enable memory protection
    if (policy.windows.memory_protection.supported !== defaults.windows.memory_protection.supported || policy.mac.memory_protection.supported !== defaults.mac.memory_protection.supported || policy.linux.memory_protection.supported !== defaults.linux.memory_protection.supported) {
      return false;
    }
    return true;
  }

  // only platinum or higher may enable memory_protection
  // only platinum or higher may enable memory_protection notification
  // Only Platinum or higher may change the memory_protection message
  // (which can be blank or what Endpoint defaults)
  // only platinum or higher may enable memory_protection
  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)();
  if (policy.windows.memory_protection.mode !== defaults.windows.memory_protection.mode || policy.mac.memory_protection.mode !== defaults.mac.memory_protection.mode || policy.linux.memory_protection.mode !== defaults.linux.memory_protection.mode) {
    return false;
  }
  if (policy.windows.popup.memory_protection.enabled !== defaults.windows.popup.memory_protection.enabled || policy.mac.popup.memory_protection.enabled !== defaults.mac.popup.memory_protection.enabled || policy.linux.popup.memory_protection.enabled !== defaults.linux.popup.memory_protection.enabled) {
    return false;
  }
  if (policy.windows.popup.memory_protection.message !== '' && policy.windows.popup.memory_protection.message !== _policy_config.DefaultPolicyRuleNotificationMessage || policy.mac.popup.memory_protection.message !== '' && policy.mac.popup.memory_protection.message !== _policy_config.DefaultPolicyRuleNotificationMessage || policy.linux.popup.memory_protection.message !== '' && policy.linux.popup.memory_protection.message !== _policy_config.DefaultPolicyRuleNotificationMessage) {
    return false;
  }
  if (policy.windows.memory_protection.supported !== defaults.windows.memory_protection.supported || policy.mac.memory_protection.supported !== defaults.mac.memory_protection.supported || policy.linux.memory_protection.supported !== defaults.linux.memory_protection.supported) {
    return false;
  }
  return true;
}
function isEndpointBehaviorPolicyValidForLicense(policy, license) {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    const defaults = (0, _policy_config.policyFactoryWithSupportedFeatures)();
    // only platinum or higher may enable behavior protection
    if (policy.windows.behavior_protection.supported !== defaults.windows.behavior_protection.supported || policy.mac.behavior_protection.supported !== defaults.mac.behavior_protection.supported || policy.linux.behavior_protection.supported !== defaults.linux.behavior_protection.supported) {
      return false;
    }
    return true;
  }
  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)();

  // only platinum or higher may enable behavior_protection
  if (policy.windows.behavior_protection.mode !== defaults.windows.behavior_protection.mode || policy.mac.behavior_protection.mode !== defaults.mac.behavior_protection.mode || policy.linux.behavior_protection.mode !== defaults.linux.behavior_protection.mode) {
    return false;
  }

  // only platinum or higher may enable behavior_protection notification
  if (policy.windows.popup.behavior_protection.enabled !== defaults.windows.popup.behavior_protection.enabled || policy.mac.popup.behavior_protection.enabled !== defaults.mac.popup.behavior_protection.enabled || policy.linux.popup.behavior_protection.enabled !== defaults.linux.popup.behavior_protection.enabled) {
    return false;
  }

  // Only Platinum or higher may change the behavior_protection message (which can be blank or what Endpoint defaults)
  if (policy.windows.popup.behavior_protection.message !== '' && policy.windows.popup.behavior_protection.message !== _policy_config.DefaultPolicyRuleNotificationMessage || policy.mac.popup.behavior_protection.message !== '' && policy.mac.popup.behavior_protection.message !== _policy_config.DefaultPolicyRuleNotificationMessage || policy.linux.popup.behavior_protection.message !== '' && policy.linux.popup.behavior_protection.message !== _policy_config.DefaultPolicyRuleNotificationMessage) {
    return false;
  }

  // only platinum or higher may enable behavior_protection
  if (policy.windows.behavior_protection.supported !== defaults.windows.behavior_protection.supported || policy.mac.behavior_protection.supported !== defaults.mac.behavior_protection.supported || policy.linux.behavior_protection.supported !== defaults.linux.behavior_protection.supported) {
    return false;
  }
  return true;
}
function isEndpointCredentialDumpingPolicyValidForLicense(policy, license) {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    // platinum allows all advanced features
    return true;
  }
  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)();

  // only platinum or higher may use credential hardening
  if (policy.windows.attack_surface_reduction.credential_hardening.enabled !== defaults.windows.attack_surface_reduction.credential_hardening.enabled) {
    return false;
  }
  return true;
}
function isEndpointAdvancedPolicyValidForLicense(policy, license) {
  var _policy$windows$advan, _policy$windows$advan2, _defaults$windows$adv, _defaults$windows$adv2;
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    // platinum allows all advanced features
    return true;
  }
  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)();

  // only platinum or higher may use rollback
  if (((_policy$windows$advan = policy.windows.advanced) === null || _policy$windows$advan === void 0 ? void 0 : (_policy$windows$advan2 = _policy$windows$advan.alerts) === null || _policy$windows$advan2 === void 0 ? void 0 : _policy$windows$advan2.rollback.self_healing.enabled) !== ((_defaults$windows$adv = defaults.windows.advanced) === null || _defaults$windows$adv === void 0 ? void 0 : (_defaults$windows$adv2 = _defaults$windows$adv.alerts) === null || _defaults$windows$adv2 === void 0 ? void 0 : _defaults$windows$adv2.rollback.self_healing.enabled)) {
    return false;
  }
  return true;
}

/**
 * Given an endpoint package policy, verifies that all enabled features that
 * require a certain license level have a valid license for them.
 */
const isEndpointPolicyValidForLicense = (policy, license) => {
  return isEndpointMalwarePolicyValidForLicense(policy, license) && isEndpointRansomwarePolicyValidForLicense(policy, license) && isEndpointMemoryPolicyValidForLicense(policy, license) && isEndpointBehaviorPolicyValidForLicense(policy, license) && isEndpointAdvancedPolicyValidForLicense(policy, license) && isEndpointCredentialDumpingPolicyValidForLicense(policy, license);
};

/**
 * Resets paid features in a PolicyConfig back to default values
 * when unsupported by the given license level.
 */
exports.isEndpointPolicyValidForLicense = isEndpointPolicyValidForLicense;
const unsetPolicyFeaturesAccordingToLicenseLevel = (policy, license) => {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    return (0, _policy_config.policyFactoryWithSupportedFeatures)(policy);
  }

  // set any license-gated features back to the defaults
  return (0, _policy_config.policyFactoryWithoutPaidFeatures)(policy);
};
exports.unsetPolicyFeaturesAccordingToLicenseLevel = unsetPolicyFeaturesAccordingToLicenseLevel;