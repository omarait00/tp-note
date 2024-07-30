"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeFieldAttrs = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const removeFieldAttrs = runtimeField => {
  const {
    type,
    script,
    fields
  } = runtimeField;
  const fieldsTypeOnly = fields && {
    fields: Object.entries(fields).reduce((col, [fieldName, field]) => {
      col[fieldName] = {
        type: field.type
      };
      return col;
    }, {})
  };
  return {
    type,
    script,
    ...fieldsTypeOnly
  };
};
exports.removeFieldAttrs = removeFieldAttrs;