"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consolidateMetricColumns = void 0;
var _utils = require("../../../../visualizations/common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function nonNullable(value) {
  return value !== null && value !== undefined;
}
const consolidateMetricColumns = (table, bucketAccessors = [], metricAccessors, metricsToLabels) => {
  if (metricAccessors.length < 2) {
    return {
      table,
      metricAccessor: metricAccessors[0],
      bucketAccessors
    };
  }
  const bucketColumns = bucketAccessors === null || bucketAccessors === void 0 ? void 0 : bucketAccessors.map(accessor => (0, _utils.getColumnByAccessor)(accessor, table.columns)).filter(nonNullable);
  const metricColumns = metricAccessors === null || metricAccessors === void 0 ? void 0 : metricAccessors.map(accessor => (0, _utils.getColumnByAccessor)(accessor, table.columns)).filter(nonNullable);
  const transposedRows = [];
  const nameColumnId = 'metric-name';
  const valueColumnId = 'value';
  table.rows.forEach(row => {
    metricColumns.forEach(metricCol => {
      const newRow = {};
      bucketColumns.forEach(({
        id
      }) => {
        newRow[id] = row[id];
      });
      newRow[nameColumnId] = metricsToLabels[metricCol.id];
      newRow[valueColumnId] = row[metricCol.id];
      transposedRows.push(newRow);
    });
  });
  const transposedColumns = [...bucketColumns, {
    id: nameColumnId,
    name: nameColumnId,
    meta: {
      type: 'string',
      sourceParams: {
        consolidatedMetricsColumn: true
      }
    }
  }, {
    id: valueColumnId,
    name: valueColumnId,
    meta: {
      type: 'number'
    }
  }];
  return {
    metricAccessor: valueColumnId,
    bucketAccessors: [...bucketColumns.map(({
      id
    }) => id), nameColumnId],
    table: {
      type: 'datatable',
      columns: transposedColumns,
      rows: transposedRows
    }
  };
};
exports.consolidateMetricColumns = consolidateMetricColumns;