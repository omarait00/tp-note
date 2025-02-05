"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axisExtentConfigFunction = void 0;
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const errors = {
  upperBoundLowerOrEqualToLowerBoundError: () => _i18n.i18n.translate('expressionXY.reusable.function.axisExtentConfig.errors.emptyUpperBound', {
    defaultMessage: 'Upper bound should be greater than lower bound, if custom mode is enabled.'
  })
};
const axisExtentConfigFunction = {
  name: _constants.AXIS_EXTENT_CONFIG,
  aliases: [],
  type: _constants.AXIS_EXTENT_CONFIG,
  help: _i18n.i18n.translate('expressionXY.axisExtentConfig.help', {
    defaultMessage: `Configure the xy chart's axis extents`
  }),
  inputTypes: ['null'],
  args: {
    mode: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionXY.axisExtentConfig.extentMode.help', {
        defaultMessage: 'The extent mode'
      }),
      options: [...Object.values(_constants.AxisExtentModes)],
      strict: true,
      default: _constants.AxisExtentModes.FULL
    },
    lowerBound: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionXY.axisExtentConfig.lowerBound.help', {
        defaultMessage: 'Lower bound'
      })
    },
    upperBound: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionXY.axisExtentConfig.upperBound.help', {
        defaultMessage: 'Upper bound'
      })
    },
    enforce: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionXY.axisExtentConfig.enforce.help', {
        defaultMessage: 'Enforce extent params.'
      })
    }
  },
  fn(input, args) {
    if (args.mode === _constants.AxisExtentModes.CUSTOM) {
      if (args.lowerBound !== undefined && args.upperBound !== undefined && args.lowerBound >= args.upperBound) {
        throw new Error(errors.upperBoundLowerOrEqualToLowerBoundError());
      }
    }
    return {
      type: _constants.AXIS_EXTENT_CONFIG,
      ...args
    };
  }
};
exports.axisExtentConfigFunction = axisExtentConfigFunction;