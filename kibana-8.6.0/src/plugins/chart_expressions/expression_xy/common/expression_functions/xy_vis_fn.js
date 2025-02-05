"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xyVisFn = void 0;
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../constants");
var _helpers = require("../helpers");
var _validate = require("./validate");
var _utils2 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createDataLayer = (args, table) => {
  const accessors = (0, _helpers.getAccessors)(args, table);
  const normalizedTable = (0, _helpers.normalizeTable)(table, accessors.xAccessor);
  return {
    type: _constants.DATA_LAYER,
    seriesType: args.seriesType,
    simpleView: args.simpleView,
    columnToLabel: args.columnToLabel,
    xScaleType: args.xScaleType,
    isHistogram: args.isHistogram,
    isPercentage: args.isPercentage,
    isHorizontal: args.isHorizontal,
    isStacked: args.isStacked,
    palette: args.palette,
    decorations: args.decorations,
    showPoints: args.showPoints,
    pointsRadius: args.pointsRadius,
    lineWidth: args.lineWidth,
    layerType: _constants.LayerTypes.DATA,
    table: normalizedTable,
    showLines: args.showLines,
    ...accessors
  };
};
const xyVisFn = async (data, args, handlers) => {
  var _dataLayers$0$splitAc, _ref, _args$ariaLabel, _handlers$variables, _handlers$getExecutio, _handlers$getExecutio2, _handlers$isSyncColor, _handlers$isSyncColor2, _handlers$isSyncToolt, _handlers$isSyncToolt2, _handlers$isSyncCurso, _handlers$isSyncCurso2;
  (0, _utils.validateAccessor)(args.splitRowAccessor, data.columns);
  (0, _utils.validateAccessor)(args.splitColumnAccessor, data.columns);
  const {
    referenceLines = [],
    // data_layer args
    seriesType,
    accessors,
    xAccessor,
    simpleView,
    splitAccessors,
    columnToLabel,
    xScaleType,
    isHistogram,
    isHorizontal,
    isPercentage,
    isStacked,
    decorations,
    palette,
    markSizeAccessor,
    showPoints,
    pointsRadius,
    lineWidth,
    showLines: realShowLines,
    ...restArgs
  } = args;
  (0, _validate.validateLinesVisibilityForChartType)(args.showLines, args.seriesType);
  const showLines = (0, _helpers.getShowLines)(args);
  const dataLayers = [createDataLayer({
    ...args,
    showLines
  }, data)];
  (0, _utils.validateAccessor)(dataLayers[0].xAccessor, data.columns);
  (_dataLayers$0$splitAc = dataLayers[0].splitAccessors) === null || _dataLayers$0$splitAc === void 0 ? void 0 : _dataLayers$0$splitAc.forEach(accessor => (0, _utils.validateAccessor)(accessor, data.columns));
  dataLayers[0].accessors.forEach(accessor => (0, _utils.validateAccessor)(accessor, data.columns));
  (0, _validate.validateMarkSizeForChartType)(dataLayers[0].markSizeAccessor, args.seriesType);
  (0, _utils.validateAccessor)(dataLayers[0].markSizeAccessor, data.columns);
  const layers = [...(0, _helpers.appendLayerIds)(dataLayers, 'dataLayers'), ...(0, _helpers.appendLayerIds)(referenceLines, 'referenceLines')];
  (0, _utils2.logDatatable)(data, layers, handlers, args.splitColumnAccessor, args.splitRowAccessor);
  const hasBar = (0, _validate.hasBarLayer)(dataLayers);
  const hasArea = (0, _validate.hasAreaLayer)(dataLayers);
  (0, _validate.validateExtents)(dataLayers, hasBar || hasArea, args.yAxisConfigs, args.xAxisConfig);
  (0, _validate.validateFillOpacity)(args.fillOpacity, hasArea);
  (0, _validate.validateAddTimeMarker)(dataLayers, args.addTimeMarker);
  (0, _validate.validateMinTimeBarInterval)(dataLayers, hasBar, args.minTimeBarInterval);
  (0, _validate.validateValueLabels)(args.valueLabels, hasBar);
  (0, _validate.validateMarkSizeRatioWithAccessor)(args.markSizeRatio, dataLayers[0].markSizeAccessor);
  (0, _validate.validateMarkSizeRatioLimits)(args.markSizeRatio);
  (0, _validate.validateLineWidthForChartType)(lineWidth, args.seriesType);
  (0, _validate.validateShowPointsForChartType)(showPoints, args.seriesType);
  (0, _validate.validatePointsRadiusForChartType)(pointsRadius, args.seriesType);
  (0, _validate.validateAxes)(dataLayers, args.yAxisConfigs);
  return {
    type: 'render',
    as: _constants.XY_VIS_RENDERER,
    value: {
      args: {
        ...restArgs,
        layers,
        markSizeRatio: dataLayers[0].markSizeAccessor && !args.markSizeRatio ? 10 : args.markSizeRatio,
        ariaLabel: (_ref = (_args$ariaLabel = args.ariaLabel) !== null && _args$ariaLabel !== void 0 ? _args$ariaLabel : (_handlers$variables = handlers.variables) === null || _handlers$variables === void 0 ? void 0 : _handlers$variables.embeddableTitle) !== null && _ref !== void 0 ? _ref : (_handlers$getExecutio = handlers.getExecutionContext) === null || _handlers$getExecutio === void 0 ? void 0 : (_handlers$getExecutio2 = _handlers$getExecutio.call(handlers)) === null || _handlers$getExecutio2 === void 0 ? void 0 : _handlers$getExecutio2.description
      },
      canNavigateToLens: Boolean(handlers.variables.canNavigateToLens),
      syncColors: (_handlers$isSyncColor = handlers === null || handlers === void 0 ? void 0 : (_handlers$isSyncColor2 = handlers.isSyncColorsEnabled) === null || _handlers$isSyncColor2 === void 0 ? void 0 : _handlers$isSyncColor2.call(handlers)) !== null && _handlers$isSyncColor !== void 0 ? _handlers$isSyncColor : false,
      syncTooltips: (_handlers$isSyncToolt = handlers === null || handlers === void 0 ? void 0 : (_handlers$isSyncToolt2 = handlers.isSyncTooltipsEnabled) === null || _handlers$isSyncToolt2 === void 0 ? void 0 : _handlers$isSyncToolt2.call(handlers)) !== null && _handlers$isSyncToolt !== void 0 ? _handlers$isSyncToolt : false,
      syncCursor: (_handlers$isSyncCurso = handlers === null || handlers === void 0 ? void 0 : (_handlers$isSyncCurso2 = handlers.isSyncCursorEnabled) === null || _handlers$isSyncCurso2 === void 0 ? void 0 : _handlers$isSyncCurso2.call(handlers)) !== null && _handlers$isSyncCurso !== void 0 ? _handlers$isSyncCurso : true
    }
  };
};
exports.xyVisFn = xyVisFn;