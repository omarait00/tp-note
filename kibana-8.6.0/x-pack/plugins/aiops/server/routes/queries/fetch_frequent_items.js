"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropDuplicates = dropDuplicates;
exports.fetchFrequentItems = fetchFrequentItems;
exports.groupDuplicates = groupDuplicates;
var _lodash = require("lodash");
var _mlAggUtils = require("@kbn/ml-agg-utils");
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FREQUENT_ITEMS_FIELDS_LIMIT = 15;
function isRandomSamplerAggregation(arg) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['sample']);
}
function dropDuplicates(cps, uniqueFields) {
  return (0, _lodash.uniqWith)(cps, (a, b) => (0, _lodash.isEqual)((0, _lodash.pick)(a, uniqueFields), (0, _lodash.pick)(b, uniqueFields)));
}
function groupDuplicates(cps, uniqueFields) {
  const groups = [];
  for (const cp of cps) {
    const compareAttributes = (0, _lodash.pick)(cp, uniqueFields);
    const groupIndex = groups.findIndex(g => (0, _lodash.isEqual)(g.keys, compareAttributes));
    if (groupIndex === -1) {
      groups.push({
        keys: compareAttributes,
        group: [cp]
      });
    } else {
      groups[groupIndex].group.push(cp);
    }
  }
  return groups;
}
async function fetchFrequentItems(client, index, searchQuery, changePoints, timeFieldName, deviationMin, deviationMax, logger,
// The default value of 1 means no sampling will be used
sampleProbability = 1, emitError, abortSignal) {
  // Sort change points by ascending p-value, necessary to apply the field limit correctly.
  const sortedChangePoints = changePoints.slice().sort((a, b) => {
    var _a$pValue, _b$pValue;
    return ((_a$pValue = a.pValue) !== null && _a$pValue !== void 0 ? _a$pValue : 0) - ((_b$pValue = b.pValue) !== null && _b$pValue !== void 0 ? _b$pValue : 0);
  });

  // Get up to 15 unique fields from change points with retained order
  const fields = sortedChangePoints.reduce((p, c) => {
    if (p.length < FREQUENT_ITEMS_FIELDS_LIMIT && !p.some(d => d === c.fieldName)) {
      p.push(c.fieldName);
    }
    return p;
  }, []);
  const query = {
    bool: {
      minimum_should_match: 2,
      filter: [searchQuery, {
        range: {
          [timeFieldName]: {
            gte: deviationMin,
            lt: deviationMax
          }
        }
      }],
      should: sortedChangePoints.map(t => {
        return {
          term: {
            [t.fieldName]: t.fieldValue
          }
        };
      })
    }
  };
  const aggFields = fields.map(field => ({
    field
  }));
  const frequentItemsAgg = {
    fi: {
      // @ts-expect-error `frequent_items` is not yet part of `AggregationsAggregationContainer`
      frequent_items: {
        minimum_set_size: 2,
        size: 200,
        minimum_support: 0.1,
        fields: aggFields
      }
    }
  };

  // frequent items can be slow, so sample and use 10% min_support
  const randomSamplerAgg = {
    sample: {
      // @ts-expect-error `random_sampler` is not yet part of `AggregationsAggregationContainer`
      random_sampler: {
        probability: sampleProbability,
        seed: _mlAggUtils.RANDOM_SAMPLER_SEED
      },
      aggs: frequentItemsAgg
    }
  };
  const esBody = {
    query,
    aggs: sampleProbability < 1 ? randomSamplerAgg : frequentItemsAgg,
    size: 0,
    track_total_hits: true
  };
  const body = await client.search({
    index,
    size: 0,
    body: esBody
  }, {
    signal: abortSignal,
    maxRetries: 0
  });
  if (body.aggregations === undefined) {
    logger.error(`Failed to fetch frequent_items, got: \n${JSON.stringify(body, null, 2)}`);
    emitError(`Failed to fetch frequent_items.`);
    return {
      fields: [],
      df: [],
      totalDocCount: 0
    };
  }
  const totalDocCountFi = body.hits.total.value;
  const frequentItems = isRandomSamplerAggregation(body.aggregations) ? body.aggregations.sample.fi : body.aggregations.fi;
  const shape = frequentItems.buckets.length;
  let maximum = shape;
  if (maximum > 50000) {
    maximum = 50000;
  }
  const fiss = frequentItems.buckets;
  fiss.length = maximum;
  const results = [];
  fiss.forEach(fis => {
    const result = {
      set: {},
      size: 0,
      maxPValue: 0,
      doc_count: 0,
      support: 0,
      total_doc_count: 0
    };
    let maxPValue;
    Object.entries(fis.key).forEach(([key, value]) => {
      var _sortedChangePoints$f;
      result.set[key] = value[0];
      const pValue = (_sortedChangePoints$f = sortedChangePoints.find(t => t.fieldName === key && t.fieldValue === value[0])) === null || _sortedChangePoints$f === void 0 ? void 0 : _sortedChangePoints$f.pValue;
      if (pValue !== undefined && pValue !== null) {
        var _maxPValue;
        maxPValue = Math.max((_maxPValue = maxPValue) !== null && _maxPValue !== void 0 ? _maxPValue : 0, pValue);
      }
    });
    if (maxPValue === undefined) {
      return;
    }
    result.size = Object.keys(result.set).length;
    result.maxPValue = maxPValue;
    result.doc_count = fis.doc_count;
    result.support = fis.support;
    result.total_doc_count = totalDocCountFi;
    results.push(result);
  });
  results.sort((a, b) => {
    return b.doc_count - a.doc_count;
  });
  const uniqueFields = (0, _lodash.uniq)(results.flatMap(r => Object.keys(r.set)));
  return {
    fields: uniqueFields,
    df: results,
    totalDocCount: totalDocCountFi
  };
}