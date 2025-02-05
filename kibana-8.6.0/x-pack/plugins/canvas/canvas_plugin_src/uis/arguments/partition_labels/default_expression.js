"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultExpression = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultExpression = () => ({
  type: 'expression',
  chain: [{
    type: 'function',
    function: 'partitionLabels',
    arguments: {
      show: [true],
      position: ['default'],
      values: [true],
      percentDecimals: [2],
      valuesFormat: ['percent']
    }
  }]
});
exports.defaultExpression = defaultExpression;