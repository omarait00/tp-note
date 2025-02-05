"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToColumnInPercentageMode = void 0;
var _common = require("../../../../../data/common");
var _formula = require("../metrics/formula");
var _formula2 = require("./formula");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getPercentageFormulaOverRange = (formula, {
  min,
  max
}) => `((${formula}) - ${min}) / (${max} - ${min})`;

// Lens is multiplying by 100, so, it is necessary to disable that operation.
const getPercentageFormula = formula => `(${formula}) / 10000`;
const isMinMax = minMax => {
  if (minMax.min !== undefined && minMax.max !== undefined) {
    return true;
  }
  return false;
};
const convertToColumnInPercentageMode = (columnConverterArgs, minMax) => {
  if (columnConverterArgs.agg.aggType === _common.METRIC_TYPES.TOP_HITS) {
    return null;
  }
  const formula = (0, _formula.getFormulaForAgg)(columnConverterArgs);
  if (formula === null) {
    return null;
  }
  const percentageModeFormula = isMinMax(minMax) ? getPercentageFormulaOverRange(formula, minMax) : getPercentageFormula(formula);
  const column = (0, _formula2.createFormulaColumn)(percentageModeFormula, columnConverterArgs.agg);
  if (column === null) {
    return null;
  }
  return {
    ...column,
    params: {
      ...(column === null || column === void 0 ? void 0 : column.params),
      format: {
        id: 'percent'
      }
    }
  };
};
exports.convertToColumnInPercentageMode = convertToColumnInPercentageMode;