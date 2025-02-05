"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToFiltersColumn = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertToFiltersColumn = (aggId, aggParams, isSplit = false) => {
  var _aggParams$filters, _aggParams$filters2;
  if (!((_aggParams$filters = aggParams.filters) !== null && _aggParams$filters !== void 0 && _aggParams$filters.length)) {
    return null;
  }
  return {
    columnId: (0, _uuid.default)(),
    operationType: 'filters',
    dataType: 'string',
    isBucketed: true,
    isSplit,
    params: {
      filters: (_aggParams$filters2 = aggParams.filters) !== null && _aggParams$filters2 !== void 0 ? _aggParams$filters2 : []
    },
    timeShift: aggParams.timeShift,
    meta: {
      aggId
    }
  };
};
exports.convertToFiltersColumn = convertToFiltersColumn;