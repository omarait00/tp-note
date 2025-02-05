"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shape = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const shape = () => ({
  name: 'shape',
  displayName: 'Shape',
  type: 'shape',
  help: 'A customizable shape',
  width: 200,
  height: 200,
  icon: 'node',
  expression: 'shape "square" fill="#4cbce4" border="rgba(255,255,255,0)" borderWidth=0 maintainAspect=false | render'
});
exports.shape = shape;