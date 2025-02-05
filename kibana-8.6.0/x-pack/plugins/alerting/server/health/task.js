"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HEALTH_TASK_TYPE = exports.HEALTH_TASK_ID = void 0;
exports.healthCheckTaskRunner = healthCheckTaskRunner;
exports.initializeAlertingHealth = initializeAlertingHealth;
exports.scheduleAlertingHealthCheck = scheduleAlertingHealthCheck;
var _types = require("../types");
var _get_health = require("./get_health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HEALTH_TASK_TYPE = 'alerting_health_check';
exports.HEALTH_TASK_TYPE = HEALTH_TASK_TYPE;
const HEALTH_TASK_ID = `Alerting-${HEALTH_TASK_TYPE}`;
exports.HEALTH_TASK_ID = HEALTH_TASK_ID;
function initializeAlertingHealth(logger, taskManager, coreStartServices) {
  registerAlertingHealthCheckTask(logger, taskManager, coreStartServices);
}
async function scheduleAlertingHealthCheck(logger, config, taskManager) {
  try {
    const interval = config.healthCheck.interval;
    await taskManager.ensureScheduled({
      id: HEALTH_TASK_ID,
      taskType: HEALTH_TASK_TYPE,
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
function registerAlertingHealthCheckTask(logger, taskManager, coreStartServices) {
  taskManager.registerTaskDefinitions({
    [HEALTH_TASK_TYPE]: {
      title: 'Alerting framework health check task',
      createTaskRunner: healthCheckTaskRunner(logger, coreStartServices)
    }
  });
}
function healthCheckTaskRunner(logger, coreStartServices) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;
    return {
      async run() {
        try {
          return await (0, _get_health.getAlertingHealthStatus)((await coreStartServices)[0].savedObjects, state.runs);
        } catch (errMsg) {
          logger.warn(`Error executing alerting health check task: ${errMsg}`);
          return {
            state: {
              runs: (state.runs || 0) + 1,
              health_status: _types.HealthStatus.Error
            }
          };
        }
      }
    };
  };
}