"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapse = void 0;
var _i18n = require("@kbn/i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * Collapses multiple rows into a single row using the specified function.
 *
 * The `by` argument specifies the columns to group by - these columns are not collapsed.
 * The `metric` arguments specifies the collumns to apply the aggregate function to.
 *
 * All other columns are removed.
 */
const collapse = {
  name: 'lens_collapse',
  type: 'datatable',
  inputTypes: ['datatable'],
  help: _i18n.i18n.translate('xpack.lens.functions.collapse.help', {
    defaultMessage: 'Collapses multiple rows into a single row using the specified aggregate function.'
  }),
  args: {
    by: {
      help: _i18n.i18n.translate('xpack.lens.functions.collapse.args.byHelpText', {
        defaultMessage: 'Columns to group by - these columns are kept as-is'
      }),
      multi: true,
      types: ['string'],
      required: false
    },
    metric: {
      help: _i18n.i18n.translate('xpack.lens.functions.collapse.args.metricHelpText', {
        defaultMessage: 'Column to calculate the specified aggregate function of'
      }),
      types: ['string'],
      multi: true,
      required: false
    },
    fn: {
      help: _i18n.i18n.translate('xpack.lens.functions.collapse.args.fnHelpText', {
        defaultMessage: 'The aggregate function to apply'
      }),
      types: ['string'],
      multi: true,
      required: true
    }
  },
  async fn(...args) {
    /** Build optimization: prevent adding extra code into initial bundle **/
    const {
      collapseFn
    } = await Promise.resolve().then(() => _interopRequireWildcard(require('./collapse_fn')));
    return collapseFn(...args);
  }
};
exports.collapse = collapse;