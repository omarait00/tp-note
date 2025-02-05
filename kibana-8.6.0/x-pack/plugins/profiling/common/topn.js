"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OTHER_BUCKET_LABEL = void 0;
exports.createTopNSamples = createTopNSamples;
exports.getTopNAggregationRequest = getTopNAggregationRequest;
exports.groupSamplesByCategory = groupSamplesByCategory;
var _eui = require("@elastic/eui");
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _elasticsearch = require("./elasticsearch");
var _histogram = require("./histogram");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const OTHER_BUCKET_LABEL = _i18n.i18n.translate('xpack.profiling.topn.otherBucketLabel', {
  defaultMessage: 'Other'
});
exports.OTHER_BUCKET_LABEL = OTHER_BUCKET_LABEL;
function getTopNAggregationRequest({
  searchField,
  highCardinality,
  fixedInterval
}) {
  return {
    group_by: {
      terms: {
        field: searchField,
        order: {
          count: 'desc'
        },
        size: 99,
        execution_hint: highCardinality ? 'map' : 'global_ordinals'
      },
      aggs: {
        ...(searchField === _elasticsearch.ProfilingESField.HostID ? {
          sample: {
            top_metrics: {
              metrics: [{
                field: _elasticsearch.ProfilingESField.HostName
              }, {
                field: _elasticsearch.ProfilingESField.HostIP
              }],
              sort: {
                '@timestamp': 'desc'
              }
            }
          }
        } : {}),
        over_time: {
          date_histogram: {
            field: _elasticsearch.ProfilingESField.Timestamp,
            fixed_interval: fixedInterval
          },
          aggs: {
            count: {
              sum: {
                field: _elasticsearch.ProfilingESField.StacktraceCount
              }
            }
          }
        },
        count: {
          sum: {
            field: _elasticsearch.ProfilingESField.StacktraceCount
          }
        }
      }
    },
    over_time: {
      date_histogram: {
        field: _elasticsearch.ProfilingESField.Timestamp,
        fixed_interval: fixedInterval
      },
      aggs: {
        count: {
          sum: {
            field: _elasticsearch.ProfilingESField.StacktraceCount
          }
        }
      }
    },
    total_count: {
      sum_bucket: {
        buckets_path: 'over_time>count'
      }
    }
  };
}
function createTopNSamples(response, startMilliseconds, endMilliseconds, bucketWidth) {
  var _response$group_by$bu;
  const bucketsByCategories = new Map();
  const uniqueTimestamps = new Set();
  const groupByBuckets = (_response$group_by$bu = response.group_by.buckets) !== null && _response$group_by$bu !== void 0 ? _response$group_by$bu : [];

  // Keep track of the sum per timestamp to subtract it from the 'other' bucket
  const sumsOfKnownFieldsByTimestamp = new Map();

  // Convert the buckets into nested maps and record the unique timestamps
  for (let i = 0; i < groupByBuckets.length; i++) {
    const frameCountsByTimestamp = new Map();
    const items = groupByBuckets[i].over_time.buckets;
    for (let j = 0; j < items.length; j++) {
      var _items$j$count$value, _sumsOfKnownFieldsByT;
      const timestamp = Number(items[j].key);
      const count = (_items$j$count$value = items[j].count.value) !== null && _items$j$count$value !== void 0 ? _items$j$count$value : 0;
      uniqueTimestamps.add(timestamp);
      const sumAtTimestamp = ((_sumsOfKnownFieldsByT = sumsOfKnownFieldsByTimestamp.get(timestamp)) !== null && _sumsOfKnownFieldsByT !== void 0 ? _sumsOfKnownFieldsByT : 0) + count;
      sumsOfKnownFieldsByTimestamp.set(timestamp, sumAtTimestamp);
      frameCountsByTimestamp.set(timestamp, count);
    }
    bucketsByCategories.set(groupByBuckets[i].key, frameCountsByTimestamp);
  }

  // Create the 'other' bucket by subtracting the sum of all known buckets
  // from the total
  const otherFrameCountsByTimestamp = new Map();
  let addOtherBucket = false;
  for (let i = 0; i < response.over_time.buckets.length; i++) {
    var _bucket$count$value, _sumsOfKnownFieldsByT2;
    const bucket = response.over_time.buckets[i];
    const timestamp = Number(bucket.key);
    const valueForOtherBucket = ((_bucket$count$value = bucket.count.value) !== null && _bucket$count$value !== void 0 ? _bucket$count$value : 0) - ((_sumsOfKnownFieldsByT2 = sumsOfKnownFieldsByTimestamp.get(timestamp)) !== null && _sumsOfKnownFieldsByT2 !== void 0 ? _sumsOfKnownFieldsByT2 : 0);
    if (valueForOtherBucket > 0) {
      addOtherBucket = true;
    }
    otherFrameCountsByTimestamp.set(timestamp, valueForOtherBucket);
  }

  // Only add the 'other' bucket if at least one value per timestamp is > 0
  if (addOtherBucket) {
    bucketsByCategories.set(OTHER_BUCKET_LABEL, otherFrameCountsByTimestamp);
  }

  // Fill in missing timestamps so that the entire time range is covered
  const timestamps = (0, _histogram.createUniformBucketsForTimeRange)([...uniqueTimestamps], startMilliseconds, endMilliseconds, bucketWidth);

  // Normalize samples so there are an equal number of data points per timestamp
  const samples = [];
  for (const category of bucketsByCategories.keys()) {
    const frameCountsByTimestamp = bucketsByCategories.get(category);
    for (const timestamp of timestamps) {
      var _frameCountsByTimesta;
      const sample = {
        Timestamp: timestamp,
        Count: (_frameCountsByTimesta = frameCountsByTimestamp.get(timestamp)) !== null && _frameCountsByTimesta !== void 0 ? _frameCountsByTimesta : 0,
        Category: category
      };
      samples.push(sample);
    }
  }
  return (0, _lodash.orderBy)(samples, ['Timestamp', 'Count', 'Category'], ['asc', 'desc', 'asc']);
}
function groupSamplesByCategory({
  samples,
  totalCount,
  metadata,
  labels
}) {
  const seriesByCategory = new Map();
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    if (!seriesByCategory.has(sample.Category)) {
      seriesByCategory.set(sample.Category, []);
    }
    const series = seriesByCategory.get(sample.Category);
    series.push({
      Timestamp: sample.Timestamp,
      Count: sample.Count
    });
  }
  const subcharts = [];
  for (const [category, series] of seriesByCategory) {
    var _metadata$category;
    const totalPerCategory = series.reduce((sumOf, {
      Count
    }) => sumOf + (Count !== null && Count !== void 0 ? Count : 0), 0);
    subcharts.push({
      Category: category,
      Label: labels[category] || category,
      Percentage: totalPerCategory / totalCount * 100,
      Series: series,
      Metadata: (_metadata$category = metadata[category]) !== null && _metadata$category !== void 0 ? _metadata$category : []
    });
  }
  const colors = (0, _eui.euiPaletteColorBlind)({
    rotations: Math.ceil(subcharts.length / 10)
  });

  // We want the mapping from the category string to the color to be constant,
  // so that the same category string will always map to the same color.
  const stringhash = s => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const ch = s.charCodeAt(i);
      hash = (hash << 5) - hash + ch; // eslint-disable-line no-bitwise
      hash &= hash; // eslint-disable-line no-bitwise
    }

    return hash % subcharts.length;
  };
  return (0, _lodash.orderBy)(subcharts, ['Percentage', 'Category'], ['desc', 'asc']).map((chart, index) => {
    return {
      ...chart,
      Color: colors[stringhash(chart.Category)],
      Index: index + 1,
      Series: chart.Series.map(value => {
        return {
          ...value,
          Category: chart.Category
        };
      })
    };
  });
}