"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFleetUsageLogger = registerFleetUsageLogger;
exports.startFleetUsageLogger = startFleetUsageLogger;
var _app_context = require("./app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TASK_ID = 'Fleet-Usage-Logger-Task';
const TASK_TYPE = 'Fleet-Usage-Logger';
async function registerFleetUsageLogger(taskManager, fetchUsage) {
  taskManager.registerTaskDefinitions({
    [TASK_TYPE]: {
      title: 'Fleet Usage Logger',
      timeout: '1m',
      maxAttempts: 1,
      createTaskRunner: ({
        taskInstance
      }) => {
        return {
          async run() {
            try {
              const usageData = await fetchUsage();
              if (_app_context.appContextService.getLogger().isLevelEnabled('debug')) {
                _app_context.appContextService.getLogger().debug(`Fleet Usage: ${JSON.stringify(usageData)}`);
              } else {
                _app_context.appContextService.getLogger().info(`Fleet Usage: ${JSON.stringify(usageData)}`);
              }
            } catch (error) {
              _app_context.appContextService.getLogger().error('Error occurred while fetching fleet usage: ' + error);
            }
          },
          async cancel() {}
        };
      }
    }
  });
}
async function startFleetUsageLogger(taskManager) {
  const isDebugLogLevelEnabled = _app_context.appContextService.getLogger().isLevelEnabled('debug');
  const isInfoLogLevelEnabled = _app_context.appContextService.getLogger().isLevelEnabled('info');
  if (!isInfoLogLevelEnabled) {
    return;
  }
  _app_context.appContextService.getLogger().info(`Task ${TASK_ID} scheduled with interval 5m`);
  await (taskManager === null || taskManager === void 0 ? void 0 : taskManager.ensureScheduled({
    id: TASK_ID,
    taskType: TASK_TYPE,
    schedule: {
      interval: isDebugLogLevelEnabled ? '5m' : '15m'
    },
    scope: ['fleet'],
    state: {},
    params: {}
  }));
}