"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorName = getErrorName;
var _i18n = require("../../../common/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getErrorName({
  error
}) {
  var _error$log, _error$exception, _error$exception$;
  return (error === null || error === void 0 ? void 0 : (_error$log = error.log) === null || _error$log === void 0 ? void 0 : _error$log.message) || (error === null || error === void 0 ? void 0 : (_error$exception = error.exception) === null || _error$exception === void 0 ? void 0 : (_error$exception$ = _error$exception[0]) === null || _error$exception$ === void 0 ? void 0 : _error$exception$.message) || _i18n.NOT_AVAILABLE_LABEL;
}