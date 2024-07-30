"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldFilterByCardinality = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const shouldFilterByCardinality = threshold => {
  var _threshold$cardinalit;
  return !!((_threshold$cardinalit = threshold.cardinality) !== null && _threshold$cardinalit !== void 0 && _threshold$cardinalit.length);
};
exports.shouldFilterByCardinality = shouldFilterByCardinality;