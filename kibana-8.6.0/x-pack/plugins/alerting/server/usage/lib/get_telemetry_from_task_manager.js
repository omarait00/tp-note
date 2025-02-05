"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFailedAndUnrecognizedTasksPerDay = getFailedAndUnrecognizedTasksPerDay;
exports.parseBucket = parseBucket;
var _lodash = require("lodash");
var _replace_dots_with_underscores = require("./replace_dots_with_underscores");
var _alerting_usage_collector = require("../alerting_usage_collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getFailedAndUnrecognizedTasksPerDay({
  esClient,
  taskManagerIndex,
  logger
}) {
  try {
    var _results$hits$total;
    const query = {
      index: taskManagerIndex,
      size: 0,
      body: {
        query: {
          bool: {
            must: [{
              bool: {
                should: [{
                  term: {
                    'task.status': 'unrecognized'
                  }
                }, {
                  term: {
                    'task.status': 'failed'
                  }
                }]
              }
            }, {
              wildcard: {
                'task.taskType': {
                  value: 'alerting:*'
                }
              }
            }, {
              range: {
                'task.runAt': {
                  gte: 'now-1d'
                }
              }
            }]
          }
        },
        aggs: {
          by_status: {
            terms: {
              field: 'task.status',
              size: 10
            },
            aggs: {
              by_task_type: {
                terms: {
                  field: 'task.taskType',
                  // Use number of alerting rule types because we're filtering by 'alerting:'
                  size: _alerting_usage_collector.NUM_ALERTING_RULE_TYPES
                }
              }
            }
          }
        }
      }
    };
    logger.debug(`query for getFailedAndUnrecognizedTasksPerDay - ${JSON.stringify(query)}`);
    const results = await esClient.search(query);
    logger.debug(`results for getFailedAndUnrecognizedTasksPerDay query - ${JSON.stringify(results)}`);
    const aggregations = results.aggregations;
    const totalFailedAndUnrecognizedTasks = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value;
    const aggregationsByStatus = aggregations.by_status.buckets;
    return {
      hasErrors: false,
      ...parseBucket(aggregationsByStatus),
      countFailedAndUnrecognizedTasks: totalFailedAndUnrecognizedTasks !== null && totalFailedAndUnrecognizedTasks !== void 0 ? totalFailedAndUnrecognizedTasks : 0
    };
  } catch (err) {
    const errorMessage = err && err.message ? err.message : err.toString();
    logger.warn(`Error executing alerting telemetry task: getFailedAndUnrecognizedTasksPerDay - ${JSON.stringify(err)}`, {
      tags: ['alerting', 'telemetry-failed'],
      error: {
        stack_trace: err.stack
      }
    });
    return {
      hasErrors: true,
      errorMessage,
      countFailedAndUnrecognizedTasks: 0,
      countFailedAndUnrecognizedTasksByStatus: {},
      countFailedAndUnrecognizedTasksByStatusByType: {}
    };
  }
}

/**
 * Bucket format:
 * {
 *   "key": "idle",                   // task status
 *   "doc_count": 28,                 // number of tasks with this status
 *   "by_task_type": {
 *     "doc_count_error_upper_bound": 0,
 *     "sum_other_doc_count": 0,
 *     "buckets": [
 *       {
 *         "key": "alerting:.es-query", // breakdown of task type for status
 *         "doc_count": 1
 *       },
 *       {
 *         "key": "alerting:.index-threshold",
 *         "doc_count": 1
 *       }
 *     ]
 *   }
 * }
 */

function parseBucket(buckets) {
  return (buckets !== null && buckets !== void 0 ? buckets : []).reduce((summary, bucket) => {
    var _bucket$by_task_type, _bucket$doc_count;
    const status = bucket.key;
    const taskTypeBuckets = bucket === null || bucket === void 0 ? void 0 : (_bucket$by_task_type = bucket.by_task_type) === null || _bucket$by_task_type === void 0 ? void 0 : _bucket$by_task_type.buckets;
    const byTaskType = (taskTypeBuckets !== null && taskTypeBuckets !== void 0 ? taskTypeBuckets : []).reduce((acc, taskTypeBucket) => {
      var _taskTypeBucket$doc_c;
      const taskType = (0, _replace_dots_with_underscores.replaceDotSymbols)(taskTypeBucket.key.replace('alerting:', ''));
      return {
        ...acc,
        [taskType]: (_taskTypeBucket$doc_c = taskTypeBucket.doc_count) !== null && _taskTypeBucket$doc_c !== void 0 ? _taskTypeBucket$doc_c : 0
      };
    }, {});
    return {
      ...summary,
      countFailedAndUnrecognizedTasksByStatus: {
        ...summary.countFailedAndUnrecognizedTasksByStatus,
        [status]: (_bucket$doc_count = bucket === null || bucket === void 0 ? void 0 : bucket.doc_count) !== null && _bucket$doc_count !== void 0 ? _bucket$doc_count : 0
      },
      countFailedAndUnrecognizedTasksByStatusByType: (0, _lodash.merge)(summary.countFailedAndUnrecognizedTasksByStatusByType, (0, _lodash.isEmpty)(byTaskType) ? {} : {
        [status]: byTaskType
      })
    };
  }, {
    countFailedAndUnrecognizedTasksByStatus: {},
    countFailedAndUnrecognizedTasksByStatusByType: {}
  });
}