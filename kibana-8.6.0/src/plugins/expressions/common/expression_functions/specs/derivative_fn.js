"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.derivativeFn = void 0;
var _series_calculation_helpers = require("../series_calculation_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Calculates the derivative of a specified column in the data table.
 *
 * Also supports multiple series in a single data table - use the `by` argument
 * to specify the columns to split the calculation by.
 * For each unique combination of all `by` columns a separate derivative will be calculated.
 * The order of rows won't be changed - this function is not modifying any existing columns, it's only
 * adding the specified `outputColumnId` column to every row of the table without adding or removing rows.
 *
 * Behavior:
 * * Will write the derivative of `inputColumnId` into `outputColumnId`
 * * If provided will use `outputColumnName` as name for the newly created column. Otherwise falls back to `outputColumnId`
 * * Derivative always start with an undefined value for the first row of a series, a cell will contain its own value minus the
 *   value of the previous cell of the same series.
 *
 * Edge cases:
 * * Will return the input table if `inputColumnId` does not exist
 * * Will throw an error if `outputColumnId` exists already in provided data table
 * * If there is no previous row of the current series with a non `null` or `undefined` value, the output cell of the current row
 *   will be set to `undefined`.
 * * If the row value contains `null` or `undefined`, it will be ignored and the output cell will be set to `undefined`
 * * If the value of the previous row of the same series contains `null` or `undefined`, the output cell of the current row will be set to `undefined` as well
 * * For all values besides `null` and `undefined`, the value will be cast to a number before it's used in the
 *   calculation of the current series even if this results in `NaN` (like in case of objects).
 * * To determine separate series defined by the `by` columns, the values of these columns will be cast to strings
 *   before comparison. If the values are objects, the return value of their `toString` method will be used for comparison.
 *   Missing values (`null` and `undefined`) will be treated as empty strings.
 */
const derivativeFn = (input, {
  by,
  inputColumnId,
  outputColumnId,
  outputColumnName
}) => {
  const resultColumns = (0, _series_calculation_helpers.buildResultColumns)(input, outputColumnId, inputColumnId, outputColumnName);
  if (!resultColumns) {
    return input;
  }
  const previousValues = {};
  return {
    ...input,
    columns: resultColumns,
    rows: input.rows.map(row => {
      const newRow = {
        ...row
      };
      const bucketIdentifier = (0, _series_calculation_helpers.getBucketIdentifier)(row, by);
      const previousValue = previousValues[bucketIdentifier];
      const currentValue = newRow[inputColumnId];
      if (currentValue != null && previousValue != null) {
        newRow[outputColumnId] = Number(currentValue) - previousValue;
      } else {
        newRow[outputColumnId] = undefined;
      }
      if (currentValue != null) {
        previousValues[bucketIdentifier] = Number(currentValue);
      } else {
        previousValues[bucketIdentifier] = undefined;
      }
      return newRow;
    })
  };
};
exports.derivativeFn = derivativeFn;