"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionStatuses = getActionStatuses;
var _constants = require("../../constants");
var _common = require("../../../common");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PRECISION_THRESHOLD = 40000;

/**
 * Return current bulk actions
 */
async function getActionStatuses(esClient, options) {
  const actions = await _getActions(esClient, options);
  const cancelledActions = await _getCancelledActions(esClient);
  let acks;
  try {
    acks = await esClient.search({
      index: _common.AGENT_ACTIONS_RESULTS_INDEX,
      query: {
        bool: {
          // There's some perf/caching advantages to using filter over must
          // See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html#filter-context
          filter: [{
            terms: {
              action_id: actions.map(a => a.actionId)
            }
          }]
        }
      },
      size: 0,
      aggs: {
        ack_counts: {
          terms: {
            field: 'action_id',
            size: actions.length || 10
          },
          aggs: {
            max_timestamp: {
              max: {
                field: '@timestamp'
              }
            },
            agent_count: {
              cardinality: {
                field: 'agent_id',
                precision_threshold: PRECISION_THRESHOLD // max value
              }
            }
          }
        }
      }
    });
  } catch (err) {
    if (err.statusCode === 404) {
      // .fleet-actions-results does not yet exist
      _.appContextService.getLogger().debug(err);
    } else {
      throw err;
    }
  }
  const results = [];
  for (const action of actions) {
    var _acks, _acks$aggregations, _acks$aggregations$ac, _acks$aggregations$ac2, _value, _matchingBucket$agent, _matchingBucket$doc_c, _matchingBucket$max_t;
    const matchingBucket = (_acks = acks) === null || _acks === void 0 ? void 0 : (_acks$aggregations = _acks.aggregations) === null || _acks$aggregations === void 0 ? void 0 : (_acks$aggregations$ac = _acks$aggregations.ack_counts) === null || _acks$aggregations$ac === void 0 ? void 0 : (_acks$aggregations$ac2 = _acks$aggregations$ac.buckets) === null || _acks$aggregations$ac2 === void 0 ? void 0 : _acks$aggregations$ac2.find(bucket => bucket.key === action.actionId);
    const nbAgentsActioned = action.nbAgentsActioned || action.nbAgentsActionCreated;
    const cardinalityCount = (_value = matchingBucket === null || matchingBucket === void 0 ? void 0 : (_matchingBucket$agent = matchingBucket.agent_count) === null || _matchingBucket$agent === void 0 ? void 0 : _matchingBucket$agent.value) !== null && _value !== void 0 ? _value : 0;
    const docCount = (_matchingBucket$doc_c = matchingBucket === null || matchingBucket === void 0 ? void 0 : matchingBucket.doc_count) !== null && _matchingBucket$doc_c !== void 0 ? _matchingBucket$doc_c : 0;
    const nbAgentsAck = action.type === 'UPDATE_TAGS' ? Math.min(docCount, nbAgentsActioned) : Math.min(docCount,
    // only using cardinality count when count lower than precision threshold
    docCount > PRECISION_THRESHOLD ? docCount : cardinalityCount, nbAgentsActioned);
    const completionTime = matchingBucket === null || matchingBucket === void 0 ? void 0 : (_matchingBucket$max_t = matchingBucket.max_timestamp) === null || _matchingBucket$max_t === void 0 ? void 0 : _matchingBucket$max_t.value_as_string;
    const complete = nbAgentsAck >= nbAgentsActioned;
    const cancelledAction = cancelledActions.find(a => a.actionId === action.actionId);
    let errorCount = 0;
    try {
      var _ref;
      // query to find errors in action results, cannot do aggregation on text type
      const res = await esClient.search({
        index: _common.AGENT_ACTIONS_RESULTS_INDEX,
        track_total_hits: true,
        rest_total_hits_as_int: true,
        query: {
          bool: {
            must: [{
              term: {
                action_id: action.actionId
              }
            }],
            should: [{
              exists: {
                field: 'error'
              }
            }],
            minimum_should_match: 1
          }
        },
        size: 0
      });
      errorCount = (_ref = res.hits.total) !== null && _ref !== void 0 ? _ref : 0;
    } catch (err) {
      if (err.statusCode === 404) {
        // .fleet-actions-results does not yet exist
        _.appContextService.getLogger().debug(err);
      } else {
        throw err;
      }
    }
    results.push({
      ...action,
      nbAgentsAck: nbAgentsAck - errorCount,
      nbAgentsFailed: errorCount,
      status: errorCount > 0 ? 'FAILED' : complete ? 'COMPLETE' : cancelledAction ? 'CANCELLED' : action.status,
      nbAgentsActioned,
      cancellationTime: cancelledAction === null || cancelledAction === void 0 ? void 0 : cancelledAction.timestamp,
      completionTime: complete ? completionTime : undefined
    });
  }
  return results;
}
async function _getCancelledActions(esClient) {
  const res = await esClient.search({
    index: _common.AGENT_ACTIONS_INDEX,
    ignore_unavailable: true,
    size: _constants.SO_SEARCH_LIMIT,
    query: {
      bool: {
        must: [{
          term: {
            type: 'CANCEL'
          }
        }]
      }
    }
  });
  return res.hits.hits.map(hit => {
    var _hit$_source, _hit$_source$data, _hit$_source2;
    return {
      actionId: (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : (_hit$_source$data = _hit$_source.data) === null || _hit$_source$data === void 0 ? void 0 : _hit$_source$data.target_id,
      timestamp: (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : _hit$_source2['@timestamp']
    };
  });
}
async function _getActions(esClient, options) {
  var _options$page, _options$perPage;
  const res = await esClient.search({
    index: _common.AGENT_ACTIONS_INDEX,
    ignore_unavailable: true,
    from: (_options$page = options.page) !== null && _options$page !== void 0 ? _options$page : 0,
    size: (_options$perPage = options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : 20,
    query: {
      bool: {
        must_not: [{
          term: {
            type: 'CANCEL'
          }
        }]
      }
    },
    body: {
      sort: [{
        '@timestamp': 'desc'
      }]
    }
  });
  return Object.values(res.hits.hits.reduce((acc, hit) => {
    var _hit$_source$agents$l, _hit$_source$agents;
    if (!hit._source || !hit._source.action_id) {
      return acc;
    }
    const source = hit._source;
    if (!acc[source.action_id]) {
      var _hit$_source$data2, _source$total, _source$data;
      const isExpired = source.expiration ? Date.parse(source.expiration) < Date.now() : false;
      acc[hit._source.action_id] = {
        actionId: hit._source.action_id,
        nbAgentsActionCreated: 0,
        nbAgentsAck: 0,
        version: (_hit$_source$data2 = hit._source.data) === null || _hit$_source$data2 === void 0 ? void 0 : _hit$_source$data2.version,
        startTime: source.start_time,
        type: source.type,
        nbAgentsActioned: (_source$total = source.total) !== null && _source$total !== void 0 ? _source$total : 0,
        status: isExpired ? 'EXPIRED' : 'IN_PROGRESS',
        expiration: source.expiration,
        newPolicyId: (_source$data = source.data) === null || _source$data === void 0 ? void 0 : _source$data.policy_id,
        creationTime: source['@timestamp'],
        nbAgentsFailed: 0
      };
    }
    acc[hit._source.action_id].nbAgentsActionCreated += (_hit$_source$agents$l = (_hit$_source$agents = hit._source.agents) === null || _hit$_source$agents === void 0 ? void 0 : _hit$_source$agents.length) !== null && _hit$_source$agents$l !== void 0 ? _hit$_source$agents$l : 0;
    return acc;
  }, {}));
}