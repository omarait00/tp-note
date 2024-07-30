"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_VARIABLES = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DEFAULT_VARIABLES = [{
  id: _uuid.default.v4(),
  name: 'exampleVariable1',
  value: '_search'
}, {
  id: _uuid.default.v4(),
  name: 'exampleVariable2',
  value: 'match_all'
}];
exports.DEFAULT_VARIABLES = DEFAULT_VARIABLES;