"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetCurrentStatusRoute = void 0;
exports.getStatus = getStatus;
exports.periodToMs = periodToMs;
exports.queryMonitorStatus = queryMonitorStatus;
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _constants = require("../../../common/constants");
var _common = require("../common");
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper function that converts a monitor's schedule to a value to use to generate
 * an appropriate look-back window for snapshot count.
 * @param schedule a number/unit pair that represents how often a configured monitor runs
 * @returns schedule interval in ms
 */
function periodToMs(schedule) {
  if (Object.keys(_datemath.default.unitsMap).indexOf(schedule.unit) === -1) return 0;
  return parseInt(schedule.number, 10) * _datemath.default.unitsMap[schedule.unit].base;
}
const DEFAULT_MAX_ES_BUCKET_SIZE = 10000;
async function queryMonitorStatus(esClient, maxLocations, maxPeriod, ids) {
  const idSize = Math.trunc(DEFAULT_MAX_ES_BUCKET_SIZE / maxLocations);
  const pageCount = Math.ceil(ids.length / idSize);
  const promises = [];
  for (let i = 0; i < pageCount; i++) {
    const params = {
      size: 0,
      query: {
        bool: {
          filter: [{
            range: {
              '@timestamp': {
                gte: maxPeriod,
                // @ts-expect-error can't mix number and string in client definition
                lte: 'now'
              }
            }
          }, {
            terms: {
              'monitor.id': ids.slice(i * idSize, i * idSize + idSize)
            }
          }, {
            exists: {
              field: 'summary'
            }
          }]
        }
      },
      aggs: {
        id: {
          terms: {
            field: 'monitor.id',
            size: idSize
          },
          aggs: {
            location: {
              terms: {
                field: 'observer.geo.name',
                size: maxLocations
              },
              aggs: {
                status: {
                  top_hits: {
                    size: 1,
                    sort: [{
                      '@timestamp': {
                        order: 'desc'
                      }
                    }],
                    _source: {
                      includes: ['@timestamp', 'summary', 'monitor', 'observer', 'config_id']
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    promises.push(esClient.baseESClient.search(params));
  }
  let up = 0;
  let down = 0;
  const upConfigs = [];
  const downConfigs = [];
  for await (const response of promises) {
    var _response$aggregation;
    (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.id.buckets.forEach(({
      location
    }) => {
      location.buckets.forEach(({
        status
      }) => {
        var _status$hits$hits$0$_, _status$hits$hits$0$_2;
        const downCount = status.hits.hits[0]._source.summary.down;
        const upCount = status.hits.hits[0]._source.summary.up;
        const configId = status.hits.hits[0]._source.config_id;
        const heartbeatId = status.hits.hits[0]._source.monitor.id;
        const locationName = (_status$hits$hits$0$_ = status.hits.hits[0]._source.observer) === null || _status$hits$hits$0$_ === void 0 ? void 0 : (_status$hits$hits$0$_2 = _status$hits$hits$0$_.geo) === null || _status$hits$hits$0$_2 === void 0 ? void 0 : _status$hits$hits$0$_2.name;
        if (upCount > 0) {
          up += 1;
          upConfigs.push({
            configId,
            heartbeatId,
            location: locationName
          });
        } else if (downCount > 0) {
          down += 1;
          downConfigs.push({
            configId,
            heartbeatId,
            location: locationName
          });
        }
      });
    });
  }
  return {
    up,
    down,
    upConfigs,
    downConfigs
  };
}

/**
 * Multi-stage function that first queries all the user's saved object monitor configs.
 *
 * Subsequently, fetch the status for each monitor per location in the data streams.
 * @returns The counts of up/down/disabled monitor by location, and a map of each monitor:location status.
 */
async function getStatus(uptimeEsClient, savedObjectsClient, syntheticsMonitorClient, params) {
  const enabledIds = [];
  const {
    query
  } = params;
  let monitors;
  let disabledCount = 0;
  let page = 1;
  let maxPeriod = 0;
  let maxLocations = 1;
  /**
   * Walk through all monitor saved objects, bucket IDs by disabled/enabled status.
   *
   * Track max period to make sure the snapshot query should reach back far enough to catch
   * latest ping for all enabled monitors.
   */
  do {
    monitors = await (0, _common.getMonitors)({
      perPage: 500,
      page,
      sortField: 'name.keyword',
      sortOrder: 'asc',
      query
    }, syntheticsMonitorClient.syntheticsService, savedObjectsClient);
    page++;
    monitors.saved_objects.forEach(monitor => {
      if (monitor.attributes[_runtime_types.ConfigKey.ENABLED] === false) {
        disabledCount += monitor.attributes[_runtime_types.ConfigKey.LOCATIONS].length;
      } else {
        enabledIds.push(monitor.attributes[_runtime_types.ConfigKey.MONITOR_QUERY_ID]);
        maxLocations = Math.max(maxLocations, monitor.attributes.locations.length);
        maxPeriod = Math.max(maxPeriod, periodToMs(monitor.attributes.schedule));
      }
    });
  } while (monitors.saved_objects.length === monitors.per_page);
  const {
    up,
    down,
    upConfigs,
    downConfigs
  } = await queryMonitorStatus(uptimeEsClient, maxLocations, maxPeriod, enabledIds);
  return {
    disabledCount,
    up,
    down,
    upConfigs,
    downConfigs
  };
}
const createGetCurrentStatusRoute = libs => ({
  method: 'GET',
  path: _constants.SYNTHETICS_API_URLS.OVERVIEW_STATUS,
  validate: {
    query: _common.QuerySchema
  },
  handler: async ({
    uptimeEsClient,
    savedObjectsClient,
    syntheticsMonitorClient,
    response,
    request
  }) => {
    const params = request.query;
    return response.ok({
      body: await getStatus(uptimeEsClient, savedObjectsClient, syntheticsMonitorClient, params)
    });
  }
});
exports.createGetCurrentStatusRoute = createGetCurrentStatusRoute;