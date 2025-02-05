"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsIndex = exports.serviceApiKeyPrivileges = exports.getSyntheticsEnablement = exports.getAPIKeyForSyntheticsService = exports.generateAndSaveServiceAPIKey = exports.generateAPIKey = exports.SyntheticsForbiddenError = void 0;
var _constants = require("../../../security/common/constants");
var _service_api_key = require("../legacy_uptime/lib/saved_objects/service_api_key");
var _check_has_privilege = require("./authentication/check_has_privilege");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const syntheticsIndex = 'synthetics-*';
exports.syntheticsIndex = syntheticsIndex;
const serviceApiKeyPrivileges = {
  cluster: ['monitor', 'read_ilm', 'read_pipeline'],
  indices: [{
    names: [syntheticsIndex],
    privileges: ['view_index_metadata', 'create_doc', 'auto_configure', 'read']
  }],
  run_as: []
};
exports.serviceApiKeyPrivileges = serviceApiKeyPrivileges;
const getAPIKeyForSyntheticsService = async ({
  server
}) => {
  try {
    const apiKey = await _service_api_key.syntheticsServiceAPIKeySavedObject.get(server);
    if (apiKey) {
      const isValid = await server.security.authc.apiKeys.validate({
        id: apiKey.id,
        api_key: apiKey.apiKey
      });
      if (isValid) {
        const {
          index
        } = await (0, _check_has_privilege.checkHasPrivileges)(server, apiKey);
        const indexPermissions = index[syntheticsIndex];
        const hasPermissions = indexPermissions.auto_configure && indexPermissions.create_doc && indexPermissions.view_index_metadata;
        if (!hasPermissions) {
          return {
            isValid: false,
            apiKey
          };
        }
      } else {
        server.logger.info('Synthetics api is no longer valid');
      }
      return {
        apiKey,
        isValid
      };
    }
  } catch (err) {
    server.logger.error(err);
  }
  return {
    isValid: false
  };
};
exports.getAPIKeyForSyntheticsService = getAPIKeyForSyntheticsService;
const generateAPIKey = async ({
  server,
  request,
  uptimePrivileges = false
}) => {
  var _security$authc$apiKe, _security$authc$apiKe3;
  const {
    security
  } = server;
  const isApiKeysEnabled = await ((_security$authc$apiKe = security.authc.apiKeys) === null || _security$authc$apiKe === void 0 ? void 0 : _security$authc$apiKe.areAPIKeysEnabled());
  if (!isApiKeysEnabled) {
    throw new Error('Please enable API keys in kibana to use synthetics service.');
  }
  if (uptimePrivileges) {
    var _security$authc$apiKe2;
    return (_security$authc$apiKe2 = security.authc.apiKeys) === null || _security$authc$apiKe2 === void 0 ? void 0 : _security$authc$apiKe2.create(request, {
      name: 'synthetics-api-key (required for project monitors)',
      kibana_role_descriptors: {
        uptime_save: {
          elasticsearch: {},
          kibana: [{
            base: [],
            spaces: [_constants.ALL_SPACES_ID],
            feature: {
              uptime: ['all'],
              fleet: ['all'],
              fleetv2: ['all']
            }
          }]
        }
      },
      metadata: {
        description: 'Created for the Synthetics Agent to be able to communicate with Kibana for generating monitors for projects'
      }
    });
  }
  const {
    canEnable
  } = await hasEnablePermissions(server);
  if (!canEnable) {
    throw new SyntheticsForbiddenError();
  }
  return (_security$authc$apiKe3 = security.authc.apiKeys) === null || _security$authc$apiKe3 === void 0 ? void 0 : _security$authc$apiKe3.create(request, {
    name: 'synthetics-api-key (required for monitor management)',
    role_descriptors: {
      synthetics_writer: serviceApiKeyPrivileges
    },
    metadata: {
      description: 'Created for synthetics service to be passed to the heartbeat to communicate with ES'
    }
  });
};
exports.generateAPIKey = generateAPIKey;
const generateAndSaveServiceAPIKey = async ({
  server,
  request,
  authSavedObjectsClient
}) => {
  const apiKeyResult = await generateAPIKey({
    server,
    request
  });
  if (apiKeyResult) {
    const {
      id,
      name,
      api_key: apiKey
    } = apiKeyResult;
    const apiKeyObject = {
      id,
      name,
      apiKey
    };
    if (authSavedObjectsClient) {
      // discard decoded key and rest of the keys
      await _service_api_key.syntheticsServiceAPIKeySavedObject.set(authSavedObjectsClient, apiKeyObject);
    }
    return apiKeyObject;
  }
};
exports.generateAndSaveServiceAPIKey = generateAndSaveServiceAPIKey;
const getSyntheticsEnablement = async ({
  server
}) => {
  const {
    security
  } = server;
  const [apiKey, hasPrivileges, areApiKeysEnabled] = await Promise.all([getAPIKeyForSyntheticsService({
    server
  }), hasEnablePermissions(server), security.authc.apiKeys.areAPIKeysEnabled()]);
  const {
    canEnable,
    canManageApiKeys
  } = hasPrivileges;
  return {
    canEnable,
    canManageApiKeys,
    isEnabled: Boolean(apiKey === null || apiKey === void 0 ? void 0 : apiKey.apiKey),
    isValidApiKey: apiKey === null || apiKey === void 0 ? void 0 : apiKey.isValid,
    areApiKeysEnabled
  };
};
exports.getSyntheticsEnablement = getSyntheticsEnablement;
const hasEnablePermissions = async ({
  uptimeEsClient
}) => {
  var _hasPrivileges$index;
  const hasPrivileges = await uptimeEsClient.baseESClient.security.hasPrivileges({
    body: {
      cluster: ['manage_security', 'manage_api_key', 'manage_own_api_key', ...serviceApiKeyPrivileges.cluster],
      index: serviceApiKeyPrivileges.indices
    }
  });
  const {
    cluster
  } = hasPrivileges;
  const {
    manage_security: manageSecurity,
    manage_api_key: manageApiKey,
    manage_own_api_key: manageOwnApiKey,
    monitor,
    read_ilm: readILM,
    read_pipeline: readPipeline
  } = cluster || {};
  const canManageApiKeys = manageSecurity || manageApiKey || manageOwnApiKey;
  const hasClusterPermissions = readILM && readPipeline && monitor;
  const hasIndexPermissions = !Object.values(((_hasPrivileges$index = hasPrivileges.index) === null || _hasPrivileges$index === void 0 ? void 0 : _hasPrivileges$index['synthetics-*']) || []).includes(false);
  return {
    canManageApiKeys,
    canEnable: canManageApiKeys && hasClusterPermissions && hasIndexPermissions
  };
};
class SyntheticsForbiddenError extends Error {
  constructor() {
    super();
    this.message = 'Forbidden';
    this.name = 'SyntheticsForbiddenError';
  }
}
exports.SyntheticsForbiddenError = SyntheticsForbiddenError;