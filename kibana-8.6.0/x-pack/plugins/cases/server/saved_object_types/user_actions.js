"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCaseUserActionSavedObjectType = void 0;
var _constants = require("../../common/constants");
var _user_actions = require("./migrations/user_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCaseUserActionSavedObjectType = migrationDeps => ({
  name: _constants.CASE_USER_ACTION_SAVED_OBJECT,
  hidden: true,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    properties: {
      action: {
        type: 'keyword'
      },
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          email: {
            type: 'keyword'
          },
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          profile_uid: {
            type: 'keyword'
          }
        }
      },
      payload: {
        dynamic: false,
        properties: {
          connector: {
            properties: {
              // connector.type
              type: {
                type: 'keyword'
              }
            }
          }
        }
      },
      owner: {
        type: 'keyword'
      },
      // The type of the action
      type: {
        type: 'keyword'
      }
    }
  },
  migrations: () => (0, _user_actions.createUserActionsMigrations)(migrationDeps),
  management: {
    importableAndExportable: true,
    visibleInManagement: false
  }
});
exports.createCaseUserActionSavedObjectType = createCaseUserActionSavedObjectType;