"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logViewSavedObjectType = exports.logViewSavedObjectName = void 0;
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const logViewSavedObjectName = 'infrastructure-monitoring-log-view';
exports.logViewSavedObjectName = logViewSavedObjectName;
const getLogViewTitle = savedObject => (0, _pipeable.pipe)(_types.logViewSavedObjectRT.decode(savedObject), (0, _Either.fold)(() => `Log view [id=${savedObject.id}]`, ({
  attributes: {
    name
  }
}) => name));
const logViewSavedObjectType = {
  name: logViewSavedObjectName,
  hidden: false,
  namespaceType: 'multiple-isolated',
  management: {
    defaultSearchField: 'name',
    displayName: 'log view',
    getTitle: getLogViewTitle,
    icon: 'logsApp',
    importableAndExportable: true
  },
  mappings: {
    dynamic: false,
    properties: {
      name: {
        type: 'text'
      }
    }
  },
  migrations: {}
};
exports.logViewSavedObjectType = logViewSavedObjectType;