"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTimeChart = isTimeChart;
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function isTimeChart(layers) {
  return layers.every(l => {
    var _getColumnByAccessor;
    return (l.xAccessor ? ((_getColumnByAccessor = (0, _utils.getColumnByAccessor)(l.xAccessor, l.table.columns)) === null || _getColumnByAccessor === void 0 ? void 0 : _getColumnByAccessor.meta.type) === 'date' : false) && (!l.xScaleType || l.xScaleType === _constants.XScaleTypes.TIME);
  });
}