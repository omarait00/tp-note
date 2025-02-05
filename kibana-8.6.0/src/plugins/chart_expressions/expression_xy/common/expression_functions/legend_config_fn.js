"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legendConfigFn = void 0;
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
  positionUsageWithIsInsideError: () => _i18n.i18n.translate('expressionXY.reusable.function.legendConfig.errors.positionUsageWithIsInsideError', {
    defaultMessage: '`position` argument is not applied if `isInside = true`. Please, use `horizontalAlignment` and `verticalAlignment` arguments instead.'
  }),
  alignmentUsageWithFalsyIsInsideError: () => _i18n.i18n.translate('expressionXY.reusable.function.legendConfig.errors.alignmentUsageWithFalsyIsInsideError', {
    defaultMessage: '`horizontalAlignment` and `verticalAlignment` arguments are not applied if `isInside = false`. Please, use the `position` argument instead.'
  }),
  floatingColumnsWithFalsyIsInsideError: () => _i18n.i18n.translate('expressionXY.reusable.function.legendConfig.errors.floatingColumnsWithFalsyIsInsideError', {
    defaultMessage: '`floatingColumns` arguments are not applied if `isInside = false`.'
  }),
  legendSizeWithFalsyIsInsideError: () => _i18n.i18n.translate('expressionXY.reusable.function.legendConfig.errors.legendSizeWithFalsyIsInsideError', {
    defaultMessage: '`legendSize` argument is not applied if `isInside = false`.'
  })
};
const legendConfigFn = async (data, args) => {
  if (args.isInside) {
    if (args.position) {
      throw new Error(errors.positionUsageWithIsInsideError());
    }
    if (args.legendSize !== undefined) {
      throw new Error(errors.legendSizeWithFalsyIsInsideError());
    }
  }
  if (!args.isInside) {
    if (args.verticalAlignment || args.horizontalAlignment) {
      throw new Error(errors.alignmentUsageWithFalsyIsInsideError());
    }
    if (args.floatingColumns !== undefined) {
      throw new Error(errors.floatingColumnsWithFalsyIsInsideError());
    }
  }
  return {
    type: _constants.LEGEND_CONFIG,
    ...args
  };
};
exports.legendConfigFn = legendConfigFn;