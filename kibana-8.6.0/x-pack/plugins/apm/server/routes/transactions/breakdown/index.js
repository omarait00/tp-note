"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionBreakdown = getTransactionBreakdown;
var _lodash = require("lodash");
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _formatters = require("../../../../common/utils/formatters");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _metrics = require("../../../lib/helpers/metrics");
var _constants = require("./constants");
var _viz_colors = require("../../../../common/viz_colors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTransactionBreakdown({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  transactionName,
  transactionType,
  start,
  end
}) {
  var _resp$aggregations;
  const subAggs = {
    sum_all_self_times: {
      sum: {
        field: _elasticsearch_fieldnames.SPAN_SELF_TIME_SUM
      }
    },
    types: {
      terms: {
        field: _elasticsearch_fieldnames.SPAN_TYPE,
        size: 20,
        order: {
          _count: 'desc'
        }
      },
      aggs: {
        subtypes: {
          terms: {
            field: _elasticsearch_fieldnames.SPAN_SUBTYPE,
            missing: '',
            size: 20,
            order: {
              _count: 'desc'
            }
          },
          aggs: {
            total_self_time_per_subtype: {
              sum: {
                field: _elasticsearch_fieldnames.SPAN_SELF_TIME_SUM
              }
            }
          }
        }
      }
    }
  };
  const filters = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, {
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
    }
  }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), {
    exists: {
      field: _elasticsearch_fieldnames.SPAN_SELF_TIME_SUM
    }
  }];
  if (transactionName) {
    filters.push({
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    });
  }
  const params = {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: filters
        }
      },
      aggs: {
        ...subAggs,
        by_date: {
          date_histogram: (0, _metrics.getMetricsDateHistogramParams)({
            start,
            end,
            metricsInterval: config.metricsInterval
          }),
          aggs: subAggs
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_transaction_breakdown', params);
  const formatBucket = aggs => {
    const sumAllSelfTimes = aggs.sum_all_self_times.value || 0;
    const breakdowns = (0, _lodash.flatten)(aggs.types.buckets.map(bucket => {
      const type = bucket.key;
      return bucket.subtypes.buckets.map(subBucket => {
        return {
          name: subBucket.key || type,
          percentage: (subBucket.total_self_time_per_subtype.value || 0) / sumAllSelfTimes
        };
      });
    }));
    return breakdowns;
  };
  const visibleKpis = resp.aggregations ? (0, _lodash.orderBy)(formatBucket(resp.aggregations), 'percentage', 'desc').slice(0, _constants.MAX_KPIS) : [];
  const kpis = (0, _lodash.orderBy)(visibleKpis.map(kpi => ({
    ...kpi,
    lowerCaseName: kpi.name.toLowerCase()
  })), 'lowerCaseName').map((kpi, index) => {
    const {
      lowerCaseName,
      ...rest
    } = kpi;
    return {
      ...rest,
      color: (0, _viz_colors.getVizColorForIndex)(index)
    };
  });
  const kpiNames = kpis.map(kpi => kpi.name);
  const bucketsByDate = ((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.by_date.buckets) || [];
  const timeseriesPerSubtype = bucketsByDate.reduce((prev, bucket) => {
    const formattedValues = formatBucket(bucket);
    const time = bucket.key;
    const updatedSeries = kpiNames.reduce((p, kpiName) => {
      const {
        name,
        percentage
      } = formattedValues.find(val => val.name === kpiName) || {
        name: kpiName,
        percentage: null
      };
      if (!p[name]) {
        p[name] = [];
      }
      return {
        ...p,
        [name]: p[name].concat({
          x: time,
          y: percentage
        })
      };
    }, prev);
    const lastValues = Object.values(updatedSeries).map(_lodash.last);

    // If for a given timestamp, some series have data, but others do not,
    // we have to set any null values to 0 to make sure the stacked area chart
    // is drawn correctly.
    // If we set all values to 0, the chart always displays null values as 0,
    // and the chart looks weird.
    const hasAnyValues = lastValues.some(value => (value === null || value === void 0 ? void 0 : value.y) !== null);
    const hasNullValues = lastValues.some(value => (value === null || value === void 0 ? void 0 : value.y) === null);
    if (hasAnyValues && hasNullValues) {
      Object.values(updatedSeries).forEach(series => {
        const value = series[series.length - 1];
        const isEmpty = value.y === null;
        if (isEmpty) {
          // local mutation to prevent complicated map/reduce calls
          value.y = 0;
        }
      });
    }
    return updatedSeries;
  }, {});
  const timeseries = kpis.map(kpi => ({
    title: kpi.name,
    color: kpi.color,
    type: 'areaStacked',
    data: timeseriesPerSubtype[kpi.name],
    hideLegend: false,
    legendValue: (0, _formatters.asPercent)(kpi.percentage, 1)
  }));
  return {
    timeseries
  };
}