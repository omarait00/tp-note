"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NATIVE_CONNECTOR_ICONS = void 0;
var _mongodb = _interopRequireDefault(require("./mongodb.svg"));
var _mysql = _interopRequireDefault(require("./mysql.svg"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NATIVE_CONNECTOR_ICONS = {
  mongodb: _mongodb.default,
  mysql: _mysql.default
};
exports.NATIVE_CONNECTOR_ICONS = NATIVE_CONNECTOR_ICONS;