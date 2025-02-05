"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceIndexPatternReference = void 0;
var _common = require("../../../../data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const replaceIndexPatternReference = doc => ({
  ...doc,
  references: Array.isArray(doc.references) ? doc.references.map(reference => {
    if (reference.type === 'index_pattern') {
      reference.type = _common.DATA_VIEW_SAVED_OBJECT_TYPE;
    }
    return reference;
  }) : doc.references
});
exports.replaceIndexPatternReference = replaceIndexPatternReference;