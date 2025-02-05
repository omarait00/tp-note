"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODEL_SCRIPTS = void 0;
var _enums = require("../../../../common/enums");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const MODEL_SCRIPTS = {
  [_enums.MODEL_TYPES.UNWEIGHTED]: () => 'MovingFunctions.unweightedAvg(values)',
  [_enums.MODEL_TYPES.WEIGHTED_EXPONENTIAL]: ({
    alpha
  }) => `MovingFunctions.ewma(values, ${alpha})`,
  [_enums.MODEL_TYPES.WEIGHTED_EXPONENTIAL_DOUBLE]: ({
    alpha,
    beta
  }) => `MovingFunctions.holt(values, ${alpha}, ${beta})`,
  [_enums.MODEL_TYPES.WEIGHTED_EXPONENTIAL_TRIPLE]: ({
    alpha,
    beta,
    gamma,
    period,
    multiplicative
  }) => `if (values.length > ${period}*2) {MovingFunctions.holtWinters(values, ${alpha}, ${beta}, ${gamma}, ${period}, ${multiplicative})}`,
  [_enums.MODEL_TYPES.WEIGHTED_LINEAR]: () => 'MovingFunctions.linearWeightedAvg(values)'
};
exports.MODEL_SCRIPTS = MODEL_SCRIPTS;