"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileShareObjectType = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const properties = {
  created: {
    type: 'date'
  },
  valid_until: {
    type: 'long'
  },
  token: {
    type: 'keyword'
  },
  name: {
    type: 'keyword'
  }
};
const fileShareObjectType = {
  name: _constants.FILE_SHARE_SO_TYPE,
  hidden: true,
  namespaceType: 'agnostic',
  // These saved objects should be visible everywhere
  mappings: {
    dynamic: false,
    properties
  }
};
exports.fileShareObjectType = fileShareObjectType;