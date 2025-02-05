"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaTelemetryAdapter = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _moment = _interopRequireDefault(require("moment"));
var _saved_objects = require("../../saved_objects/saved_objects");
var _lib = require("../../lib");
var _es_search = require("../../../../../common/utils/es_search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// seconds in an hour
const BUCKET_SIZE = 3600;
// take buckets in the last day
const BUCKET_NUMBER = 24;
class KibanaTelemetryAdapter {
  static initUsageCollector(usageCollector, getSavedObjectsClient) {
    return usageCollector.makeUsageCollector({
      type: 'uptime',
      schema: {
        last_24_hours: {
          hits: {
            autoRefreshEnabled: {
              type: 'boolean'
            },
            autorefreshInterval: {
              type: 'array',
              items: {
                type: 'long'
              }
            },
            dateRangeEnd: {
              type: 'array',
              items: {
                type: 'date'
              }
            },
            dateRangeStart: {
              type: 'array',
              items: {
                type: 'date'
              }
            },
            monitor_frequency: {
              type: 'array',
              items: {
                type: 'long'
              }
            },
            monitor_name_stats: {
              avg_length: {
                type: 'float',
                _meta: {
                  description: 'This field represents the average length of monitor names'
                }
              },
              max_length: {
                type: 'long',
                _meta: {
                  description: 'This field represents the max length of monitor names'
                }
              },
              min_length: {
                type: 'long',
                _meta: {
                  description: 'This field represents the min length of monitor names'
                }
              }
            },
            monitor_page: {
              type: 'long'
            },
            no_of_unique_monitors: {
              type: 'long',
              _meta: {
                description: 'This field represents the number of unique configured monitors'
              }
            },
            no_of_unique_observer_locations: {
              type: 'long',
              _meta: {
                description: 'This field represents the number of unique monitor observer locations'
              }
            },
            observer_location_name_stats: {
              avg_length: {
                type: 'float',
                _meta: {
                  description: 'This field represents the average length of monitor observer location names'
                }
              },
              max_length: {
                type: 'long',
                _meta: {
                  description: 'This field represents the max length of monitor observer location names'
                }
              },
              min_length: {
                type: 'long',
                _meta: {
                  description: 'This field represents the min length of monitor observer location names'
                }
              }
            },
            overview_page: {
              type: 'long'
            },
            settings_page: {
              type: 'long'
            },
            fleet_monitor_name_stats: {
              avg_length: {
                type: 'float',
                _meta: {
                  description: 'This field represents the average length of fleet managed monitor names'
                }
              },
              max_length: {
                type: 'long',
                _meta: {
                  description: 'This field represents the max length of fleet managed monitor names'
                }
              },
              min_length: {
                type: 'long',
                _meta: {
                  description: 'This field represents the min length of fleet managed monitor names'
                }
              }
            },
            fleet_monitor_frequency: {
              type: 'array',
              items: {
                type: 'long',
                _meta: {
                  description: 'This field represents the average the monitor frequency of fleet managed monitors'
                }
              }
            },
            fleet_no_of_unique_monitors: {
              type: 'long',
              _meta: {
                description: 'This field represents the number of unique configured fleet managed monitors'
              }
            }
          }
        }
      },
      fetch: async ({
        esClient
      }) => {
        const savedObjectsClient = getSavedObjectsClient();
        if (savedObjectsClient) {
          const uptimeEsClient = (0, _lib.createUptimeESClient)({
            esClient,
            savedObjectsClient
          });
          await this.countNoOfUniqueMonitorAndLocations(uptimeEsClient, savedObjectsClient);
          await this.countNoOfUniqueFleetManagedMonitors(uptimeEsClient);
        }
        const report = this.getReport();
        return {
          last_24_hours: {
            hits: {
              ...report
            }
          }
        };
      },
      isReady: () => typeof getSavedObjectsClient() !== 'undefined'
    });
  }
  static clearLocalTelemetry() {
    this.collector = {};
  }
  static countPageView(pageView) {
    const bucketId = this.getBucketToIncrement();
    const bucket = this.collector[bucketId];
    if (pageView.page === 'Overview') {
      bucket.overview_page += 1;
    }
    if (pageView.page === 'Monitor') {
      bucket.monitor_page += 1;
    }
    if (pageView.page === 'Settings') {
      bucket.settings_page += 1;
    }
    this.updateDateData(pageView, bucket);
    return bucket;
  }
  static updateDateData({
    dateStart,
    dateEnd,
    autoRefreshEnabled,
    autorefreshInterval
  }, bucket) {
    const prevDateStart = [...bucket.dateRangeStart].pop();
    if (!prevDateStart || prevDateStart !== dateStart) {
      bucket.dateRangeStart.push(dateStart);
      bucket.dateRangeEnd.push(dateEnd);
    } else {
      const prevDateEnd = [...bucket.dateRangeEnd].pop();
      if (!prevDateEnd || prevDateEnd !== dateEnd) {
        bucket.dateRangeStart.push(dateStart);
        bucket.dateRangeEnd.push(dateEnd);
      }
    }
    const prevAutorefreshInterval = [...bucket.autorefreshInterval].pop();
    if (!prevAutorefreshInterval || prevAutorefreshInterval !== autorefreshInterval) {
      bucket.autorefreshInterval.push(autorefreshInterval);
    }
    bucket.autoRefreshEnabled = autoRefreshEnabled;
  }
  static async countNoOfUniqueMonitorAndLocations(callCluster, savedObjectsClient) {
    var _result$aggregations$, _result$aggregations, _result$aggregations$2, _result$aggregations$3, _result$aggregations2, _result$aggregations3, _result$aggregations4, _result$aggregations5, _result$aggregations6, _monitorNameStats$min, _monitorNameStats$max, _monitorNameStats$avg, _monitorNameStats$avg2, _locationNameStats$mi, _locationNameStats$ma, _locationNameStats$av, _locationNameStats$av2;
    const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
    const params = (0, _es_search.createEsQuery)({
      index: dynamicSettings.heartbeatIndices,
      body: {
        query: {
          bool: {
            must: [{
              range: {
                '@timestamp': {
                  gte: 'now-1d/d',
                  lt: 'now'
                }
              }
            }, {
              exists: {
                field: 'summary'
              }
            }]
          }
        },
        size: 0,
        aggs: {
          unique_monitors: {
            cardinality: {
              field: 'monitor.id'
            }
          },
          unique_locations: {
            cardinality: {
              field: 'observer.geo.name',
              missing: 'N/A'
            }
          },
          monitor_name: {
            string_stats: {
              field: 'monitor.name'
            }
          },
          observer_loc_name: {
            string_stats: {
              field: 'observer.geo.name'
            }
          },
          monitors: {
            terms: {
              field: 'monitor.id',
              size: 1000
            },
            aggs: {
              docs: {
                top_hits: {
                  size: 1,
                  _source: ['monitor.timespan']
                }
              }
            }
          }
        }
      }
    });
    const {
      body: result
    } = await callCluster.search(params, 'telemetryLog');
    const numberOfUniqueMonitors = (_result$aggregations$ = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$2 = _result$aggregations.unique_monitors) === null || _result$aggregations$2 === void 0 ? void 0 : _result$aggregations$2.value) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : 0;
    const numberOfUniqueLocations = (_result$aggregations$3 = result === null || result === void 0 ? void 0 : (_result$aggregations2 = result.aggregations) === null || _result$aggregations2 === void 0 ? void 0 : (_result$aggregations3 = _result$aggregations2.unique_locations) === null || _result$aggregations3 === void 0 ? void 0 : _result$aggregations3.value) !== null && _result$aggregations$3 !== void 0 ? _result$aggregations$3 : 0;
    const monitorNameStats = result === null || result === void 0 ? void 0 : (_result$aggregations4 = result.aggregations) === null || _result$aggregations4 === void 0 ? void 0 : _result$aggregations4.monitor_name;
    const locationNameStats = result === null || result === void 0 ? void 0 : (_result$aggregations5 = result.aggregations) === null || _result$aggregations5 === void 0 ? void 0 : _result$aggregations5.observer_loc_name;
    const uniqueMonitors = result === null || result === void 0 ? void 0 : (_result$aggregations6 = result.aggregations) === null || _result$aggregations6 === void 0 ? void 0 : _result$aggregations6.monitors.buckets;
    const bucketId = this.getBucketToIncrement();
    const bucket = this.collector[bucketId];
    bucket.no_of_unique_monitors = numberOfUniqueMonitors;
    bucket.no_of_unique_observer_locations = numberOfUniqueLocations;
    bucket.no_of_unique_observer_locations = numberOfUniqueLocations;
    bucket.monitor_name_stats = {
      min_length: (_monitorNameStats$min = monitorNameStats === null || monitorNameStats === void 0 ? void 0 : monitorNameStats.min_length) !== null && _monitorNameStats$min !== void 0 ? _monitorNameStats$min : 0,
      max_length: (_monitorNameStats$max = monitorNameStats === null || monitorNameStats === void 0 ? void 0 : monitorNameStats.max_length) !== null && _monitorNameStats$max !== void 0 ? _monitorNameStats$max : 0,
      avg_length: +((_monitorNameStats$avg = monitorNameStats === null || monitorNameStats === void 0 ? void 0 : (_monitorNameStats$avg2 = monitorNameStats.avg_length) === null || _monitorNameStats$avg2 === void 0 ? void 0 : _monitorNameStats$avg2.toFixed(2)) !== null && _monitorNameStats$avg !== void 0 ? _monitorNameStats$avg : 0)
    };
    bucket.observer_location_name_stats = {
      min_length: (_locationNameStats$mi = locationNameStats === null || locationNameStats === void 0 ? void 0 : locationNameStats.min_length) !== null && _locationNameStats$mi !== void 0 ? _locationNameStats$mi : 0,
      max_length: (_locationNameStats$ma = locationNameStats === null || locationNameStats === void 0 ? void 0 : locationNameStats.max_length) !== null && _locationNameStats$ma !== void 0 ? _locationNameStats$ma : 0,
      avg_length: +((_locationNameStats$av = locationNameStats === null || locationNameStats === void 0 ? void 0 : (_locationNameStats$av2 = locationNameStats.avg_length) === null || _locationNameStats$av2 === void 0 ? void 0 : _locationNameStats$av2.toFixed(2)) !== null && _locationNameStats$av !== void 0 ? _locationNameStats$av : 0)
    };
    bucket.monitor_frequency = this.getMonitorsFrequency(uniqueMonitors);
    return bucket;
  }
  static async countNoOfUniqueFleetManagedMonitors(callCluster) {
    var _result$aggregations$4, _result$aggregations7, _result$aggregations8, _result$aggregations9, _result$aggregations10, _monitorNameStats$min2, _monitorNameStats$max2, _monitorNameStats$avg3, _monitorNameStats$avg4;
    const params = {
      index: 'synthetics-*',
      body: {
        query: {
          bool: {
            must: [{
              range: {
                '@timestamp': {
                  gte: 'now-1d/d',
                  lt: 'now'
                }
              }
            }, {
              exists: {
                field: 'summary'
              }
            }, {
              term: {
                'monitor.fleet_managed': true
              }
            }]
          }
        },
        size: 0,
        aggs: {
          unique_monitors: {
            cardinality: {
              field: 'monitor.id'
            }
          },
          monitor_name: {
            string_stats: {
              field: 'monitor.name'
            }
          },
          monitors: {
            terms: {
              field: 'monitor.id',
              size: 1000
            },
            aggs: {
              docs: {
                top_hits: {
                  size: 1,
                  _source: ['monitor.timespan']
                }
              }
            }
          }
        }
      }
    };
    const {
      body: result
    } = await callCluster.search(params, 'telemetryLogFleet');
    const numberOfUniqueMonitors = (_result$aggregations$4 = result === null || result === void 0 ? void 0 : (_result$aggregations7 = result.aggregations) === null || _result$aggregations7 === void 0 ? void 0 : (_result$aggregations8 = _result$aggregations7.unique_monitors) === null || _result$aggregations8 === void 0 ? void 0 : _result$aggregations8.value) !== null && _result$aggregations$4 !== void 0 ? _result$aggregations$4 : 0;
    const monitorNameStats = result === null || result === void 0 ? void 0 : (_result$aggregations9 = result.aggregations) === null || _result$aggregations9 === void 0 ? void 0 : _result$aggregations9.monitor_name;
    const uniqueMonitors = result === null || result === void 0 ? void 0 : (_result$aggregations10 = result.aggregations) === null || _result$aggregations10 === void 0 ? void 0 : _result$aggregations10.monitors.buckets;
    const bucketId = this.getBucketToIncrement();
    const bucket = this.collector[bucketId];
    bucket.fleet_no_of_unique_monitors = numberOfUniqueMonitors;
    bucket.fleet_monitor_name_stats = {
      min_length: (_monitorNameStats$min2 = monitorNameStats === null || monitorNameStats === void 0 ? void 0 : monitorNameStats.min_length) !== null && _monitorNameStats$min2 !== void 0 ? _monitorNameStats$min2 : 0,
      max_length: (_monitorNameStats$max2 = monitorNameStats === null || monitorNameStats === void 0 ? void 0 : monitorNameStats.max_length) !== null && _monitorNameStats$max2 !== void 0 ? _monitorNameStats$max2 : 0,
      avg_length: +((_monitorNameStats$avg3 = monitorNameStats === null || monitorNameStats === void 0 ? void 0 : (_monitorNameStats$avg4 = monitorNameStats.avg_length) === null || _monitorNameStats$avg4 === void 0 ? void 0 : _monitorNameStats$avg4.toFixed(2)) !== null && _monitorNameStats$avg3 !== void 0 ? _monitorNameStats$avg3 : 0)
    };
    bucket.fleet_monitor_frequency = this.getMonitorsFrequency(uniqueMonitors);
    return bucket;
  }
  static getMonitorsFrequency(uniqueMonitors = []) {
    const frequencies = [];
    uniqueMonitors.map(item => {
      var _docs$hits$hits$, _docs$hits, _docs$hits$hits;
      return (_docs$hits$hits$ = (_docs$hits = item.docs.hits) === null || _docs$hits === void 0 ? void 0 : (_docs$hits$hits = _docs$hits.hits) === null || _docs$hits$hits === void 0 ? void 0 : _docs$hits$hits[0]) !== null && _docs$hits$hits$ !== void 0 ? _docs$hits$hits$ : {};
    }).forEach(monitor => {
      var _monitor$_source, _monitor$_source$moni;
      const timespan = monitor === null || monitor === void 0 ? void 0 : (_monitor$_source = monitor._source) === null || _monitor$_source === void 0 ? void 0 : (_monitor$_source$moni = _monitor$_source.monitor) === null || _monitor$_source$moni === void 0 ? void 0 : _monitor$_source$moni.timespan;
      if (timespan) {
        const timeDiffSec = _moment.default.duration((0, _moment.default)(timespan.lt).diff((0, _moment.default)(timespan.gte))).asSeconds();
        frequencies.push(timeDiffSec);
      }
    });
    return frequencies;
  }
  static getReport() {
    const minBucket = this.getCollectorWindow();
    Object.keys(this.collector).map(key => parseInt(key, 10)).filter(key => key < minBucket).forEach(oldBucket => {
      delete this.collector[oldBucket];
    });
    return Object.values(this.collector).reduce((acc, cum) => ({
      ...cum,
      overview_page: acc.overview_page + cum.overview_page,
      monitor_page: acc.monitor_page + cum.monitor_page,
      settings_page: acc.settings_page + cum.settings_page
    }), {
      overview_page: 0,
      monitor_page: 0,
      settings_page: 0
    });
  }
  static getBucket() {
    const nowInSeconds = Math.round(Date.now() / 1000);
    return nowInSeconds - nowInSeconds % BUCKET_SIZE;
  }
  static getBucketToIncrement() {
    const bucketId = this.getBucket();
    if (!this.collector[bucketId]) {
      this.collector[bucketId] = {
        overview_page: 0,
        monitor_page: 0,
        no_of_unique_monitors: 0,
        settings_page: 0,
        monitor_frequency: [],
        monitor_name_stats: {
          min_length: 0,
          max_length: 0,
          avg_length: 0
        },
        no_of_unique_observer_locations: 0,
        observer_location_name_stats: {
          min_length: 0,
          max_length: 0,
          avg_length: 0
        },
        dateRangeStart: [],
        dateRangeEnd: [],
        autoRefreshEnabled: false,
        autorefreshInterval: [],
        fleet_no_of_unique_monitors: 0,
        fleet_monitor_frequency: [],
        fleet_monitor_name_stats: {
          min_length: 0,
          max_length: 0,
          avg_length: 0
        }
      };
    }
    return bucketId;
  }
  static getCollectorWindow() {
    return this.getBucket() - BUCKET_SIZE * (BUCKET_NUMBER - 1);
  }
}
exports.KibanaTelemetryAdapter = KibanaTelemetryAdapter;
(0, _defineProperty2.default)(KibanaTelemetryAdapter, "registerUsageCollector", (usageCollector, getSavedObjectsClient) => {
  if (!usageCollector) {
    return;
  }
  const collector = KibanaTelemetryAdapter.initUsageCollector(usageCollector, getSavedObjectsClient);
  usageCollector.registerCollector(collector);
});
(0, _defineProperty2.default)(KibanaTelemetryAdapter, "collector", {});