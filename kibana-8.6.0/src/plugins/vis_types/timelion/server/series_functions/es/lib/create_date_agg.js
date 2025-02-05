"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDateAgg;
var _agg_body = require("./agg_body");
var _server = require("../../../../../../data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const {
  dateHistogramInterval
} = _server.search.aggs;
function createDateAgg(config, tlConfig, scriptFields) {
  const dateAgg = {
    time_buckets: {
      meta: {
        type: 'time_buckets'
      },
      date_histogram: {
        field: config.timefield,
        time_zone: config.timezone || tlConfig.time.timezone,
        extended_bounds: {
          min: tlConfig.time.from,
          max: tlConfig.time.to
        },
        min_doc_count: 0,
        ...dateHistogramInterval(config.interval, config.forceFixedInterval)
      }
    }
  };
  dateAgg.time_buckets.aggs = {};
  (config.metric || []).forEach(metric => {
    const metricBody = {};
    const [metricName, metricArgs] = metric.split(/:(.+)/);
    if (metricName === _server.METRIC_TYPES.COUNT) {
      // This is pretty lame, but its how the "doc_count" metric has to be implemented at the moment
      // It simplifies the aggregation tree walking code considerably
      metricBody[metricName] = {
        bucket_script: {
          buckets_path: '_count',
          script: {
            source: '_value',
            lang: 'expression'
          }
        }
      };
    } else if (metricName && metricArgs) {
      const splittedArgs = metricArgs.split(/(.*[^\\]):/).filter(Boolean);
      const field = splittedArgs[0].replace(/\\:/g, ':');
      const percentArgs = splittedArgs[1];
      const metricKey = metricName + '(' + field + ')';
      metricBody[metricKey] = {
        [metricName]: (0, _agg_body.buildAggBody)(field, scriptFields)
      };
      if (metricName === _server.METRIC_TYPES.PERCENTILES && percentArgs) {
        let percentList = percentArgs.split(',');
        percentList = percentList.map(x => parseFloat(x));
        metricBody[metricKey][metricName].percents = percentList;
      }
    } else {
      throw new Error('`metric` requires metric:field or simply count');
    }
    dateAgg.time_buckets.aggs = {
      ...dateAgg.time_buckets.aggs,
      ...metricBody
    };
  });
  return dateAgg;
}
module.exports = exports.default;