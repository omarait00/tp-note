"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xyVisFunction = void 0;
var _constants = require("../constants");
var _i18n = require("../i18n");
var _common_xy_args = require("./common_xy_args");
var _common_data_layer_args = require("./common_data_layer_args");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const xyVisFunction = {
  name: _constants.XY_VIS,
  type: 'render',
  inputTypes: ['datatable'],
  help: _i18n.strings.getXYHelp(),
  args: {
    ..._common_xy_args.commonXYArgs,
    ..._common_data_layer_args.commonDataLayerArgs,
    xAccessor: {
      types: ['string', 'vis_dimension'],
      help: _i18n.strings.getXAccessorHelp()
    },
    splitAccessors: {
      types: ['string', 'vis_dimension'],
      help: _i18n.strings.getSplitAccessorHelp(),
      multi: true
    },
    accessors: {
      types: ['string', 'vis_dimension'],
      help: _i18n.strings.getAccessorsHelp(),
      multi: true
    },
    referenceLines: {
      types: [_constants.REFERENCE_LINE],
      help: _i18n.strings.getReferenceLinesHelp(),
      multi: true
    },
    splitColumnAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getSplitColumnAccessorHelp()
    },
    splitRowAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getSplitRowAccessorHelp()
    },
    markSizeAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getMarkSizeAccessorHelp()
    }
  },
  async fn(data, args, handlers) {
    const {
      xyVisFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./xy_vis_fn')));
    return await xyVisFn(data, args, handlers);
  }
};
exports.xyVisFunction = xyVisFunction;