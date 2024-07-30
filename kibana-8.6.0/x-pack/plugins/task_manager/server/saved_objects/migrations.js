"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations = getMigrations;
var _server = require("../../../../../src/core/server");
var _task_type_dictionary = require("../task_type_dictionary");
var _task = require("../task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getMigrations() {
  return {
    '7.4.0': executeMigrationWithErrorHandling(doc => ({
      ...doc,
      updated_at: new Date().toISOString()
    }), '7.4.0'),
    '7.6.0': executeMigrationWithErrorHandling(moveIntervalIntoSchedule, '7.6.0'),
    '8.0.0': executeMigrationWithErrorHandling(pipeMigrations(alertingTaskLegacyIdToSavedObjectIds, actionsTasksLegacyIdToSavedObjectIds), '8.0.0'),
    '8.2.0': executeMigrationWithErrorHandling(pipeMigrations(resetAttemptsAndStatusForTheTasksWithoutSchedule, resetUnrecognizedStatus), '8.2.0'),
    '8.5.0': executeMigrationWithErrorHandling(pipeMigrations(addEnabledField), '8.5.0')
  };
}
function executeMigrationWithErrorHandling(migrationFunc, version) {
  return (doc, context) => {
    try {
      return migrationFunc(doc, context);
    } catch (ex) {
      context.log.error(`savedObject ${version} migration failed for task instance ${doc.id} with error: ${ex.message}`, {
        migrations: {
          taskInstanceDocument: doc
        }
      });
      throw ex;
    }
  };
}
function alertingTaskLegacyIdToSavedObjectIds(doc) {
  if (doc.attributes.taskType.startsWith('alerting:')) {
    let params = {};
    params = JSON.parse(doc.attributes.params);
    if (params.alertId && params.spaceId && params.spaceId !== 'default') {
      const newId = _server.SavedObjectsUtils.getConvertedObjectId(params.spaceId, 'alert', params.alertId);
      return {
        ...doc,
        attributes: {
          ...doc.attributes,
          params: JSON.stringify({
            ...params,
            alertId: newId
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          })
        }
      };
    }
  }

  return doc;
}
function actionsTasksLegacyIdToSavedObjectIds(doc) {
  if (doc.attributes.taskType.startsWith('actions:')) {
    let params = {};
    params = JSON.parse(doc.attributes.params);
    if (params.actionTaskParamsId && params.spaceId && params.spaceId !== 'default') {
      const newId = _server.SavedObjectsUtils.getConvertedObjectId(params.spaceId, 'action_task_params', params.actionTaskParamsId);
      return {
        ...doc,
        attributes: {
          ...doc.attributes,
          params: JSON.stringify({
            ...params,
            actionTaskParamsId: newId
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          })
        }
      };
    }
  }

  return doc;
}
function moveIntervalIntoSchedule({
  attributes: {
    interval,
    ...attributes
  },
  ...doc
}) {
  return {
    ...doc,
    attributes: {
      ...attributes,
      ...(interval ? {
        schedule: {
          interval
        }
      } : {})
    }
  };
}
function resetUnrecognizedStatus(doc) {
  var _doc$attributes;
  const status = doc === null || doc === void 0 ? void 0 : (_doc$attributes = doc.attributes) === null || _doc$attributes === void 0 ? void 0 : _doc$attributes.status;
  if (status && status === 'unrecognized') {
    const taskType = doc.attributes.taskType;
    // If task type is in the REMOVED_TYPES list, maintain "unrecognized" status
    if (_task_type_dictionary.REMOVED_TYPES.indexOf(taskType) >= 0) {
      return doc;
    }
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        status: 'idle'
      }
    };
  }
  return doc;
}
function pipeMigrations(...migrations) {
  return doc => migrations.reduce((migratedDoc, nextMigration) => nextMigration(migratedDoc), doc);
}
function resetAttemptsAndStatusForTheTasksWithoutSchedule(doc) {
  if (doc.attributes.taskType.startsWith('alerting:')) {
    var _doc$attributes$sched;
    if (!((_doc$attributes$sched = doc.attributes.schedule) !== null && _doc$attributes$sched !== void 0 && _doc$attributes$sched.interval) && (doc.attributes.status === _task.TaskStatus.Failed || doc.attributes.status === _task.TaskStatus.Running)) {
      return {
        ...doc,
        attributes: {
          ...doc.attributes,
          attempts: 0,
          status: _task.TaskStatus.Idle
        }
      };
    }
  }
  return doc;
}
function addEnabledField(doc) {
  if (doc.attributes.status === _task.TaskStatus.Failed || doc.attributes.status === _task.TaskStatus.Unrecognized) {
    return doc;
  }
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      enabled: true
    }
  };
}