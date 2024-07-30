"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieChartTypes = exports.PLUGIN_ID = exports.NumberDisplay = exports.NOT_INTERNATIONALIZED_PRODUCT_NAME = exports.LegendDisplay = exports.LENS_EMBEDDABLE_TYPE = exports.LENS_EDIT_BY_VALUE = exports.ENABLE_SQL = exports.DOC_TYPE = exports.DOCUMENT_FIELD_NAME = exports.CategoryDisplay = exports.BASE_API_URL = exports.APP_ID = void 0;
exports.getBasePath = getBasePath;
exports.getEditPath = getEditPath;
exports.getFullPath = getFullPath;
var _risonNode = _interopRequireDefault(require("rison-node"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN_ID = 'lens';
exports.PLUGIN_ID = PLUGIN_ID;
const APP_ID = 'lens';
exports.APP_ID = APP_ID;
const LENS_EMBEDDABLE_TYPE = 'lens';
exports.LENS_EMBEDDABLE_TYPE = LENS_EMBEDDABLE_TYPE;
const DOC_TYPE = 'lens';
exports.DOC_TYPE = DOC_TYPE;
const NOT_INTERNATIONALIZED_PRODUCT_NAME = 'Lens Visualizations';
exports.NOT_INTERNATIONALIZED_PRODUCT_NAME = NOT_INTERNATIONALIZED_PRODUCT_NAME;
const BASE_API_URL = '/api/lens';
exports.BASE_API_URL = BASE_API_URL;
const LENS_EDIT_BY_VALUE = 'edit_by_value';
exports.LENS_EDIT_BY_VALUE = LENS_EDIT_BY_VALUE;
const ENABLE_SQL = 'discover:enableSql';
exports.ENABLE_SQL = ENABLE_SQL;
const PieChartTypes = {
  PIE: 'pie',
  DONUT: 'donut',
  TREEMAP: 'treemap',
  MOSAIC: 'mosaic',
  WAFFLE: 'waffle'
};
exports.PieChartTypes = PieChartTypes;
const CategoryDisplay = {
  DEFAULT: 'default',
  INSIDE: 'inside',
  HIDE: 'hide'
};
exports.CategoryDisplay = CategoryDisplay;
const NumberDisplay = {
  HIDDEN: 'hidden',
  PERCENT: 'percent',
  VALUE: 'value'
};
exports.NumberDisplay = NumberDisplay;
const LegendDisplay = {
  DEFAULT: 'default',
  SHOW: 'show',
  HIDE: 'hide'
};

// might collide with user-supplied field names, try to make as unique as possible
exports.LegendDisplay = LegendDisplay;
const DOCUMENT_FIELD_NAME = '___records___';
exports.DOCUMENT_FIELD_NAME = DOCUMENT_FIELD_NAME;
function getBasePath() {
  return `#/`;
}
const GLOBAL_RISON_STATE_PARAM = '_g';
function getEditPath(id, timeRange) {
  let timeParam = '';
  if (timeRange) {
    timeParam = `?${GLOBAL_RISON_STATE_PARAM}=${_risonNode.default.encode({
      time: timeRange
    })}`;
  }
  return id ? `#/edit/${encodeURIComponent(id)}${timeParam}` : `#/${LENS_EDIT_BY_VALUE}${timeParam}`;
}
function getFullPath(id) {
  return `/app/${PLUGIN_ID}${id ? getEditPath(id) : getBasePath()}`;
}