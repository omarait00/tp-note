"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricElementInitializer = void 0;
var _common = require("../../../../../../src/plugins/field_formats/common");
var _fonts = require("../../../common/lib/fonts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const metricElementInitializer = (core, setup) => {
  return () => ({
    name: 'metric',
    displayName: 'Metric',
    type: 'chart',
    help: 'A number with a label',
    width: 200,
    height: 100,
    icon: 'visMetric',
    expression: `kibana
| selectFilter
| demodata
| math "unique(country)"
| metric "Countries"
  metricFont={font size=48 family="${_fonts.openSans.value}" color="#000000" align="center" lHeight=48}
  labelFont={font size=14 family="${_fonts.openSans.value}" color="#000000" align="center"}
  metricFormat="${core.uiSettings.get(_common.FORMATS_UI_SETTINGS.FORMAT_NUMBER_DEFAULT_PATTERN)}"
| render`
  });
};
exports.metricElementInitializer = metricElementInitializer;