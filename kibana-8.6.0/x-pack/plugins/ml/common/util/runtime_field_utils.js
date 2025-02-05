"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRuntimeField = isRuntimeField;
exports.isRuntimeMappings = isRuntimeMappings;
var _common = require("../../../../../src/plugins/data/common");
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isRuntimeField(arg) {
  return ((0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['type']) && Object.keys(arg).length === 1 || (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['type', 'script']) && (
  // Can be a string
  typeof arg.script === 'string' ||
  // Can be InlineScript
  (0, _mlIsPopulatedObject.isPopulatedObject)(arg.script, ['source']) && typeof arg.script.source === 'string' ||
  // Can be StoredScriptId
  (0, _mlIsPopulatedObject.isPopulatedObject)(arg.script, ['id']) && typeof arg.script.id === 'string')) && _common.RUNTIME_FIELD_TYPES.includes(arg.type);
}
function isRuntimeMappings(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg) && Object.values(arg).every(d => isRuntimeField(d));
}