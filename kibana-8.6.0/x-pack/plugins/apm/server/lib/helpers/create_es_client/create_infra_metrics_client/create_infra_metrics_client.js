"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInfraMetricsClient = createInfraMetricsClient;
var _get_infra_metric_indices = require("../../get_infra_metric_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createInfraMetricsClient(resources) {
  return {
    async search(opts) {
      const {
        savedObjects: {
          client: savedObjectsClient
        },
        elasticsearch: {
          client: esClient
        }
      } = await resources.context.core;
      const indexName = await (0, _get_infra_metric_indices.getInfraMetricIndices)({
        infraPlugin: resources.plugins.infra,
        savedObjectsClient
      });
      const searchParams = {
        index: [indexName],
        ...opts
      };
      return esClient.asCurrentUser.search(searchParams);
    }
  };
}