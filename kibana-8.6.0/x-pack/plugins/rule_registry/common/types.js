"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortSchema = exports.sortOrderSchema = exports.minDocCount = exports.metricsAggsSchemas = exports.bucketAggsSchemas = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// note: these schemas are not exhaustive. See the `Sort` type of `@elastic/elasticsearch` if you need to enhance it.
const fieldSchema = t.string;
const sortOrderSchema = t.union([t.literal('asc'), t.literal('desc'), t.literal('_doc')]);
exports.sortOrderSchema = sortOrderSchema;
const sortModeSchema = t.union([t.literal('min'), t.literal('max'), t.literal('sum'), t.literal('avg'), t.literal('median')]);
const fieldSortSchema = t.exact(t.partial({
  missing: t.union([t.string, t.number, t.boolean]),
  mode: sortModeSchema,
  order: sortOrderSchema
  // nested and unmapped_type not implemented yet
}));

const sortContainerSchema = t.record(t.string, t.union([sortOrderSchema, fieldSortSchema]));
const sortCombinationsSchema = t.union([fieldSchema, sortContainerSchema]);
const sortSchema = t.union([sortCombinationsSchema, t.array(sortCombinationsSchema)]);
exports.sortSchema = sortSchema;
const minDocCount = t.number;
exports.minDocCount = minDocCount;
/**
 * Schemas for the Bucket aggregations.
 *
 * Currently supported:
 * - filter
 * - histogram
 * - nested
 * - terms
 *
 * Not implemented:
 * - adjacency_matrix
 * - auto_date_histogram
 * - children
 * - composite
 * - date_histogram
 * - date_range
 * - diversified_sampler
 * - filters
 * - geo_distance
 * - geohash_grid
 * - geotile_grid
 * - global
 * - ip_range
 * - missing
 * - multi_terms
 * - parent
 * - range
 * - rare_terms
 * - reverse_nested
 * - sampler
 * - significant_terms
 * - significant_text
 * - variable_width_histogram
 */
const bucketAggsTempsSchemas = t.exact(t.partial({
  filter: t.exact(t.partial({
    term: t.record(t.string, t.union([t.string, t.boolean, t.number]))
  })),
  date_histogram: t.exact(t.partial({
    field: t.string,
    fixed_interval: t.string,
    min_doc_count: t.number,
    extended_bounds: t.type({
      min: t.string,
      max: t.string
    })
  })),
  histogram: t.exact(t.partial({
    field: t.string,
    interval: t.number,
    min_doc_count: t.number,
    extended_bounds: t.exact(t.type({
      min: t.number,
      max: t.number
    })),
    hard_bounds: t.exact(t.type({
      min: t.number,
      max: t.number
    })),
    missing: t.number,
    keyed: t.boolean,
    order: t.exact(t.type({
      _count: t.string,
      _key: t.string
    }))
  })),
  nested: t.type({
    path: t.string
  }),
  terms: t.exact(t.partial({
    field: t.string,
    collect_mode: t.string,
    exclude: t.union([t.string, t.array(t.string)]),
    include: t.union([t.string, t.array(t.string)]),
    execution_hint: t.string,
    missing: t.union([t.number, t.string]),
    min_doc_count: t.number,
    size: t.number,
    show_term_doc_count_error: t.boolean,
    order: t.union([sortOrderSchema, t.record(t.string, sortOrderSchema), t.array(t.record(t.string, sortOrderSchema))])
  }))
}));
const bucketAggsSchemas = t.intersection([bucketAggsTempsSchemas, t.partial({
  aggs: t.union([t.record(t.string, bucketAggsTempsSchemas), t.undefined]),
  aggregations: t.union([t.record(t.string, bucketAggsTempsSchemas), t.undefined])
})]);

/**
 * Schemas for the metrics Aggregations
 *
 * Currently supported:
 * - avg
 * - cardinality
 * - min
 * - max
 * - sum
 * - top_hits
 * - weighted_avg
 *
 * Not implemented:
 * - boxplot
 * - extended_stats
 * - geo_bounds
 * - geo_centroid
 * - geo_line
 * - matrix_stats
 * - median_absolute_deviation
 * - percentile_ranks
 * - percentiles
 * - rate
 * - scripted_metric
 * - stats
 * - string_stats
 * - t_test
 * - value_count
 */
exports.bucketAggsSchemas = bucketAggsSchemas;
const metricsAggsSchemas = t.exact(t.partial({
  avg: t.exact(t.partial({
    field: t.string,
    missing: t.union([t.string, t.number, t.boolean])
  })),
  cardinality: t.exact(t.partial({
    field: t.string,
    precision_threshold: t.number,
    rehash: t.boolean,
    missing: t.union([t.string, t.number, t.boolean])
  })),
  min: t.exact(t.partial({
    field: t.string,
    missing: t.union([t.string, t.number, t.boolean]),
    format: t.string
  })),
  max: t.exact(t.partial({
    field: t.string,
    missing: t.union([t.string, t.number, t.boolean]),
    format: t.string
  })),
  sum: t.exact(t.partial({
    field: t.string,
    missing: t.union([t.string, t.number, t.boolean])
  })),
  top_hits: t.exact(t.partial({
    explain: t.boolean,
    docvalue_fields: t.union([t.string, t.array(t.string)]),
    stored_fields: t.union([t.string, t.array(t.string)]),
    from: t.number,
    size: t.number,
    sort: sortSchema,
    seq_no_primary_term: t.boolean,
    version: t.boolean,
    track_scores: t.boolean,
    highlight: t.any,
    _source: t.union([t.boolean, t.string, t.array(t.string)])
  })),
  weighted_avg: t.exact(t.partial({
    format: t.string,
    value_type: t.string,
    value: t.partial({
      field: t.string,
      missing: t.number
    }),
    weight: t.partial({
      field: t.string,
      missing: t.number
    })
  })),
  aggs: t.undefined,
  aggregations: t.undefined
}));
exports.metricsAggsSchemas = metricsAggsSchemas;