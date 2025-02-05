"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPipelineStateDocument = getPipelineStateDocument;
var _create_query = require("../create_query");
var _metrics = require("../metrics");
var _get_index_patterns = require("../cluster/get_index_patterns");
var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getPipelineStateDocument({
  req,
  clusterUuid,
  pipelineId,
  version
}) {
  var _req$server$plugins, _resp$hits$hits$0$_so, _resp$hits, _resp$hits$hits$;
  const dataset = 'node';
  const type = 'logstash_state';
  const moduleType = 'logstash';
  const indexPatterns = (0, _get_index_patterns.getIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const {
    callWithRequest
  } = (_req$server$plugins = req.server.plugins) === null || _req$server$plugins === void 0 ? void 0 : _req$server$plugins.elasticsearch.getCluster('monitoring');
  const filters = [{
    term: {
      'logstash_state.pipeline.id': pipelineId
    }
  }, {
    term: {
      'logstash_state.pipeline.hash': version.hash
    }
  }];
  const query = (0, _create_query.createQuery)({
    // We intentionally do not set a start/end time for the state document
    // The reason being that any matching document will work since they are all identical if they share a given hash
    // This is important because a user may pick a very narrow time picker window. If we were to use a start/end value
    // that could result in us being unable to render the graph
    // Use the logstash_stats documents to determine whether the instance is up/down
    type,
    dsDataset: (0, _get_index_patterns.getLogstashDataset)(dataset),
    metricset: dataset,
    metric: _metrics.LogstashMetric.getMetricFields(),
    clusterUuid,
    filters
  });
  const params = {
    index: indexPatterns,
    size: 1,
    ignore_unavailable: true,
    body: {
      _source: {
        excludes: 'logstash_state.pipeline.representation.plugins'
      },
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query,
      terminate_after: 1 // Safe to do because all these documents are functionally identical
    }
  };

  const resp = await callWithRequest(req, 'search', params);
  // Return null if doc not found
  return (_resp$hits$hits$0$_so = (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : (_resp$hits$hits$ = _resp$hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source) !== null && _resp$hits$hits$0$_so !== void 0 ? _resp$hits$hits$0$_so : null;
}