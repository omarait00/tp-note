"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_CONVERTER_COLOR = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DEFAULT_CONVERTER_COLOR = {
  range: `${Number.NEGATIVE_INFINITY}:${Number.POSITIVE_INFINITY}`,
  regex: '<insert regex>',
  text: '#000000',
  background: '#ffffff'
};
exports.DEFAULT_CONVERTER_COLOR = DEFAULT_CONVERTER_COLOR;