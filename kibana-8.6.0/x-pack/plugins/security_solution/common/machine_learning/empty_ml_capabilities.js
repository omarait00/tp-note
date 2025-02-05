"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emptyMlCapabilities = void 0;
var _common = require("../../../ml/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const emptyMlCapabilities = {
  capabilities: (0, _common.getDefaultMlCapabilities)(),
  isPlatinumOrTrialLicense: false,
  mlFeatureEnabledInSpace: false,
  upgradeInProgress: false
};
exports.emptyMlCapabilities = emptyMlCapabilities;