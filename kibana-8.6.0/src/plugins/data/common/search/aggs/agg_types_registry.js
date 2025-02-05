"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggTypesRegistry = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class AggTypesRegistry {
  constructor() {
    (0, _defineProperty2.default)(this, "bucketAggs", new Map());
    (0, _defineProperty2.default)(this, "metricAggs", new Map());
    (0, _defineProperty2.default)(this, "setup", () => {
      return {
        registerBucket: (name, type) => {
          if (this.bucketAggs.get(name) || this.metricAggs.get(name)) {
            throw new Error(`Agg has already been registered with name: ${name}`);
          }
          this.bucketAggs.set(name, type);
        },
        registerMetric: (name, type) => {
          if (this.bucketAggs.get(name) || this.metricAggs.get(name)) {
            throw new Error(`Agg has already been registered with name: ${name}`);
          }
          this.metricAggs.set(name, type);
        }
      };
    });
    (0, _defineProperty2.default)(this, "start", aggTypesDependencies => {
      const initializedAggTypes = new Map();
      const getInitializedFromCache = (key, agg) => {
        if (initializedAggTypes.has(key)) {
          return initializedAggTypes.get(key);
        }
        const initialized = agg(aggTypesDependencies);
        initializedAggTypes.set(key, initialized);
        return initialized;
      };
      return {
        get: name => getInitializedFromCache(name, this.bucketAggs.get(name) || this.metricAggs.get(name)),
        getAll: () => ({
          buckets: Array.from(this.bucketAggs.entries()).map(([key, value]) => getInitializedFromCache(key, value)),
          metrics: Array.from(this.metricAggs.entries()).map(([key, value]) => getInitializedFromCache(key, value))
        })
      };
    });
  }
}
exports.AggTypesRegistry = AggTypesRegistry;