"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.benchmarksQueryParamsSchema = exports.DEFAULT_BENCHMARKS_PER_PAGE = exports.BENCHMARK_PACKAGE_POLICY_PREFIX = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_BENCHMARKS_PER_PAGE = 20;
exports.DEFAULT_BENCHMARKS_PER_PAGE = DEFAULT_BENCHMARKS_PER_PAGE;
const BENCHMARK_PACKAGE_POLICY_PREFIX = 'package_policy.';
exports.BENCHMARK_PACKAGE_POLICY_PREFIX = BENCHMARK_PACKAGE_POLICY_PREFIX;
const benchmarksQueryParamsSchema = _configSchema.schema.object({
  /**
   * The page of objects to return
   */
  page: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  }),
  /**
   * The number of objects to include in each page
   */
  per_page: _configSchema.schema.number({
    defaultValue: DEFAULT_BENCHMARKS_PER_PAGE,
    min: 0
  }),
  /**
   *  Once of PackagePolicy fields for sorting the found objects.
   *  Sortable fields:
   *    - package_policy.id
   *    - package_policy.name
   *    - package_policy.policy_id
   *    - package_policy.namespace
   *    - package_policy.updated_at
   *    - package_policy.updated_by
   *    - package_policy.created_at
   *    - package_policy.created_by,
   *    - package_policy.package.name
   *    - package_policy.package.title
   *    - package_policy.package.version
   */
  sort_field: _configSchema.schema.oneOf([_configSchema.schema.literal('package_policy.id'), _configSchema.schema.literal('package_policy.name'), _configSchema.schema.literal('package_policy.policy_id'), _configSchema.schema.literal('package_policy.namespace'), _configSchema.schema.literal('package_policy.updated_at'), _configSchema.schema.literal('package_policy.updated_by'), _configSchema.schema.literal('package_policy.created_at'), _configSchema.schema.literal('package_policy.created_by'), _configSchema.schema.literal('package_policy.package.name'), _configSchema.schema.literal('package_policy.package.title')], {
    defaultValue: 'package_policy.name'
  }),
  /**
   * The order to sort by
   */
  sort_order: _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')], {
    defaultValue: 'asc'
  }),
  /**
   * Benchmark filter
   */
  benchmark_name: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.benchmarksQueryParamsSchema = benchmarksQueryParamsSchema;