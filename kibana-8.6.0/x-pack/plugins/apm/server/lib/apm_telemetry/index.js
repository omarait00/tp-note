"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APM_TELEMETRY_TASK_NAME = void 0;
exports.createApmTelemetry = createApmTelemetry;
var _server = require("../../../../../../src/core/server");
var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");
var _get_internal_saved_objects_client = require("../helpers/get_internal_saved_objects_client");
var _collect_data_telemetry = require("./collect_data_telemetry");
var _schema = require("./schema");
var _get_apm_indices = require("../../routes/settings/apm_indices/get_apm_indices");
var _telemetry_client = require("./telemetry_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const APM_TELEMETRY_TASK_NAME = 'apm-telemetry-task';
exports.APM_TELEMETRY_TASK_NAME = APM_TELEMETRY_TASK_NAME;
async function createApmTelemetry({
  core,
  config,
  usageCollector,
  taskManager,
  logger,
  kibanaVersion,
  isProd
}) {
  taskManager.registerTaskDefinitions({
    [APM_TELEMETRY_TASK_NAME]: {
      title: 'Collect APM usage',
      createTaskRunner: () => {
        return {
          run: async () => {
            await collectAndStore();
          },
          cancel: async () => {}
        };
      }
    }
  });
  const savedObjectsClient = await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core);
  const indices = await (0, _get_apm_indices.getApmIndices)({
    config,
    savedObjectsClient
  });
  const telemetryClient = await (0, _telemetry_client.getTelemetryClient)({
    core
  });
  const collectAndStore = async () => {
    const dataTelemetry = await (0, _collect_data_telemetry.collectDataTelemetry)({
      indices,
      telemetryClient,
      logger,
      savedObjectsClient,
      isProd
    });
    await savedObjectsClient.create(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, {
      ...dataTelemetry,
      kibanaVersion
    }, {
      id: _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE,
      overwrite: true
    });
  };
  const collector = usageCollector.makeUsageCollector({
    type: 'apm',
    schema: _schema.apmSchema,
    fetch: async () => {
      try {
        const {
          kibanaVersion: storedKibanaVersion,
          ...data
        } = (await savedObjectsClient.get(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_ID)).attributes;
        return data;
      } catch (err) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
          // task has not run yet, so no saved object to return
          return {};
        }
        throw err;
      }
    },
    isReady: () => true
  });
  usageCollector.registerCollector(collector);
  core.getStartServices().then(async ([_coreStart, pluginsStart]) => {
    const {
      taskManager: taskManagerStart
    } = pluginsStart;
    taskManagerStart.ensureScheduled({
      id: APM_TELEMETRY_TASK_NAME,
      taskType: APM_TELEMETRY_TASK_NAME,
      schedule: {
        interval: '720m'
      },
      scope: ['apm'],
      params: {},
      state: {}
    });
    try {
      const currentData = (await savedObjectsClient.get(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_ID)).attributes;
      if (currentData.kibanaVersion !== kibanaVersion) {
        logger.debug(`Stored telemetry is out of date. Task will run immediately. Stored: ${currentData.kibanaVersion}, expected: ${kibanaVersion}`);
        await taskManagerStart.runSoon(APM_TELEMETRY_TASK_NAME);
      }
    } catch (err) {
      if (!_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        logger.warn('Failed to fetch saved telemetry data.');
      }
    }
  });
}