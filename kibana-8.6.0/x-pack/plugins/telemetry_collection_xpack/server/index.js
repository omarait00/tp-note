"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

function plugin() {
  return new _plugin.TelemetryCollectionXpackPlugin();
}