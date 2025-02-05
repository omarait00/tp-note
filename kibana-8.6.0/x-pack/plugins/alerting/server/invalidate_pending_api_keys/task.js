"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TASK_ID = void 0;
exports.initializeApiKeyInvalidator = initializeApiKeyInvalidator;
exports.scheduleApiKeyInvalidatorTask = scheduleApiKeyInvalidatorTask;
var _get_cadence = require("../lib/get_cadence");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TASK_TYPE = 'alerts_invalidate_api_keys';
const TASK_ID = `Alerts-${TASK_TYPE}`;
exports.TASK_ID = TASK_ID;
const invalidateAPIKeys = async (params, securityPluginStart) => {
  if (!securityPluginStart) {
    return {
      apiKeysEnabled: false
    };
  }
  const invalidateAPIKeyResult = await securityPluginStart.authc.apiKeys.invalidateAsInternalUser(params);
  // Null when Elasticsearch security is disabled
  if (!invalidateAPIKeyResult) {
    return {
      apiKeysEnabled: false
    };
  }
  return {
    apiKeysEnabled: true,
    result: invalidateAPIKeyResult
  };
};
function initializeApiKeyInvalidator(logger, coreStartServices, taskManager, config) {
  registerApiKeyInvalidatorTaskDefinition(logger, coreStartServices, taskManager, config);
}
async function scheduleApiKeyInvalidatorTask(logger, config, taskManager) {
  const interval = config.invalidateApiKeysTask.interval;
  try {
    await taskManager.ensureScheduled({
      id: TASK_ID,
      taskType: TASK_TYPE,
      schedule: {
        interval
      },
      state: {},
      params: {}
    });
  } catch (e) {
    logger.debug(`Error scheduling task, received ${e.message}`);
  }
}
function registerApiKeyInvalidatorTaskDefinition(logger, coreStartServices, taskManager, config) {
  taskManager.registerTaskDefinitions({
    [TASK_TYPE]: {
      title: 'Invalidate alert API Keys',
      createTaskRunner: taskRunner(logger, coreStartServices, config)
    }
  });
}
function getFakeKibanaRequest(basePath) {
  const requestHeaders = {};
  return {
    headers: requestHeaders,
    getBasePath: () => basePath,
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    }
  };
}
function taskRunner(logger, coreStartServices, config) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;
    return {
      async run() {
        let totalInvalidated = 0;
        try {
          const [{
            savedObjects,
            http
          }, {
            encryptedSavedObjects,
            security
          }] = await coreStartServices;
          const savedObjectsClient = savedObjects.getScopedClient(getFakeKibanaRequest(http.basePath.serverBasePath), {
            includedHiddenTypes: ['api_key_pending_invalidation'],
            excludedWrappers: ['security']
          });
          const encryptedSavedObjectsClient = encryptedSavedObjects.getClient({
            includedHiddenTypes: ['api_key_pending_invalidation']
          });
          const configuredDelay = config.invalidateApiKeysTask.removalDelay;
          const delay = (0, _get_cadence.timePeriodBeforeDate)(new Date(), configuredDelay).toISOString();
          let hasApiKeysPendingInvalidation = true;
          const PAGE_SIZE = 100;
          do {
            const apiKeysToInvalidate = await savedObjectsClient.find({
              type: 'api_key_pending_invalidation',
              filter: `api_key_pending_invalidation.attributes.createdAt <= "${delay}"`,
              page: 1,
              sortField: 'createdAt',
              sortOrder: 'asc',
              perPage: PAGE_SIZE
            });
            totalInvalidated += await invalidateApiKeys(logger, savedObjectsClient, apiKeysToInvalidate, encryptedSavedObjectsClient, security);
            hasApiKeysPendingInvalidation = apiKeysToInvalidate.total > PAGE_SIZE;
          } while (hasApiKeysPendingInvalidation);
          return {
            state: {
              runs: (state.runs || 0) + 1,
              total_invalidated: totalInvalidated
            },
            schedule: {
              interval: config.invalidateApiKeysTask.interval
            }
          };
        } catch (e) {
          logger.warn(`Error executing alerting apiKey invalidation task: ${e.message}`);
          return {
            state: {
              runs: (state.runs || 0) + 1,
              total_invalidated: totalInvalidated
            },
            schedule: {
              interval: config.invalidateApiKeysTask.interval
            }
          };
        }
      }
    };
  };
}
async function invalidateApiKeys(logger, savedObjectsClient, apiKeysToInvalidate, encryptedSavedObjectsClient, securityPluginStart) {
  let totalInvalidated = 0;
  const apiKeyIds = await Promise.all(apiKeysToInvalidate.saved_objects.map(async apiKeyObj => {
    const decryptedApiKey = await encryptedSavedObjectsClient.getDecryptedAsInternalUser('api_key_pending_invalidation', apiKeyObj.id);
    return decryptedApiKey.attributes.apiKeyId;
  }));
  if (apiKeyIds.length > 0) {
    const response = await invalidateAPIKeys({
      ids: apiKeyIds
    }, securityPluginStart);
    if (response.apiKeysEnabled === true && response.result.error_count > 0) {
      logger.error(`Failed to invalidate API Keys [ids="${apiKeyIds.join(', ')}"]`);
    } else {
      await Promise.all(apiKeysToInvalidate.saved_objects.map(async apiKeyObj => {
        try {
          await savedObjectsClient.delete('api_key_pending_invalidation', apiKeyObj.id);
          totalInvalidated++;
        } catch (err) {
          logger.error(`Failed to delete invalidated API key "${apiKeyObj.attributes.apiKeyId}". Error: ${err.message}`);
        }
      }));
    }
  }
  logger.debug(`Total invalidated API keys "${totalInvalidated}"`);
  return totalInvalidated;
}