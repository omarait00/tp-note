"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AlertingConnectorFeatureId", {
  enumerable: true,
  get: function () {
    return _connector_feature_config.AlertingConnectorFeatureId;
  }
});
Object.defineProperty(exports, "CasesConnectorFeatureId", {
  enumerable: true,
  get: function () {
    return _connector_feature_config.CasesConnectorFeatureId;
  }
});
exports.InvalidEmailReason = void 0;
Object.defineProperty(exports, "SecurityConnectorFeatureId", {
  enumerable: true,
  get: function () {
    return _connector_feature_config.SecurityConnectorFeatureId;
  }
});
Object.defineProperty(exports, "UptimeConnectorFeatureId", {
  enumerable: true,
  get: function () {
    return _connector_feature_config.UptimeConnectorFeatureId;
  }
});
exports.isActionTypeExecutorResult = isActionTypeExecutorResult;
var _connector_feature_config = require("./connector_feature_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let InvalidEmailReason;
exports.InvalidEmailReason = InvalidEmailReason;
(function (InvalidEmailReason) {
  InvalidEmailReason["invalid"] = "invalid";
  InvalidEmailReason["notAllowed"] = "notAllowed";
})(InvalidEmailReason || (exports.InvalidEmailReason = InvalidEmailReason = {}));
// the result returned from an action type executor function
const ActionTypeExecutorResultStatusValues = ['ok', 'error'];
function isActionTypeExecutorResult(result) {
  const unsafeResult = result;
  return unsafeResult && typeof (unsafeResult === null || unsafeResult === void 0 ? void 0 : unsafeResult.actionId) === 'string' && ActionTypeExecutorResultStatusValues.includes(unsafeResult === null || unsafeResult === void 0 ? void 0 : unsafeResult.status);
}