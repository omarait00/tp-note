"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricVisFunction = void 0;
var _i18n = require("@kbn/i18n");
var _utils = require("../../../../visualizations/common/utils");
var _common = require("../../../../charts/common");
var _types = require("../types");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const errors = {
  severalMetricsAndColorFullBackgroundSpecifiedError: () => _i18n.i18n.translate('expressionLegacyMetricVis.function.errors.severalMetricsAndColorFullBackgroundSpecified', {
    defaultMessage: 'Full background coloring cannot be applied to a visualization with multiple metrics.'
  }),
  splitByBucketAndColorFullBackgroundSpecifiedError: () => _i18n.i18n.translate('expressionLegacyMetricVis.function.errors.splitByBucketAndColorFullBackgroundSpecified', {
    defaultMessage: 'Full background coloring cannot be applied to visualizations that have a bucket specified.'
  })
};
const metricVisFunction = () => ({
  name: _constants.EXPRESSION_METRIC_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressionLegacyMetricVis.function.help', {
    defaultMessage: 'Metric visualization'
  }),
  args: {
    autoScaleMetricAlignment: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.autoScaleMetricAlignment.help', {
        defaultMessage: 'Metric alignment after scaled'
      }),
      required: false
    },
    percentageMode: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.percentageMode.help', {
        defaultMessage: 'Shows metric in percentage mode. Requires colorRange to be set.'
      })
    },
    colorMode: {
      types: ['string'],
      default: `"${_common.ColorMode.None}"`,
      options: [_common.ColorMode.None, _common.ColorMode.Labels, _common.ColorMode.Background],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.colorMode.help', {
        defaultMessage: 'Which part of metric to color'
      }),
      strict: true
    },
    colorFullBackground: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.colorFullBackground.help', {
        defaultMessage: 'Applies the selected background color to the full visualization container'
      })
    },
    palette: {
      types: ['palette'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.palette.help', {
        defaultMessage: 'Provides colors for the values, based on the bounds.'
      })
    },
    showLabels: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.showLabels.help', {
        defaultMessage: 'Shows labels under the metric values.'
      })
    },
    font: {
      types: ['style'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.font.help', {
        defaultMessage: 'Font settings.'
      }),
      default: `{font size=60 align="center"}`
    },
    labelFont: {
      types: ['style'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.labelFont.help', {
        defaultMessage: 'Label font settings.'
      }),
      default: `{font size=24 align="center"}`
    },
    labelPosition: {
      types: ['string'],
      options: [_constants.LabelPosition.BOTTOM, _constants.LabelPosition.TOP],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.labelPosition.help', {
        defaultMessage: 'Label position'
      }),
      default: _constants.LabelPosition.BOTTOM,
      strict: true
    },
    metric: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.metric.help', {
        defaultMessage: 'metric dimension configuration'
      }),
      required: true,
      multi: true
    },
    bucket: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.bucket.help', {
        defaultMessage: 'bucket dimension configuration'
      })
    },
    autoScale: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionLegacyMetricVis.function.autoScale.help', {
        defaultMessage: 'Enable auto scale'
      }),
      required: false
    }
  },
  fn(input, args, handlers) {
    var _args$palette, _handlers$inspectorAd, _args$palette2, _handlers$variables;
    if (args.percentageMode && !((_args$palette = args.palette) !== null && _args$palette !== void 0 && _args$palette.params)) {
      throw new Error('Palette must be provided when using percentageMode');
    }

    // currently we can allow colorize full container only for one metric
    if (args.colorFullBackground) {
      if (args.bucket) {
        throw new Error(errors.splitByBucketAndColorFullBackgroundSpecifiedError());
      }
      if (args.metric.length > 1 || input.rows.length > 1) {
        throw new Error(errors.severalMetricsAndColorFullBackgroundSpecifiedError());
      }
    }
    args.metric.forEach(metric => (0, _utils.validateAccessor)(metric, input.columns));
    (0, _utils.validateAccessor)(args.bucket, input.columns);
    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      handlers.inspectorAdapters.tables.reset();
      handlers.inspectorAdapters.tables.allowCsvExport = true;
      const argsTable = [[args.metric, _i18n.i18n.translate('expressionLegacyMetricVis.function.dimension.metric', {
        defaultMessage: 'Metric'
      })]];
      if (args.bucket) {
        argsTable.push([[args.bucket], _i18n.i18n.translate('expressionLegacyMetricVis.function.dimension.splitGroup', {
          defaultMessage: 'Split group'
        })]);
      }
      const logTable = (0, _utils.prepareLogTable)(input, argsTable, true);
      handlers.inspectorAdapters.tables.logDatatable('default', logTable);
    }
    return {
      type: 'render',
      as: _constants.EXPRESSION_METRIC_NAME,
      value: {
        visData: input,
        visType: _types.visType,
        visConfig: {
          metric: {
            ...(args.autoScaleMetricAlignment ? {
              autoScaleMetricAlignment: args.autoScaleMetricAlignment
            } : {}),
            palette: (_args$palette2 = args.palette) === null || _args$palette2 === void 0 ? void 0 : _args$palette2.params,
            percentageMode: args.percentageMode,
            metricColorMode: args.colorMode,
            labels: {
              show: args.showLabels,
              position: args.labelPosition,
              style: {
                ...args.labelFont
              }
            },
            colorFullBackground: args.colorFullBackground,
            style: {
              bgColor: args.colorMode === _common.ColorMode.Background,
              labelColor: args.colorMode === _common.ColorMode.Labels,
              ...args.font
            },
            autoScale: args.autoScale
          },
          dimensions: {
            metrics: args.metric,
            ...(args.bucket ? {
              bucket: args.bucket
            } : {})
          }
        },
        canNavigateToLens: Boolean(handlers === null || handlers === void 0 ? void 0 : (_handlers$variables = handlers.variables) === null || _handlers$variables === void 0 ? void 0 : _handlers$variables.canNavigateToLens)
      }
    };
  }
});
exports.metricVisFunction = metricVisFunction;