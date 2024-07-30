"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referenceLineLayerFunction = void 0;
var _constants = require("../constants");
var _i18n = require("../i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const referenceLineLayerFunction = {
  name: _constants.REFERENCE_LINE_LAYER,
  aliases: [],
  type: _constants.REFERENCE_LINE_LAYER,
  help: _i18n.strings.getRLHelp(),
  inputTypes: ['datatable'],
  args: {
    accessors: {
      types: ['string'],
      help: _i18n.strings.getRLAccessorsHelp(),
      multi: true
    },
    decorations: {
      types: [_constants.REFERENCE_LINE_DECORATION_CONFIG],
      help: _i18n.strings.getRLDecorationConfigHelp(),
      multi: true
    },
    columnToLabel: {
      types: ['string'],
      help: _i18n.strings.getColumnToLabelHelp()
    },
    table: {
      types: ['datatable'],
      help: _i18n.strings.getTableHelp()
    },
    layerId: {
      types: ['string'],
      help: _i18n.strings.getLayerIdHelp()
    }
  },
  async fn(input, args, context) {
    const {
      referenceLineLayerFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./reference_line_layer_fn')));
    return await referenceLineLayerFn(input, args, context);
  }
};
exports.referenceLineLayerFunction = referenceLineLayerFunction;