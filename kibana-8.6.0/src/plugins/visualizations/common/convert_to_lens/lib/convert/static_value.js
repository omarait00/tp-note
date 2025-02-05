"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStaticValueColumn = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createStaticValueColumn = value => ({
  operationType: 'static_value',
  columnId: (0, _uuid.default)(),
  isBucketed: false,
  isSplit: false,
  dataType: 'number',
  references: [],
  params: {
    value: value.toString()
  }
});
exports.createStaticValueColumn = createStaticValueColumn;