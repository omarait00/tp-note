"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatnumber = void 0;
var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  FormatNumber: strings
} = _i18n.TransformStrings;
const formatnumber = () => ({
  name: 'formatnumber',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'format',
    displayName: strings.getFormatDisplayName(),
    argType: 'numberformat'
  }]
});
exports.formatnumber = formatnumber;