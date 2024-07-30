"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldAsString = getFieldAsString;
exports.supportedSchemas = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This structure defines the preset supported schemas for a resolver graph. We'll probably want convert this
 * implementation to something similar to how row renderers is implemented.
 */
const supportedSchemas = [{
  name: 'endpoint',
  constraints: [{
    field: 'agent.type',
    value: 'endpoint'
  }],
  schema: {
    id: 'process.entity_id',
    parent: 'process.parent.entity_id',
    ancestry: 'process.Ext.ancestry',
    name: 'process.name'
  }
}, {
  name: 'winlogbeat',
  constraints: [{
    field: 'agent.type',
    value: 'winlogbeat'
  }, {
    field: 'event.module',
    value: 'sysmon'
  }],
  schema: {
    id: 'process.entity_id',
    parent: 'process.parent.entity_id',
    name: 'process.name'
  }
}];
exports.supportedSchemas = supportedSchemas;
function getFieldAsString(doc, field) {
  const value = _lodash.default.get(doc, field);
  if (value === undefined) {
    return undefined;
  }
  return String(value);
}