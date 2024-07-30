"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstalledIntegrationSet = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createInstalledIntegrationSet = () => {
  const packageMap = new Map([]);
  const addPackagePolicy = policy => {
    const packageInfo = getPackageInfoFromPolicy(policy);
    const integrationsInfo = getIntegrationsInfoFromPolicy(policy, packageInfo);
    const packageKey = `${packageInfo.package_name}:${packageInfo.package_version}`;
    const existingPackageInfo = packageMap.get(packageKey);
    if (existingPackageInfo == null) {
      const integrationsMap = new Map();
      integrationsInfo.forEach(integration => {
        addIntegrationToMap(integrationsMap, integration);
      });
      packageMap.set(packageKey, {
        ...packageInfo,
        integrations: integrationsMap
      });
    } else {
      integrationsInfo.forEach(integration => {
        addIntegrationToMap(existingPackageInfo.integrations, integration);
      });
    }
  };
  const addRegistryPackage = registryPackage => {
    var _registryPackage$poli;
    const policyTemplates = (_registryPackage$poli = registryPackage.policy_templates) !== null && _registryPackage$poli !== void 0 ? _registryPackage$poli : [];
    const packageKey = `${registryPackage.name}:${registryPackage.version}`;
    const existingPackageInfo = packageMap.get(packageKey);
    if (existingPackageInfo != null) {
      for (const integration of existingPackageInfo.integrations.values()) {
        const policyTemplate = policyTemplates.find(t => t.name === integration.integration_name);
        if (policyTemplate != null) {
          integration.integration_title = policyTemplate.title;
        }
      }
    }
  };
  const getPackages = () => {
    const packages = Array.from(packageMap.values());
    return packages.map(packageInfo => {
      const integrations = Array.from(packageInfo.integrations.values());
      return {
        ...packageInfo,
        integrations
      };
    });
  };
  const getIntegrations = () => {
    const packages = Array.from(packageMap.values());
    return (0, _lodash.flatten)(packages.map(packageInfo => {
      const integrations = Array.from(packageInfo.integrations.values());
      return integrations.map(integrationInfo => {
        return packageInfo.package_name === integrationInfo.integration_name ? {
          package_name: packageInfo.package_name,
          package_title: packageInfo.package_title,
          package_version: packageInfo.package_version,
          is_enabled: integrationInfo.is_enabled
        } : {
          package_name: packageInfo.package_name,
          package_title: packageInfo.package_title,
          package_version: packageInfo.package_version,
          integration_name: integrationInfo.integration_name,
          integration_title: integrationInfo.integration_title,
          is_enabled: integrationInfo.is_enabled
        };
      });
    }));
  };
  return {
    addPackagePolicy,
    addRegistryPackage,
    getPackages,
    getIntegrations
  };
};
exports.createInstalledIntegrationSet = createInstalledIntegrationSet;
const getPackageInfoFromPolicy = policy => {
  var _policy$package, _policy$package2, _policy$package3;
  return {
    package_name: normalizeString((_policy$package = policy.package) === null || _policy$package === void 0 ? void 0 : _policy$package.name),
    package_title: normalizeString((_policy$package2 = policy.package) === null || _policy$package2 === void 0 ? void 0 : _policy$package2.title),
    package_version: normalizeString((_policy$package3 = policy.package) === null || _policy$package3 === void 0 ? void 0 : _policy$package3.version)
  };
};
const getIntegrationsInfoFromPolicy = (policy, packageInfo) => {
  return policy.inputs.map(input => {
    const integrationName = normalizeString(input.policy_template); // e.g. 'cloudtrail'
    const integrationTitle = `${packageInfo.package_title} ${(0, _lodash.capitalize)(integrationName)}`; // e.g. 'AWS Cloudtrail'
    return {
      integration_name: integrationName,
      integration_title: integrationTitle,
      // title gets re-initialized later in addRegistryPackage()
      is_enabled: input.enabled
    };
  });
};
const normalizeString = raw => {
  return (raw !== null && raw !== void 0 ? raw : '').trim();
};
const addIntegrationToMap = (map, integration) => {
  if (!map.has(integration.integration_name) || integration.is_enabled) {
    map.set(integration.integration_name, integration);
  }
};