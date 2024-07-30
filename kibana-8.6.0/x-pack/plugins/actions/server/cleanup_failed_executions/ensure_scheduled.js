"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureScheduled = ensureScheduled;
var _server = require("../../../task_manager/server");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function ensureScheduled(taskManager, logger, {
  cleanupInterval
}) {
  try {
    await taskManager.ensureScheduled({
      id: _constants.TASK_ID,
      taskType: _constants.TASK_TYPE,
      schedule: {
        interval: (0, _server.asInterval)(cleanupInterval.asMilliseconds())
      },
      state: {
        runs: 0,
        total_cleaned_up: 0
      },
      params: {}
    });
  } catch (e) {
    logger.error(`Error scheduling ${_constants.TASK_ID}, received ${e.message}`);
  }
}