"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNumericFieldForDatatable = isNumericFieldForDatatable;
var _transpose_helpers = require("./transpose_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isValidNumber(value) {
  return typeof value === 'number' || value == null;
}
function isNumericFieldForDatatable(currentData, accessor) {
  var _column$meta$params;
  const column = currentData === null || currentData === void 0 ? void 0 : currentData.columns.find(col => col.id === accessor || (0, _transpose_helpers.getOriginalId)(col.id) === accessor);
  // min and max aggs are reporting as number but are actually dates - work around this by checking for the date formatter until this is fixed at the source
  const isNumeric = (column === null || column === void 0 ? void 0 : column.meta.type) === 'number' && (column === null || column === void 0 ? void 0 : (_column$meta$params = column.meta.params) === null || _column$meta$params === void 0 ? void 0 : _column$meta$params.id) !== 'date';
  return isNumeric && (currentData === null || currentData === void 0 ? void 0 : currentData.rows.every(row => {
    const val = row[accessor];
    return isValidNumber(val) || Array.isArray(val) && val.every(isValidNumber);
  }));
}