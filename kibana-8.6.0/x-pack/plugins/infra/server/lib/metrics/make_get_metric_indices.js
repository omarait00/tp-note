"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeGetMetricIndices = makeGetMetricIndices;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function makeGetMetricIndices(metricSources) {
  return async (savedObjectsClient, sourceId = 'default') => {
    const source = await metricSources.getSourceConfiguration(savedObjectsClient, sourceId);
    return source.configuration.metricAlias;
  };
}