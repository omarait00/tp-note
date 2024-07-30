"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.TYPE = exports.CheckDeletedFilesTask = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../task_manager/server");
var _elasticsearch = require("@elastic/elasticsearch");
var _files = require("../services/files");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TYPE = 'fleet:check-deleted-files-task';
exports.TYPE = TYPE;
const VERSION = '1.0.0';
exports.VERSION = VERSION;
const TITLE = 'Fleet Deleted Files Periodic Tasks';
const TIMEOUT = '2m';
const SCOPE = ['fleet'];
const INTERVAL = '1d';
class CheckDeletedFilesTask {
  constructor(setupContract) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "wasStarted", false);
    (0, _defineProperty2.default)(this, "abortController", new AbortController());
    (0, _defineProperty2.default)(this, "start", async ({
      taskManager
    }) => {
      if (!taskManager) {
        this.logger.error('missing required service during start');
        return;
      }
      this.wasStarted = true;
      try {
        await taskManager.ensureScheduled({
          id: this.taskId,
          taskType: TYPE,
          scope: SCOPE,
          schedule: {
            interval: INTERVAL
          },
          state: {},
          params: {
            version: VERSION
          }
        });
      } catch (e) {
        this.logger.error(`Error scheduling task, received error: ${e}`);
      }
    });
    (0, _defineProperty2.default)(this, "runTask", async (taskInstance, core) => {
      if (!this.wasStarted) {
        this.logger.debug('[runTask()] Aborted. Task not started yet');
        return;
      }

      // Check that this task is current
      if (taskInstance.id !== this.taskId) {
        (0, _server.throwUnrecoverableError)(new Error('Outdated task version'));
      }
      const [{
        elasticsearch
      }] = await core.getStartServices();
      const esClient = elasticsearch.client.asInternalUser;
      try {
        const readyFiles = await (0, _files.getFilesByStatus)(esClient, this.abortController);
        if (!readyFiles.length) return;
        const {
          fileIdsByIndex: deletedFileIdsByIndex,
          allFileIds: allDeletedFileIds
        } = await (0, _files.fileIdsWithoutChunksByIndex)(esClient, this.abortController, readyFiles);
        if (!allDeletedFileIds.size) return;
        this.logger.info(`Attempting to update ${allDeletedFileIds.size} files to DELETED status`);
        this.logger.debug(`Attempting to file ids: ${deletedFileIdsByIndex}`);
        const updatedFilesResponses = await (0, _files.updateFilesStatus)(esClient, this.abortController, deletedFileIdsByIndex, 'DELETED');
        const failures = updatedFilesResponses.flatMap(updatedFilesResponse => updatedFilesResponse.failures);
        if (failures !== null && failures !== void 0 && failures.length) {
          this.logger.warn(`Failed to update ${failures.length} files to DELETED status`);
          this.logger.debug(`Failed to update files to DELETED status: ${failures}`);
        }
      } catch (err) {
        if (err instanceof _elasticsearch.errors.RequestAbortedError) {
          this.logger.warn(`request aborted due to timeout: ${err}`);
          return;
        }
        this.logger.error(err);
      }
    });
    const {
      core: _core,
      taskManager: _taskManager,
      logFactory
    } = setupContract;
    this.logger = logFactory.get(this.taskId);
    _taskManager.registerTaskDefinitions({
      [TYPE]: {
        title: TITLE,
        timeout: TIMEOUT,
        createTaskRunner: ({
          taskInstance
        }) => {
          return {
            run: async () => {
              return this.runTask(taskInstance, _core);
            },
            cancel: async () => {
              this.abortController.abort('task timed out');
            }
          };
        }
      }
    });
  }
  get taskId() {
    return `${TYPE}:${VERSION}`;
  }
}
exports.CheckDeletedFilesTask = CheckDeletedFilesTask;