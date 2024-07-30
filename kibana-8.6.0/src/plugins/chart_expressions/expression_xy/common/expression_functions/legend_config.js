"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legendConfigFunction = void 0;
var _charts = require("@elastic/charts");
var _i18n = require("@kbn/i18n");
var _constants = require("../../../../visualizations/common/constants");
var _constants2 = require("../constants");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const legendConfigFunction = {
  name: _constants2.LEGEND_CONFIG,
  aliases: [],
  type: _constants2.LEGEND_CONFIG,
  help: _i18n.i18n.translate('expressionXY.legendConfig.help', {
    defaultMessage: `Configure the xy chart's legend`
  }),
  inputTypes: ['null'],
  args: {
    isVisible: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionXY.legendConfig.isVisible.help', {
        defaultMessage: 'Specifies whether or not the legend is visible.'
      }),
      default: true
    },
    position: {
      types: ['string'],
      options: [_charts.Position.Top, _charts.Position.Right, _charts.Position.Bottom, _charts.Position.Left],
      help: _i18n.i18n.translate('expressionXY.legendConfig.position.help', {
        defaultMessage: 'Specifies the legend position.'
      }),
      strict: true
    },
    showSingleSeries: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionXY.legendConfig.showSingleSeries.help', {
        defaultMessage: 'Specifies whether a legend with just a single entry should be shown'
      })
    },
    isInside: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionXY.legendConfig.isInside.help', {
        defaultMessage: 'Specifies whether a legend is inside the chart'
      })
    },
    horizontalAlignment: {
      types: ['string'],
      options: [_charts.HorizontalAlignment.Right, _charts.HorizontalAlignment.Left],
      help: _i18n.i18n.translate('expressionXY.legendConfig.horizontalAlignment.help', {
        defaultMessage: 'Specifies the horizontal alignment of the legend when it is displayed inside chart.'
      }),
      strict: true
    },
    verticalAlignment: {
      types: ['string'],
      options: [_charts.VerticalAlignment.Top, _charts.VerticalAlignment.Bottom],
      help: _i18n.i18n.translate('expressionXY.legendConfig.verticalAlignment.help', {
        defaultMessage: 'Specifies the vertical alignment of the legend when it is displayed inside chart.'
      }),
      strict: true
    },
    floatingColumns: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionXY.legendConfig.floatingColumns.help', {
        defaultMessage: 'Specifies the number of columns when legend is displayed inside chart.'
      })
    },
    maxLines: {
      types: ['number'],
      help: _i18n.i18n.translate('expressionXY.legendConfig.maxLines.help', {
        defaultMessage: 'Specifies the number of lines per legend item.'
      })
    },
    shouldTruncate: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('expressionXY.legendConfig.shouldTruncate.help', {
        defaultMessage: 'Specifies whether the legend items will be truncated or not'
      })
    },
    legendSize: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionXY.legendConfig.legendSize.help', {
        defaultMessage: 'Specifies the legend size.'
      }),
      options: [_constants.LegendSize.AUTO, _constants.LegendSize.SMALL, _constants.LegendSize.MEDIUM, _constants.LegendSize.LARGE, _constants.LegendSize.EXTRA_LARGE],
      strict: true
    }
  },
  async fn(input, args, handlers) {
    const {
      legendConfigFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./legend_config_fn')));
    return await legendConfigFn(input, args, handlers);
  }
};
exports.legendConfigFunction = legendConfigFunction;