"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SETUP_API_ROUTE = exports.SETTINGS_API_ROUTES = exports.PRECONFIGURATION_API_ROUTES = exports.PACKAGE_POLICY_API_ROUTES = exports.PACKAGE_POLICY_API_ROOT = exports.OUTPUT_API_ROUTES = exports.LIMITED_CONCURRENCY_ROUTE_TAG = exports.K8S_API_ROUTES = exports.K8S_API_ROOT = exports.INTERNAL_ROOT = exports.INSTALL_SCRIPT_API_ROUTES = exports.FLEET_SERVER_HOST_API_ROUTES = exports.EPM_API_ROUTES = exports.EPM_API_ROOT = exports.ENROLLMENT_API_KEY_ROUTES = exports.DOWNLOAD_SOURCE_API_ROUTES = exports.DOWNLOAD_SOURCE_API_ROOT = exports.DATA_STREAM_API_ROUTES = exports.DATA_STREAM_API_ROOT = exports.APP_API_ROUTES = exports.API_ROOT = exports.AGENT_POLICY_API_ROUTES = exports.AGENT_POLICY_API_ROOT = exports.AGENT_API_ROUTES = exports.AGENTS_SETUP_API_ROUTES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Base API paths

const INTERNAL_ROOT = `/internal/fleet`;
exports.INTERNAL_ROOT = INTERNAL_ROOT;
const API_ROOT = `/api/fleet`;
exports.API_ROOT = API_ROOT;
const EPM_API_ROOT = `${API_ROOT}/epm`;
exports.EPM_API_ROOT = EPM_API_ROOT;
const DATA_STREAM_API_ROOT = `${API_ROOT}/data_streams`;
exports.DATA_STREAM_API_ROOT = DATA_STREAM_API_ROOT;
const PACKAGE_POLICY_API_ROOT = `${API_ROOT}/package_policies`;
exports.PACKAGE_POLICY_API_ROOT = PACKAGE_POLICY_API_ROOT;
const AGENT_POLICY_API_ROOT = `${API_ROOT}/agent_policies`;
exports.AGENT_POLICY_API_ROOT = AGENT_POLICY_API_ROOT;
const K8S_API_ROOT = `${API_ROOT}/kubernetes`;
exports.K8S_API_ROOT = K8S_API_ROOT;
const DOWNLOAD_SOURCE_API_ROOT = `${API_ROOT}/agent_download_sources`;
exports.DOWNLOAD_SOURCE_API_ROOT = DOWNLOAD_SOURCE_API_ROOT;
const LIMITED_CONCURRENCY_ROUTE_TAG = 'ingest:limited-concurrency';

// EPM API routes
exports.LIMITED_CONCURRENCY_ROUTE_TAG = LIMITED_CONCURRENCY_ROUTE_TAG;
const EPM_PACKAGES_MANY = `${EPM_API_ROOT}/packages`;
const EPM_PACKAGES_BULK = `${EPM_PACKAGES_MANY}/_bulk`;
const EPM_PACKAGES_ONE_DEPRECATED = `${EPM_PACKAGES_MANY}/{pkgkey}`;
const EPM_PACKAGES_ONE = `${EPM_PACKAGES_MANY}/{pkgName}/{pkgVersion}`;
const EPM_API_ROUTES = {
  BULK_INSTALL_PATTERN: EPM_PACKAGES_BULK,
  LIST_PATTERN: EPM_PACKAGES_MANY,
  LIMITED_LIST_PATTERN: `${EPM_PACKAGES_MANY}/limited`,
  INFO_PATTERN: EPM_PACKAGES_ONE,
  INSTALL_FROM_REGISTRY_PATTERN: EPM_PACKAGES_ONE,
  INSTALL_BY_UPLOAD_PATTERN: EPM_PACKAGES_MANY,
  DELETE_PATTERN: EPM_PACKAGES_ONE,
  FILEPATH_PATTERN: `${EPM_PACKAGES_ONE}/{filePath*}`,
  CATEGORIES_PATTERN: `${EPM_API_ROOT}/categories`,
  STATS_PATTERN: `${EPM_PACKAGES_MANY}/{pkgName}/stats`,
  INFO_PATTERN_DEPRECATED: EPM_PACKAGES_ONE_DEPRECATED,
  INSTALL_FROM_REGISTRY_PATTERN_DEPRECATED: EPM_PACKAGES_ONE_DEPRECATED,
  DELETE_PATTERN_DEPRECATED: EPM_PACKAGES_ONE_DEPRECATED
};

// Data stream API routes
exports.EPM_API_ROUTES = EPM_API_ROUTES;
const DATA_STREAM_API_ROUTES = {
  LIST_PATTERN: `${DATA_STREAM_API_ROOT}`
};

// Package policy API routes
exports.DATA_STREAM_API_ROUTES = DATA_STREAM_API_ROUTES;
const PACKAGE_POLICY_API_ROUTES = {
  LIST_PATTERN: `${PACKAGE_POLICY_API_ROOT}`,
  BULK_GET_PATTERN: `${PACKAGE_POLICY_API_ROOT}/_bulk_get`,
  INFO_PATTERN: `${PACKAGE_POLICY_API_ROOT}/{packagePolicyId}`,
  CREATE_PATTERN: `${PACKAGE_POLICY_API_ROOT}`,
  UPDATE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/{packagePolicyId}`,
  DELETE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/delete`,
  UPGRADE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/upgrade`,
  DRYRUN_PATTERN: `${PACKAGE_POLICY_API_ROOT}/upgrade/dryrun`,
  ORPHANED_INTEGRATION_POLICIES: `${INTERNAL_ROOT}/orphaned_integration_policies`
};

// Agent policy API routes
exports.PACKAGE_POLICY_API_ROUTES = PACKAGE_POLICY_API_ROUTES;
const AGENT_POLICY_API_ROUTES = {
  LIST_PATTERN: `${AGENT_POLICY_API_ROOT}`,
  BULK_GET_PATTERN: `${AGENT_POLICY_API_ROOT}/_bulk_get`,
  INFO_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}`,
  CREATE_PATTERN: `${AGENT_POLICY_API_ROOT}`,
  UPDATE_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}`,
  COPY_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}/copy`,
  DELETE_PATTERN: `${AGENT_POLICY_API_ROOT}/delete`,
  FULL_INFO_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}/full`,
  FULL_INFO_DOWNLOAD_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}/download`
};

// Kubernetes Manifest API routes
exports.AGENT_POLICY_API_ROUTES = AGENT_POLICY_API_ROUTES;
const K8S_API_ROUTES = {
  K8S_DOWNLOAD_PATTERN: `${K8S_API_ROOT}/download`,
  K8S_INFO_PATTERN: `${K8S_API_ROOT}`
};

// Output API routes
exports.K8S_API_ROUTES = K8S_API_ROUTES;
const OUTPUT_API_ROUTES = {
  LIST_PATTERN: `${API_ROOT}/outputs`,
  INFO_PATTERN: `${API_ROOT}/outputs/{outputId}`,
  UPDATE_PATTERN: `${API_ROOT}/outputs/{outputId}`,
  DELETE_PATTERN: `${API_ROOT}/outputs/{outputId}`,
  CREATE_PATTERN: `${API_ROOT}/outputs`,
  LOGSTASH_API_KEY_PATTERN: `${API_ROOT}/logstash_api_keys`
};

// Fleet server API routes
exports.OUTPUT_API_ROUTES = OUTPUT_API_ROUTES;
const FLEET_SERVER_HOST_API_ROUTES = {
  LIST_PATTERN: `${API_ROOT}/fleet_server_hosts`,
  CREATE_PATTERN: `${API_ROOT}/fleet_server_hosts`,
  INFO_PATTERN: `${API_ROOT}/fleet_server_hosts/{itemId}`,
  UPDATE_PATTERN: `${API_ROOT}/fleet_server_hosts/{itemId}`,
  DELETE_PATTERN: `${API_ROOT}/fleet_server_hosts/{itemId}`
};

// Settings API routes
exports.FLEET_SERVER_HOST_API_ROUTES = FLEET_SERVER_HOST_API_ROUTES;
const SETTINGS_API_ROUTES = {
  INFO_PATTERN: `${API_ROOT}/settings`,
  UPDATE_PATTERN: `${API_ROOT}/settings`
};

// App API routes
exports.SETTINGS_API_ROUTES = SETTINGS_API_ROUTES;
const APP_API_ROUTES = {
  HEALTH_CHECK_PATTERN: `${API_ROOT}/health_check`,
  CHECK_PERMISSIONS_PATTERN: `${API_ROOT}/check-permissions`,
  GENERATE_SERVICE_TOKEN_PATTERN: `${API_ROOT}/service_tokens`,
  // deprecated since 8.0
  GENERATE_SERVICE_TOKEN_PATTERN_DEPRECATED: `${API_ROOT}/service-tokens`
};

// Agent API routes
exports.APP_API_ROUTES = APP_API_ROUTES;
const AGENT_API_ROUTES = {
  LIST_PATTERN: `${API_ROOT}/agents`,
  INFO_PATTERN: `${API_ROOT}/agents/{agentId}`,
  UPDATE_PATTERN: `${API_ROOT}/agents/{agentId}`,
  BULK_UPDATE_AGENT_TAGS_PATTERN: `${API_ROOT}/agents/bulk_update_agent_tags`,
  DELETE_PATTERN: `${API_ROOT}/agents/{agentId}`,
  CHECKIN_PATTERN: `${API_ROOT}/agents/{agentId}/checkin`,
  ACKS_PATTERN: `${API_ROOT}/agents/{agentId}/acks`,
  ACTIONS_PATTERN: `${API_ROOT}/agents/{agentId}/actions`,
  CANCEL_ACTIONS_PATTERN: `${API_ROOT}/agents/actions/{actionId}/cancel`,
  UNENROLL_PATTERN: `${API_ROOT}/agents/{agentId}/unenroll`,
  BULK_UNENROLL_PATTERN: `${API_ROOT}/agents/bulk_unenroll`,
  REASSIGN_PATTERN: `${API_ROOT}/agents/{agentId}/reassign`,
  BULK_REASSIGN_PATTERN: `${API_ROOT}/agents/bulk_reassign`,
  REQUEST_DIAGNOSTICS_PATTERN: `${API_ROOT}/agents/{agentId}/request_diagnostics`,
  BULK_REQUEST_DIAGNOSTICS_PATTERN: `${API_ROOT}/agents/bulk_request_diagnostics`,
  AVAILABLE_VERSIONS_PATTERN: `${API_ROOT}/agents/available_versions`,
  STATUS_PATTERN: `${API_ROOT}/agent_status`,
  DATA_PATTERN: `${API_ROOT}/agent_status/data`,
  // deprecated since 8.0
  STATUS_PATTERN_DEPRECATED: `${API_ROOT}/agent-status`,
  UPGRADE_PATTERN: `${API_ROOT}/agents/{agentId}/upgrade`,
  BULK_UPGRADE_PATTERN: `${API_ROOT}/agents/bulk_upgrade`,
  CURRENT_UPGRADES_PATTERN: `${API_ROOT}/agents/current_upgrades`,
  ACTION_STATUS_PATTERN: `${API_ROOT}/agents/action_status`,
  LIST_TAGS_PATTERN: `${API_ROOT}/agents/tags`,
  LIST_UPLOADS_PATTERN: `${API_ROOT}/agents/{agentId}/uploads`,
  GET_UPLOAD_FILE_PATTERN: `${API_ROOT}/agents/files/{fileId}/{fileName}`
};
exports.AGENT_API_ROUTES = AGENT_API_ROUTES;
const ENROLLMENT_API_KEY_ROUTES = {
  CREATE_PATTERN: `${API_ROOT}/enrollment_api_keys`,
  LIST_PATTERN: `${API_ROOT}/enrollment_api_keys`,
  INFO_PATTERN: `${API_ROOT}/enrollment_api_keys/{keyId}`,
  DELETE_PATTERN: `${API_ROOT}/enrollment_api_keys/{keyId}`,
  // deprecated since 8.0
  CREATE_PATTERN_DEPRECATED: `${API_ROOT}/enrollment-api-keys`,
  LIST_PATTERN_DEPRECATED: `${API_ROOT}/enrollment-api-keys`,
  INFO_PATTERN_DEPRECATED: `${API_ROOT}/enrollment-api-keys/{keyId}`,
  DELETE_PATTERN_DEPRECATED: `${API_ROOT}/enrollment-api-keys/{keyId}`
};

// Agents setup API routes
exports.ENROLLMENT_API_KEY_ROUTES = ENROLLMENT_API_KEY_ROUTES;
const AGENTS_SETUP_API_ROUTES = {
  INFO_PATTERN: `${API_ROOT}/agents/setup`,
  CREATE_PATTERN: `${API_ROOT}/agents/setup`
};
exports.AGENTS_SETUP_API_ROUTES = AGENTS_SETUP_API_ROUTES;
const SETUP_API_ROUTE = `${API_ROOT}/setup`;
exports.SETUP_API_ROUTE = SETUP_API_ROUTE;
const INSTALL_SCRIPT_API_ROUTES = `${API_ROOT}/install/{osType}`;

// Policy preconfig API routes
exports.INSTALL_SCRIPT_API_ROUTES = INSTALL_SCRIPT_API_ROUTES;
const PRECONFIGURATION_API_ROUTES = {
  UPDATE_PATTERN: `${API_ROOT}/setup/preconfiguration`,
  RESET_PATTERN: `${INTERNAL_ROOT}/reset_preconfigured_agent_policies`,
  RESET_ONE_PATTERN: `${INTERNAL_ROOT}/reset_preconfigured_agent_policies/{agentPolicyId}`
};

// Agent download source routes
exports.PRECONFIGURATION_API_ROUTES = PRECONFIGURATION_API_ROUTES;
const DOWNLOAD_SOURCE_API_ROUTES = {
  LIST_PATTERN: `${API_ROOT}/agent_download_sources`,
  INFO_PATTERN: `${API_ROOT}/agent_download_sources/{sourceId}`,
  CREATE_PATTERN: `${API_ROOT}/agent_download_sources`,
  UPDATE_PATTERN: `${API_ROOT}/agent_download_sources/{sourceId}`,
  DELETE_PATTERN: `${API_ROOT}/agent_download_sources/{sourceId}`
};
exports.DOWNLOAD_SOURCE_API_ROUTES = DOWNLOAD_SOURCE_API_ROUTES;