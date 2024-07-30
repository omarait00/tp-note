"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResultTestConfig = getResultTestConfig;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getResultTestConfig(config) {
  var _config$notStarted$en, _config$notStarted, _config$errorMessages, _config$errorMessages2;
  return {
    notStarted: {
      enabled: (_config$notStarted$en = config === null || config === void 0 ? void 0 : (_config$notStarted = config.notStarted) === null || _config$notStarted === void 0 ? void 0 : _config$notStarted.enabled) !== null && _config$notStarted$en !== void 0 ? _config$notStarted$en : true
    },
    errorMessages: {
      enabled: (_config$errorMessages = config === null || config === void 0 ? void 0 : (_config$errorMessages2 = config.errorMessages) === null || _config$errorMessages2 === void 0 ? void 0 : _config$errorMessages2.enabled) !== null && _config$errorMessages !== void 0 ? _config$errorMessages : true
    }
  };
}