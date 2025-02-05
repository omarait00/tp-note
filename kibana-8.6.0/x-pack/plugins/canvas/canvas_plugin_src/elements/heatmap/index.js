"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const heatmap = () => ({
  name: 'heatmap',
  displayName: 'Heatmap',
  type: 'chart',
  help: 'Heatmap visualization',
  icon: 'heatmap',
  expression: `kibana
| selectFilter
| demodata
| head 10
| heatmap xAccessor={visdimension "age"} yAccessor={visdimension "project"} valueAccessor={visdimension "cost"}
| render`
});
exports.heatmap = heatmap;