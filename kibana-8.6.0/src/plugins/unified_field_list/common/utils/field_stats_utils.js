"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSearchParams = buildSearchParams;
exports.canProvideStatsForField = canProvideStatsForField;
exports.fetchAndCalculateFieldStats = fetchAndCalculateFieldStats;
exports.getDateHistogram = getDateHistogram;
exports.getNumberHistogram = getNumberHistogram;
exports.getSimpleExamples = getSimpleExamples;
exports.getStringSamples = getStringSamples;
exports.sumSampledValues = sumSampledValues;
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _field_examples_calculator = require("./field_examples_calculator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const SHARD_SIZE = 5000;
const DEFAULT_TOP_VALUES_SIZE = 10;
const SIMPLE_EXAMPLES_SIZE = 100;
function buildSearchParams({
  dataViewPattern,
  timeFieldName,
  fromDate,
  toDate,
  dslQuery,
  runtimeMappings,
  aggs,
  fields,
  size
}) {
  const filter = timeFieldName ? [{
    range: {
      [timeFieldName]: {
        gte: fromDate,
        lte: toDate
      }
    }
  }, dslQuery] : [dslQuery];
  if ((fields === null || fields === void 0 ? void 0 : fields.length) === 1) {
    filter.push({
      exists: fields[0]
    });
  }
  const query = {
    bool: {
      filter
    }
  };
  return {
    index: dataViewPattern,
    body: {
      query,
      aggs,
      fields,
      runtime_mappings: runtimeMappings,
      _source: fields !== null && fields !== void 0 && fields.length ? false : undefined
    },
    track_total_hits: true,
    size: size !== null && size !== void 0 ? size : 0
  };
}
async function fetchAndCalculateFieldStats({
  searchHandler,
  dataView,
  field,
  fromDate,
  toDate,
  size
}) {
  if (!field.aggregatable) {
    return (0, _field_examples_calculator.canProvideExamplesForField)(field) ? await getSimpleExamples(searchHandler, field, dataView) : {};
  }
  if (!canProvideAggregatedStatsForField(field)) {
    return {};
  }
  if (field.type === 'histogram') {
    return await getNumberHistogram(searchHandler, field, false);
  }
  if (field.type === 'number') {
    return await getNumberHistogram(searchHandler, field);
  }
  if (field.type === 'date') {
    return await getDateHistogram(searchHandler, field, {
      fromDate,
      toDate
    });
  }
  return await getStringSamples(searchHandler, field, size);
}
function canProvideAggregatedStatsForField(field) {
  return !(field.type === 'document' || field.type.includes('range') || field.type === 'geo_point' || field.type === 'geo_shape' || field.type === 'murmur3' || field.type === 'attachment');
}
function canProvideStatsForField(field) {
  return field.aggregatable && canProvideAggregatedStatsForField(field) || !field.aggregatable && (0, _field_examples_calculator.canProvideExamplesForField)(field);
}
async function getNumberHistogram(aggSearchWithBody, field, useTopHits = true) {
  const fieldRef = getFieldRef(field);
  const baseAggs = {
    min_value: {
      min: {
        field: field.name
      }
    },
    max_value: {
      max: {
        field: field.name
      }
    },
    sample_count: {
      value_count: {
        ...fieldRef
      }
    }
  };
  const searchWithoutHits = {
    sample: {
      sampler: {
        shard_size: SHARD_SIZE
      },
      aggs: {
        ...baseAggs
      }
    }
  };
  const searchWithHits = {
    sample: {
      sampler: {
        shard_size: SHARD_SIZE
      },
      aggs: {
        ...baseAggs,
        top_values: {
          terms: {
            ...fieldRef,
            size: DEFAULT_TOP_VALUES_SIZE
          }
        }
      }
    }
  };
  const minMaxResult = await aggSearchWithBody({
    aggs: useTopHits ? searchWithHits : searchWithoutHits
  });
  const minValue = minMaxResult.aggregations.sample.min_value.value;
  const maxValue = minMaxResult.aggregations.sample.max_value.value;
  const terms = 'top_values' in minMaxResult.aggregations.sample ? minMaxResult.aggregations.sample.top_values : {
    buckets: [],
    sum_other_doc_count: 0
  };
  const topValues = {
    buckets: terms.buckets.map(bucket => ({
      count: bucket.doc_count,
      key: bucket.key
    }))
  };
  let histogramInterval = (maxValue - minValue) / 10;
  if (Number.isInteger(minValue) && Number.isInteger(maxValue)) {
    histogramInterval = Math.ceil(histogramInterval);
  }
  if (histogramInterval === 0) {
    return {
      totalDocuments: getHitsTotal(minMaxResult),
      sampledValues: sumSampledValues(topValues, terms.sum_other_doc_count) || minMaxResult.aggregations.sample.sample_count.value,
      sampledDocuments: minMaxResult.aggregations.sample.doc_count,
      topValues,
      histogram: useTopHits ? {
        buckets: []
      } : {
        // Insert a fake bucket for a single-value histogram
        buckets: [{
          count: minMaxResult.aggregations.sample.doc_count,
          key: minValue
        }]
      }
    };
  }
  const histogramBody = {
    sample: {
      sampler: {
        shard_size: SHARD_SIZE
      },
      aggs: {
        histo: {
          histogram: {
            field: field.name,
            interval: histogramInterval
          }
        }
      }
    }
  };
  const histogramResult = await aggSearchWithBody({
    aggs: histogramBody
  });
  return {
    totalDocuments: getHitsTotal(minMaxResult),
    sampledDocuments: minMaxResult.aggregations.sample.doc_count,
    sampledValues: sumSampledValues(topValues, terms.sum_other_doc_count) || minMaxResult.aggregations.sample.sample_count.value,
    histogram: {
      buckets: histogramResult.aggregations.sample.histo.buckets.map(bucket => ({
        count: bucket.doc_count,
        key: bucket.key
      }))
    },
    topValues
  };
}
async function getStringSamples(aggSearchWithBody, field, size = DEFAULT_TOP_VALUES_SIZE) {
  const fieldRef = getFieldRef(field);
  const topValuesBody = {
    sample: {
      sampler: {
        shard_size: SHARD_SIZE
      },
      aggs: {
        sample_count: {
          value_count: {
            ...fieldRef
          }
        },
        top_values: {
          terms: {
            ...fieldRef,
            size,
            // 25 is the default shard size set for size:10 by Elasticsearch.
            // Setting it to 25 for every size below 10 makes sure the shard size doesn't change for sizes 1-10, keeping the top terms stable.
            shard_size: size <= 10 ? 25 : undefined
          }
        }
      }
    }
  };
  const topValuesResult = await aggSearchWithBody({
    aggs: topValuesBody
  });
  const topValues = {
    buckets: topValuesResult.aggregations.sample.top_values.buckets.map(bucket => ({
      count: bucket.doc_count,
      key: bucket.key
    }))
  };
  return {
    totalDocuments: getHitsTotal(topValuesResult),
    sampledDocuments: topValuesResult.aggregations.sample.doc_count,
    sampledValues: sumSampledValues(topValues, topValuesResult.aggregations.sample.top_values.sum_other_doc_count) || topValuesResult.aggregations.sample.sample_count.value,
    topValues
  };
}

// This one is not sampled so that it returns the full date range
async function getDateHistogram(aggSearchWithBody, field, range) {
  const fromDate = _datemath.default.parse(range.fromDate);
  const toDate = _datemath.default.parse(range.toDate);
  if (!fromDate) {
    throw Error('Invalid fromDate value');
  }
  if (!toDate) {
    throw Error('Invalid toDate value');
  }
  const interval = Math.round((toDate.valueOf() - fromDate.valueOf()) / 10);
  if (interval < 1) {
    return {
      totalDocuments: 0,
      histogram: {
        buckets: []
      }
    };
  }

  // TODO: Respect rollup intervals
  const fixedInterval = `${interval}ms`;
  const histogramBody = {
    histo: {
      date_histogram: {
        ...getFieldRef(field),
        fixed_interval: fixedInterval
      }
    }
  };
  const results = await aggSearchWithBody({
    aggs: histogramBody
  });
  return {
    totalDocuments: getHitsTotal(results),
    histogram: {
      buckets: results.aggregations.histo.buckets.map(bucket => ({
        count: bucket.doc_count,
        key: bucket.key
      }))
    }
  };
}
async function getSimpleExamples(search, field, dataView) {
  try {
    const fieldRef = getFieldRef(field);
    const simpleExamplesBody = {
      size: SIMPLE_EXAMPLES_SIZE,
      fields: [fieldRef]
    };
    const simpleExamplesResult = await search(simpleExamplesBody);
    const fieldExampleBuckets = (0, _field_examples_calculator.getFieldExampleBuckets)({
      hits: simpleExamplesResult.hits.hits,
      field,
      dataView,
      count: DEFAULT_TOP_VALUES_SIZE
    });
    return {
      totalDocuments: getHitsTotal(simpleExamplesResult),
      sampledDocuments: fieldExampleBuckets.sampledDocuments,
      sampledValues: fieldExampleBuckets.sampledValues,
      topValues: {
        buckets: fieldExampleBuckets.buckets
      }
    };
  } catch (error) {
    console.error(error); // eslint-disable-line  no-console
    return {};
  }
}
function getFieldRef(field) {
  return field.scripted ? {
    script: {
      lang: field.lang,
      source: field.script
    }
  } : {
    field: field.name
  };
}
const getHitsTotal = body => {
  var _ref, _value;
  return (_ref = (_value = body.hits.total.value) !== null && _value !== void 0 ? _value : body.hits.total) !== null && _ref !== void 0 ? _ref : 0;
};

// We could use `aggregations.sample.sample_count.value` instead, but it does not always give a correct sum
// See Github issue #144625
function sumSampledValues(topValues, sumOtherDocCount) {
  var _topValues$buckets;
  const valuesInTopBuckets = (topValues === null || topValues === void 0 ? void 0 : (_topValues$buckets = topValues.buckets) === null || _topValues$buckets === void 0 ? void 0 : _topValues$buckets.reduce((prev, bucket) => bucket.count + prev, 0)) || 0;
  return valuesInTopBuckets + (sumOtherDocCount || 0);
}