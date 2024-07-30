"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;
var _existing_fields = require("./existing_fields");
var _field_stats = require("./field_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function defineRoutes(setup, logger) {
  (0, _field_stats.initFieldStatsRoute)(setup);
  (0, _existing_fields.existingFieldsRoute)(setup, logger);
}