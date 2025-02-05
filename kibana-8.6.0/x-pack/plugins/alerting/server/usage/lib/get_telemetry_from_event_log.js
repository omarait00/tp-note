"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExecutionTimeoutsPerDayCount = getExecutionTimeoutsPerDayCount;
exports.getExecutionsPerDayCount = getExecutionsPerDayCount;
exports.parseExecutionCountAggregationResults = parseExecutionCountAggregationResults;
exports.parseExecutionFailureByRuleType = parseExecutionFailureByRuleType;
exports.parsePercentileAggs = parsePercentileAggs;
exports.parseRuleTypeBucket = parseRuleTypeBucket;
var _lodash = require("lodash");
var _alerting_usage_collector = require("../alerting_usage_collector");
var _replace_dots_with_underscores = require("./replace_dots_with_underscores");
var _parse_simple_rule_type_bucket = require("./parse_simple_rule_type_bucket");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const Millis2Nanos = 1000 * 1000;
const percentileFieldNameMapping = {
  '50.0': 'p50',
  '90.0': 'p90',
  '99.0': 'p99'
};
async function getExecutionsPerDayCount({
  esClient,
  eventLogIndex,
  logger
}) {
  try {
    var _results$hits$total;
    const eventLogAggs = {
      avg_execution_time: {
        avg: {
          field: 'event.duration'
        }
      },
      avg_es_search_duration: {
        avg: {
          field: 'kibana.alert.rule.execution.metrics.es_search_duration_ms'
        }
      },
      avg_total_search_duration: {
        avg: {
          field: 'kibana.alert.rule.execution.metrics.total_search_duration_ms'
        }
      },
      percentile_scheduled_actions: {
        percentiles: {
          field: 'kibana.alert.rule.execution.metrics.number_of_generated_actions',
          percents: [50, 90, 99]
        }
      },
      percentile_alerts: {
        percentiles: {
          field: 'kibana.alert.rule.execution.metrics.alert_counts.active',
          percents: [50, 90, 99]
        }
      },
      execution_failures: {
        filter: {
          term: {
            'event.outcome': 'failure'
          }
        },
        aggs: {
          by_reason: {
            terms: {
              field: 'event.reason',
              size: _alerting_usage_collector.NUM_ALERTING_EXECUTION_FAILURE_REASON_TYPES
            }
          }
        }
      }
    };
    const query = {
      index: eventLogIndex,
      size: 0,
      body: {
        query: getProviderAndActionFilterForTimeRange('execute'),
        aggs: {
          ...eventLogAggs,
          by_rule_type_id: {
            terms: {
              field: 'rule.category',
              size: _alerting_usage_collector.NUM_ALERTING_RULE_TYPES
            },
            aggs: eventLogAggs
          },
          by_execution_status: {
            terms: {
              field: 'event.outcome'
            }
          }
        }
      }
    };
    logger.debug(`query for getExecutionsPerDayCount - ${JSON.stringify(query)}`);
    const results = await esClient.search(query);
    logger.debug(`results for getExecutionsPerDayCount query - ${JSON.stringify(results)}`);
    const totalRuleExecutions = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value;
    const aggregations = results.aggregations;
    const aggregationsByRuleTypeId = aggregations.by_rule_type_id.buckets;
    return {
      hasErrors: false,
      ...parseRuleTypeBucket(aggregationsByRuleTypeId),
      ...parseExecutionFailureByRuleType(aggregationsByRuleTypeId),
      ...parseExecutionCountAggregationResults(aggregations),
      countTotalRuleExecutions: totalRuleExecutions !== null && totalRuleExecutions !== void 0 ? totalRuleExecutions : 0,
      countRulesByExecutionStatus: (0, _parse_simple_rule_type_bucket.parseSimpleRuleTypeBucket)(aggregations.by_execution_status.buckets)
    };
  } catch (err) {
    const errorMessage = err && err.message ? err.message : err.toString();
    logger.warn(`Error executing alerting telemetry task: getExecutionsPerDayCount - ${JSON.stringify(err)}`, {
      tags: ['alerting', 'telemetry-failed'],
      error: {
        stack_trace: err.stack
      }
    });
    return {
      hasErrors: true,
      errorMessage,
      countTotalRuleExecutions: 0,
      countRuleExecutionsByType: {},
      countTotalFailedExecutions: 0,
      countFailedExecutionsByReason: {},
      countFailedExecutionsByReasonByType: {},
      avgExecutionTime: 0,
      avgExecutionTimeByType: {},
      avgEsSearchDuration: 0,
      avgEsSearchDurationByType: {},
      avgTotalSearchDuration: 0,
      avgTotalSearchDurationByType: {},
      generatedActionsPercentiles: {},
      generatedActionsPercentilesByType: {},
      alertsPercentiles: {},
      alertsPercentilesByType: {},
      countRulesByExecutionStatus: {}
    };
  }
}
async function getExecutionTimeoutsPerDayCount({
  esClient,
  eventLogIndex,
  logger
}) {
  try {
    var _results$hits$total2;
    const query = {
      index: eventLogIndex,
      size: 0,
      body: {
        query: getProviderAndActionFilterForTimeRange('execute-timeout'),
        aggs: {
          by_rule_type_id: {
            terms: {
              field: 'rule.category',
              size: _alerting_usage_collector.NUM_ALERTING_RULE_TYPES
            }
          }
        }
      }
    };
    logger.debug(`query for getExecutionTimeoutsPerDayCount - ${JSON.stringify(query)}`);
    const results = await esClient.search(query);
    logger.debug(`results for getExecutionTimeoutsPerDayCount query - ${JSON.stringify(results)}`);
    const aggregations = results.aggregations;
    const totalTimedoutExecutionsCount = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total2 = results.hits.total) === null || _results$hits$total2 === void 0 ? void 0 : _results$hits$total2.value;
    return {
      hasErrors: false,
      countExecutionTimeouts: totalTimedoutExecutionsCount !== null && totalTimedoutExecutionsCount !== void 0 ? totalTimedoutExecutionsCount : 0,
      countExecutionTimeoutsByType: (0, _parse_simple_rule_type_bucket.parseSimpleRuleTypeBucket)(aggregations.by_rule_type_id.buckets)
    };
  } catch (err) {
    const errorMessage = err && err.message ? err.message : err.toString();
    logger.warn(`Error executing alerting telemetry task: getExecutionsTimeoutsPerDayCount - ${JSON.stringify(err)}`, {
      tags: ['alerting', 'telemetry-failed'],
      error: {
        stack_trace: err.stack
      }
    });
    return {
      hasErrors: true,
      errorMessage,
      countExecutionTimeouts: 0,
      countExecutionTimeoutsByType: {}
    };
  }
}

/**
 * Bucket format:
 * {
 *   key: '.index-threshold',             // rule type id
 *   doc_count: 78,                       // count of number of executions
 *   avg_es_search_duration: {            // average es search duration across executions
 *     value: 40.76056338028169,
 *   },
 *   percentile_alerts: {                 // stats for number of alerts created across executions
 *     values: {
 *       '50.0': 1,
 *       '95.0': 1,
 *       '99.0': 1,
 *     },
 *   },
 *   execution_failures: {
 *     doc_count: 7,                      // count of number of failed executions
 *     by_reason: {
 *       doc_count_error_upper_bound: 0,
 *       sum_other_doc_count: 0,
 *       buckets: [
 *         {
 *           key: 'execute',              // breakdown of reason for execution failures
 *           doc_count: 4,
 *         },
 *         {
 *           key: 'decrypt',
 *           doc_count: 3,
 *         },
 *       ],
 *     },
 *   },
 *   percentile_scheduled_actions: {      // stats for number of actions generated across executions
 *     values: {
 *       '50.0': 0,
 *       '95.0': 0,
 *       '99.0': 0,
 *     },
 *   },
 *   avg_execution_time: {                // average execution time in nanoseconds across executions
 *     value: 100576923.07692307,
 *   },
 *   avg_total_search_duration: {         // average total search duration across executions
 *     value: 43.74647887323944,
 *   },
 *   by_execution_status: {
 *      "doc_count_error_upper_bound":0,
 *      "sum_other_doc_count":0,
 *      "buckets":[
 *        {"key":"success","doc_count":48},
 *        {"key":"failure","doc_count":1}
 *      ]
 *   }
 * }
 */

function parseRuleTypeBucket(buckets) {
  let summary = {
    countRuleExecutionsByType: {},
    avgExecutionTimeByType: {},
    avgEsSearchDurationByType: {},
    avgTotalSearchDurationByType: {},
    generatedActionsPercentilesByType: {
      p50: {},
      p90: {},
      p99: {}
    },
    alertsPercentilesByType: {
      p50: {},
      p90: {},
      p99: {}
    }
  };
  for (const bucket of buckets !== null && buckets !== void 0 ? buckets : []) {
    var _replaceDotSymbols, _bucket$doc_count, _bucket$avg_execution, _bucket$avg_execution2, _bucket$avg_es_search, _bucket$avg_es_search2, _bucket$avg_total_sea, _bucket$avg_total_sea2, _bucket$percentile_sc, _bucket$percentile_sc2, _bucket$percentile_al, _bucket$percentile_al2;
    const ruleType = (_replaceDotSymbols = (0, _replace_dots_with_underscores.replaceDotSymbols)(bucket === null || bucket === void 0 ? void 0 : bucket.key)) !== null && _replaceDotSymbols !== void 0 ? _replaceDotSymbols : '';
    const numExecutions = (_bucket$doc_count = bucket === null || bucket === void 0 ? void 0 : bucket.doc_count) !== null && _bucket$doc_count !== void 0 ? _bucket$doc_count : 0;
    const avgExecutionTimeNanos = (_bucket$avg_execution = bucket === null || bucket === void 0 ? void 0 : (_bucket$avg_execution2 = bucket.avg_execution_time) === null || _bucket$avg_execution2 === void 0 ? void 0 : _bucket$avg_execution2.value) !== null && _bucket$avg_execution !== void 0 ? _bucket$avg_execution : 0;
    const avgEsSearchTimeMillis = (_bucket$avg_es_search = bucket === null || bucket === void 0 ? void 0 : (_bucket$avg_es_search2 = bucket.avg_es_search_duration) === null || _bucket$avg_es_search2 === void 0 ? void 0 : _bucket$avg_es_search2.value) !== null && _bucket$avg_es_search !== void 0 ? _bucket$avg_es_search : 0;
    const avgTotalSearchTimeMillis = (_bucket$avg_total_sea = bucket === null || bucket === void 0 ? void 0 : (_bucket$avg_total_sea2 = bucket.avg_total_search_duration) === null || _bucket$avg_total_sea2 === void 0 ? void 0 : _bucket$avg_total_sea2.value) !== null && _bucket$avg_total_sea !== void 0 ? _bucket$avg_total_sea : 0;
    const actionPercentiles = (_bucket$percentile_sc = bucket === null || bucket === void 0 ? void 0 : (_bucket$percentile_sc2 = bucket.percentile_scheduled_actions) === null || _bucket$percentile_sc2 === void 0 ? void 0 : _bucket$percentile_sc2.values) !== null && _bucket$percentile_sc !== void 0 ? _bucket$percentile_sc : {};
    const alertPercentiles = (_bucket$percentile_al = bucket === null || bucket === void 0 ? void 0 : (_bucket$percentile_al2 = bucket.percentile_alerts) === null || _bucket$percentile_al2 === void 0 ? void 0 : _bucket$percentile_al2.values) !== null && _bucket$percentile_al !== void 0 ? _bucket$percentile_al : {};
    summary = {
      countRuleExecutionsByType: {
        ...summary.countRuleExecutionsByType,
        [ruleType]: numExecutions
      },
      avgExecutionTimeByType: {
        ...summary.avgExecutionTimeByType,
        [ruleType]: Math.round(avgExecutionTimeNanos / Millis2Nanos)
      },
      avgEsSearchDurationByType: {
        ...summary.avgEsSearchDurationByType,
        [ruleType]: Math.round(avgEsSearchTimeMillis)
      },
      avgTotalSearchDurationByType: {
        ...summary.avgTotalSearchDurationByType,
        [ruleType]: Math.round(avgTotalSearchTimeMillis)
      },
      generatedActionsPercentilesByType: (0, _lodash.merge)(summary.generatedActionsPercentilesByType, parsePercentileAggs(actionPercentiles, ruleType)),
      alertsPercentilesByType: (0, _lodash.merge)(summary.alertsPercentilesByType, parsePercentileAggs(alertPercentiles, ruleType))
    };
  }
  return summary;
}
function parseExecutionFailureByRuleType(buckets) {
  const executionFailuresWithRuleTypeBuckets = (0, _lodash.flatMap)(buckets !== null && buckets !== void 0 ? buckets : [], bucket => {
    var _bucket$execution_fai, _bucket$execution_fai2;
    const ruleType = (0, _replace_dots_with_underscores.replaceDotSymbols)(bucket.key);

    /**
     * Execution failure bucket format
     * [
     *   {
     *     key: 'execute',
     *     doc_count: 4,
     *   },
     *   {
     *     key: 'decrypt',
     *     doc_count: 3,
     *   },
     * ]
     */

    const executionFailuresBuckets = bucket === null || bucket === void 0 ? void 0 : (_bucket$execution_fai = bucket.execution_failures) === null || _bucket$execution_fai === void 0 ? void 0 : (_bucket$execution_fai2 = _bucket$execution_fai.by_reason) === null || _bucket$execution_fai2 === void 0 ? void 0 : _bucket$execution_fai2.buckets;
    return (executionFailuresBuckets !== null && executionFailuresBuckets !== void 0 ? executionFailuresBuckets : []).map(b => ({
      ...b,
      ruleType
    }));
  });
  const parsedFailures = (executionFailuresWithRuleTypeBuckets !== null && executionFailuresWithRuleTypeBuckets !== void 0 ? executionFailuresWithRuleTypeBuckets : []).reduce((acc, bucket) => {
    const ruleType = bucket.ruleType;
    const reason = bucket.key;
    if (acc[reason]) {
      if (acc[reason][ruleType]) {
        return {
          ...acc,
          [reason]: {
            ...acc[reason],
            [ruleType]: acc[reason][ruleType] + bucket.doc_count
          }
        };
      }
      return {
        ...acc,
        [reason]: {
          ...acc[reason],
          [ruleType]: bucket.doc_count
        }
      };
    }
    return {
      ...acc,
      [reason]: {
        [ruleType]: bucket.doc_count
      }
    };
  }, {});
  return {
    countFailedExecutionsByReasonByType: parsedFailures
  };
}
function parsePercentileAggs(percentiles, ruleTypeId) {
  return Object.keys(percentiles !== null && percentiles !== void 0 ? percentiles : {}).reduce((acc, percentileKey) => {
    let result = {};
    const percentileKeyMapped = percentileFieldNameMapping[percentileKey];
    if (percentileKeyMapped) {
      if (ruleTypeId) {
        var _percentiles$percenti;
        result = {
          [percentileKeyMapped]: {
            [ruleTypeId]: (_percentiles$percenti = percentiles[percentileKey]) !== null && _percentiles$percenti !== void 0 ? _percentiles$percenti : 0
          }
        };
      } else {
        var _percentiles$percenti2;
        result = {
          [percentileKeyMapped]: (_percentiles$percenti2 = percentiles[percentileKey]) !== null && _percentiles$percenti2 !== void 0 ? _percentiles$percenti2 : 0
        };
      }
    }
    return {
      ...acc,
      ...result
    };
  }, {});
}

/**
 * Aggregation Result Format (minus rule type id agg buckets)
 * {
 *   avg_es_search_duration: {
 *     value: 26.246376811594203,
 *   },
 *   percentile_alerts: {
 *     values: {
 *       '50.0': 1,
 *       '90.0': 5,
 *       '99.0': 5,
 *     },
 *   },
 *   execution_failures: {
 *     doc_count: 10,
 *     by_reason: {
 *       doc_count_error_upper_bound: 0,
 *       sum_other_doc_count: 0,
 *       buckets: [
 *         {
 *           key: 'decrypt',
 *           doc_count: 6,
 *         },
 *         {
 *           key: 'execute',
 *           doc_count: 4,
 *         },
 *       ],
 *     },
 *   },
 *   percentile_scheduled_actions: {
 *     values: {
 *       '50.0': 0,
 *       '95.0': 5,
 *       '99.0': 5,
 *     },
 *   },
 *   avg_execution_time: {
 *     value: 288250000,
 *   },
 *   avg_total_search_duration: {
 *     value: 28.630434782608695,
 *   },
 */
function parseExecutionCountAggregationResults(results) {
  var _results$avg_executio, _results$avg_executio2, _results$avg_es_searc, _results$avg_es_searc2, _results$avg_total_se, _results$avg_total_se2, _ref, _results$execution_fa, _results$execution_fa2, _results$percentile_s, _results$percentile_s2, _results$percentile_a, _results$percentile_a2, _results$execution_fa3, _results$execution_fa4;
  const avgExecutionTimeNanos = (_results$avg_executio = results === null || results === void 0 ? void 0 : (_results$avg_executio2 = results.avg_execution_time) === null || _results$avg_executio2 === void 0 ? void 0 : _results$avg_executio2.value) !== null && _results$avg_executio !== void 0 ? _results$avg_executio : 0;
  const avgEsSearchDurationMillis = (_results$avg_es_searc = results === null || results === void 0 ? void 0 : (_results$avg_es_searc2 = results.avg_es_search_duration) === null || _results$avg_es_searc2 === void 0 ? void 0 : _results$avg_es_searc2.value) !== null && _results$avg_es_searc !== void 0 ? _results$avg_es_searc : 0;
  const avgTotalSearchDurationMillis = (_results$avg_total_se = results === null || results === void 0 ? void 0 : (_results$avg_total_se2 = results.avg_total_search_duration) === null || _results$avg_total_se2 === void 0 ? void 0 : _results$avg_total_se2.value) !== null && _results$avg_total_se !== void 0 ? _results$avg_total_se : 0;
  const executionFailuresByReasonBuckets = (_ref = results === null || results === void 0 ? void 0 : (_results$execution_fa = results.execution_failures) === null || _results$execution_fa === void 0 ? void 0 : (_results$execution_fa2 = _results$execution_fa.by_reason) === null || _results$execution_fa2 === void 0 ? void 0 : _results$execution_fa2.buckets) !== null && _ref !== void 0 ? _ref : [];
  const actionPercentiles = (_results$percentile_s = results === null || results === void 0 ? void 0 : (_results$percentile_s2 = results.percentile_scheduled_actions) === null || _results$percentile_s2 === void 0 ? void 0 : _results$percentile_s2.values) !== null && _results$percentile_s !== void 0 ? _results$percentile_s : {};
  const alertPercentiles = (_results$percentile_a = results === null || results === void 0 ? void 0 : (_results$percentile_a2 = results.percentile_alerts) === null || _results$percentile_a2 === void 0 ? void 0 : _results$percentile_a2.values) !== null && _results$percentile_a !== void 0 ? _results$percentile_a : {};
  return {
    countTotalFailedExecutions: (_results$execution_fa3 = results === null || results === void 0 ? void 0 : (_results$execution_fa4 = results.execution_failures) === null || _results$execution_fa4 === void 0 ? void 0 : _results$execution_fa4.doc_count) !== null && _results$execution_fa3 !== void 0 ? _results$execution_fa3 : 0,
    countFailedExecutionsByReason: executionFailuresByReasonBuckets.reduce((acc, bucket) => {
      var _bucket$doc_count2;
      const reason = bucket.key;
      return {
        ...acc,
        [reason]: (_bucket$doc_count2 = bucket.doc_count) !== null && _bucket$doc_count2 !== void 0 ? _bucket$doc_count2 : 0
      };
    }, {}),
    avgExecutionTime: Math.round(avgExecutionTimeNanos / Millis2Nanos),
    avgEsSearchDuration: Math.round(avgEsSearchDurationMillis),
    avgTotalSearchDuration: Math.round(avgTotalSearchDurationMillis),
    generatedActionsPercentiles: parsePercentileAggs(actionPercentiles),
    alertsPercentiles: parsePercentileAggs(alertPercentiles)
  };
}
function getProviderAndActionFilterForTimeRange(action, provider = 'alerting', range = '1d') {
  return {
    bool: {
      filter: {
        bool: {
          must: [{
            term: {
              'event.action': action
            }
          }, {
            term: {
              'event.provider': provider
            }
          }, {
            range: {
              '@timestamp': {
                gte: `now-${range}`
              }
            }
          }]
        }
      }
    }
  };
}