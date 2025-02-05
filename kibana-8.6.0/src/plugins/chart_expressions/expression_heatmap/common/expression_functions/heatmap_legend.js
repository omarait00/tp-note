"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heatmapLegendConfig = void 0;
var _charts = require("@elastic/charts");
var _i18n = require("@kbn/i18n");
var _constants = require("../../../../visualizations/common/constants");
var _constants2 = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const heatmapLegendConfig = {
  name: _constants2.EXPRESSION_HEATMAP_LEGEND_NAME,
  aliases: [],
  type: _constants2.EXPRESSION_HEATMAP_LEGEND_NAME,
  help: `Configure the heatmap chart's legend`,
  inputTypes: ['null'],
  args: {
    isVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.isVisible.help', {
        defaultMessage: 'Specifies whether or not the legend is visible.'
      })
    },
    position: {
      types: ['string'],
      default: _charts.Position.Right,
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.position.help', {
        defaultMessage: 'Specifies the legend position.'
      }),
      strict: true
    },
    maxLines: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.maxLines.help', {
        defaultMessage: 'Specifies the number of lines per legend item.'
      })
    },
    shouldTruncate: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legend.shouldTruncate.help', {
        defaultMessage: 'Specifies whether or not the legend items should be truncated.'
      })
    },
    legendSize: {
      types: ['string'],
      default: _constants.DEFAULT_LEGEND_SIZE,
      help: _i18n.i18n.translate('expressionHeatmap.function.args.legendSize.help', {
        defaultMessage: 'Specifies the legend size.'
      }),
      options: [_constants.LegendSize.AUTO, _constants.LegendSize.SMALL, _constants.LegendSize.MEDIUM, _constants.LegendSize.LARGE, _constants.LegendSize.EXTRA_LARGE],
      strict: true
    }
  },
  fn(input, args) {
    return {
      type: _constants2.EXPRESSION_HEATMAP_LEGEND_NAME,
      ...args
    };
  }
};
exports.heatmapLegendConfig = heatmapLegendConfig;