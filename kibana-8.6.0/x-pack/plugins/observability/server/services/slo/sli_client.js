"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSLIClient = void 0;
var _std = require("@kbn/std");
var _constants = require("../../assets/constants");
var _date_range = require("../../domain/services/date_range");
var _errors = require("../../errors");
var _schema = require("../../types/schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DefaultSLIClient {
  constructor(esClient) {
    this.esClient = esClient;
  }
  async fetchCurrentSLIData(slo) {
    const dateRange = (0, _date_range.toDateRange)(slo.time_window);
    if (_schema.occurencesBudgetingMethodSchema.is(slo.budgeting_method)) {
      const result = await this.esClient.search({
        ...commonQuery(slo, dateRange),
        aggs: {
          good: {
            sum: {
              field: 'slo.numerator'
            }
          },
          total: {
            sum: {
              field: 'slo.denominator'
            }
          }
        }
      });
      return handleResult(result.aggregations, dateRange);
    }
    if (_schema.timeslicesBudgetingMethodSchema.is(slo.budgeting_method)) {
      const result = await this.esClient.search({
        ...commonQuery(slo, dateRange),
        aggs: {
          slices: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: toInterval(slo.objective.timeslice_window)
            },
            aggs: {
              good: {
                sum: {
                  field: 'slo.numerator'
                }
              },
              total: {
                sum: {
                  field: 'slo.denominator'
                }
              },
              good_slice: {
                bucket_script: {
                  buckets_path: {
                    good: 'good',
                    total: 'total'
                  },
                  script: `params.good / params.total >= ${slo.objective.timeslice_target} ? 1 : 0`
                }
              },
              count_slice: {
                bucket_script: {
                  buckets_path: {},
                  script: '1'
                }
              }
            }
          },
          good: {
            sum_bucket: {
              buckets_path: 'slices>good_slice.value'
            }
          },
          total: {
            sum_bucket: {
              buckets_path: 'slices>count_slice.value'
            }
          }
        }
      });
      return handleResult(result.aggregations, dateRange);
    }
    (0, _std.assertNever)(slo.budgeting_method);
  }
  async fetchSLIDataFrom(slo, lookbackWindows) {
    const sortedLookbackWindows = [...lookbackWindows].sort((a, b) => a.duration.isShorterThan(b.duration) ? 1 : -1);
    const longestLookbackWindow = sortedLookbackWindows[0];
    const longestDateRange = (0, _date_range.toDateRange)({
      duration: longestLookbackWindow.duration,
      is_rolling: true
    });
    if (_schema.occurencesBudgetingMethodSchema.is(slo.budgeting_method)) {
      const result = await this.esClient.search({
        ...commonQuery(slo, longestDateRange),
        aggs: toLookbackWindowsAggregationsQuery(sortedLookbackWindows)
      });
      return handleWindowedResult(result.aggregations, lookbackWindows);
    }
    if (_schema.timeslicesBudgetingMethodSchema.is(slo.budgeting_method)) {
      const result = await this.esClient.search({
        ...commonQuery(slo, longestDateRange),
        aggs: toLookbackWindowsSlicedAggregationsQuery(slo, sortedLookbackWindows)
      });
      return handleWindowedResult(result.aggregations, lookbackWindows);
    }
    (0, _std.assertNever)(slo.budgeting_method);
  }
}
exports.DefaultSLIClient = DefaultSLIClient;
function commonQuery(slo, dateRange) {
  return {
    size: 0,
    index: `${_constants.SLO_DESTINATION_INDEX_NAME}*`,
    query: {
      bool: {
        filter: [{
          term: {
            'slo.id': slo.id
          }
        }, {
          term: {
            'slo.revision': slo.revision
          }
        }, {
          range: {
            '@timestamp': {
              gte: dateRange.from.toISOString(),
              lt: dateRange.to.toISOString()
            }
          }
        }]
      }
    }
  };
}
function handleResult(aggregations, dateRange) {
  const good = aggregations === null || aggregations === void 0 ? void 0 : aggregations.good;
  const total = aggregations === null || aggregations === void 0 ? void 0 : aggregations.total;
  if (good === undefined || good.value === null || total === undefined || total.value === null) {
    throw new _errors.InternalQueryError('SLI aggregation query');
  }
  return {
    date_range: dateRange,
    good: good.value,
    total: total.value
  };
}
function toLookbackWindowsAggregationsQuery(sortedLookbackWindow) {
  return sortedLookbackWindow.reduce((acc, lookbackWindow) => ({
    ...acc,
    [lookbackWindow.name]: {
      date_range: {
        field: '@timestamp',
        ranges: [{
          from: `now-${lookbackWindow.duration.format()}/m`,
          to: 'now/m'
        }]
      },
      aggs: {
        good: {
          sum: {
            field: 'slo.numerator'
          }
        },
        total: {
          sum: {
            field: 'slo.denominator'
          }
        }
      }
    }
  }), {});
}
function toLookbackWindowsSlicedAggregationsQuery(slo, lookbackWindows) {
  return lookbackWindows.reduce((acc, lookbackWindow) => ({
    ...acc,
    [lookbackWindow.name]: {
      date_range: {
        field: '@timestamp',
        ranges: [{
          from: `now-${lookbackWindow.duration.format()}/m`,
          to: 'now/m'
        }]
      },
      aggs: {
        slices: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: toInterval(slo.objective.timeslice_window)
          },
          aggs: {
            good: {
              sum: {
                field: 'slo.numerator'
              }
            },
            total: {
              sum: {
                field: 'slo.denominator'
              }
            },
            good_slice: {
              bucket_script: {
                buckets_path: {
                  good: 'good',
                  total: 'total'
                },
                script: `params.good / params.total >= ${slo.objective.timeslice_target} ? 1 : 0`
              }
            },
            count_slice: {
              bucket_script: {
                buckets_path: {},
                script: '1'
              }
            }
          }
        },
        good: {
          sum_bucket: {
            buckets_path: 'slices>good_slice.value'
          }
        },
        total: {
          sum_bucket: {
            buckets_path: 'slices>count_slice.value'
          }
        }
      }
    }
  }), {});
}
function handleWindowedResult(aggregations, lookbackWindows) {
  if (aggregations === undefined) {
    throw new _errors.InternalQueryError('Invalid aggregation response');
  }
  const indicatorDataPerLookbackWindow = {};
  lookbackWindows.forEach(lookbackWindow => {
    var _aggregations$lookbac;
    const windowAggBuckets = (_aggregations$lookbac = aggregations[lookbackWindow.name]) === null || _aggregations$lookbac === void 0 ? void 0 : _aggregations$lookbac.buckets;
    if (!Array.isArray(windowAggBuckets) || windowAggBuckets.length === 0) {
      throw new _errors.InternalQueryError('Invalid aggregation bucket response');
    }
    const bucket = windowAggBuckets[0];
    const good = bucket.good.value;
    const total = bucket.total.value;
    if (good === null || total === null) {
      throw new _errors.InternalQueryError('Invalid aggregation sum bucket response');
    }
    indicatorDataPerLookbackWindow[lookbackWindow.name] = {
      good,
      total,
      date_range: {
        from: new Date(bucket.from_as_string),
        to: new Date(bucket.to_as_string)
      }
    };
  });
  return indicatorDataPerLookbackWindow;
}
function toInterval(duration) {
  if (duration === undefined) return '1m';
  return duration.format();
}