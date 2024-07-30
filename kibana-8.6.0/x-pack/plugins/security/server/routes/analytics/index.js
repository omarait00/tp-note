"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAnalyticsRoutes = defineAnalyticsRoutes;
var _authentication_type = require("./authentication_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineAnalyticsRoutes(params) {
  (0, _authentication_type.defineRecordAnalyticsOnAuthTypeRoutes)(params);
}