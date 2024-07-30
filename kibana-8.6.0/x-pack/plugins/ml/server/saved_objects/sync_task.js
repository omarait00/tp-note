"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsSyncService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _util = require("./util");
var _service = require("./service");
var _sync = require("./sync");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SAVED_OBJECTS_SYNC_TASK_TYPE = 'ML:saved-objects-sync';
const SAVED_OBJECTS_SYNC_TASK_ID = 'ML:saved-objects-sync-task';
const SAVED_OBJECTS_SYNC_INTERVAL_DEFAULT = '1h';
class SavedObjectsSyncService {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "core", null);
    (0, _defineProperty2.default)(this, "log", void 0);
    this.log = createLocalLogger(logger, `Task ${SAVED_OBJECTS_SYNC_TASK_ID}: `);
  }
  registerSyncTask(taskManager, security, spacesEnabled, isMlReady) {
    taskManager.registerTaskDefinitions({
      [SAVED_OBJECTS_SYNC_TASK_TYPE]: {
        title: 'ML saved objet sync',
        description: "This task periodically syncs ML's saved objects",
        timeout: '1m',
        maxAttempts: 3,
        createTaskRunner: ({
          taskInstance
        }) => {
          return {
            run: async () => {
              var _state$runs, _state$totalSavedObje;
              await isMlReady();
              const core = this.core;
              const {
                state
              } = taskInstance;
              if (core === null || security === null || spacesEnabled === null) {
                const error = 'dependencies not initialized';
                this.log.error(error);
                throw new Error(error);
              }
              const client = core.elasticsearch.client;
              const {
                getInternalSavedObjectsClient
              } = (0, _util.savedObjectClientsFactory)(() => core.savedObjects);
              const savedObjectsClient = getInternalSavedObjectsClient();
              if (savedObjectsClient === null) {
                const error = 'Internal saved object client not initialized';
                this.log.error(error);
                throw new Error(error);
              }
              const mlSavedObjectService = (0, _service.mlSavedObjectServiceFactory)(savedObjectsClient, savedObjectsClient, spacesEnabled, security === null || security === void 0 ? void 0 : security.authz, client, isMlReady);
              const {
                initSavedObjects
              } = (0, _sync.syncSavedObjectsFactory)(client, mlSavedObjectService);
              const {
                jobs,
                trainedModels
              } = await initSavedObjects(false);
              const count = jobs.length + trainedModels.length;
              this.log.info(count ? `${count} ML saved object${count > 1 ? 's' : ''} synced` : 'No ML saved objects in need of synchronization');
              return {
                state: {
                  runs: ((_state$runs = state.runs) !== null && _state$runs !== void 0 ? _state$runs : 0) + 1,
                  totalSavedObjectsSynced: ((_state$totalSavedObje = state.totalSavedObjectsSynced) !== null && _state$totalSavedObje !== void 0 ? _state$totalSavedObje : 0) + count
                }
              };
            },
            cancel: async () => {
              this.log.warn('timed out');
            }
          };
        }
      }
    });
  }
  async scheduleSyncTask(taskManager, core) {
    this.core = core;
    try {
      var _taskInstance$schedul;
      await taskManager.removeIfExists(SAVED_OBJECTS_SYNC_TASK_ID);
      const taskInstance = await taskManager.ensureScheduled({
        id: SAVED_OBJECTS_SYNC_TASK_ID,
        taskType: SAVED_OBJECTS_SYNC_TASK_TYPE,
        schedule: {
          interval: SAVED_OBJECTS_SYNC_INTERVAL_DEFAULT
        },
        params: {},
        state: {
          runs: 0,
          totalSavedObjectsSynced: 0
        },
        scope: ['ml']
      });
      this.log.info(`scheduled with interval ${(_taskInstance$schedul = taskInstance.schedule) === null || _taskInstance$schedul === void 0 ? void 0 : _taskInstance$schedul.interval}`);
      return taskInstance;
    } catch (e) {
      var _e$message;
      this.log.error(`Error running task: ${SAVED_OBJECTS_SYNC_TASK_ID}, `, (_e$message = e === null || e === void 0 ? void 0 : e.message) !== null && _e$message !== void 0 ? _e$message : e);
      return null;
    }
  }
}
exports.SavedObjectsSyncService = SavedObjectsSyncService;
function createLocalLogger(logger, preText) {
  return {
    info: text => logger.info(`${preText}${text}`),
    warn: text => logger.warn(`${preText}${text}`),
    error: (text, e) => logger.error(`${preText}${text} ${e !== null && e !== void 0 ? e : ''}`)
  };
}