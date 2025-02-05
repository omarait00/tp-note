"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gaugeFunction = exports.errors = void 0;
var _i18n = require("@kbn/i18n");
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../constants");
var _utils2 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const errors = {
  centralMajorNotSupportedForShapeError: shape => _i18n.i18n.translate('expressionGauge.functions.gauge.errors.centralMajorNotSupportedForShapeError', {
    defaultMessage: 'Fields "centralMajor" and "centralMajorMode" are not supported by the shape "{shape}"',
    values: {
      shape
    }
  })
};
exports.errors = errors;
const strings = {
  getMetricHelp: () => _i18n.i18n.translate('expressionGauge.logDatatable.metric', {
    defaultMessage: 'Metric'
  }),
  getMinHelp: () => _i18n.i18n.translate('expressionGauge.logDatatable.min', {
    defaultMessage: 'Min'
  }),
  getMaxHelp: () => _i18n.i18n.translate('expressionGauge.logDatatable.max', {
    defaultMessage: 'Max'
  }),
  getGoalHelp: () => _i18n.i18n.translate('expressionGauge.logDatatable.goal', {
    defaultMessage: 'Goal'
  })
};
const gaugeFunction = () => ({
  name: _constants.EXPRESSION_GAUGE_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('expressionGauge.functions.gauge.help', {
    defaultMessage: 'Gauge visualization'
  }),
  args: {
    shape: {
      types: ['string'],
      options: [_constants.GaugeShapes.HORIZONTAL_BULLET, _constants.GaugeShapes.VERTICAL_BULLET, _constants.GaugeShapes.ARC, _constants.GaugeShapes.CIRCLE],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.shape.help', {
        defaultMessage: 'Type of gauge chart'
      }),
      required: true,
      strict: true
    },
    metric: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.metric.help', {
        defaultMessage: 'Current value'
      })
    },
    min: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.min.help', {
        defaultMessage: 'Minimum value'
      })
    },
    max: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.max.help', {
        defaultMessage: 'Maximum value'
      })
    },
    goal: {
      types: ['string', 'vis_dimension'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.goal.help', {
        defaultMessage: 'Goal Value'
      })
    },
    colorMode: {
      types: ['string'],
      default: _constants.GaugeColorModes.NONE,
      options: [_constants.GaugeColorModes.NONE, _constants.GaugeColorModes.PALETTE],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.colorMode.help', {
        defaultMessage: 'If set to palette, the palette colors will be applied to the bands'
      }),
      strict: true
    },
    palette: {
      types: ['palette'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.palette.help', {
        defaultMessage: 'Provides colors for the values'
      })
    },
    ticksPosition: {
      types: ['string'],
      default: _constants.GaugeTicksPositions.AUTO,
      options: [_constants.GaugeTicksPositions.HIDDEN, _constants.GaugeTicksPositions.AUTO, _constants.GaugeTicksPositions.BANDS],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.ticksPosition.help', {
        defaultMessage: 'Specifies the placement of ticks'
      }),
      strict: true
    },
    labelMajor: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.labelMajor.help', {
        defaultMessage: 'Specifies the labelMajor of the gauge chart displayed inside the chart.'
      })
    },
    labelMajorMode: {
      types: ['string'],
      options: [_constants.GaugeLabelMajorModes.NONE, _constants.GaugeLabelMajorModes.AUTO, _constants.GaugeLabelMajorModes.CUSTOM],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.labelMajorMode.help', {
        defaultMessage: 'Specifies the mode of labelMajor'
      }),
      default: _constants.GaugeLabelMajorModes.AUTO,
      strict: true
    },
    labelMinor: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.labelMinor.help', {
        defaultMessage: 'Specifies the labelMinor of the gauge chart'
      })
    },
    centralMajor: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.centralMajor.help', {
        defaultMessage: 'Specifies the centralMajor of the gauge chart displayed inside the chart.'
      })
    },
    centralMajorMode: {
      types: ['string'],
      options: [_constants.GaugeLabelMajorModes.NONE, _constants.GaugeLabelMajorModes.AUTO, _constants.GaugeLabelMajorModes.CUSTOM],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.centralMajorMode.help', {
        defaultMessage: 'Specifies the mode of centralMajor'
      }),
      strict: true
    },
    // used only in legacy gauge, consider it as @deprecated
    percentageMode: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.percentageMode.help', {
        defaultMessage: 'Enables relative precentage mode'
      })
    },
    respectRanges: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.respectRanges.help', {
        defaultMessage: 'Respect max and min values from ranges'
      })
    },
    commonLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionGauge.functions.gauge.args.commonLabel.help', {
        defaultMessage: 'Specifies the common label outside the chart'
      })
    },
    ariaLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionGauge.functions.gaugeChart.config.ariaLabel.help', {
        defaultMessage: 'Specifies the aria label of the gauge chart'
      })
    }
  },
  fn(data, args, handlers) {
    var _handlers$inspectorAd, _ref, _args$ariaLabel, _handlers$variables, _handlers$getExecutio, _handlers$getExecutio2, _handlers$variables2;
    (0, _utils.validateAccessor)(args.metric, data.columns);
    (0, _utils.validateAccessor)(args.min, data.columns);
    (0, _utils.validateAccessor)(args.max, data.columns);
    (0, _utils.validateAccessor)(args.goal, data.columns);
    const {
      centralMajor,
      centralMajorMode,
      ...restArgs
    } = args;
    const {
      metric,
      min,
      max,
      goal
    } = restArgs;
    if (!(0, _utils2.isRoundShape)(args.shape) && (centralMajorMode || centralMajor)) {
      throw new Error(errors.centralMajorNotSupportedForShapeError(args.shape));
    }
    if (handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables) {
      handlers.inspectorAdapters.tables.reset();
      handlers.inspectorAdapters.tables.allowCsvExport = true;
      const logTable = (0, _utils.prepareLogTable)(data, [[metric ? [metric] : undefined, strings.getMetricHelp()], [min ? [min] : undefined, strings.getMinHelp()], [max ? [max] : undefined, strings.getMaxHelp()], [goal ? [goal] : undefined, strings.getGoalHelp()]], true);
      handlers.inspectorAdapters.tables.logDatatable('default', logTable);
    }
    const centralMajorArgs = (0, _utils2.isRoundShape)(args.shape) ? {
      centralMajorMode: !centralMajorMode ? _constants.GaugeCentralMajorModes.AUTO : centralMajorMode,
      centralMajor
    } : {};
    return {
      type: 'render',
      as: _constants.EXPRESSION_GAUGE_NAME,
      value: {
        data,
        args: {
          ...restArgs,
          ...centralMajorArgs,
          ariaLabel: (_ref = (_args$ariaLabel = args.ariaLabel) !== null && _args$ariaLabel !== void 0 ? _args$ariaLabel : (_handlers$variables = handlers.variables) === null || _handlers$variables === void 0 ? void 0 : _handlers$variables.embeddableTitle) !== null && _ref !== void 0 ? _ref : (_handlers$getExecutio = handlers.getExecutionContext) === null || _handlers$getExecutio === void 0 ? void 0 : (_handlers$getExecutio2 = _handlers$getExecutio.call(handlers)) === null || _handlers$getExecutio2 === void 0 ? void 0 : _handlers$getExecutio2.description
        },
        canNavigateToLens: Boolean(handlers === null || handlers === void 0 ? void 0 : (_handlers$variables2 = handlers.variables) === null || _handlers$variables2 === void 0 ? void 0 : _handlers$variables2.canNavigateToLens)
      }
    };
  }
});
exports.gaugeFunction = gaugeFunction;