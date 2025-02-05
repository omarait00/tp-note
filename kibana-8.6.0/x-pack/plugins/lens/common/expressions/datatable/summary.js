"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeSummaryRowForColumn = computeSummaryRowForColumn;
exports.getDefaultSummaryLabel = getDefaultSummaryLabel;
exports.getFinalSummaryConfiguration = getFinalSummaryConfiguration;
exports.getSummaryRowOptions = getSummaryRowOptions;
var _i18n = require("@kbn/i18n");
var _transpose_helpers = require("./transpose_helpers");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getFinalSummaryConfiguration(columnId, columnArgs, table) {
  var _columnArgs$summaryLa;
  const isNumeric = (0, _utils.isNumericFieldForDatatable)(table, columnId);
  const summaryRow = isNumeric ? (columnArgs === null || columnArgs === void 0 ? void 0 : columnArgs.summaryRow) || 'none' : 'none';
  const summaryLabel = (_columnArgs$summaryLa = columnArgs === null || columnArgs === void 0 ? void 0 : columnArgs.summaryLabel) !== null && _columnArgs$summaryLa !== void 0 ? _columnArgs$summaryLa : getDefaultSummaryLabel(summaryRow);
  return {
    summaryRow,
    summaryLabel
  };
}
function getDefaultSummaryLabel(type) {
  return getSummaryRowOptions().find(({
    value
  }) => type === value).label;
}
function getSummaryRowOptions() {
  return [{
    value: 'none',
    label: _i18n.i18n.translate('xpack.lens.table.summaryRow.none', {
      defaultMessage: 'None'
    }),
    'data-test-subj': 'lns-datatable-summary-none'
  }, {
    value: 'count',
    label: _i18n.i18n.translate('xpack.lens.table.summaryRow.count', {
      defaultMessage: 'Value count'
    }),
    'data-test-subj': 'lns-datatable-summary-count'
  }, {
    value: 'sum',
    label: _i18n.i18n.translate('xpack.lens.table.summaryRow.sum', {
      defaultMessage: 'Sum'
    }),
    'data-test-subj': 'lns-datatable-summary-sum'
  }, {
    value: 'avg',
    label: _i18n.i18n.translate('xpack.lens.table.summaryRow.average', {
      defaultMessage: 'Average'
    }),
    'data-test-subj': 'lns-datatable-summary-avg'
  }, {
    value: 'min',
    label: _i18n.i18n.translate('xpack.lens.table.summaryRow.minimum', {
      defaultMessage: 'Minimum'
    }),
    'data-test-subj': 'lns-datatable-summary-min'
  }, {
    value: 'max',
    label: _i18n.i18n.translate('xpack.lens.table.summaryRow.maximum', {
      defaultMessage: 'Maximum'
    }),
    'data-test-subj': 'lns-datatable-summary-max'
  }];
}

/** @internal **/
function computeSummaryRowForColumn(columnArgs, table, formatters, defaultFormatter) {
  const summaryValue = computeFinalValue(columnArgs.summaryRow, columnArgs.columnId, table.rows);
  // ignore the coluymn formatter for the count case
  if (columnArgs.summaryRow === 'count') {
    return defaultFormatter.convert(summaryValue);
  }
  return formatters[(0, _transpose_helpers.getOriginalId)(columnArgs.columnId)].convert(summaryValue);
}
function computeFinalValue(type, columnId, rows) {
  // flatten the row structure, to easier handle numeric arrays
  const validRows = rows.filter(v => v[columnId] != null).flatMap(v => v[columnId]);
  const count = validRows.length;
  const sum = validRows.reduce((partialSum, value) => {
    return partialSum + value;
  }, 0);
  switch (type) {
    case 'sum':
      return sum;
    case 'count':
      return count;
    case 'avg':
      return sum / count;
    case 'min':
      return Math.min(...validRows);
    case 'max':
      return Math.max(...validRows);
    default:
      throw Error('No summary function found');
  }
}