"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAlertType = void 0;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isAlertType = partialAlert => {
  const ruleTypeValues = Object.values(_securitysolutionRules.ruleTypeMappings);
  return ruleTypeValues.includes(partialAlert.alertTypeId);
};
exports.isAlertType = isAlertType;