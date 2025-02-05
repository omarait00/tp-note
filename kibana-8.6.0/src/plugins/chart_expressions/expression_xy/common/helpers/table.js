"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeTable = normalizeTable;
var _moment = _interopRequireDefault(require("moment"));
var _utils = require("../../../../visualizations/common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function normalizeTable(data, xAccessor) {
  const xColumn = xAccessor && (0, _utils.getColumnByAccessor)(xAccessor, data.columns);
  if (xColumn && (xColumn === null || xColumn === void 0 ? void 0 : xColumn.meta.type) === 'date') {
    const xColumnId = xColumn.id;
    if (!data.rows.some(row => typeof row[xColumnId] === 'string' && row[xColumnId] !== '__other__')) return data;
    const rows = data.rows.map(row => {
      return typeof row[xColumnId] !== 'string' ? row : {
        ...row,
        [xColumnId]: (0, _moment.default)(row[xColumnId]).valueOf()
      };
    });
    return {
      ...data,
      rows
    };
  }
  return data;
}