"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layeredXyVisFunction = void 0;
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
var _common_xy_args = require("./common_xy_args");
var _i18n2 = require("../i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const layeredXyVisFunction = {
  name: _constants.LAYERED_XY_VIS,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n2.strings.getXYHelp(),
  args: {
    ..._common_xy_args.commonXYArgs,
    layers: {
      types: [_constants.EXTENDED_DATA_LAYER, _constants.REFERENCE_LINE_LAYER, _constants.REFERENCE_LINE],
      help: _i18n.i18n.translate('expressionXY.layeredXyVis.layers.help', {
        defaultMessage: 'Layers of visual series'
      }),
      multi: true
    },
    annotations: {
      types: ['event_annotations_result'],
      help: _i18n.i18n.translate('expressionXY.layeredXyVis.annotations.help', {
        defaultMessage: 'Annotations'
      })
    },
    splitColumnAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n2.strings.getSplitColumnAccessorHelp()
    },
    splitRowAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n2.strings.getSplitRowAccessorHelp()
    },
    singleTable: {
      types: ['boolean'],
      help: _i18n.i18n.translate('expressionXY.layeredXyVis.singleTable.help', {
        defaultMessage: 'All layers use the one datatable'
      }),
      default: false
    }
  },
  async fn(data, args, handlers) {
    const {
      layeredXyVisFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./layered_xy_vis_fn')));
    return await layeredXyVisFn(data, args, handlers);
  }
};
exports.layeredXyVisFunction = layeredXyVisFunction;