"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// By default, hide any guided onboarding UI. Change it with guidedOnboarding.ui:true in kibana.dev.yml
const configSchema = _configSchema.schema.object({
  ui: _configSchema.schema.boolean({
    defaultValue: false
  })
});
const config = {
  // define which config properties should be available in the client side plugin
  exposeToBrowser: {
    ui: true
  },
  schema: configSchema
};
exports.config = config;