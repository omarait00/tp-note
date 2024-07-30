"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCspmUsageCollector = registerCspmUsageCollector;
var _indices_stats_collector = require("./indices_stats_collector");
var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerCspmUsageCollector(logger, usageCollection) {
  // usageCollection is an optional dependency, so make sure to return if it is not registered
  if (!usageCollection) {
    return;
  }

  // Create usage collector
  const cspmUsageCollector = usageCollection.makeUsageCollector({
    type: 'cloud_security_posture',
    isReady: () => true,
    fetch: async collectorFetchContext => {
      const indicesStats = await (0, _indices_stats_collector.getIndicesStats)(collectorFetchContext.esClient, logger);
      return {
        indices: indicesStats
      };
    },
    schema: _schema.cspmUsageSchema
  });

  // Register usage collector
  usageCollection.registerCollector(cspmUsageCollector);
}