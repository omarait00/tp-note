"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteStoredScriptBodySchema = exports.deleteStoredScript = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteStoredScriptBodySchema = _configSchema.schema.object({
  id: _configSchema.schema.string({
    minLength: 1
  })
});
exports.deleteStoredScriptBodySchema = deleteStoredScriptBodySchema;
const deleteStoredScript = async ({
  client,
  options
}) => {
  await client.asCurrentUser.deleteScript(options);
};
exports.deleteStoredScript = deleteStoredScript;