"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendedDataLayerFunction = void 0;
var _constants = require("../constants");
var _i18n = require("../i18n");
var _common_data_layer_args = require("./common_data_layer_args");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const extendedDataLayerFunction = {
  name: _constants.EXTENDED_DATA_LAYER,
  aliases: [],
  type: _constants.EXTENDED_DATA_LAYER,
  help: _i18n.strings.getDataLayerFnHelp(),
  inputTypes: ['datatable'],
  args: {
    ..._common_data_layer_args.commonDataLayerArgs,
    xAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getXAccessorHelp()
    },
    splitAccessors: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getSplitAccessorHelp(),
      multi: true
    },
    accessors: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getAccessorsHelp(),
      multi: true
    },
    markSizeAccessor: {
      types: ['vis_dimension', 'string'],
      help: _i18n.strings.getMarkSizeAccessorHelp()
    },
    layerId: {
      types: ['string'],
      help: _i18n.strings.getLayerIdHelp()
    }
  },
  async fn(input, args, context) {
    const {
      extendedDataLayerFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./extended_data_layer_fn')));
    return await extendedDataLayerFn(input, args, context);
  }
};
exports.extendedDataLayerFunction = extendedDataLayerFunction;