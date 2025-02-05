"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTrace = startTrace;
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function startTrace(name, category) {
  const span = _elasticApmNode.default.startSpan(name, category);
  return () => {
    if (span) span.end();
  };
}