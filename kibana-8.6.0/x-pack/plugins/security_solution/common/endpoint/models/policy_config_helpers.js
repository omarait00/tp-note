"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableProtections = void 0;
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns a copy of the passed `PolicyConfig` with all protections set to disabled.
 *
 * @param policy
 * @returns
 */
const disableProtections = policy => {
  const result = disableCommonProtections(policy);
  return {
    ...result,
    windows: {
      ...result.windows,
      ...getDisabledWindowsSpecificProtections(result),
      popup: {
        ...result.windows.popup,
        ...getDisabledWindowsSpecificPopups(result)
      }
    }
  };
};
exports.disableProtections = disableProtections;
const disableCommonProtections = policy => {
  let policyOutput = policy;
  for (const key in policyOutput) {
    if (Object.prototype.hasOwnProperty.call(policyOutput, key)) {
      const os = key;
      policyOutput = {
        ...policyOutput,
        [os]: {
          ...policyOutput[os],
          ...getDisabledCommonProtectionsForOS(policyOutput, os),
          popup: {
            ...policyOutput[os].popup,
            ...getDisabledCommonPopupsForOS(policyOutput, os)
          }
        }
      };
    }
  }
  return policyOutput;
};
const getDisabledCommonProtectionsForOS = (policy, os) => ({
  behavior_protection: {
    ...policy[os].behavior_protection,
    mode: _types.ProtectionModes.off
  },
  memory_protection: {
    ...policy[os].memory_protection,
    mode: _types.ProtectionModes.off
  },
  malware: {
    ...policy[os].malware,
    blocklist: false,
    mode: _types.ProtectionModes.off
  }
});
const getDisabledCommonPopupsForOS = (policy, os) => ({
  behavior_protection: {
    ...policy[os].popup.behavior_protection,
    enabled: false
  },
  malware: {
    ...policy[os].popup.malware,
    enabled: false
  },
  memory_protection: {
    ...policy[os].popup.memory_protection,
    enabled: false
  }
});
const getDisabledWindowsSpecificProtections = policy => ({
  ransomware: {
    ...policy.windows.ransomware,
    mode: _types.ProtectionModes.off
  },
  attack_surface_reduction: {
    ...policy.windows.attack_surface_reduction,
    credential_hardening: {
      enabled: false
    }
  }
});
const getDisabledWindowsSpecificPopups = policy => ({
  ransomware: {
    ...policy.windows.popup.ransomware,
    enabled: false
  }
});