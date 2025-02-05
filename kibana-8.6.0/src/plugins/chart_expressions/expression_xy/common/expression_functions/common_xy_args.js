"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commonXYArgs = void 0;
var _constants = require("../constants");
var _i18n = require("../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const commonXYArgs = {
  legend: {
    types: [_constants.LEGEND_CONFIG],
    help: _i18n.strings.getLegendHelp(),
    default: `{${_constants.LEGEND_CONFIG}}`
  },
  fittingFunction: {
    types: ['string'],
    options: [...Object.values(_constants.FittingFunctions)],
    help: _i18n.strings.getFittingFunctionHelp(),
    strict: true
  },
  endValue: {
    types: ['string'],
    options: [...Object.values(_constants.EndValues)],
    help: _i18n.strings.getEndValueHelp(),
    strict: true
  },
  emphasizeFitting: {
    types: ['boolean'],
    default: false,
    help: ''
  },
  valueLabels: {
    types: ['string'],
    options: [...Object.values(_constants.ValueLabelModes)],
    help: _i18n.strings.getValueLabelsHelp(),
    strict: true,
    default: _constants.ValueLabelModes.HIDE
  },
  fillOpacity: {
    types: ['number'],
    help: _i18n.strings.getFillOpacityHelp()
  },
  hideEndzones: {
    types: ['boolean'],
    default: false,
    help: _i18n.strings.getHideEndzonesHelp()
  },
  valuesInLegend: {
    types: ['boolean'],
    default: false,
    help: _i18n.strings.getValuesInLegendHelp()
  },
  ariaLabel: {
    types: ['string'],
    help: _i18n.strings.getAriaLabelHelp()
  },
  xAxisConfig: {
    types: [_constants.X_AXIS_CONFIG],
    help: _i18n.strings.getXAxisConfigHelp()
  },
  yAxisConfigs: {
    types: [_constants.Y_AXIS_CONFIG],
    help: _i18n.strings.getyAxisConfigsHelp(),
    multi: true
  },
  detailedTooltip: {
    types: ['boolean'],
    help: _i18n.strings.getDetailedTooltipHelp()
  },
  showTooltip: {
    types: ['boolean'],
    default: true,
    help: _i18n.strings.getShowTooltipHelp()
  },
  orderBucketsBySum: {
    types: ['boolean'],
    default: false,
    help: _i18n.strings.getOrderBucketsBySum()
  },
  addTimeMarker: {
    types: ['boolean'],
    default: false,
    help: _i18n.strings.getAddTimeMakerHelp()
  },
  markSizeRatio: {
    types: ['number'],
    help: _i18n.strings.getMarkSizeRatioHelp()
  },
  minTimeBarInterval: {
    types: ['string'],
    help: _i18n.strings.getMinTimeBarIntervalHelp()
  }
};
exports.commonXYArgs = commonXYArgs;