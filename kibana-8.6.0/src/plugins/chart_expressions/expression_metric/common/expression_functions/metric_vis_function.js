"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricVisFunction = void 0;
var _i18n = require("@kbn/i18n");
var _utils = require("../../../../visualizations/common/utils");
var _charts = require("@elastic/charts");
var _types = require("../types");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const metricVisFunction = () => ({
  name: _constants.EXPRESSION_METRIC_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressionMetricVis.function.help', {
    defaultMessage: 'Metric visualization'
  }),
  args: {
    metric: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.metric.help', {
        defaultMessage: 'The primary metric.'
      }),
      required: true
    },
    secondaryMetric: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.secondaryMetric.help', {
        defaultMessage: 'The secondary metric (shown above the primary).'
      })
    },
    max: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.max.help.', {
        defaultMessage: 'The dimension containing the maximum value.'
      })
    },
    breakdownBy: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.breakdownBy.help', {
        defaultMessage: 'The dimension containing the labels for sub-categories.'
      })
    },
    trendline: {
      types: [_constants.EXPRESSION_METRIC_TRENDLINE_NAME],
      help: _i18n.i18n.translate('expressionMetricVis.function.trendline.help', {
        defaultMessage: 'An optional trendline configuration'
      })
    },
    subtitle: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.subtitle.help', {
        defaultMessage: 'The subtitle for a single metric. Overridden if breakdownBy is supplied.'
      })
    },
    secondaryPrefix: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.secondaryPrefix.help', {
        defaultMessage: 'Optional text to be show before secondaryMetric.'
      })
    },
    progressDirection: {
      types: ['string'],
      options: [_charts.LayoutDirection.Vertical, _charts.LayoutDirection.Horizontal],
      default: _charts.LayoutDirection.Vertical,
      help: _i18n.i18n.translate('expressionMetricVis.function.progressDirection.help', {
        defaultMessage: 'The direction the progress bar should grow.'
      }),
      strict: true
    },
    color: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.color.help', {
        defaultMessage: 'Provides a static visualization color. Overridden by palette.'
      })
    },
    palette: {
      types: ['palette'],
      help: _i18n.i18n.translate('expressionMetricVis.function.palette.help', {
        defaultMessage: 'Provides colors for the values, based on the bounds.'
      })
    },
    maxCols: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionMetricVis.function.numCols.help', {
        defaultMessage: 'Specifies the max number of columns in the metric grid.'
      }),
      default: 5
    },
    minTiles: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionMetricVis.function.minTiles.help', {
        defaultMessage: 'Specifies the minimum number of tiles in the metric grid regardless of the input data.'
      })
    },
    inspectorTableId: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionMetricVis.function.inspectorTableId.help', {
        defaultMessage: 'An ID for the inspector table'
      }),
      multi: false,
      default: 'default'
    }
  },
  fn(input, args, handlers) {
    var _handlers$inspectorAd, _args$palette, _args$trendline4;
    (0, _utils.validateAccessor)(args.metric, input.columns);
    (0, _utils.validateAccessor)(args.secondaryMetric, input.columns);
    (0, _utils.validateAccessor)(args.max, input.columns);
    (0, _utils.validateAccessor)(args.breakdownBy, input.columns);
    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      var _args$trendline;
      handlers.inspectorAdapters.tables.reset();
      handlers.inspectorAdapters.tables.allowCsvExport = true;
      const argsTable = [[[args.metric], _i18n.i18n.translate('expressionMetricVis.function.dimension.metric', {
        defaultMessage: 'Metric'
      })]];
      if (args.secondaryMetric) {
        argsTable.push([[args.secondaryMetric], _i18n.i18n.translate('expressionMetricVis.function.dimension.secondaryMetric', {
          defaultMessage: 'Secondary Metric'
        })]);
      }
      if (args.breakdownBy) {
        argsTable.push([[args.breakdownBy], _i18n.i18n.translate('expressionMetricVis.function.dimension.splitGroup', {
          defaultMessage: 'Split group'
        })]);
      }
      if (args.max) {
        argsTable.push([[args.max], _i18n.i18n.translate('expressionMetricVis.function.dimension.maximum', {
          defaultMessage: 'Maximum'
        })]);
      }
      const logTable = (0, _utils.prepareLogTable)(input, argsTable, true);
      handlers.inspectorAdapters.tables.logDatatable(args.inspectorTableId, logTable);
      if ((_args$trendline = args.trendline) !== null && _args$trendline !== void 0 && _args$trendline.inspectorTable && args.trendline.inspectorTableId) {
        var _args$trendline2, _args$trendline3;
        handlers.inspectorAdapters.tables.logDatatable((_args$trendline2 = args.trendline) === null || _args$trendline2 === void 0 ? void 0 : _args$trendline2.inspectorTableId, (_args$trendline3 = args.trendline) === null || _args$trendline3 === void 0 ? void 0 : _args$trendline3.inspectorTable);
      }
    }
    return {
      type: 'render',
      as: _constants.EXPRESSION_METRIC_NAME,
      value: {
        visData: input,
        visType: _types.visType,
        visConfig: {
          metric: {
            subtitle: args.subtitle,
            secondaryPrefix: args.secondaryPrefix,
            color: args.color,
            palette: (_args$palette = args.palette) === null || _args$palette === void 0 ? void 0 : _args$palette.params,
            progressDirection: args.progressDirection,
            maxCols: args.maxCols,
            minTiles: args.minTiles,
            trends: (_args$trendline4 = args.trendline) === null || _args$trendline4 === void 0 ? void 0 : _args$trendline4.trends
          },
          dimensions: {
            metric: args.metric,
            secondaryMetric: args.secondaryMetric,
            max: args.max,
            breakdownBy: args.breakdownBy
          }
        }
      }
    };
  }
});
exports.metricVisFunction = metricVisFunction;