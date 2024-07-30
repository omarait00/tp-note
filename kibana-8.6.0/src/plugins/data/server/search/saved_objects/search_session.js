"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSessionSavedObjectType = void 0;
var _common = require("../../../common");
var _search_session_migration = require("./search_session_migration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const searchSessionSavedObjectType = {
  name: _common.SEARCH_SESSION_TYPE,
  namespaceType: 'single',
  hidden: true,
  mappings: {
    properties: {
      sessionId: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      created: {
        type: 'date'
      },
      expires: {
        type: 'date'
      },
      appId: {
        type: 'keyword'
      },
      locatorId: {
        type: 'keyword'
      },
      initialState: {
        type: 'object',
        enabled: false
      },
      restoreState: {
        type: 'object',
        enabled: false
      },
      idMapping: {
        type: 'object',
        enabled: false
      },
      realmType: {
        type: 'keyword'
      },
      realmName: {
        type: 'keyword'
      },
      username: {
        type: 'keyword'
      },
      version: {
        type: 'keyword'
      },
      isCanceled: {
        type: 'boolean'
      }
    }
  },
  migrations: _search_session_migration.searchSessionSavedObjectMigrations
};
exports.searchSessionSavedObjectType = searchSessionSavedObjectType;