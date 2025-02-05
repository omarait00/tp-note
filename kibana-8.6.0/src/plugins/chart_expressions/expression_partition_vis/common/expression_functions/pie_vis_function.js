"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pieVisFunction = void 0;
var _charts = require("@elastic/charts");
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../../../../visualizations/common/constants");
var _expression_renderers = require("../types/expression_renderers");
var _types = require("../types");
var _constants2 = require("../constants");
var _i18n = require("./i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const pieVisFunction = () => ({
  name: _constants2.PIE_VIS_EXPRESSION_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.strings.getPieVisFunctionName(),
  args: {
    metrics: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getMetricArgHelp(),
      required: true,
      multi: true
    },
    metricsToLabels: {
      types: ['string'],
      help: _i18n.strings.getMetricToLabelHelp()
    },
    buckets: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getBucketsArgHelp(),
      multi: true
    },
    splitColumn: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getSplitColumnArgHelp(),
      multi: true
    },
    splitRow: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getSplitRowArgHelp(),
      multi: true
    },
    addTooltip: {
      types: ['boolean'],
      help: _i18n.strings.getAddTooltipArgHelp(),
      default: true
    },
    legendDisplay: {
      types: ['string'],
      help: _i18n.strings.getLegendDisplayArgHelp(),
      options: [_expression_renderers.LegendDisplay.SHOW, _expression_renderers.LegendDisplay.HIDE, _expression_renderers.LegendDisplay.DEFAULT],
      default: _expression_renderers.LegendDisplay.HIDE,
      strict: true
    },
    legendPosition: {
      types: ['string'],
      default: _charts.Position.Right,
      help: _i18n.strings.getLegendPositionArgHelp(),
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      strict: true
    },
    legendSize: {
      types: ['string'],
      default: _constants.DEFAULT_LEGEND_SIZE,
      help: _i18n.strings.getLegendSizeArgHelp(),
      options: [_constants.LegendSize.AUTO, _constants.LegendSize.SMALL, _constants.LegendSize.MEDIUM, _constants.LegendSize.LARGE, _constants.LegendSize.EXTRA_LARGE],
      strict: true
    },
    nestedLegend: {
      types: ['boolean'],
      help: _i18n.strings.getNestedLegendArgHelp(),
      default: false
    },
    truncateLegend: {
      types: ['boolean'],
      help: _i18n.strings.getTruncateLegendArgHelp(),
      default: true
    },
    maxLegendLines: {
      types: ['number'],
      help: _i18n.strings.getMaxLegendLinesArgHelp()
    },
    distinctColors: {
      types: ['boolean'],
      help: _i18n.strings.getDistinctColorsArgHelp(),
      default: false
    },
    respectSourceOrder: {
      types: ['boolean'],
      help: _i18n.strings.getRespectSourceOrderArgHelp(),
      default: true
    },
    isDonut: {
      types: ['boolean'],
      help: _i18n.strings.getIsDonutArgHelp(),
      default: false
    },
    emptySizeRatio: {
      types: ['number'],
      help: _i18n.strings.getEmptySizeRatioArgHelp(),
      default: _expression_renderers.EmptySizeRatios.SMALL
    },
    palette: {
      types: ['palette', 'system_palette'],
      help: _i18n.strings.getPaletteArgHelp(),
      default: '{palette}'
    },
    labels: {
      types: [_constants2.PARTITION_LABELS_VALUE],
      help: _i18n.strings.getLabelsArgHelp(),
      default: `{${_constants2.PARTITION_LABELS_FUNCTION}}`
    },
    startFromSecondLargestSlice: {
      types: ['boolean'],
      help: _i18n.strings.getStartFromSecondLargestSliceArgHelp(),
      default: true
    },
    ariaLabel: {
      types: ['string'],
      help: _i18n.strings.getAriaLabelHelp(),
      required: false
    }
  },
  fn(context, args, handlers) {
    var _ref, _args$ariaLabel, _handlers$variables, _handlers$getExecutio, _handlers$getExecutio2, _handlers$inspectorAd, _handlers$isSyncColor, _handlers$isSyncColor2, _handlers$variables2;
    if (args.splitColumn && args.splitRow) {
      throw new Error(_i18n.errors.splitRowAndSplitColumnAreSpecifiedError());
    }
    args.metrics.forEach(accessor => (0, _utils.validateAccessor)(accessor, context.columns));
    if (args.buckets) {
      args.buckets.forEach(accessor => (0, _utils.validateAccessor)(accessor, context.columns));
    }
    if (args.splitColumn) {
      args.splitColumn.forEach(splitColumn => (0, _utils.validateAccessor)(splitColumn, context.columns));
    }
    if (args.splitRow) {
      args.splitRow.forEach(splitRow => (0, _utils.validateAccessor)(splitRow, context.columns));
    }
    const visConfig = {
      ...args,
      metricsToLabels: args.metricsToLabels ? JSON.parse(args.metricsToLabels) : {},
      ariaLabel: (_ref = (_args$ariaLabel = args.ariaLabel) !== null && _args$ariaLabel !== void 0 ? _args$ariaLabel : (_handlers$variables = handlers.variables) === null || _handlers$variables === void 0 ? void 0 : _handlers$variables.embeddableTitle) !== null && _ref !== void 0 ? _ref : (_handlers$getExecutio = handlers.getExecutionContext) === null || _handlers$getExecutio === void 0 ? void 0 : (_handlers$getExecutio2 = _handlers$getExecutio.call(handlers)) === null || _handlers$getExecutio2 === void 0 ? void 0 : _handlers$getExecutio2.description,
      palette: args.palette,
      dimensions: {
        metrics: args.metrics,
        buckets: args.buckets,
        splitColumn: args.splitColumn,
        splitRow: args.splitRow
      }
    };
    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      handlers.inspectorAdapters.tables.reset();
      handlers.inspectorAdapters.tables.allowCsvExport = true;
      const logTable = (0, _utils.prepareLogTable)(context, [[args.metrics, _i18n.strings.getSliceSizeHelp()], [args.buckets, _i18n.strings.getSliceHelp()], [args.splitColumn, _i18n.strings.getColumnSplitHelp()], [args.splitRow, _i18n.strings.getRowSplitHelp()]], true);
      handlers.inspectorAdapters.tables.logDatatable('default', logTable);
    }
    return {
      type: 'render',
      as: _constants2.PARTITION_VIS_RENDERER_NAME,
      value: {
        visData: context,
        visConfig,
        syncColors: (_handlers$isSyncColor = handlers === null || handlers === void 0 ? void 0 : (_handlers$isSyncColor2 = handlers.isSyncColorsEnabled) === null || _handlers$isSyncColor2 === void 0 ? void 0 : _handlers$isSyncColor2.call(handlers)) !== null && _handlers$isSyncColor !== void 0 ? _handlers$isSyncColor : false,
        visType: args.isDonut ? _types.ChartTypes.DONUT : _types.ChartTypes.PIE,
        canNavigateToLens: Boolean(handlers === null || handlers === void 0 ? void 0 : (_handlers$variables2 = handlers.variables) === null || _handlers$variables2 === void 0 ? void 0 : _handlers$variables2.canNavigateToLens),
        params: {
          listenOnChange: true
        }
      }
    };
  }
});
exports.pieVisFunction = pieVisFunction;