"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;
var _mappings = _interopRequireDefault(require("./mappings.json"));
var _migrations = require("./migrations");
var _oldest_idle_action_task = require("../queries/oldest_idle_action_task");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setupSavedObjects(savedObjects, config) {
  savedObjects.registerType({
    name: 'task',
    namespaceType: 'agnostic',
    hidden: true,
    convertToAliasScript: `ctx._id = ctx._source.type + ':' + ctx._id; ctx._source.remove("kibana")`,
    mappings: _mappings.default.task,
    migrations: (0, _migrations.getMigrations)(),
    indexPattern: _constants.TASK_MANAGER_INDEX,
    excludeOnUpgrade: async ({
      readonlyEsClient
    }) => {
      const oldestNeededActionParams = await (0, _oldest_idle_action_task.getOldestIdleActionTask)(readonlyEsClient, _constants.TASK_MANAGER_INDEX);

      // Delete all action tasks that have failed and are no longer needed
      return {
        bool: {
          must: [{
            terms: {
              'task.taskType': ['actions:.email', 'actions:.index', 'actions:.pagerduty', 'actions:.swimlane', 'actions:.server-log', 'actions:.slack', 'actions:.webhook', 'actions:.servicenow', 'actions:.servicenow-sir', 'actions:.jira', 'actions:.resilient', 'actions:.teams']
            }
          }, {
            term: {
              type: 'task'
            }
          }, {
            term: {
              'task.status': 'failed'
            }
          }, {
            range: {
              'task.runAt': {
                // Only apply to tasks that were run before the oldest needed action
                lt: oldestNeededActionParams
              }
            }
          }]
        }
      };
    }
  });
}