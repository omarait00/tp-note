"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackagePolicyUpdateCallback = exports.getPackagePolicyPostCreateCallback = exports.getPackagePolicyDeleteCallback = exports.getPackagePolicyCreateCallback = void 0;
var _install_prepackaged_rules = require("./handlers/install_prepackaged_rules");
var _create_policy_artifact_manifest = require("./handlers/create_policy_artifact_manifest");
var _create_default_policy = require("./handlers/create_default_policy");
var _validate_policy_against_license = require("./handlers/validate_policy_against_license");
var _validate_integration_config = require("./handlers/validate_integration_config");
var _remove_policy_from_artifacts = require("./handlers/remove_policy_from_artifacts");
var _notify_protection_feature_usage = require("./notify_protection_feature_usage");
var _constants = require("./constants");
var _create_event_filters = require("./handlers/create_event_filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isEndpointPackagePolicy = packagePolicy => {
  var _packagePolicy$packag;
  return ((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) === 'endpoint';
};

/**
 * Callback to handle creation of PackagePolicies in Fleet
 */
const getPackagePolicyCreateCallback = (logger, manifestManager, securitySolutionRequestContextFactory, alerts, licenseService, exceptionsClient) => {
  return async (newPackagePolicy, context, request) => {
    var _newPackagePolicy$inp, _newPackagePolicy$inp2, _newPackagePolicy$inp3;
    // We only care about Endpoint package policies
    if (!isEndpointPackagePolicy(newPackagePolicy)) {
      return newPackagePolicy;
    }

    // Optional endpoint integration configuration
    let endpointIntegrationConfig;

    // Check if has endpoint integration configuration input
    const integrationConfigInput = newPackagePolicy === null || newPackagePolicy === void 0 ? void 0 : (_newPackagePolicy$inp = newPackagePolicy.inputs) === null || _newPackagePolicy$inp === void 0 ? void 0 : (_newPackagePolicy$inp2 = _newPackagePolicy$inp.find(input => input.type === _constants.ENDPOINT_INTEGRATION_CONFIG_KEY)) === null || _newPackagePolicy$inp2 === void 0 ? void 0 : (_newPackagePolicy$inp3 = _newPackagePolicy$inp2.config) === null || _newPackagePolicy$inp3 === void 0 ? void 0 : _newPackagePolicy$inp3._config;
    if (integrationConfigInput !== null && integrationConfigInput !== void 0 && integrationConfigInput.value) {
      // The cast below is needed in order to ensure proper typing for the
      // Elastic Defend integration configuration
      endpointIntegrationConfig = integrationConfigInput.value;

      // Validate that the Elastic Defend integration config is valid
      (0, _validate_integration_config.validateIntegrationConfig)(endpointIntegrationConfig, logger);
    }

    // In this callback we are handling an HTTP request to the fleet plugin. Since we use
    // code from the security_solution plugin to handle it (installPrepackagedRules),
    // we need to build the context that is native to security_solution and pass it there.
    const securitySolutionContext = await securitySolutionRequestContextFactory.create(context, request);

    // perform these operations in parallel in order to help in not delaying the API response too much
    const [, manifestValue] = await Promise.all([
    // Install Detection Engine prepackaged rules
    exceptionsClient && (0, _install_prepackaged_rules.installPrepackagedRules)({
      logger,
      context: securitySolutionContext,
      request,
      alerts,
      exceptionsClient
    }),
    // create the Artifact Manifest for this policy
    (0, _create_policy_artifact_manifest.createPolicyArtifactManifest)(logger, manifestManager)]);

    // Add the default endpoint security policy
    const defaultPolicyValue = (0, _create_default_policy.createDefaultPolicy)(licenseService, endpointIntegrationConfig);
    return {
      // We cast the type here so that any changes to the Endpoint
      // specific data follow the types/schema expected
      ...newPackagePolicy,
      inputs: [{
        type: 'endpoint',
        enabled: true,
        streams: [],
        config: {
          integration_config: endpointIntegrationConfig ? {
            value: endpointIntegrationConfig
          } : {},
          artifact_manifest: {
            value: manifestValue
          },
          policy: {
            value: defaultPolicyValue
          }
        }
      }]
    };
  };
};
exports.getPackagePolicyCreateCallback = getPackagePolicyCreateCallback;
const getPackagePolicyUpdateCallback = (logger, licenseService, featureUsageService, endpointMetadataService) => {
  return async newPackagePolicy => {
    var _newPackagePolicy$inp4, _newPackagePolicy$inp5;
    if (!isEndpointPackagePolicy(newPackagePolicy)) {
      return newPackagePolicy;
    }

    // Validate that Endpoint Security policy is valid against current license
    (0, _validate_policy_against_license.validatePolicyAgainstLicense)( // The cast below is needed in order to ensure proper typing for
    // the policy configuration specific for endpoint
    (_newPackagePolicy$inp4 = newPackagePolicy.inputs[0].config) === null || _newPackagePolicy$inp4 === void 0 ? void 0 : (_newPackagePolicy$inp5 = _newPackagePolicy$inp4.policy) === null || _newPackagePolicy$inp5 === void 0 ? void 0 : _newPackagePolicy$inp5.value, licenseService, logger);
    (0, _notify_protection_feature_usage.notifyProtectionFeatureUsage)(newPackagePolicy, featureUsageService, endpointMetadataService);
    return newPackagePolicy;
  };
};
exports.getPackagePolicyUpdateCallback = getPackagePolicyUpdateCallback;
const getPackagePolicyPostCreateCallback = (logger, exceptionsClient) => {
  return async packagePolicy => {
    var _packagePolicy$inputs, _integrationConfig$va;
    // We only care about Endpoint package policies
    if (!exceptionsClient || !isEndpointPackagePolicy(packagePolicy)) {
      return packagePolicy;
    }
    const integrationConfig = packagePolicy === null || packagePolicy === void 0 ? void 0 : (_packagePolicy$inputs = packagePolicy.inputs[0].config) === null || _packagePolicy$inputs === void 0 ? void 0 : _packagePolicy$inputs.integration_config;
    if (integrationConfig && (integrationConfig === null || integrationConfig === void 0 ? void 0 : (_integrationConfig$va = integrationConfig.value) === null || _integrationConfig$va === void 0 ? void 0 : _integrationConfig$va.eventFilters) !== undefined) {
      (0, _create_event_filters.createEventFilters)(logger, exceptionsClient, integrationConfig.value.eventFilters, packagePolicy);
    }
    return packagePolicy;
  };
};
exports.getPackagePolicyPostCreateCallback = getPackagePolicyPostCreateCallback;
const getPackagePolicyDeleteCallback = exceptionsClient => {
  return async deletePackagePolicy => {
    if (!exceptionsClient) {
      return;
    }
    const policiesToRemove = [];
    for (const policy of deletePackagePolicy) {
      if (isEndpointPackagePolicy(policy)) {
        policiesToRemove.push((0, _remove_policy_from_artifacts.removePolicyFromArtifacts)(exceptionsClient, policy));
      }
    }
    await Promise.all(policiesToRemove);
  };
};
exports.getPackagePolicyDeleteCallback = getPackagePolicyDeleteCallback;