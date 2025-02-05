"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendLayerIds = appendLayerIds;
exports.generateLayerId = void 0;
exports.getAccessors = getAccessors;
exports.getDataLayers = getDataLayers;
exports.getShowLines = void 0;
var _common = require("../../../../expressions/common");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function isWithLayerId(layer) {
  return layer.layerId ? true : false;
}
const generateLayerId = (keyword, index) => `${keyword}-${index}`;
exports.generateLayerId = generateLayerId;
function appendLayerIds(layers, keyword) {
  return layers.filter(l => l !== undefined).map((l, index) => ({
    ...l,
    layerId: isWithLayerId(l) ? l.layerId : generateLayerId(keyword, index)
  }));
}
const getShowLines = args => {
  var _args$showLines;
  return (_args$showLines = args.showLines) !== null && _args$showLines !== void 0 ? _args$showLines : args.seriesType === _constants.SeriesTypes.LINE || args.seriesType !== _constants.SeriesTypes.AREA;
};
exports.getShowLines = getShowLines;
function getDataLayers(layers) {
  return layers.filter(layer => layer.layerType === _constants.LayerTypes.DATA || !layer.layerType);
}
function getAccessors(args, table) {
  var _args$accessors;
  let splitAccessors = args.splitAccessors;
  let xAccessor = args.xAccessor;
  let accessors = (_args$accessors = args.accessors) !== null && _args$accessors !== void 0 ? _args$accessors : [];
  let markSizeAccessor = args.markSizeAccessor;
  if (!(splitAccessors && splitAccessors.length) && !xAccessor && !(accessors && accessors.length) && !markSizeAccessor) {
    var _table$columns$find, _table$columns$find2, _table$columns$find3, _table$columns$find4;
    const y = (_table$columns$find = table.columns.find(column => column.id === _common.PointSeriesColumnNames.Y)) === null || _table$columns$find === void 0 ? void 0 : _table$columns$find.id;
    const splitColumnId = (_table$columns$find2 = table.columns.find(column => column.id === _common.PointSeriesColumnNames.COLOR)) === null || _table$columns$find2 === void 0 ? void 0 : _table$columns$find2.id;
    xAccessor = (_table$columns$find3 = table.columns.find(column => column.id === _common.PointSeriesColumnNames.X)) === null || _table$columns$find3 === void 0 ? void 0 : _table$columns$find3.id;
    splitAccessors = splitColumnId ? [splitColumnId] : [];
    accessors = y ? [y] : [];
    markSizeAccessor = (_table$columns$find4 = table.columns.find(column => column.id === _common.PointSeriesColumnNames.SIZE)) === null || _table$columns$find4 === void 0 ? void 0 : _table$columns$find4.id;
  }
  return {
    splitAccessors,
    xAccessor,
    accessors,
    markSizeAccessor
  };
}