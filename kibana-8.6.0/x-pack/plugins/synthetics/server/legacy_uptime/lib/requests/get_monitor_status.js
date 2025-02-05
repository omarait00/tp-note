"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorStatus = exports.getMonitorDownStatusMessageParams = void 0;
var _common = require("../../../../../observability/common");
var _as_mutable_array = require("../../../../common/utils/as_mutable_array");
var _es_search = require("../../../../common/utils/es_search");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMonitorDownStatusMessageParams = (info, count, numTimes, timerangeCount, timerangeUnit, oldVersionTimeRange) => {
  return {
    info,
    count,
    interval: oldVersionTimeRange ? oldVersionTimeRange.from.slice(-3) : (0, _common.formatDurationFromTimeUnitChar)(timerangeCount, timerangeUnit),
    numTimes
  };
};
exports.getMonitorDownStatusMessageParams = getMonitorDownStatusMessageParams;
const getLocationClause = locations => ({
  bool: {
    should: [...locations.map(location => ({
      term: {
        'observer.geo.name': location
      }
    }))]
  }
});
const executeQueryParams = async ({
  timestampRange,
  timespanRange,
  filters,
  afterKey,
  uptimeEsClient,
  locations
}) => {
  var _result$aggregations, _result$aggregations$, _result$aggregations2, _result$aggregations3;
  const queryParams = (0, _es_search.createEsQuery)({
    body: {
      query: {
        bool: {
          filter: [{
            exists: {
              field: 'summary'
            }
          }, {
            range: {
              'summary.down': {
                gt: '0'
              }
            }
          }, {
            range: {
              '@timestamp': {
                gte: timestampRange.from,
                lte: timestampRange.to
              }
            }
          }, {
            range: {
              'monitor.timespan': {
                gte: timespanRange.from,
                lte: timespanRange.to
              }
            }
          },
          // append user filters, if defined
          ...(filters !== null && filters !== void 0 && filters.bool ? [filters] : [])]
        }
      },
      size: 0,
      aggs: {
        monitors: {
          composite: {
            size: 2000,
            /**
             * We "paginate" results by utilizing the `afterKey` field
             * to tell Elasticsearch where it should start on subsequent queries.
             */
            ...(afterKey ? {
              after: afterKey
            } : {}),
            sources: (0, _as_mutable_array.asMutableArray)([{
              monitorId: {
                terms: {
                  field: 'monitor.id'
                }
              }
            }, {
              status: {
                terms: {
                  field: 'monitor.status'
                }
              }
            }, {
              location: {
                terms: {
                  field: 'observer.geo.name',
                  missing_bucket: true
                }
              }
            }])
          },
          aggs: {
            fields: {
              top_hits: {
                size: 1,
                sort: [{
                  '@timestamp': 'desc'
                }]
              }
            }
          }
        }
      }
    }
  });

  /**
   * Perform a logical `and` against the selected location filters.
   */
  if (locations.length) {
    queryParams.body.query.bool.filter.push(getLocationClause(locations));
  }
  const {
    body: result
  } = await uptimeEsClient.search(queryParams);
  const afterKeyRes = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$ = _result$aggregations.monitors) === null || _result$aggregations$ === void 0 ? void 0 : _result$aggregations$.after_key;
  const monitors = (result === null || result === void 0 ? void 0 : (_result$aggregations2 = result.aggregations) === null || _result$aggregations2 === void 0 ? void 0 : (_result$aggregations3 = _result$aggregations2.monitors) === null || _result$aggregations3 === void 0 ? void 0 : _result$aggregations3.buckets) || [];
  return {
    afterKeyRes,
    monitors
  };
};
const getMonitorStatus = async ({
  uptimeEsClient,
  filters,
  locations,
  numTimes,
  timespanRange,
  timestampRange
}) => {
  let afterKey;
  let monitors = [];
  do {
    // today this value is hardcoded. In the future we may support
    // multiple status types for this alert, and this will become a parameter

    const {
      afterKeyRes,
      monitors: monitorRes
    } = await executeQueryParams({
      afterKey,
      timespanRange,
      timestampRange,
      filters,
      uptimeEsClient,
      locations
    });
    afterKey = afterKeyRes;
    monitors = monitors.concat(monitorRes);
  } while (afterKey !== undefined);

  // @ts-ignore 4.3.5 upgrade - Expression produces a union type that is too complex to represent.ts(2590)
  return monitors.filter(monitor => (monitor === null || monitor === void 0 ? void 0 : monitor.doc_count) >= numTimes).map(({
    key,
    doc_count: count,
    fields
  }) => {
    var _fields$hits, _fields$hits$hits, _fields$hits$hits$;
    return {
      count,
      monitorId: key.monitorId,
      status: key.status,
      location: key.location === null ? _constants.UNNAMED_LOCATION : key.location,
      monitorInfo: fields === null || fields === void 0 ? void 0 : (_fields$hits = fields.hits) === null || _fields$hits === void 0 ? void 0 : (_fields$hits$hits = _fields$hits.hits) === null || _fields$hits$hits === void 0 ? void 0 : (_fields$hits$hits$ = _fields$hits$hits[0]) === null || _fields$hits$hits$ === void 0 ? void 0 : _fields$hits$hits$._source
    };
  });
};
exports.getMonitorStatus = getMonitorStatus;