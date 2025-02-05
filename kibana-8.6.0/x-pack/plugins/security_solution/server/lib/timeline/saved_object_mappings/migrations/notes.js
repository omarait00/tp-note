"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notesMigrations = void 0;
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const notesMigrations = {
  '7.16.0': _utils.migrateTimelineIdToReferences
};
exports.notesMigrations = notesMigrations;