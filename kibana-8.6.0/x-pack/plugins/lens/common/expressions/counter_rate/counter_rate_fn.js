"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.counterRateFn = void 0;
var _common = require("../../../../../../src/plugins/expressions/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const counterRateFn = (input, {
  by,
  inputColumnId,
  outputColumnId,
  outputColumnName
}) => {
  const resultColumns = (0, _common.buildResultColumns)(input, outputColumnId, inputColumnId, outputColumnName);
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
      const bucketIdentifier = (0, _common.getBucketIdentifier)(row, by);
      const previousValue = previousValues[bucketIdentifier];
      const currentValue = newRow[inputColumnId];
      if (currentValue != null && previousValue != null) {
        const currentValueAsNumber = Number(currentValue);
        if (currentValueAsNumber >= previousValue) {
          newRow[outputColumnId] = currentValueAsNumber - previousValue;
        } else {
          newRow[outputColumnId] = currentValueAsNumber;
        }
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
exports.counterRateFn = counterRateFn;