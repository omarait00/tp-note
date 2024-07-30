"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToColumns = void 0;
var _i18n = require("@kbn/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const mapToColumns = {
  name: 'lens_map_to_columns',
  type: 'datatable',
  help: _i18n.i18n.translate('xpack.lens.functions.mapToColumns.help', {
    defaultMessage: 'A helper to transform a datatable to match Lens column definitions'
  }),
  args: {
    idMap: {
      types: ['string'],
      help: _i18n.i18n.translate('xpack.lens.functions.mapToColumns.idMap.help', {
        defaultMessage: 'A JSON encoded object in which keys are the datatable column ids and values are the Lens column definitions. Any datatable columns not mentioned within the ID map will be kept unmapped.'
      })
    }
  },
  inputTypes: ['datatable'],
  async fn(...args) {
    /** Build optimization: prevent adding extra code into initial bundle **/
    const {
      mapToOriginalColumns
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./map_to_columns_fn')));
    return mapToOriginalColumns(...args);
  }
};
exports.mapToColumns = mapToColumns;