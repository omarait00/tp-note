"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestApmPackage = getLatestApmPackage;
var _get_cloud_apm_package_policy = require("./get_cloud_apm_package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getLatestApmPackage({
  fleetPluginStart,
  request
}) {
  var _firstTemplate$inputs;
  const packageClient = fleetPluginStart.packageService.asScoped(request);
  const {
    name,
    version
  } = await packageClient.fetchFindLatestPackage(_get_cloud_apm_package_policy.APM_PACKAGE_NAME);
  const registryPackage = await packageClient.getPackage(name, version);
  const {
    title,
    policy_templates: policyTemplates
  } = registryPackage.packageInfo;
  const firstTemplate = policyTemplates === null || policyTemplates === void 0 ? void 0 : policyTemplates[0];
  const policyTemplateInputVars = firstTemplate && 'inputs' in firstTemplate ? ((_firstTemplate$inputs = firstTemplate.inputs) === null || _firstTemplate$inputs === void 0 ? void 0 : _firstTemplate$inputs[0].vars) || [] : [];
  return {
    package: {
      name,
      version,
      title
    },
    policyTemplateInputVars
  };
}