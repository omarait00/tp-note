"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repeatImage = void 0;
var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  RepeatImage: strings
} = _i18n.ViewStrings;
const repeatImage = () => ({
  name: 'repeatImage',
  displayName: strings.getDisplayName(),
  modelArgs: [['_', {
    label: 'Value'
  }]],
  args: [{
    name: 'image',
    displayName: strings.getImageDisplayName(),
    help: strings.getImageHelp(),
    argType: 'imageUpload'
  }, {
    name: 'emptyImage',
    displayName: strings.getEmptyImageDisplayName(),
    help: strings.getEmptyImageHelp(),
    argType: 'imageUpload'
  }, {
    name: 'size',
    displayName: strings.getSizeDisplayName(),
    help: strings.getSizeHelp(),
    argType: 'number',
    default: '100'
  }, {
    name: 'max',
    displayName: strings.getMaxDisplayName(),
    help: strings.getMaxHelp(),
    argType: 'number',
    default: '1000'
  }]
});
exports.repeatImage = repeatImage;