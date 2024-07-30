"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.casesTelemetrySavedObjectType = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const casesTelemetrySavedObjectType = {
  name: _constants.CASE_TELEMETRY_SAVED_OBJECT,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {}
  }
};
exports.casesTelemetrySavedObjectType = casesTelemetrySavedObjectType;