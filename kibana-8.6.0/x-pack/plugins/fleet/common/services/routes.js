"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRouteService = exports.settingsRoutesService = exports.packagePolicyRouteService = exports.outputRoutesService = exports.fleetSetupRouteService = exports.fleetServerHostsRoutesService = exports.epmRouteService = exports.enrollmentAPIKeyRouteService = exports.downloadSourceRoutesService = exports.dataStreamRouteService = exports.appRoutesService = exports.agentRouteService = exports.agentPolicyRouteService = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const epmRouteService = {
  getCategoriesPath: () => {
    return _constants.EPM_API_ROUTES.CATEGORIES_PATTERN;
  },
  getListPath: () => {
    return _constants.EPM_API_ROUTES.LIST_PATTERN;
  },
  getListLimitedPath: () => {
    return _constants.EPM_API_ROUTES.LIMITED_LIST_PATTERN;
  },
  getInfoPath: (pkgName, pkgVersion) => {
    if (pkgVersion) {
      return _constants.EPM_API_ROUTES.INFO_PATTERN.replace('{pkgName}', pkgName).replace('{pkgVersion}', pkgVersion);
    } else {
      return _constants.EPM_API_ROUTES.INFO_PATTERN.replace('{pkgName}', pkgName).replace('/{pkgVersion}', '');
    }
  },
  getStatsPath: pkgName => {
    return _constants.EPM_API_ROUTES.STATS_PATTERN.replace('{pkgName}', pkgName);
  },
  getFilePath: filePath => {
    return `${_constants.EPM_API_ROOT}${filePath.replace('/package', '/packages')}`;
  },
  getInstallPath: (pkgName, pkgVersion) => {
    return _constants.EPM_API_ROUTES.INSTALL_FROM_REGISTRY_PATTERN.replace('{pkgName}', pkgName).replace('{pkgVersion}', pkgVersion).replace(/\/$/, ''); // trim trailing slash
  },

  getBulkInstallPath: () => {
    return _constants.EPM_API_ROUTES.BULK_INSTALL_PATTERN;
  },
  getRemovePath: (pkgName, pkgVersion) => {
    return _constants.EPM_API_ROUTES.DELETE_PATTERN.replace('{pkgName}', pkgName).replace('{pkgVersion}', pkgVersion).replace(/\/$/, ''); // trim trailing slash
  },

  getUpdatePath: (pkgName, pkgVersion) => {
    return _constants.EPM_API_ROUTES.INFO_PATTERN.replace('{pkgName}', pkgName).replace('{pkgVersion}', pkgVersion);
  }
};
exports.epmRouteService = epmRouteService;
const packagePolicyRouteService = {
  getListPath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.LIST_PATTERN;
  },
  getInfoPath: packagePolicyId => {
    return _constants.PACKAGE_POLICY_API_ROUTES.INFO_PATTERN.replace('{packagePolicyId}', packagePolicyId);
  },
  getCreatePath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.CREATE_PATTERN;
  },
  getUpdatePath: packagePolicyId => {
    return _constants.PACKAGE_POLICY_API_ROUTES.UPDATE_PATTERN.replace('{packagePolicyId}', packagePolicyId);
  },
  getDeletePath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.DELETE_PATTERN;
  },
  getUpgradePath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.UPGRADE_PATTERN;
  },
  getDryRunPath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.DRYRUN_PATTERN;
  },
  getOrphanedIntegrationPoliciesPath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.ORPHANED_INTEGRATION_POLICIES;
  }
};
exports.packagePolicyRouteService = packagePolicyRouteService;
const agentPolicyRouteService = {
  getListPath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.LIST_PATTERN;
  },
  getBulkGetPath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.BULK_GET_PATTERN;
  },
  getInfoPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.INFO_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getCreatePath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.CREATE_PATTERN;
  },
  getUpdatePath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.UPDATE_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getCopyPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.COPY_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getDeletePath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.DELETE_PATTERN;
  },
  getInfoFullPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getInfoFullDownloadPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_DOWNLOAD_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getK8sInfoPath: () => {
    return _constants.K8S_API_ROUTES.K8S_INFO_PATTERN;
  },
  getK8sFullDownloadPath: () => {
    return _constants.K8S_API_ROUTES.K8S_DOWNLOAD_PATTERN;
  },
  getResetOnePreconfiguredAgentPolicyPath: agentPolicyId => {
    return _constants.PRECONFIGURATION_API_ROUTES.RESET_ONE_PATTERN.replace(`{agentPolicyId}`, agentPolicyId);
  },
  getResetAllPreconfiguredAgentPolicyPath: () => {
    return _constants.PRECONFIGURATION_API_ROUTES.RESET_PATTERN;
  }
};
exports.agentPolicyRouteService = agentPolicyRouteService;
const dataStreamRouteService = {
  getListPath: () => {
    return _constants.DATA_STREAM_API_ROUTES.LIST_PATTERN;
  }
};
exports.dataStreamRouteService = dataStreamRouteService;
const fleetSetupRouteService = {
  getFleetSetupPath: () => _constants.AGENTS_SETUP_API_ROUTES.INFO_PATTERN,
  postFleetSetupPath: () => _constants.AGENTS_SETUP_API_ROUTES.CREATE_PATTERN
};
exports.fleetSetupRouteService = fleetSetupRouteService;
const agentRouteService = {
  getInfoPath: agentId => _constants.AGENT_API_ROUTES.INFO_PATTERN.replace('{agentId}', agentId),
  getUpdatePath: agentId => _constants.AGENT_API_ROUTES.UPDATE_PATTERN.replace('{agentId}', agentId),
  getBulkUpdateTagsPath: () => _constants.AGENT_API_ROUTES.BULK_UPDATE_AGENT_TAGS_PATTERN,
  getUnenrollPath: agentId => _constants.AGENT_API_ROUTES.UNENROLL_PATTERN.replace('{agentId}', agentId),
  getBulkUnenrollPath: () => _constants.AGENT_API_ROUTES.BULK_UNENROLL_PATTERN,
  getReassignPath: agentId => _constants.AGENT_API_ROUTES.REASSIGN_PATTERN.replace('{agentId}', agentId),
  getBulkReassignPath: () => _constants.AGENT_API_ROUTES.BULK_REASSIGN_PATTERN,
  getUpgradePath: agentId => _constants.AGENT_API_ROUTES.UPGRADE_PATTERN.replace('{agentId}', agentId),
  getBulkUpgradePath: () => _constants.AGENT_API_ROUTES.BULK_UPGRADE_PATTERN,
  getActionStatusPath: () => _constants.AGENT_API_ROUTES.ACTION_STATUS_PATTERN,
  getCurrentUpgradesPath: () => _constants.AGENT_API_ROUTES.CURRENT_UPGRADES_PATTERN,
  getCancelActionPath: actionId => _constants.AGENT_API_ROUTES.CANCEL_ACTIONS_PATTERN.replace('{actionId}', actionId),
  getListPath: () => _constants.AGENT_API_ROUTES.LIST_PATTERN,
  getStatusPath: () => _constants.AGENT_API_ROUTES.STATUS_PATTERN,
  getIncomingDataPath: () => _constants.AGENT_API_ROUTES.DATA_PATTERN,
  getCreateActionPath: agentId => _constants.AGENT_API_ROUTES.ACTIONS_PATTERN.replace('{agentId}', agentId),
  getListTagsPath: () => _constants.AGENT_API_ROUTES.LIST_TAGS_PATTERN,
  getAvailableVersionsPath: () => _constants.AGENT_API_ROUTES.AVAILABLE_VERSIONS_PATTERN,
  getRequestDiagnosticsPath: agentId => _constants.AGENT_API_ROUTES.REQUEST_DIAGNOSTICS_PATTERN.replace('{agentId}', agentId),
  getBulkRequestDiagnosticsPath: () => _constants.AGENT_API_ROUTES.BULK_REQUEST_DIAGNOSTICS_PATTERN,
  getListAgentUploads: agentId => _constants.AGENT_API_ROUTES.LIST_UPLOADS_PATTERN.replace('{agentId}', agentId),
  getAgentFileDownloadLink: (fileId, fileName) => _constants.AGENT_API_ROUTES.GET_UPLOAD_FILE_PATTERN.replace('{fileId}', fileId).replace('{fileName}', fileName)
};
exports.agentRouteService = agentRouteService;
const outputRoutesService = {
  getInfoPath: outputId => _constants.OUTPUT_API_ROUTES.INFO_PATTERN.replace('{outputId}', outputId),
  getUpdatePath: outputId => _constants.OUTPUT_API_ROUTES.UPDATE_PATTERN.replace('{outputId}', outputId),
  getListPath: () => _constants.OUTPUT_API_ROUTES.LIST_PATTERN,
  getDeletePath: outputId => _constants.OUTPUT_API_ROUTES.DELETE_PATTERN.replace('{outputId}', outputId),
  getCreatePath: () => _constants.OUTPUT_API_ROUTES.CREATE_PATTERN,
  getCreateLogstashApiKeyPath: () => _constants.OUTPUT_API_ROUTES.LOGSTASH_API_KEY_PATTERN
};
exports.outputRoutesService = outputRoutesService;
const fleetServerHostsRoutesService = {
  getInfoPath: itemId => _constants.FLEET_SERVER_HOST_API_ROUTES.INFO_PATTERN.replace('{itemId}', itemId),
  getUpdatePath: itemId => _constants.FLEET_SERVER_HOST_API_ROUTES.UPDATE_PATTERN.replace('{itemId}', itemId),
  getListPath: () => _constants.FLEET_SERVER_HOST_API_ROUTES.LIST_PATTERN,
  getDeletePath: itemId => _constants.FLEET_SERVER_HOST_API_ROUTES.DELETE_PATTERN.replace('{itemId}', itemId),
  getCreatePath: () => _constants.FLEET_SERVER_HOST_API_ROUTES.CREATE_PATTERN
};
exports.fleetServerHostsRoutesService = fleetServerHostsRoutesService;
const settingsRoutesService = {
  getInfoPath: () => _constants.SETTINGS_API_ROUTES.INFO_PATTERN,
  getUpdatePath: () => _constants.SETTINGS_API_ROUTES.UPDATE_PATTERN
};
exports.settingsRoutesService = settingsRoutesService;
const appRoutesService = {
  getCheckPermissionsPath: fleetServerSetup => _constants.APP_API_ROUTES.CHECK_PERMISSIONS_PATTERN,
  getRegenerateServiceTokenPath: () => _constants.APP_API_ROUTES.GENERATE_SERVICE_TOKEN_PATTERN
};
exports.appRoutesService = appRoutesService;
const enrollmentAPIKeyRouteService = {
  getListPath: () => _constants.ENROLLMENT_API_KEY_ROUTES.LIST_PATTERN,
  getCreatePath: () => _constants.ENROLLMENT_API_KEY_ROUTES.CREATE_PATTERN,
  getInfoPath: keyId => _constants.ENROLLMENT_API_KEY_ROUTES.INFO_PATTERN.replace('{keyId}', keyId),
  getDeletePath: keyId => _constants.ENROLLMENT_API_KEY_ROUTES.DELETE_PATTERN.replace('{keyId}', keyId)
};
exports.enrollmentAPIKeyRouteService = enrollmentAPIKeyRouteService;
const setupRouteService = {
  getSetupPath: () => _constants.SETUP_API_ROUTE
};
exports.setupRouteService = setupRouteService;
const downloadSourceRoutesService = {
  getInfoPath: downloadSourceId => _constants.DOWNLOAD_SOURCE_API_ROUTES.INFO_PATTERN.replace('{sourceId}', downloadSourceId),
  getUpdatePath: downloadSourceId => _constants.DOWNLOAD_SOURCE_API_ROUTES.UPDATE_PATTERN.replace('{sourceId}', downloadSourceId),
  getListPath: () => _constants.DOWNLOAD_SOURCE_API_ROUTES.LIST_PATTERN,
  getDeletePath: downloadSourceId => _constants.DOWNLOAD_SOURCE_API_ROUTES.DELETE_PATTERN.replace('{sourceId}', downloadSourceId),
  getCreatePath: () => _constants.DOWNLOAD_SOURCE_API_ROUTES.CREATE_PATTERN
};
exports.downloadSourceRoutesService = downloadSourceRoutesService;