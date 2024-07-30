"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateEndpointAuthz = void 0;
exports.calculatePermissionsFromCapabilities = calculatePermissionsFromCapabilities;
exports.calculatePermissionsFromPrivileges = calculatePermissionsFromPrivileges;
exports.defaultEndpointPermissions = defaultEndpointPermissions;
exports.getEndpointAuthzInitialState = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defaultEndpointPermissions() {
  return {
    canWriteSecuritySolution: false,
    canReadSecuritySolution: false
  };
}
function hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, privilege) {
  var _fleetAuthz$packagePr, _fleetAuthz$packagePr2, _fleetAuthz$packagePr3;
  // user is superuser, always return true
  if (hasEndpointManagementAccess) {
    return true;
  }

  // not superuser and FF not enabled, no access
  if (!isEndpointRbacEnabled) {
    return false;
  }

  // FF enabled, access based on privileges
  return (_fleetAuthz$packagePr = (_fleetAuthz$packagePr2 = fleetAuthz.packagePrivileges) === null || _fleetAuthz$packagePr2 === void 0 ? void 0 : (_fleetAuthz$packagePr3 = _fleetAuthz$packagePr2.endpoint) === null || _fleetAuthz$packagePr3 === void 0 ? void 0 : _fleetAuthz$packagePr3.actions[privilege].executePackageAction) !== null && _fleetAuthz$packagePr !== void 0 ? _fleetAuthz$packagePr : false;
}

/**
 * Used by both the server and the UI to generate the Authorization for access to Endpoint related
 * functionality
 *
 * @param licenseService
 * @param fleetAuthz
 * @param userRoles
 */

// eslint-disable-next-line complexity
const calculateEndpointAuthz = (licenseService, fleetAuthz, userRoles, isEndpointRbacEnabled = false, permissions = defaultEndpointPermissions()) => {
  var _fleetAuthz$fleet$all;
  const isPlatinumPlusLicense = licenseService.isPlatinumPlus();
  const isEnterpriseLicense = licenseService.isEnterprise();
  const hasEndpointManagementAccess = userRoles.includes('superuser');
  const {
    canWriteSecuritySolution = false,
    canReadSecuritySolution = false
  } = permissions;
  const canWriteEndpointList = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeEndpointList');
  const canReadEndpointList = canWriteEndpointList || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readEndpointList');
  const canWritePolicyManagement = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writePolicyManagement');
  const canReadPolicyManagement = canWritePolicyManagement || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readPolicyManagement');
  const canWriteActionsLogManagement = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeActionsLogManagement');
  const canReadActionsLogManagement = canWriteActionsLogManagement || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readActionsLogManagement');
  const canIsolateHost = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeHostIsolation');
  const canWriteProcessOperations = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeProcessOperations');
  const canWriteTrustedApplications = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeTrustedApplications');
  const canReadTrustedApplications = canWriteTrustedApplications || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readTrustedApplications');
  const canWriteHostIsolationExceptions = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeHostIsolationExceptions');
  const canReadHostIsolationExceptions = canWriteHostIsolationExceptions || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readHostIsolationExceptions');
  const canWriteBlocklist = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeBlocklist');
  const canReadBlocklist = canWriteBlocklist || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readBlocklist');
  const canWriteEventFilters = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeEventFilters');
  const canReadEventFilters = canWriteEventFilters || hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'readEventFilters');
  const canWriteFileOperations = hasPermission(fleetAuthz, isEndpointRbacEnabled, hasEndpointManagementAccess, 'writeFileOperations');
  return {
    canWriteSecuritySolution,
    canReadSecuritySolution,
    canAccessFleet: (_fleetAuthz$fleet$all = fleetAuthz === null || fleetAuthz === void 0 ? void 0 : fleetAuthz.fleet.all) !== null && _fleetAuthz$fleet$all !== void 0 ? _fleetAuthz$fleet$all : userRoles.includes('superuser'),
    canAccessEndpointManagement: hasEndpointManagementAccess,
    canCreateArtifactsByPolicy: hasEndpointManagementAccess && isPlatinumPlusLicense,
    canWriteEndpointList,
    canReadEndpointList,
    canWritePolicyManagement,
    canReadPolicyManagement,
    canWriteActionsLogManagement,
    canReadActionsLogManagement: canReadActionsLogManagement && isEnterpriseLicense,
    canAccessEndpointActionsLogManagement: canReadActionsLogManagement && isPlatinumPlusLicense,
    // Response Actions
    canIsolateHost: canIsolateHost && isPlatinumPlusLicense,
    canUnIsolateHost: canIsolateHost,
    canKillProcess: canWriteProcessOperations && isEnterpriseLicense,
    canSuspendProcess: canWriteProcessOperations && isEnterpriseLicense,
    canGetRunningProcesses: canWriteProcessOperations && isEnterpriseLicense,
    canAccessResponseConsole: isEnterpriseLicense && (canIsolateHost || canWriteProcessOperations || canWriteFileOperations),
    canWriteFileOperations: canWriteFileOperations && isEnterpriseLicense,
    // artifacts
    canWriteTrustedApplications,
    canReadTrustedApplications,
    canWriteHostIsolationExceptions: canWriteHostIsolationExceptions && isPlatinumPlusLicense,
    canReadHostIsolationExceptions,
    canWriteBlocklist,
    canReadBlocklist,
    canWriteEventFilters,
    canReadEventFilters
  };
};
exports.calculateEndpointAuthz = calculateEndpointAuthz;
const getEndpointAuthzInitialState = () => {
  return {
    ...defaultEndpointPermissions(),
    canAccessFleet: false,
    canAccessEndpointActionsLogManagement: false,
    canAccessEndpointManagement: false,
    canCreateArtifactsByPolicy: false,
    canWriteEndpointList: false,
    canReadEndpointList: false,
    canWritePolicyManagement: false,
    canReadPolicyManagement: false,
    canWriteActionsLogManagement: false,
    canReadActionsLogManagement: false,
    canIsolateHost: false,
    canUnIsolateHost: true,
    canKillProcess: false,
    canSuspendProcess: false,
    canGetRunningProcesses: false,
    canAccessResponseConsole: false,
    canWriteFileOperations: false,
    canWriteTrustedApplications: false,
    canReadTrustedApplications: false,
    canWriteHostIsolationExceptions: false,
    canReadHostIsolationExceptions: false,
    canWriteBlocklist: false,
    canReadBlocklist: false,
    canWriteEventFilters: false,
    canReadEventFilters: false
  };
};
exports.getEndpointAuthzInitialState = getEndpointAuthzInitialState;
const SIEM_PERMISSIONS = [{
  permission: 'canWriteSecuritySolution',
  privilege: 'crud'
}, {
  permission: 'canReadSecuritySolution',
  privilege: 'show'
}];
function hasPrivilege(kibanaPrivileges, prefix, searchPrivilege) {
  const privilege = kibanaPrivileges.find(p => p.privilege.endsWith(`${prefix}${searchPrivilege}`));
  return (privilege === null || privilege === void 0 ? void 0 : privilege.authorized) || false;
}
function calculatePermissionsFromPrivileges(kibanaPrivileges) {
  if (!kibanaPrivileges || !kibanaPrivileges.length) {
    return defaultEndpointPermissions();
  }
  const siemPermissions = SIEM_PERMISSIONS.reduce((acc, {
    permission,
    privilege
  }) => {
    return {
      ...acc,
      [permission]: hasPrivilege(kibanaPrivileges, 'siem/', privilege)
    };
  }, {});
  return {
    ...siemPermissions
  };
}
function calculatePermissionsFromCapabilities(capabilities) {
  if (!capabilities || !capabilities.siem) {
    return defaultEndpointPermissions();
  }
  return SIEM_PERMISSIONS.reduce((acc, {
    permission,
    privilege
  }) => {
    return {
      ...acc,
      [permission]: capabilities.siem[privilege] || false
    };
  }, {});
}