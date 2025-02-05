"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLogViewRoutes = void 0;
var _get_log_view = require("./get_log_view");
var _put_log_view = require("./put_log_view");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initLogViewRoutes = dependencies => {
  (0, _get_log_view.initGetLogViewRoute)(dependencies);
  (0, _put_log_view.initPutLogViewRoute)(dependencies);
};
exports.initLogViewRoutes = initLogViewRoutes;