"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAuthz = void 0;
exports.calculatePackagePrivilegesFromCapabilities = calculatePackagePrivilegesFromCapabilities;
exports.calculatePackagePrivilegesFromKibanaPrivileges = calculatePackagePrivilegesFromKibanaPrivileges;
var _coreApplicationCommon = require("@kbn/core-application-common");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const calculateAuthz = ({
  fleet,
  integrations,
  isSuperuser
}) => ({
  fleet: {
    all: fleet.all && (integrations.all || integrations.read),
    // These are currently used by Fleet Server setup
    setup: fleet.all || fleet.setup,
    readEnrollmentTokens: fleet.all || fleet.setup,
    readAgentPolicies: fleet.all || fleet.setup
  },
  integrations: {
    readPackageInfo: fleet.all || fleet.setup || integrations.all || integrations.read,
    readInstalledPackages: integrations.all || integrations.read,
    installPackages: fleet.all && integrations.all,
    upgradePackages: fleet.all && integrations.all,
    removePackages: fleet.all && integrations.all,
    uploadPackages: isSuperuser,
    readPackageSettings: fleet.all && integrations.all,
    writePackageSettings: fleet.all && integrations.all,
    readIntegrationPolicies: fleet.all && (integrations.all || integrations.read),
    writeIntegrationPolicies: fleet.all && integrations.all
  }
});
exports.calculateAuthz = calculateAuthz;
function calculatePackagePrivilegesFromCapabilities(capabilities) {
  if (!capabilities) {
    return {};
  }
  const endpointActions = _constants.ENDPOINT_PRIVILEGES.reduce((acc, privilege) => {
    return {
      ...acc,
      [privilege]: {
        executePackageAction: capabilities.siem[privilege] || false
      }
    };
  }, {});
  return {
    endpoint: {
      actions: endpointActions
    }
  };
}
function getAuthorizationFromPrivileges(kibanaPrivileges, searchPrivilege) {
  const privilege = kibanaPrivileges.find(p => p.privilege.endsWith(`${_coreApplicationCommon.DEFAULT_APP_CATEGORIES.security.id}-${searchPrivilege}`));
  return (privilege === null || privilege === void 0 ? void 0 : privilege.authorized) || false;
}
function calculatePackagePrivilegesFromKibanaPrivileges(kibanaPrivileges) {
  if (!kibanaPrivileges || !kibanaPrivileges.length) {
    return {};
  }
  const endpointActions = _constants.ENDPOINT_PRIVILEGES.reduce((acc, privilege) => {
    const kibanaPrivilege = getAuthorizationFromPrivileges(kibanaPrivileges, privilege);
    return {
      ...acc,
      [privilege]: {
        executePackageAction: kibanaPrivilege
      }
    };
  }, {});
  return {
    endpoint: {
      actions: endpointActions
    }
  };
}