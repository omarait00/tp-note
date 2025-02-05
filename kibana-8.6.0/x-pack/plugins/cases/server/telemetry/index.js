"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCasesTelemetry = void 0;
Object.defineProperty(exports, "scheduleCasesTelemetryTask", {
  enumerable: true,
  get: function () {
    return _schedule_telemetry_task.scheduleCasesTelemetryTask;
  }
});
var _server = require("../../../../../src/core/server");
var _collect_telemetry_data = require("./collect_telemetry_data");
var _constants = require("../../common/constants");
var _schema = require("./schema");
var _schedule_telemetry_task = require("./schedule_telemetry_task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCasesTelemetry = async ({
  core,
  taskManager,
  usageCollection,
  logger
}) => {
  const getInternalSavedObjectClient = async () => {
    const [coreStart] = await core.getStartServices();
    return coreStart.savedObjects.createInternalRepository(_constants.SAVED_OBJECT_TYPES);
  };
  taskManager.registerTaskDefinitions({
    [_constants.CASES_TELEMETRY_TASK_NAME]: {
      title: 'Collect Cases telemetry data',
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
  const collectAndStore = async () => {
    const savedObjectsClient = await getInternalSavedObjectClient();
    const telemetryData = await (0, _collect_telemetry_data.collectTelemetryData)({
      savedObjectsClient,
      logger
    });
    await savedObjectsClient.create(_constants.CASE_TELEMETRY_SAVED_OBJECT, telemetryData, {
      id: _constants.CASE_TELEMETRY_SAVED_OBJECT_ID,
      overwrite: true
    });
  };
  const collector = usageCollection.makeUsageCollector({
    type: 'cases',
    schema: _schema.casesSchema,
    isReady: () => true,
    fetch: async () => {
      try {
        const savedObjectsClient = await getInternalSavedObjectClient();
        const data = (await savedObjectsClient.get(_constants.CASE_TELEMETRY_SAVED_OBJECT, _constants.CASE_TELEMETRY_SAVED_OBJECT_ID)).attributes;
        return data;
      } catch (err) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
          // task has not run yet, so no saved object to return
          return {};
        }
        throw err;
      }
    }
  });
  usageCollection.registerCollector(collector);
};
exports.createCasesTelemetry = createCasesTelemetry;