"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmPackagePolicyDefinition = getApmPackagePolicyDefinition;
var _jsYaml = _interopRequireDefault(require("js-yaml"));
var _fleet = require("../../../common/fleet");
var _get_latest_apm_package = require("./get_latest_apm_package");
var _translate_legacy_schema_paths = require("./translate_legacy_schema_paths");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getApmPackagePolicyDefinition({
  apmServerSchema,
  cloudPluginSetup,
  fleetPluginStart,
  request
}) {
  const latestApmPackage = await (0, _get_latest_apm_package.getLatestApmPackage)({
    fleetPluginStart,
    request
  });
  return {
    name: 'Elastic APM',
    namespace: 'default',
    enabled: true,
    policy_id: _fleet.POLICY_ELASTIC_AGENT_ON_CLOUD,
    inputs: [{
      type: 'apm',
      enabled: true,
      streams: [],
      vars: getApmPackageInputVars({
        policyTemplateInputVars: latestApmPackage.policyTemplateInputVars,
        apmServerSchema: (0, _translate_legacy_schema_paths.translateLegacySchemaPaths)(apmServerSchema),
        cloudPluginSetup
      })
    }],
    package: {
      name: latestApmPackage.package.name,
      version: latestApmPackage.package.version,
      title: latestApmPackage.package.title
    }
  };
}
function getApmPackageInputVars({
  policyTemplateInputVars,
  apmServerSchema,
  cloudPluginSetup
}) {
  var _cloudPluginSetup$apm;
  const overrideValues = {
    url: cloudPluginSetup === null || cloudPluginSetup === void 0 ? void 0 : (_cloudPluginSetup$apm = cloudPluginSetup.apm) === null || _cloudPluginSetup$apm === void 0 ? void 0 : _cloudPluginSetup$apm.url,
    // overrides 'apm-server.url' to be the cloud APM host
    rum_allow_origins: ensureValidMultiText(apmServerSchema[_fleet.INPUT_VAR_NAME_TO_SCHEMA_PATH.rum_allow_origins]) // fixes issue where "*" needs to be wrapped in quotes to be parsed as a YAML string
  };

  return policyTemplateInputVars.reduce((acc, registryVarsEntry) => {
    var _ref, _ref2, _overrideValues$name;
    const {
      name,
      type,
      default: defaultValue
    } = registryVarsEntry;
    return {
      ...acc,
      [name]: {
        type,
        value: (_ref = (_ref2 = (_overrideValues$name = overrideValues[name]) !== null && _overrideValues$name !== void 0 ? _overrideValues$name : apmServerSchema[_fleet.INPUT_VAR_NAME_TO_SCHEMA_PATH[name]]) !== null && _ref2 !== void 0 ? _ref2 : defaultValue) !== null && _ref !== void 0 ? _ref : ''
      }
    };
  }, {});
}
function ensureValidMultiText(textMultiValue) {
  if (!textMultiValue) {
    return undefined;
  }
  return textMultiValue.map(escapeInvalidYamlString);
}
function escapeInvalidYamlString(yamlString) {
  try {
    _jsYaml.default.load(yamlString);
  } catch (error) {
    if (error instanceof _jsYaml.default.YAMLException) {
      return `"${yamlString}"`;
    }
  }
  return yamlString;
}