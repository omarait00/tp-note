"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verticalBarChart = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const verticalBarChart = () => ({
  name: 'verticalBarChart',
  displayName: 'Vertical bar chart',
  type: 'chart',
  help: 'A customizable vertical bar chart',
  icon: 'visBarVertical',
  expression: `kibana
| selectFilter
| demodata
| pointseries x="project" y="size(cost)" color="project"
| plot defaultStyle={seriesStyle bars=0.75} legend=false
| render`
});
exports.verticalBarChart = verticalBarChart;