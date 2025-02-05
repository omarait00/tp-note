"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEssqlFn = void 0;
var _esQuery = require("@kbn/es-query");
var _fieldTypes = require("@kbn/field-types");
var _i18n = require("@kbn/i18n");
var _common = require("../../../../inspector/common");
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _es_query = require("../../es_query");
var _query = require("../../query");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function normalizeType(type) {
  switch (type) {
    case _fieldTypes.ES_FIELD_TYPES._INDEX:
    case _fieldTypes.ES_FIELD_TYPES.GEO_POINT:
    case _fieldTypes.ES_FIELD_TYPES.IP:
      return _fieldTypes.KBN_FIELD_TYPES.STRING;
    case '_version':
      return _fieldTypes.KBN_FIELD_TYPES.NUMBER;
    case 'datetime':
      return _fieldTypes.KBN_FIELD_TYPES.DATE;
    default:
      return (0, _fieldTypes.castEsToKbnFieldTypeName)(type);
  }
}
function sanitize(value) {
  return value.replace(/[\(\)]/g, '_');
}
const getEssqlFn = ({
  getStartDependencies
}) => {
  const essql = {
    name: 'essql',
    type: 'datatable',
    inputTypes: ['kibana_context', 'null'],
    help: _i18n.i18n.translate('data.search.essql.help', {
      defaultMessage: 'Queries Elasticsearch using Elasticsearch SQL.'
    }),
    args: {
      query: {
        aliases: ['_', 'q'],
        types: ['string'],
        help: _i18n.i18n.translate('data.search.essql.query.help', {
          defaultMessage: 'An Elasticsearch SQL query.'
        })
      },
      parameter: {
        aliases: ['param'],
        types: ['string', 'number', 'boolean'],
        multi: true,
        help: _i18n.i18n.translate('data.search.essql.parameter.help', {
          defaultMessage: 'A parameter to be passed to the SQL query.'
        })
      },
      count: {
        types: ['number'],
        help: _i18n.i18n.translate('data.search.essql.count.help', {
          defaultMessage: 'The number of documents to retrieve. For better performance, use a smaller data set.'
        }),
        default: 1000
      },
      timezone: {
        aliases: ['tz'],
        types: ['string'],
        default: 'UTC',
        help: _i18n.i18n.translate('data.search.essql.timezone.help', {
          defaultMessage: 'The timezone to use for date operations. Valid ISO8601 formats and UTC offsets both work.'
        })
      },
      timeField: {
        aliases: ['timeField'],
        types: ['string'],
        help: _i18n.i18n.translate('data.search.essql.timeField.help', {
          defaultMessage: 'The time field to use in the time range filter set in the context.'
        })
      }
    },
    fn(input, {
      count,
      parameter,
      query,
      timeField,
      timezone
    }, {
      abortSignal,
      inspectorAdapters,
      getKibanaRequest
    }) {
      return (0, _rxjs.defer)(() => getStartDependencies(() => {
        const request = getKibanaRequest === null || getKibanaRequest === void 0 ? void 0 : getKibanaRequest();
        if (!request) {
          throw new Error('A KibanaRequest is required to run queries on the server. ' + 'Please provide a request object to the expression execution params.');
        }
        return request;
      })).pipe((0, _operators.switchMap)(({
        nowProvider,
        search,
        uiSettings
      }) => {
        const params = {
          query,
          fetch_size: count,
          time_zone: timezone,
          params: parameter,
          field_multi_value_leniency: true
        };
        if (input) {
          var _input$filters;
          const esQueryConfigs = (0, _es_query.getEsQueryConfig)(uiSettings);
          const timeFilter = input.timeRange && (0, _query.getTime)(undefined, input.timeRange, {
            fieldName: timeField,
            forceNow: nowProvider === null || nowProvider === void 0 ? void 0 : nowProvider.get()
          });
          params.filter = (0, _esQuery.buildEsQuery)(undefined, input.query || [], [...((_input$filters = input.filters) !== null && _input$filters !== void 0 ? _input$filters : []), ...(timeFilter ? [timeFilter] : [])], esQueryConfigs);
        }
        let startTime = Date.now();
        const logInspectorRequest = () => {
          if (!inspectorAdapters.requests) {
            inspectorAdapters.requests = new _common.RequestAdapter();
          }
          const request = inspectorAdapters.requests.start(_i18n.i18n.translate('data.search.dataRequest.title', {
            defaultMessage: 'Data'
          }), {
            description: _i18n.i18n.translate('data.search.es_search.dataRequest.description', {
              defaultMessage: 'This request queries Elasticsearch to fetch the data for the visualization.'
            })
          }, startTime);
          startTime = Date.now();
          return request;
        };
        return search({
          params
        }, {
          abortSignal,
          strategy: _.SQL_SEARCH_STRATEGY
        }).pipe((0, _operators.catchError)(error => {
          if (!error.err) {
            error.message = `Unexpected error from Elasticsearch: ${error.message}`;
          } else {
            const {
              type,
              reason
            } = error.err.attributes;
            if (type === 'parsing_exception') {
              error.message = `Couldn't parse Elasticsearch SQL query. You may need to add double quotes to names containing special characters. Check your query and try again. Error: ${reason}`;
            } else {
              error.message = `Unexpected error from Elasticsearch: ${type} - ${reason}`;
            }
          }
          return (0, _rxjs.throwError)(() => error);
        }), (0, _operators.tap)({
          next({
            rawResponse,
            took
          }) {
            logInspectorRequest().stats({
              hits: {
                label: _i18n.i18n.translate('data.search.es_search.hitsLabel', {
                  defaultMessage: 'Hits'
                }),
                value: `${rawResponse.rows.length}`,
                description: _i18n.i18n.translate('data.search.es_search.hitsDescription', {
                  defaultMessage: 'The number of documents returned by the query.'
                })
              },
              queryTime: {
                label: _i18n.i18n.translate('data.search.es_search.queryTimeLabel', {
                  defaultMessage: 'Query time'
                }),
                value: _i18n.i18n.translate('data.search.es_search.queryTimeValue', {
                  defaultMessage: '{queryTime}ms',
                  values: {
                    queryTime: took
                  }
                }),
                description: _i18n.i18n.translate('data.search.es_search.queryTimeDescription', {
                  defaultMessage: 'The time it took to process the query. ' + 'Does not include the time to send the request or parse it in the browser.'
                })
              }
            }).json(params).ok({
              json: rawResponse
            });
          },
          error(error) {
            logInspectorRequest().error({
              json: error
            });
          }
        }));
      }), (0, _operators.map)(({
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
            type: normalizeType(type)
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
  return essql;
};
exports.getEssqlFn = getEssqlFn;