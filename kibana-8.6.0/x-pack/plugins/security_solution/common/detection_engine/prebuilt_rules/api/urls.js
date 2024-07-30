"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PREBUILT_RULES_URL = exports.PREBUILT_RULES_STATUS_URL = void 0;
var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PREBUILT_RULES_URL = `${_constants.DETECTION_ENGINE_RULES_URL}/prepackaged`;
exports.PREBUILT_RULES_URL = PREBUILT_RULES_URL;
const PREBUILT_RULES_STATUS_URL = `${_constants.DETECTION_ENGINE_RULES_URL}/prepackaged/_status`;
exports.PREBUILT_RULES_STATUS_URL = PREBUILT_RULES_STATUS_URL;