"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INTERVAL_STRING_RE = exports.GTE_INTERVAL_RE = void 0;
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const GTE_INTERVAL_RE = new RegExp(`^>=([\\d\\.]+\\s*(${_datemath.default.units.join('|')}))$`);
exports.GTE_INTERVAL_RE = GTE_INTERVAL_RE;
const INTERVAL_STRING_RE = new RegExp(`^([\\d\\.]+)\\s*(${_datemath.default.units.join('|')})$`);
exports.INTERVAL_STRING_RE = INTERVAL_STRING_RE;