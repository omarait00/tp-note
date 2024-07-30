"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedObjectsCounts = getSavedObjectsCounts;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const MISSING_TYPE_KEY = 'missing_so_type';

/**
 * Object describing the output of {@link getSavedObjectsCounts} method.
 */

/**
 * Returns the total number of Saved Objects indexed in Elasticsearch.
 * It also returns a break-down of the document count for all the built-in SOs in Kibana (or the types specified in `soTypes`).
 * Finally, it completes the information with an `others` counter, that indicates the number of documents that do not match the SO type breakdown.
 *
 * @param esClient The {@link ElasticsearchClient} to use when performing the aggregation.
 * @param kibanaIndex The index where SOs are stored. Typically '.kibana'.
 * @param soTypes The SO types we want to know about.
 * @param exclusive If `true`, the results will only contain the breakdown for the specified `soTypes`. Otherwise, it'll also return `missing` and `others` bucket.
 * @returns {@link SavedObjectsCounts}
 */
async function getSavedObjectsCounts(esClient, kibanaIndex,
// Typically '.kibana'. We might need a way to obtain it from the SavedObjects client (or the SavedObjects client to provide a way to run aggregations?)
soTypes, exclusive = false) {
  var _body$aggregations, _body$aggregations$ty, _ref, _body$hits, _body$hits2, _body$hits3, _body$hits3$total, _body$aggregations$ty2, _body$aggregations2, _body$aggregations2$t;
  const body = await esClient.search({
    index: kibanaIndex,
    ignore_unavailable: true,
    filter_path: ['aggregations.types.buckets', 'aggregations.types.sum_other_doc_count', 'hits.total'],
    body: {
      size: 0,
      track_total_hits: true,
      query: exclusive ? {
        terms: {
          type: soTypes
        }
      } : {
        match_all: {}
      },
      aggs: {
        types: {
          terms: {
            field: 'type',
            // If `exclusive == true`, we only care about the strict length of the provided SO types.
            // Otherwise, we want to account for the `missing` bucket (size and missing option).
            ...(exclusive ? {
              size: soTypes.length
            } : {
              missing: MISSING_TYPE_KEY,
              size: soTypes.length + 1
            })
          }
        }
      }
    }
  });
  const buckets = ((_body$aggregations = body.aggregations) === null || _body$aggregations === void 0 ? void 0 : (_body$aggregations$ty = _body$aggregations.types) === null || _body$aggregations$ty === void 0 ? void 0 : _body$aggregations$ty.buckets) || [];
  const nonExpectedTypes = [];
  const perType = buckets.map(perTypeEntry => {
    if (perTypeEntry.key !== MISSING_TYPE_KEY && !soTypes.includes(perTypeEntry.key)) {
      // If the breakdown includes any SO types that are not expected, highlight them in the nonExpectedTypes list.
      nonExpectedTypes.push(perTypeEntry.key);
    }
    return {
      key: perTypeEntry.key,
      doc_count: perTypeEntry.doc_count
    };
  });
  return {
    total: (_ref = typeof ((_body$hits = body.hits) === null || _body$hits === void 0 ? void 0 : _body$hits.total) === 'number' ? (_body$hits2 = body.hits) === null || _body$hits2 === void 0 ? void 0 : _body$hits2.total : (_body$hits3 = body.hits) === null || _body$hits3 === void 0 ? void 0 : (_body$hits3$total = _body$hits3.total) === null || _body$hits3$total === void 0 ? void 0 : _body$hits3$total.value) !== null && _ref !== void 0 ? _ref : 0,
    per_type: perType,
    non_expected_types: nonExpectedTypes,
    others: (_body$aggregations$ty2 = (_body$aggregations2 = body.aggregations) === null || _body$aggregations2 === void 0 ? void 0 : (_body$aggregations2$t = _body$aggregations2.types) === null || _body$aggregations2$t === void 0 ? void 0 : _body$aggregations2$t.sum_other_doc_count) !== null && _body$aggregations$ty2 !== void 0 ? _body$aggregations$ty2 : 0
  };
}