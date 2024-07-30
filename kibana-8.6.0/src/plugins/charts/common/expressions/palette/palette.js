"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.palette = palette;
var _i18n = require("@kbn/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function palette() {
  return {
    name: 'palette',
    aliases: [],
    type: 'palette',
    inputTypes: ['null'],
    help: _i18n.i18n.translate('charts.functions.paletteHelpText', {
      defaultMessage: 'Creates a color palette.'
    }),
    args: {
      color: {
        aliases: ['_'],
        multi: true,
        types: ['string'],
        help: _i18n.i18n.translate('charts.functions.palette.args.colorHelpText', {
          defaultMessage: 'The palette colors. Accepts an {html} color name, {hex}, {hsl}, {hsla}, {rgb}, or {rgba}.',
          values: {
            html: 'HTML',
            rgb: 'RGB',
            rgba: 'RGBA',
            hex: 'HEX',
            hsl: 'HSL',
            hsla: 'HSLA'
          }
        }),
        required: false
      },
      stop: {
        multi: true,
        types: ['number'],
        help: _i18n.i18n.translate('charts.functions.palette.args.stopHelpText', {
          defaultMessage: 'The palette color stops. When used, it must be associated with each color.'
        }),
        required: false
      },
      continuity: {
        types: ['string'],
        options: ['above', 'below', 'all', 'none'],
        default: 'above',
        help: ''
      },
      rangeMin: {
        types: ['number'],
        help: ''
      },
      rangeMax: {
        types: ['number'],
        help: ''
      },
      range: {
        types: ['string'],
        options: ['number', 'percent'],
        default: 'percent',
        help: ''
      },
      gradient: {
        types: ['boolean'],
        default: false,
        help: _i18n.i18n.translate('charts.functions.palette.args.gradientHelpText', {
          defaultMessage: 'Make a gradient palette where supported?'
        }),
        options: [true, false]
      },
      reverse: {
        types: ['boolean'],
        default: false,
        help: _i18n.i18n.translate('charts.functions.palette.args.reverseHelpText', {
          defaultMessage: 'Reverse the palette?'
        }),
        options: [true, false]
      }
    },
    async fn(...args) {
      /** Build optimization: prevent adding extra code into initial bundle **/
      const {
        paletteExpressionFn
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./palette_fn')));
      return paletteExpressionFn(...args);
    }
  };
}