"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_INSTALLED_INTEGRATIONS_URL = void 0;
var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GET_INSTALLED_INTEGRATIONS_URL = `${_constants.INTERNAL_DETECTION_ENGINE_URL}/fleet/integrations/installed`;
exports.GET_INSTALLED_INTEGRATIONS_URL = GET_INSTALLED_INTEGRATIONS_URL;