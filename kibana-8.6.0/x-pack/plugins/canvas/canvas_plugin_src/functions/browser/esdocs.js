"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esdocs = esdocs;
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _common = require("../../../../../../src/plugins/data/common");
var _services = require("../../../public/services");
var _i18n = require("../../../i18n");
var _build_bool_array = require("../../../common/lib/request/build_bool_array");
var _normalize_type = require("../../../common/lib/request/normalize_type");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function sanitize(value) {
  return value.replace(/[\(\)]/g, '_');
}
function esdocs() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().esdocs;
  return {
    name: 'esdocs',
    type: 'datatable',
    context: {
      types: ['filter']
    },
    help,
    args: {
      query: {
        types: ['string'],
        aliases: ['_', 'q'],
        help: argHelp.query,
        default: '-_index:.kibana'
      },
      count: {
        types: ['number'],
        default: 1000,
        help: argHelp.count
      },
      fields: {
        help: argHelp.fields,
        types: ['string']
      },
      index: {
        types: ['string'],
        aliases: ['dataView'],
        default: '_all',
        help: argHelp.index
      },
      // TODO: This arg isn't being used in the function.
      // We need to restore this functionality or remove it as an arg.
      metaFields: {
        help: argHelp.metaFields,
        types: ['string']
      },
      sort: {
        types: ['string'],
        help: argHelp.sort
      }
    },
    fn(input, args, {
      abortSignal
    }) {
      // Load ad-hoc to avoid adding to the page load bundle size
      return (0, _rxjs.from)(Promise.resolve().then(() => _interopRequireWildcard(require('safe-squel')))).pipe((0, _rxjs.switchMap)(squel => {
        const {
          count,
          index,
          fields,
          sort
        } = args;
        let query = squel.select({
          autoQuoteTableNames: true,
          autoQuoteFieldNames: true,
          autoQuoteAliasNames: true,
          nameQuoteCharacter: '"'
        });
        if (index) {
          query.from(index);
        }
        if (fields) {
          const allFields = fields.split(',').map(field => field.trim());
          allFields.forEach(field => query = query.field(field));
        }
        if (sort) {
          const [sortField, sortOrder] = sort.split(',').map(str => str.trim());
          if (sortField) {
            query.order(`"${sortField}"`, sortOrder === 'asc');
          }
        }
        const params = {
          query: query.toString(),
          fetch_size: count,
          field_multi_value_leniency: true,
          filter: {
            bool: {
              must: [{
                match_all: {}
              }, ...(0, _build_bool_array.buildBoolArray)([...input.and, {
                type: 'filter',
                filterType: 'luceneQueryString',
                query: args.query,
                and: []
              }])]
            }
          }
        };
        const search = _services.searchService.getService().search;
        return search.search({
          params
        }, {
          abortSignal,
          strategy: _common.SQL_SEARCH_STRATEGY
        });
      }), (0, _rxjs.catchError)(error => {
        if (!error.err) {
          error.message = `Unexpected error from Elasticsearch: ${error.message}`;
        } else {
          const {
            type,
            reason
          } = error.err.attributes;
          error.message = type === 'parsing_exception' ? `Couldn't parse Elasticsearch SQL query. You may need to add double quotes to names containing special characters. Check your query and try again. Error: ${reason}` : `Unexpected error from Elasticsearch: ${type} - ${reason}`;
        }
        return (0, _rxjs.throwError)(() => error);
      }), (0, _rxjs.map)(({
        rawResponse: body
      }) => {
        var _body$columns$map, _body$columns;
        const columns = (_body$columns$map = (_body$columns = body.columns) === null || _body$columns === void 0 ? void 0 : _body$columns.map(({
          name,
          type
        }) => ({
          id: sanitize(name),
          name: sanitize(name),
          meta: {
            type: (0, _normalize_type.normalizeType)(type)
          }
        }))) !== null && _body$columns$map !== void 0 ? _body$columns$map : [];
        const columnNames = columns.map(({
          name
        }) => name);
        const rows = body.rows.map(row => (0, _lodash.zipObject)(columnNames, row));
        return {
          type: 'datatable',
          meta: {
            type: 'essql'
          },
          columns,
          rows
        };
      }));
    }
  };
}