"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUICapabilities = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Return the UI capabilities for each type of operation. These strings must match the values defined in the UI
 * here: x-pack/plugins/cases/public/client/helpers/capabilities.ts
 */
const createUICapabilities = () => ({
  all: [_constants.CREATE_CASES_CAPABILITY, _constants.READ_CASES_CAPABILITY, _constants.UPDATE_CASES_CAPABILITY, _constants.PUSH_CASES_CAPABILITY],
  read: [_constants.READ_CASES_CAPABILITY],
  delete: [_constants.DELETE_CASES_CAPABILITY]
});
exports.createUICapabilities = createUICapabilities;