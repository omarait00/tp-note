"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyMetricVis = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const legacyMetricVis = () => ({
  name: 'legacyMetricVis',
  displayName: 'Legacy metric Vis',
  type: 'chart',
  help: 'Legacy metric visualization',
  icon: 'visMetric',
  expression: `kibana
| selectFilter
| demodata
| head 1
| legacyMetricVis metric={visdimension "percent_uptime"} colorMode="Labels"
| render`
});
exports.legacyMetricVis = legacyMetricVis;