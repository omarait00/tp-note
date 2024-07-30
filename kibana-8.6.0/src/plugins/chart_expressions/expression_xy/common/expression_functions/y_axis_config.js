"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yAxisConfigFunction = void 0;
var _charts = require("@elastic/charts");
var _i18n = require("../i18n");
var _constants = require("../constants");
var _common_axis_args = require("./common_axis_args");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const yAxisConfigFunction = {
  name: _constants.Y_AXIS_CONFIG,
  aliases: [],
  type: _constants.Y_AXIS_CONFIG,
  help: _i18n.strings.getYAxisConfigFnHelp(),
  inputTypes: ['null'],
  args: {
    ..._common_axis_args.commonAxisConfigArgs,
    mode: {
      types: ['string'],
      options: [...Object.values(_constants.AxisModes)],
      help: _i18n.strings.getAxisModeHelp()
    },
    boundsMargin: {
      types: ['number'],
      help: _i18n.strings.getAxisBoundsMarginHelp()
    },
    scaleType: {
      options: [...Object.values(_constants.YScaleTypes)],
      help: _i18n.strings.getAxisScaleTypeHelp(),
      default: _constants.YScaleTypes.LINEAR
    },
    position: {
      types: ['string'],
      options: [_charts.Position.Right, _charts.Position.Left],
      help: _i18n.strings.getAxisPositionHelp(),
      strict: true
    }
  },
  fn(input, args) {
    var _args$position;
    return {
      type: _constants.Y_AXIS_CONFIG,
      ...args,
      position: (_args$position = args.position) !== null && _args$position !== void 0 ? _args$position : _charts.Position.Left
    };
  }
};
exports.yAxisConfigFunction = yAxisConfigFunction;