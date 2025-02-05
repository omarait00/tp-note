"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileObjectType = void 0;
var _common = require("../../common");
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
  Updated: {
    type: 'date'
  },
  name: {
    type: 'text'
  },
  user: {
    type: 'flattened'
  },
  Status: {
    type: 'keyword'
  },
  mime_type: {
    type: 'keyword'
  },
  extension: {
    type: 'keyword'
  },
  size: {
    type: 'long'
  },
  Meta: {
    type: 'flattened'
  },
  FileKind: {
    type: 'keyword'
  }
};
const fileObjectType = {
  name: _common.FILE_SO_TYPE,
  hidden: true,
  namespaceType: 'multiple-isolated',
  management: {
    importableAndExportable: false
  },
  mappings: {
    dynamic: false,
    properties
  }
};
exports.fileObjectType = fileObjectType;