"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceGroupQuery = serviceGroupQuery;
var _server = require("../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function serviceGroupQuery(serviceGroup) {
  return serviceGroup ? (0, _server.kqlQuery)(serviceGroup === null || serviceGroup === void 0 ? void 0 : serviceGroup.kuery) : [];
}