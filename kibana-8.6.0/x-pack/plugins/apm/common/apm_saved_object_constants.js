"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APM_TELEMETRY_SAVED_OBJECT_TYPE = exports.APM_TELEMETRY_SAVED_OBJECT_ID = exports.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE = exports.APM_SERVER_SCHEMA_SAVED_OBJECT_ID = exports.APM_INDEX_SETTINGS_SAVED_OBJECT_TYPE = exports.APM_INDEX_SETTINGS_SAVED_OBJECT_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// the types have to match the names of the saved object mappings
// in /x-pack/plugins/apm/mappings.json

// APM index settings
const APM_INDEX_SETTINGS_SAVED_OBJECT_TYPE = 'apm-indices';
exports.APM_INDEX_SETTINGS_SAVED_OBJECT_TYPE = APM_INDEX_SETTINGS_SAVED_OBJECT_TYPE;
const APM_INDEX_SETTINGS_SAVED_OBJECT_ID = 'apm-indices';

// APM telemetry
exports.APM_INDEX_SETTINGS_SAVED_OBJECT_ID = APM_INDEX_SETTINGS_SAVED_OBJECT_ID;
const APM_TELEMETRY_SAVED_OBJECT_TYPE = 'apm-telemetry';
exports.APM_TELEMETRY_SAVED_OBJECT_TYPE = APM_TELEMETRY_SAVED_OBJECT_TYPE;
const APM_TELEMETRY_SAVED_OBJECT_ID = 'apm-telemetry';

// APM Server schema
exports.APM_TELEMETRY_SAVED_OBJECT_ID = APM_TELEMETRY_SAVED_OBJECT_ID;
const APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE = 'apm-server-schema';
exports.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE = APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE;
const APM_SERVER_SCHEMA_SAVED_OBJECT_ID = 'apm-server-schema';
exports.APM_SERVER_SCHEMA_SAVED_OBJECT_ID = APM_SERVER_SCHEMA_SAVED_OBJECT_ID;